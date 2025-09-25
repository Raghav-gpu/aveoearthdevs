from typing import Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, select, delete
from sqlalchemy.orm import selectinload
from app.database.base import get_supabase_client
from app.core.base import BaseCrud
from app.core.pagination import PaginationParams, PaginatedResponse
from app.features.products.models.wishlist import Wishlist
from app.features.products.models.product import Product
from app.core.exceptions import NotFoundException, ValidationException, ConflictException
from app.core.logging import get_logger

logger = get_logger("crud.wishlist")

class WishlistCrud(BaseCrud[Wishlist]):
    def __init__(self):
        super().__init__(get_supabase_client(), Wishlist)

    async def add_to_wishlist(self, db: AsyncSession, user_id: str, product_id: str) -> Dict[str, Any]:
        try:
            existing = await db.execute(
                select(Wishlist)
                .where(Wishlist.user_id == user_id)
                .where(Wishlist.product_id == product_id)
            )
            if existing.scalar_one_or_none():
                raise ConflictException("Product already in wishlist")
            
            wishlist_data = {
                "user_id": user_id,
                "product_id": product_id
            }
            
            created_item = await self.create(db, wishlist_data)
            logger.info(f"Product {product_id} added to wishlist for user {user_id}")
            return created_item.to_dict()
        except Exception as e:
            logger.error(f"Error adding product {product_id} to wishlist for user {user_id}: {str(e)}")
            raise

    async def remove_from_wishlist(self, db: AsyncSession, user_id: str, product_id: str) -> bool:
        try:
            result = await db.execute(
                delete(Wishlist)
                .where(Wishlist.user_id == user_id)
                .where(Wishlist.product_id == product_id)
            )
            
            if result.rowcount == 0:
                raise NotFoundException("Product not found in wishlist")
            
            await db.commit()
            logger.info(f"Product {product_id} removed from wishlist for user {user_id}")
            return True
        except Exception as e:
            logger.error(f"Error removing product {product_id} from wishlist for user {user_id}: {str(e)}")
            raise

    async def get_user_wishlist(
        self,
        db: AsyncSession,
        user_id: str,
        pagination: PaginationParams
    ) -> PaginatedResponse[Dict[str, Any]]:
        try:
            query = (
                select(Wishlist)
                .where(Wishlist.user_id == user_id)
                .options(
                    selectinload(Wishlist.product).selectinload(Product.category),
                    selectinload(Wishlist.product).selectinload(Product.brand),
                    selectinload(Wishlist.product).selectinload(Product.images)
                )
                .order_by(Wishlist.added_at.desc())
            )
            
            count_query = select(func.count()).select_from(Wishlist).where(Wishlist.user_id == user_id)
            
            total_result = await db.execute(count_query)
            total = total_result.scalar()
            
            paginated_query = query.offset(pagination.offset).limit(pagination.limit)
            result = await db.execute(paginated_query)
            wishlist_items = result.scalars().all()
            
            wishlist_data = []
            for item in wishlist_items:
                item_dict = item.to_dict()
                if item.product:
                    product_dict = item.product.to_dict()
                    product_dict["category"] = item.product.category.to_dict() if item.product.category else None
                    product_dict["brand"] = item.product.brand.to_dict() if item.product.brand else None
                    product_dict["images"] = [img.to_dict() for img in item.product.images] if item.product.images else []
                    item_dict["product"] = product_dict
                wishlist_data.append(item_dict)
            
            return PaginatedResponse.create(
                items=wishlist_data,
                total=total,
                page=pagination.page,
                limit=pagination.limit
            )
        except Exception as e:
            logger.error(f"Error getting wishlist for user {user_id}: {str(e)}")
            raise

    async def is_in_wishlist(self, db: AsyncSession, user_id: str, product_id: str) -> bool:
        try:
            result = await db.execute(
                select(Wishlist)
                .where(Wishlist.user_id == user_id)
                .where(Wishlist.product_id == product_id)
            )
            return result.scalar_one_or_none() is not None
        except Exception as e:
            logger.error(f"Error checking if product {product_id} is in wishlist for user {user_id}: {str(e)}")
            return False

    async def clear_wishlist(self, db: AsyncSession, user_id: str) -> bool:
        try:
            await db.execute(
                delete(Wishlist)
                .where(Wishlist.user_id == user_id)
            )
            await db.commit()
            logger.info(f"Wishlist cleared for user {user_id}")
            return True
        except Exception as e:
            logger.error(f"Error clearing wishlist for user {user_id}: {str(e)}")
            raise
