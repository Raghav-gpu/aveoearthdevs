from typing import Dict, Any, List, Optional
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_, desc
from sqlalchemy.orm import selectinload
from app.database.base import get_supabase_client
from app.core.base import BaseCrud
from app.core.pagination import PaginationParams, PaginatedResponse
from app.features.products.models.product import Product, ProductStatusEnum, ProductApprovalEnum, ProductVisibilityEnum
from app.features.products.models.product_image import ProductImage
from app.features.products.models.product_variant import ProductVariant
from app.core.exceptions import NotFoundException, AuthorizationException, ConflictException
from app.core.logging import get_logger

logger = get_logger("crud.products")

class ProductCrud(BaseCrud[Product]):
    def __init__(self):
        super().__init__(get_supabase_client(), Product)

    async def get_by_id(self, db: AsyncSession, id: str) -> Optional[Product]:
        try:
            result = await db.execute(
                select(Product)
                .where(Product.id == id)
                .options(
                    selectinload(Product.category),
                    selectinload(Product.brand),
                    selectinload(Product.images),
                    selectinload(Product.variants).selectinload(ProductVariant.images),
                    selectinload(Product.sustainability_scores)
                )
            )
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error getting product by id {id}: {str(e)}")
            raise

    async def get_product_by_sku(self, db: AsyncSession, sku: str) -> Optional[Product]:
        try:
            result = await db.execute(
                select(Product)
                .where(Product.sku == sku)
            )
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error getting product by SKU {sku}: {str(e)}")
            raise

    async def get_product_by_slug(self, db: AsyncSession, slug: str) -> Optional[Product]:
        try:
            result = await db.execute(
                select(Product)
                .where(Product.slug == slug)
                .options(
                    selectinload(Product.category),
                    selectinload(Product.brand),
                    selectinload(Product.images),
                    selectinload(Product.variants).selectinload(ProductVariant.images),
                    selectinload(Product.sustainability_scores)
                )
            )
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error getting product by slug {slug}: {str(e)}")
            raise

    async def create_product(self, db: AsyncSession, supplier_id: str, product_data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            existing_sku = await self.get_product_by_sku(db, product_data["sku"])
            if existing_sku:
                raise ConflictException("Product with this SKU already exists")
            
            if product_data.get("slug"):
                existing_slug = await self.get_product_by_slug(db, product_data["slug"])
                if existing_slug:
                    raise ConflictException("Product with this slug already exists")
            
            product_data["supplier_id"] = supplier_id
            product_data["status"] = ProductStatusEnum.DRAFT
            product_data["approval_status"] = ProductApprovalEnum.PENDING
            product_data["visibility"] = ProductVisibilityEnum.HIDDEN
            
            created_product = await self.create(db, product_data)
            result_dict = created_product.to_dict()
            
            product_image_crud = ProductImageCrud()
            images = await product_image_crud.get_product_images(db, created_product.id)
            result_dict["images"] = [img.to_dict() for img in images]
            
            logger.info(f"Product created: {created_product.id} by supplier {supplier_id}")
            return result_dict
        except Exception as e:
            logger.error(f"Error creating product: {str(e)}")
            raise

    async def update_product(self, db: AsyncSession, product_id: str, supplier_id: str, product_data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            existing_product = await self.get_by_id(db, product_id)
            if not existing_product:
                raise NotFoundException("Product not found")
            
            if str(existing_product.supplier_id) != supplier_id:
                raise AuthorizationException("You can only update your own products")
            
            if product_data.get("sku") and product_data.get("sku") != existing_product.sku:
                sku_check = await self.get_product_by_sku(db, product_data["sku"])
                if sku_check and str(sku_check.id) != product_id:
                    raise ConflictException("Product with this SKU already exists")
            
            if product_data.get("slug") and product_data.get("slug") != existing_product.slug:
                slug_check = await self.get_product_by_slug(db, product_data["slug"])
                if slug_check and str(slug_check.id) != product_id:
                    raise ConflictException("Product with this slug already exists")
            
            updated_product = await self.update(db, product_id, product_data)
            result_dict = updated_product.to_dict()
            
            product_image_crud = ProductImageCrud()
            images = await product_image_crud.get_product_images(db, product_id)
            result_dict["images"] = [img.to_dict() for img in images]
            
            logger.info(f"Product updated: {product_id} by supplier {supplier_id}")
            return result_dict
        except Exception as e:
            logger.error(f"Error updating product {product_id}: {str(e)}")
            raise

    async def get_supplier_products(
        self,
        db: AsyncSession,
        supplier_id: str,
        pagination: PaginationParams,
        status: Optional[str] = None,
        search: Optional[str] = None
    ) -> PaginatedResponse[Dict[str, Any]]:
        try:
            query = select(Product).where(Product.supplier_id == supplier_id)
            
            if status:
                query = query.where(Product.status == status)
            
            if search:
                search_term = f"%{search}%"
                query = query.where(
                    or_(
                        Product.name.ilike(search_term),
                        Product.sku.ilike(search_term),
                        Product.description.ilike(search_term)
                    )
                )
            
            query = query.options(
                selectinload(Product.category),
                selectinload(Product.brand),
                selectinload(Product.images)
            ).order_by(desc(Product.created_at))
            
            count_query = select(func.count()).select_from(Product).where(Product.supplier_id == supplier_id)
            if status:
                count_query = count_query.where(Product.status == status)
            if search:
                search_term = f"%{search}%"
                count_query = count_query.where(
                    or_(
                        Product.name.ilike(search_term),
                        Product.sku.ilike(search_term),
                        Product.description.ilike(search_term)
                    )
                )
            
            total_result = await db.execute(count_query)
            total = total_result.scalar()
            
            paginated_query = query.offset(pagination.offset).limit(pagination.limit)
            result = await db.execute(paginated_query)
            products = result.scalars().all()
            
            products_data = []
            for product in products:
                product_dict = product.to_dict()
                product_dict["category"] = product.category.to_dict() if product.category else None
                product_dict["brand"] = product.brand.to_dict() if product.brand else None
                product_dict["images"] = [img.to_dict() for img in product.images] if product.images else []
                products_data.append(product_dict)
            
            return PaginatedResponse.create(
                items=products_data,
                total=total,
                page=pagination.page,
                limit=pagination.limit
            )
        except Exception as e:
            logger.error(f"Error getting supplier products for {supplier_id}: {str(e)}")
            raise

    async def get_public_products(
        self,
        db: Optional[AsyncSession],
        pagination: PaginationParams,
        category_id: Optional[str] = None,
        brand_id: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        search: Optional[str] = None,
        sort_by: Optional[str] = "created_at",
        sort_order: Optional[str] = "desc"
    ) -> PaginatedResponse[Dict[str, Any]]:
        # Handle case when database is not available
        if db is None:
            logger.warning("Database not available, returning empty products list")
            return PaginatedResponse[Dict[str, Any]](
                items=[],
                total=0,
                page=pagination.page,
                limit=pagination.limit,
                total_pages=0
            )
        
        try:
            query = select(Product).where(
                and_(
                    Product.status == ProductStatusEnum.ACTIVE,
                    Product.approval_status == ProductApprovalEnum.APPROVED,
                    Product.visibility == ProductVisibilityEnum.VISIBLE
                )
            )
            
            if category_id:
                query = query.where(Product.category_id == category_id)
            
            if brand_id:
                query = query.where(Product.brand_id == brand_id)
            
            if min_price is not None:
                query = query.where(Product.price >= min_price)
            
            if max_price is not None:
                query = query.where(Product.price <= max_price)
            
            if search:
                search_term = f"%{search}%"
                query = query.where(
                    or_(
                        Product.name.ilike(search_term),
                        Product.description.ilike(search_term),
                        Product.tags.astext.ilike(search_term)
                    )
                )
            
            query = query.options(
                selectinload(Product.category),
                selectinload(Product.brand),
                selectinload(Product.images),
                selectinload(Product.sustainability_scores)
            )
            
            if sort_by == "price":
                if sort_order == "desc":
                    query = query.order_by(desc(Product.price))
                else:
                    query = query.order_by(Product.price)
            elif sort_by == "name":
                if sort_order == "desc":
                    query = query.order_by(desc(Product.name))
                else:
                    query = query.order_by(Product.name)
            else:
                if sort_order == "desc":
                    query = query.order_by(desc(Product.created_at))
                else:
                    query = query.order_by(Product.created_at)
            
            count_query = select(func.count()).select_from(Product).where(
                and_(
                    Product.status == ProductStatusEnum.ACTIVE,
                    Product.approval_status == ProductApprovalEnum.APPROVED,
                    Product.visibility == ProductVisibilityEnum.VISIBLE
                )
            )
            
            if category_id:
                count_query = count_query.where(Product.category_id == category_id)
            if brand_id:
                count_query = count_query.where(Product.brand_id == brand_id)
            if min_price is not None:
                count_query = count_query.where(Product.price >= min_price)
            if max_price is not None:
                count_query = count_query.where(Product.price <= max_price)
            if search:
                search_term = f"%{search}%"
                count_query = count_query.where(
                    or_(
                        Product.name.ilike(search_term),
                        Product.description.ilike(search_term),
                        Product.tags.astext.ilike(search_term)
                    )
                )
            
            total_result = await db.execute(count_query)
            total = total_result.scalar()
            
            paginated_query = query.offset(pagination.offset).limit(pagination.limit)
            result = await db.execute(paginated_query)
            products = result.scalars().all()
            
            products_data = []
            for product in products:
                product_dict = product.to_dict()
                product_dict["category"] = product.category.to_dict() if product.category else None
                product_dict["brand"] = product.brand.to_dict() if product.brand else None
                product_dict["images"] = [img.to_dict() for img in product.images] if product.images else []
                product_dict["sustainability_scores"] = [score.to_dict() for score in product.sustainability_scores] if product.sustainability_scores else []
                products_data.append(product_dict)
            
            return PaginatedResponse.create(
                items=products_data,
                total=total,
                page=pagination.page,
                limit=pagination.limit
            )
        except Exception as e:
            logger.error(f"Error getting public products: {str(e)}")
            raise

    async def publish_product(self, db: AsyncSession, product_id: str, supplier_id: str) -> Dict[str, Any]:
        try:
            product = await self.get_by_id(db, product_id)
            if not product:
                raise NotFoundException("Product not found")
            
            if str(product.supplier_id) != supplier_id:
                raise AuthorizationException("You can only publish your own products")
            
            update_data = {
                "status": ProductStatusEnum.PENDING,
                "published_at": datetime.utcnow()
            }
            
            updated_product = await self.update(db, product_id, update_data)
            result_dict = updated_product.to_dict()
            
            product_image_crud = ProductImageCrud()
            images = await product_image_crud.get_product_images(db, product_id)
            result_dict["images"] = [img.to_dict() for img in images]
            
            logger.info(f"Product published: {product_id} by supplier {supplier_id}")
            return result_dict
        except Exception as e:
            logger.error(f"Error publishing product {product_id}: {str(e)}")
            raise

    async def approve_product(self, db: AsyncSession, product_id: str, admin_id: str, approval_notes: Optional[str] = None) -> Dict[str, Any]:
        try:
            product = await self.get_by_id(db, product_id)
            if not product:
                raise NotFoundException("Product not found")
            
            update_data = {
                "approval_status": ProductApprovalEnum.APPROVED,
                "status": ProductStatusEnum.ACTIVE,
                "visibility": ProductVisibilityEnum.VISIBLE,
                "approved_at": datetime.utcnow(),
                "approved_by": admin_id,
                "approval_notes": approval_notes
            }
            
            updated_product = await self.update(db, product_id, update_data)
            result_dict = updated_product.to_dict()
            
            product_image_crud = ProductImageCrud()
            images = await product_image_crud.get_product_images(db, product_id)
            result_dict["images"] = [img.to_dict() for img in images]
            
            logger.info(f"Product approved: {product_id} by admin {admin_id}")
            return result_dict
        except Exception as e:
            logger.error(f"Error approving product {product_id}: {str(e)}")
            raise

    async def reject_product(self, db: AsyncSession, product_id: str, admin_id: str, rejection_notes: str) -> Dict[str, Any]:
        try:
            product = await self.get_by_id(db, product_id)
            if not product:
                raise NotFoundException("Product not found")
            
            update_data = {
                "approval_status": ProductApprovalEnum.REJECTED,
                "status": ProductStatusEnum.REJECTED,
                "approved_by": admin_id,
                "approval_notes": rejection_notes
            }
            
            updated_product = await self.update(db, product_id, update_data)
            result_dict = updated_product.to_dict()
            
            product_image_crud = ProductImageCrud()
            images = await product_image_crud.get_product_images(db, product_id)
            result_dict["images"] = [img.to_dict() for img in images]
            
            logger.info(f"Product rejected: {product_id} by admin {admin_id}")
            return result_dict
        except Exception as e:
            logger.error(f"Error rejecting product {product_id}: {str(e)}")
            raise


class ProductImageCrud(BaseCrud[ProductImage]):
    def __init__(self):
        super().__init__(get_supabase_client(), ProductImage)

    async def get_product_images(self, db: AsyncSession, product_id: str) -> List[ProductImage]:
        try:
            result = await db.execute(
                select(ProductImage)
                .where(ProductImage.product_id == product_id)
                .order_by(ProductImage.sort_order, ProductImage.created_at)
            )
            return result.scalars().all()
        except Exception as e:
            logger.error(f"Error getting images for product {product_id}: {str(e)}")
            raise

    async def delete_product_image(self, db: AsyncSession, image_id: str, supplier_id: str = None) -> bool:
        try:
            image = await self.get_by_id(db, image_id)
            if not image:
                raise NotFoundException("Image not found")
            
            if supplier_id:
                product = await db.execute(
                    select(Product).where(Product.id == image.product_id)
                )
                product = product.scalar_one_or_none()
                
                if not product or str(product.supplier_id) != supplier_id:
                    raise AuthorizationException("You can only delete images from your own products")
            
            await self.delete(db, image_id)
            return True
        except Exception as e:
            logger.error(f"Error deleting image {image_id}: {str(e)}")
            raise

    async def delete_product_image_simple(self, db: AsyncSession, image_id: str) -> bool:
        try:
            result = await db.execute(
                select(ProductImage).where(ProductImage.id == image_id)
            )
            image = result.scalar_one_or_none()
            if not image:
                raise NotFoundException("Image not found")
            
            await db.delete(image)
            await db.commit()
            return True
        except Exception as e:
            await db.rollback()
            logger.error(f"Error deleting image {image_id}: {str(e)}")
            raise

    async def get_supplier_products_paginated(
        self,
        db: AsyncSession,
        supplier_id: Optional[str],
        pagination: PaginationParams,
        status: Optional[str] = None
    ) -> tuple[List[Dict[str, Any]], int]:
        try:
            query = select(Product)
            
            if supplier_id:
                query = query.where(Product.supplier_id == supplier_id)
            
            if status:
                query = query.where(Product.approval_status == status)
                
            query = query.options(
                selectinload(Product.category),
                selectinload(Product.brand),
                selectinload(Product.images)
            ).order_by(desc(Product.created_at))
            
            count_query = select(func.count()).select_from(Product)
            if supplier_id:
                count_query = count_query.where(Product.supplier_id == supplier_id)
            if status:
                count_query = count_query.where(Product.approval_status == status)
            
            total_result = await db.execute(count_query)
            total = total_result.scalar()
            
            paginated_query = query.offset(pagination.offset).limit(pagination.limit)
            result = await db.execute(paginated_query)
            products = result.scalars().all()
            
            products_data = []
            for product in products:
                product_dict = product.to_dict()
                product_dict["category"] = product.category.to_dict() if product.category else None
                product_dict["brand"] = product.brand.to_dict() if product.brand else None
                product_dict["images"] = [img.to_dict() for img in product.images] if product.images else []
                products_data.append(product_dict)
            
            return products_data, total
        except Exception as e:
            logger.error(f"Error getting paginated products: {str(e)}")
            raise

    async def get_products_paginated(
        self,
        db: AsyncSession,
        pagination: PaginationParams
    ) -> tuple[List[Dict[str, Any]], int]:
        try:
            query = select(Product).options(
                selectinload(Product.category),
                selectinload(Product.brand),
                selectinload(Product.images)
            ).order_by(desc(Product.created_at))
            
            count_query = select(func.count()).select_from(Product)
            
            total_result = await db.execute(count_query)
            total = total_result.scalar()
            
            paginated_query = query.offset(pagination.offset).limit(pagination.limit)
            result = await db.execute(paginated_query)
            products = result.scalars().all()
            
            products_data = []
            for product in products:
                product_dict = product.to_dict()
                product_dict["category"] = product.category.to_dict() if product.category else None
                product_dict["brand"] = product.brand.to_dict() if product.brand else None
                product_dict["images"] = [img.to_dict() for img in product.images] if product.images else []
                products_data.append(product_dict)
            
            return products_data, total
        except Exception as e:
            logger.error(f"Error getting all products paginated: {str(e)}")
            raise