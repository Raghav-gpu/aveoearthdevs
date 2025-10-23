import uvicorn
from datetime import datetime
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from app.core.config import settings
from app.core.exceptions import AveoException
from app.core.logging import get_logger
from app.database.session import init_database, close_database_connections
from app.features.auth.routes.auth_routes import auth_router
from app.features.auth.routes.profile_routes import profile_router
from app.features.auth.routes.referral_routes import referral_router
from app.features.auth.routes.address_routes import buyer_address_router, admin_address_router
from app.features.auth.routes.account_routes import account_router
from app.features.auth.routes.settings_routes import settings_router
from app.features.supplier.onboarding.routes.onboarding_routes import supplier_onboarding_router
from app.features.supplier.onboarding.routes.supplier_admin_routes import supplier_admin_router
from app.features.products.routes.products_admin_routes import products_admin_router
from app.features.products.routes.products_buyer_routes import products_buyer_router
from app.features.products.routes.products_supplier_routes import products_supplier_router
from app.features.products.routes.product_search_routes import product_search_router
from app.features.orders.routes.orders_supplier_routes import orders_supplier_router
from app.features.orders.routes.orders_buyer_routes import orders_buyer_router
from app.features.orders.routes.orders_admin_routes import orders_admin_router
from app.features.analytics.routes.analytics_routes import analytics_router
from app.features.analytics.routes.dashboard_routes import dashboard_router

app_logger = get_logger("main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    app_logger.info(f"Starting {settings.PROJECT_NAME} v{settings.PROJECT_VERSION}")
    
    try:
        db_success = await init_database()
        if db_success:
            app_logger.info("Database initialization completed successfully")
        else:
            app_logger.warning("Database initialization failed - continuing with limited functionality")
    except Exception as e:
        app_logger.error(f"Database initialization failed: {str(e)}")
        app_logger.info("Continuing with limited functionality")
    
    try:
        from app.core.supabase_storage import SupabaseStorageClient
        storage_client = SupabaseStorageClient()
        # Initialize storage buckets
        storage_client._ensure_bucket_exists("supplier-assets")
        storage_client._ensure_bucket_exists("product-assets")
        storage_client._ensure_bucket_exists("category-assets")
        storage_client._ensure_bucket_exists("user-uploads")
        app_logger.info("Supabase storage buckets initialized")
    except Exception as e:
        app_logger.error(f"Supabase storage initialization failed: {str(e)}")
        app_logger.info("Continuing without Supabase storage")
    
    yield
    
    app_logger.info("Shutting down application...")
    await close_database_connections()
    app_logger.info("Application shutdown completed")


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Enterprise B2B Sustainable Products Marketplace API",
    version=settings.PROJECT_VERSION,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(AveoException)
async def aveo_exception_handler(request: Request, exc: AveoException):
    app_logger.error(f"AveoException: {exc.message} - {request.url}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.message,
            "type": exc.__class__.__name__,
            "path": str(request.url.path)
        }
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    app_logger.error(f"Unhandled exception: {str(exc)} - {request.url}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "Internal server error",
            "type": "InternalServerError",
            "path": str(request.url.path)
        }
    )

app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(admin_address_router)
app.include_router(buyer_address_router)
app.include_router(referral_router)
app.include_router(supplier_onboarding_router)
app.include_router(supplier_admin_router)
app.include_router(products_admin_router)
app.include_router(products_buyer_router)
app.include_router(products_supplier_router)
app.include_router(product_search_router)
app.include_router(account_router)
app.include_router(settings_router)
app.include_router(orders_supplier_router)
app.include_router(orders_buyer_router)
app.include_router(orders_admin_router)
app.include_router(analytics_router)
app.include_router(dashboard_router)

@app.get("/")
async def root():
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.PROJECT_VERSION,
        "description": "AveoEarth B2B Sustainable Products Marketplace API",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.PROJECT_VERSION,
        "timestamp": datetime.utcnow().isoformat()
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower()
    )