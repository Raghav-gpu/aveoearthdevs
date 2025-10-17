"""
Fallback search implementation using Supabase directly
This provides basic search functionality when SQLAlchemy is not available
"""

from fastapi import APIRouter, Depends, HTTPException
from typing import Optional, Dict, Any, List
from app.database.base import get_supabase_client
from app.core.logging import get_logger

logger = get_logger("products.search_fallback")

# Create a fallback router
product_search_fallback_router = APIRouter(prefix="/search", tags=["product-search-fallback"])

@product_search_fallback_router.post("/")
async def search_products_fallback(
    request: Dict[str, Any]
):
    """
    Fallback search endpoint that uses Supabase directly
    """
    try:
        supabase = get_supabase_client()
        
        # Extract search parameters
        query = request.get("query", "")
        page = request.get("page", 1)
        limit = request.get("limit", 20)
        category_id = request.get("category_id")
        
        # Build the query
        search_query = supabase.table("products").select("*")
        
        # Add text search if query provided
        if query:
            search_query = search_query.or_(f"name.ilike.%{query}%,description.ilike.%{query}%")
        
        # Add category filter if provided
        if category_id:
            search_query = search_query.eq("category_id", category_id)
        
        # Add pagination
        offset = (page - 1) * limit
        search_query = search_query.range(offset, offset + limit - 1)
        
        # Execute query
        response = search_query.execute()
        
        if response.data is None:
            logger.warning("No products found in search")
            return {
                "products": [],
                "total": 0,
                "page": page,
                "per_page": limit,
                "total_pages": 0,
                "filters_applied": request,
                "available_filters": {}
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
                "created_at": product.get("created_at")
            })
        
        # Get total count for pagination
        count_query = supabase.table("products").select("id", count="exact")
        if query:
            count_query = count_query.or_(f"name.ilike.%{query}%,description.ilike.%{query}%")
        if category_id:
            count_query = count_query.eq("category_id", category_id)
        
        count_response = count_query.execute()
        total = count_response.count if count_response.count is not None else len(products)
        total_pages = (total + limit - 1) // limit
        
        return {
            "products": products,
            "total": total,
            "page": page,
            "per_page": limit,
            "total_pages": total_pages,
            "filters_applied": request,
            "available_filters": {}
        }
        
    except Exception as e:
        logger.error(f"Search fallback error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@product_search_fallback_router.get("/trending")
async def get_trending_products_fallback(
    limit: int = 10
):
    """
    Fallback trending products endpoint
    """
    try:
        supabase = get_supabase_client()
        
        # Get products ordered by created_at (newest first)
        response = supabase.table("products").select("*").order("created_at", desc=True).limit(limit).execute()
        
        if response.data is None:
            return {"products": [], "total": 0}
        
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
                "created_at": product.get("created_at")
            })
        
        return {
            "products": products,
            "total": len(products),
            "recommendation_type": "trending"
        }
        
    except Exception as e:
        logger.error(f"Trending products fallback error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get trending products: {str(e)}")

@product_search_fallback_router.get("/new-arrivals")
async def get_new_arrivals_fallback(
    limit: int = 20,
    days_back: int = 30
):
    """
    Fallback new arrivals endpoint
    """
    try:
        supabase = get_supabase_client()
        
        # Get products created within the last N days
        from datetime import datetime, timedelta
        cutoff_date = datetime.utcnow() - timedelta(days=days_back)
        
        response = supabase.table("products").select("*").gte("created_at", cutoff_date.isoformat()).order("created_at", desc=True).limit(limit).execute()
        
        if response.data is None:
            return {"products": [], "total": 0, "days_back": days_back}
        
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
                "created_at": product.get("created_at")
            })
        
        return {
            "products": products,
            "total": len(products),
            "days_back": days_back
        }
        
    except Exception as e:
        logger.error(f"New arrivals fallback error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get new arrivals: {str(e)}")

@product_search_fallback_router.get("/best-sellers")
async def get_best_sellers_fallback(
    limit: int = 20,
    time_period: str = "month"
):
    """
    Fallback best sellers endpoint
    """
    try:
        supabase = get_supabase_client()
        
        # For now, return products ordered by some criteria
        # In a real implementation, this would query order data
        response = supabase.table("products").select("*").order("created_at", desc=True).limit(limit).execute()
        
        if response.data is None:
            return {"products": [], "total": 0, "time_period": time_period}
        
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
                "created_at": product.get("created_at")
            })
        
        return {
            "products": products,
            "total": len(products),
            "time_period": time_period
        }
        
    except Exception as e:
        logger.error(f"Best sellers fallback error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get best sellers: {str(e)}")

@product_search_fallback_router.get("/top-rated")
async def get_top_rated_fallback(
    limit: int = 20
):
    """
    Fallback top rated products endpoint
    """
    try:
        supabase = get_supabase_client()
        
        # For now, return products ordered by sustainability score
        response = supabase.table("products").select("*").order("sustainability_score", desc=True).limit(limit).execute()
        
        if response.data is None:
            return {"products": [], "total": 0}
        
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
                "created_at": product.get("created_at")
            })
        
        return {
            "products": products,
            "total": len(products),
            "recommendation_type": "top_rated"
        }
        
    except Exception as e:
        logger.error(f"Top rated fallback error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get top rated products: {str(e)}")
