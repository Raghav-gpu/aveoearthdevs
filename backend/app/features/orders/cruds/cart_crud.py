from typing import Optional, List
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, delete, func, update
from sqlalchemy.orm import selectinload
from app.core.base import BaseCrud
from app.core.exceptions import NotFoundException, ValidationException
from app.core.logging import get_logger
from app.features.orders.models.cart import Cart, CartItem
from app.features.products.models.product import Product
from app.features.products.models.product_variant import ProductVariant
from app.features.products.cruds.product_inventory_crud import ProductInventoryCrud
from app.features.orders.responses.cart_response import CartResponse, CartWithItemsResponse, CartItemResponse
from app.database.base import get_supabase_client

logger = get_logger("crud.cart")


class CartCrud(BaseCrud[Cart]):
    def __init__(self):
        super().__init__(get_supabase_client(), Cart)

    async def get_or_create_cart(self, db: AsyncSession, user_id: Optional[str] = None, session_id: Optional[str] = None) -> Cart:
        try:
            if not user_id and not session_id:
                raise ValidationException("Either user_id or session_id must be provided")

            query = select(Cart)
            if user_id:
                query = query.where(Cart.user_id == user_id)
            else:
                query = query.where(Cart.session_id == session_id)

            result = await db.execute(query)
            cart = result.scalar_one_or_none()

            if not cart:
                cart_data = {
                    "user_id": user_id,
                    "session_id": session_id,
                    "expires_at": datetime.utcnow() + timedelta(days=30)
                }
                cart = await self.create(db, cart_data)
                logger.info(f"Created new cart for user_id: {user_id}, session_id: {session_id}")
            
            return cart
        except Exception as e:
            logger.error(f"Error getting or creating cart: {str(e)}")
            raise

    async def get_cart_with_items(self, db: AsyncSession, cart_id: str) -> CartWithItemsResponse:
        try:
            query = select(Cart).where(Cart.id == cart_id)
            result = await db.execute(query)
            cart = result.scalar_one_or_none()
            
            if not cart:
                raise NotFoundException("Cart not found")

            items_query = select(CartItem).where(CartItem.cart_id == cart_id).options(
                selectinload(CartItem.product),
                selectinload(CartItem.variant)
            )
            items_result = await db.execute(items_query)
            cart_items = items_result.scalars().all()

            cart_dict = cart.to_dict()
            items_with_details = []
            for item in cart_items:
                item_dict = item.to_dict()
                if item.product:
                    item_dict["product_name"] = item.product.name
                    item_dict["product_slug"] = item.product.slug
                    item_dict["sku"] = item.product.sku
                if item.variant:
                    item_dict["variant_title"] = item.variant.title
                    if item.variant.sku:
                        item_dict["sku"] = item.variant.sku
                items_with_details.append(item_dict)
            
            cart_dict["items"] = items_with_details
            
            return CartWithItemsResponse(**cart_dict)
        except Exception as e:
            logger.error(f"Error getting cart with items: {str(e)}")
            raise

    async def add_item_to_cart(self, db: AsyncSession, cart_id: str, product_id: str, quantity: int, variant_id: Optional[str] = None) -> CartItemResponse:
        try:
            cart = await self.get_by_id(db, cart_id)
            if not cart:
                raise NotFoundException("Cart not found")

            product_query = select(Product).where(Product.id == product_id)
            product_result = await db.execute(product_query)
            product = product_result.scalar_one_or_none()
            
            if not product:
                raise NotFoundException("Product not found")

            unit_price = product.price
            variant = None
            
            if variant_id:
                variant_query = select(ProductVariant).where(ProductVariant.id == variant_id)
                variant_result = await db.execute(variant_query)
                variant = variant_result.scalar_one_or_none()
                
                if not variant:
                    raise NotFoundException("Product variant not found")
                
                if variant.price:
                    unit_price = variant.price

            inventory_crud = ProductInventoryCrud()
            if variant_id:
                available_quantity = await inventory_crud.get_variant_stock(db, variant_id)
            else:
                available_quantity = await inventory_crud.get_product_stock(db, product_id)

            if available_quantity < quantity:
                raise ValidationException(f"Insufficient stock. Available: {available_quantity}")

            existing_item_query = select(CartItem).where(
                and_(
                    CartItem.cart_id == cart_id,
                    CartItem.product_id == product_id,
                    CartItem.variant_id == variant_id
                )
            )
            existing_item_result = await db.execute(existing_item_query)
            existing_item = existing_item_result.scalar_one_or_none()

            if existing_item:
                new_quantity = existing_item.quantity + quantity
                if available_quantity < new_quantity:
                    raise ValidationException(f"Insufficient stock. Available: {available_quantity}")
                
                existing_item.quantity = new_quantity
                existing_item.total_price = existing_item.quantity * existing_item.unit_price
                await db.commit()
                await db.refresh(existing_item)
                cart_item = existing_item
            else:
                cart_item_data = {
                    "cart_id": cart_id,
                    "product_id": product_id,
                    "variant_id": variant_id,
                    "quantity": quantity,
                    "unit_price": unit_price,
                    "total_price": quantity * unit_price
                }
                cart_item = CartItem(**cart_item_data)
                db.add(cart_item)
                await db.commit()
                await db.refresh(cart_item)

            await self._update_cart_totals(db, cart_id)
            
            logger.info(f"Added item to cart {cart_id}: product {product_id}, quantity {quantity}")
            return CartItemResponse(**cart_item.to_dict())
        except Exception as e:
            await db.rollback()
            logger.error(f"Error adding item to cart: {str(e)}")
            raise

    async def update_cart_item_quantity(self, db: AsyncSession, cart_item_id: str, quantity: int) -> CartItemResponse:
        try:
            cart_item_query = select(CartItem).where(CartItem.id == cart_item_id)
            cart_item_result = await db.execute(cart_item_query)
            cart_item = cart_item_result.scalar_one_or_none()
            
            if not cart_item:
                raise NotFoundException("Cart item not found")

            if quantity <= 0:
                cart_id = str(cart_item.cart_id)
                cart_item_dict = cart_item.to_dict()
                await db.delete(cart_item)
                await db.commit()
                await self._update_cart_totals(db, cart_id)
                cart_item_dict["quantity"] = 0
                cart_item_dict["total_price"] = 0.0
                return CartItemResponse(**cart_item_dict)

            inventory_crud = ProductInventoryCrud()
            if cart_item.variant_id:
                available_quantity = await inventory_crud.get_variant_stock(db, str(cart_item.variant_id))
            else:
                available_quantity = await inventory_crud.get_product_stock(db, str(cart_item.product_id))

            if available_quantity < quantity:
                raise ValidationException(f"Insufficient stock. Available: {available_quantity}")

            cart_item.quantity = quantity
            cart_item.total_price = cart_item.quantity * cart_item.unit_price
            await db.commit()
            await db.refresh(cart_item)
            
            await self._update_cart_totals(db, str(cart_item.cart_id))
            
            logger.info(f"Updated cart item {cart_item_id} quantity to {quantity}")
            return CartItemResponse(**cart_item.to_dict())
        except Exception as e:
            await db.rollback()
            logger.error(f"Error updating cart item quantity: {str(e)}")
            raise

    async def remove_cart_item(self, db: AsyncSession, cart_item_id: str) -> bool:
        try:
            cart_item_query = select(CartItem).where(CartItem.id == cart_item_id)
            cart_item_result = await db.execute(cart_item_query)
            cart_item = cart_item_result.scalar_one_or_none()
            
            if not cart_item:
                raise NotFoundException("Cart item not found")

            cart_id = str(cart_item.cart_id)
            await db.delete(cart_item)
            await db.commit()
            
            await self._update_cart_totals(db, cart_id)
            
            logger.info(f"Removed cart item {cart_item_id}")
            return True
        except Exception as e:
            await db.rollback()
            logger.error(f"Error removing cart item: {str(e)}")
            raise

    async def clear_cart(self, db: AsyncSession, cart_id: str) -> bool:
        try:
            await db.execute(delete(CartItem).where(CartItem.cart_id == cart_id))
            await db.commit()
            
            await self._update_cart_totals(db, cart_id)
            
            logger.info(f"Cleared cart {cart_id}")
            return True
        except Exception as e:
            await db.rollback()
            logger.error(f"Error clearing cart: {str(e)}")
            raise

    async def transfer_cart_to_user(self, db: AsyncSession, session_id: str, user_id: str) -> CartResponse:
        try:
            session_cart_query = select(Cart).where(Cart.session_id == session_id)
            session_cart_result = await db.execute(session_cart_query)
            session_cart = session_cart_result.scalar_one_or_none()

            if not session_cart:
                cart = await self.get_or_create_cart(db, user_id=user_id)
                return CartResponse(**cart.to_dict())

            user_cart_query = select(Cart).where(Cart.user_id == user_id)
            user_cart_result = await db.execute(user_cart_query)
            user_cart = user_cart_result.scalar_one_or_none()

            if not user_cart:
                session_cart.user_id = user_id
                session_cart.session_id = None
                await db.commit()
                await db.refresh(session_cart)
                return CartResponse(**session_cart.to_dict())
            else:
                session_items_query = select(CartItem).where(CartItem.cart_id == session_cart.id)
                session_items_result = await db.execute(session_items_query)
                session_items = session_items_result.scalars().all()

                for item in session_items:
                    existing_item_query = select(CartItem).where(
                        and_(
                            CartItem.cart_id == user_cart.id,
                            CartItem.product_id == item.product_id,
                            CartItem.variant_id == item.variant_id
                        )
                    )
                    existing_item_result = await db.execute(existing_item_query)
                    existing_item = existing_item_result.scalar_one_or_none()

                    if existing_item:
                        existing_item.quantity += item.quantity
                        existing_item.total_price = existing_item.quantity * existing_item.unit_price
                    else:
                        item.cart_id = user_cart.id

                await db.delete(session_cart)
                await db.commit()
                
                await self._update_cart_totals(db, str(user_cart.id))
                
                return CartResponse(**user_cart.to_dict())
        except Exception as e:
            await db.rollback()
            logger.error(f"Error transferring cart to user: {str(e)}")
            raise

    async def get_cart_count(self, db: AsyncSession, user_id: Optional[str] = None, session_id: Optional[str] = None) -> int:
        try:
            # First find the cart
            cart_query = select(Cart)
            if user_id:
                cart_query = cart_query.where(Cart.user_id == user_id)
            elif session_id:
                cart_query = cart_query.where(Cart.session_id == session_id)
            else:
                return 0
            
            cart_result = await db.execute(cart_query)
            cart = cart_result.scalar_one_or_none()
            
            if not cart:
                return 0
            
            # Then count items in that cart
            count_query = select(func.sum(CartItem.quantity)).where(CartItem.cart_id == cart.id)
            result = await db.execute(count_query)
            count = result.scalar() or 0
            return int(count)
        except Exception as e:
            logger.error(f"Error getting cart count: {str(e)}")
            return 0

    async def cleanup_expired_carts(self, db: AsyncSession) -> int:
        try:
            expired_carts_query = select(Cart).where(Cart.expires_at < datetime.utcnow())
            expired_carts_result = await db.execute(expired_carts_query)
            expired_carts = expired_carts_result.scalars().all()

            count = 0
            for cart in expired_carts:
                await db.delete(cart)
                count += 1

            await db.commit()
            logger.info(f"Cleaned up {count} expired carts")
            return count
        except Exception as e:
            await db.rollback()
            logger.error(f"Error cleaning up expired carts: {str(e)}")
            raise

    async def _update_cart_totals(self, db: AsyncSession, cart_id: str):
        try:
            cart_items_query = select(CartItem).where(CartItem.cart_id == cart_id)
            cart_items_result = await db.execute(cart_items_query)
            cart_items = cart_items_result.scalars().all()

            subtotal = sum(item.total_price for item in cart_items)
            
            await db.execute(
                update(Cart)
                .where(Cart.id == cart_id)
                .values(
                    subtotal=subtotal,
                    total_amount=subtotal
                )
            )
            await db.commit()
        except Exception as e:
            logger.error(f"Error updating cart totals: {str(e)}")
            raise
