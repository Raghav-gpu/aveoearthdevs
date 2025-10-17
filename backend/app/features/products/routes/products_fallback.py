"""
Fallback products implementation using Supabase directly
This provides basic product functionality when SQLAlchemy is not available
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional, Dict, Any, List
from app.database.base import get_supabase_client
from app.core.logging import get_logger

logger = get_logger("products.fallback")

# Create a fallback router
products_fallback_router = APIRouter(prefix="/products", tags=["Products-Fallback"])

@products_fallback_router.get("/")
async def get_products_fallback(
    category_id: Optional[str] = Query(None),
    brand_id: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100)
):
    """
    Fallback products endpoint that uses Supabase directly
    """
    try:
        supabase = get_supabase_client()
        
        # Build the query
        query = supabase.table("products").select("*")
        
        # Add filters
        if category_id:
            query = query.eq("category_id", category_id)
        if brand_id:
            query = query.eq("brand_id", brand_id)
        if min_price is not None:
            query = query.gte("price", min_price)
        if max_price is not None:
            query = query.lte("price", max_price)
        
        # Add pagination
        offset = (page - 1) * limit
        query = query.range(offset, offset + limit - 1)
        
        # Execute query
        response = query.execute()
        
        if response.data is None:
            logger.warning("No products found")
            return {
                "data": [],
                "total": 0,
                "page": page,
                "limit": limit,
                "total_pages": 0
            }
        
        # Format response
        products = []
        for product in response.data:
            products.append({
                "id": product.get("id"),
                "name": product.get("name"),
                "description": product.get("description"),
                "price": product.get("price"),
                "image_url": product.get("image_url"),
                "category_id": product.get("category_id"),
                "brand_id": product.get("brand_id"),
                "sustainability_score": product.get("sustainability_score", 85),
                "stock": product.get("stock", 100),
                "created_at": product.get("created_at"),
                "updated_at": product.get("updated_at")
            })
        
        # Get total count for pagination
        count_query = supabase.table("products").select("id", count="exact")
        if category_id:
            count_query = count_query.eq("category_id", category_id)
        if brand_id:
            count_query = count_query.eq("brand_id", brand_id)
        if min_price is not None:
            count_query = count_query.gte("price", min_price)
        if max_price is not None:
            count_query = count_query.lte("price", max_price)
        
        count_response = count_query.execute()
        total = count_response.count if count_response.count is not None else len(products)
        total_pages = (total + limit - 1) // limit
        
        return {
            "data": products,
            "total": total,
            "page": page,
            "limit": limit,
            "total_pages": total_pages
        }
        
    except Exception as e:
        logger.error(f"Products fallback error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get products: {str(e)}")

@products_fallback_router.get("/categories/tree")
async def get_categories_tree_fallback():
    """
    Fallback categories tree endpoint
    """
    try:
        supabase = get_supabase_client()
        
        # Get all categories
        response = supabase.table("categories").select("*").order("name").execute()
        
        if response.data is None:
            return {"categories": []}
        
        # Build tree structure
        categories = []
        for category in response.data:
            categories.append({
                "id": category.get("id"),
                "name": category.get("name"),
                "description": category.get("description"),
                "parent_id": category.get("parent_id"),
                "slug": category.get("slug"),
                "image_url": category.get("image_url"),
                "is_active": category.get("is_active", True),
                "children": []
            })
        
        return {"categories": categories}
        
    except Exception as e:
        logger.error(f"Categories fallback error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get categories: {str(e)}")

@products_fallback_router.get("/brands/active")
async def get_active_brands_fallback():
    """
    Fallback active brands endpoint
    """
    try:
        supabase = get_supabase_client()
        
        # Get active brands
        response = supabase.table("brands").select("*").eq("is_active", True).order("name").execute()
        
        if response.data is None:
            return {"brands": []}
        
        brands = []
        for brand in response.data:
            brands.append({
                "id": brand.get("id"),
                "name": brand.get("name"),
                "description": brand.get("description"),
                "logo_url": brand.get("logo_url"),
                "website": brand.get("website"),
                "is_active": brand.get("is_active", True)
            })
        
        return {"brands": brands}
        
    except Exception as e:
        logger.error(f"Brands fallback error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get brands: {str(e)}")

@products_fallback_router.get("/{product_id}")
async def get_product_by_id_fallback(product_id: str):
    """
    Fallback single product endpoint
    """
    try:
        supabase = get_supabase_client()
        
        # Get product by ID
        response = supabase.table("products").select("*").eq("id", product_id).single().execute()
        
        if response.data is None:
            raise HTTPException(status_code=404, detail="Product not found")
        
        product = response.data
        
        return {
            "id": product.get("id"),
            "name": product.get("name"),
            "description": product.get("description"),
            "price": product.get("price"),
            "image_url": product.get("image_url"),
            "category_id": product.get("category_id"),
            "brand_id": product.get("brand_id"),
            "sustainability_score": product.get("sustainability_score", 85),
            "stock": product.get("stock", 100),
            "created_at": product.get("created_at"),
            "updated_at": product.get("updated_at")
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Product by ID fallback error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get product: {str(e)}")
