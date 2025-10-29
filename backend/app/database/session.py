from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy import text, inspect
from sqlalchemy.exc import OperationalError, TimeoutError as SQLTimeoutError
from app.core.config import settings
from typing import AsyncGenerator
from app.core.logging import get_logger
from app.core.base import Base
from app.core.exceptions import ServiceUnavailableException

logger = get_logger("session")

async_engine = None
AsyncSessionLocal = None

async def init_database():
    global async_engine, AsyncSessionLocal
    
    if not settings.DATABASE_URL:
        logger.warning("No DATABASE_URL provided, SQLAlchemy features disabled")
        return False
    
    try:
        # Parse and convert DATABASE_URL to asyncpg format
        if settings.DATABASE_URL.startswith("postgresql://"):
            async_url = settings.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")
        elif settings.DATABASE_URL.startswith("postgresql+psycopg2://"):
            async_url = settings.DATABASE_URL.replace("postgresql+psycopg2://", "postgresql+asyncpg://")
        else:
            async_url = settings.DATABASE_URL
        
        # Remove sslmode query parameter as asyncpg handles SSL differently
        # asyncpg requires ssl in connect_args, not in URL query string
        if "?sslmode=require" in async_url:
            async_url = async_url.replace("?sslmode=require", "")
        if "&sslmode=require" in async_url:
            async_url = async_url.replace("&sslmode=require", "")
        if "sslmode=require" in async_url and "?" in async_url:
            # Handle case where sslmode is in query params with other params
            parts = async_url.split("?")
            base_url = parts[0]
            query_params = parts[1] if len(parts) > 1 else ""
            params = [p for p in query_params.split("&") if not p.startswith("sslmode")]
            if params:
                async_url = base_url + "?" + "&".join(params)
            else:
                async_url = base_url
        
        if settings.SUPABASE_SERVICE_ROLE_KEY and settings.SUPABASE_ANON_KEY in async_url:
            async_url = async_url.replace(settings.SUPABASE_ANON_KEY, settings.SUPABASE_SERVICE_ROLE_KEY)
            logger.info("Using service role for database operations to bypass RLS")
        
        # For Supabase, SSL is required - pass it via connect_args
        connect_args = {}
        if "supabase.co" in async_url:
            # Supabase requires SSL - asyncpg uses ssl=True for require
            import ssl
            connect_args = {"ssl": ssl.create_default_context()}
        
        async_engine = create_async_engine(
            async_url,
            pool_size=5,
            max_overflow=10,
            pool_pre_ping=False,
            pool_recycle=300,
            pool_timeout=10,
            echo=False,
            future=True,
            connect_args=connect_args,
            execution_options={
                "isolation_level": "READ_COMMITTED",
            },
        )
        
        AsyncSessionLocal = async_sessionmaker(
            bind=async_engine,
            class_=AsyncSession,
            expire_on_commit=False,
            autoflush=False,
            autocommit=False,
        )
        
        await ensure_tables_created()
        logger.info("Database initialized successfully with async support")
        return True
        
    except Exception as e:
        async_engine = None
        AsyncSessionLocal = None
        logger.error(f"Failed to initialize database: {str(e)}")
        logger.info("Continuing without SQLAlchemy support - using Supabase only")
        return False

async def ensure_tables_created():
    try:
        if not async_engine or not Base.metadata:
            logger.warning("Database engine or metadata not available")
            return
            
        async with async_engine.begin() as conn:
            def check_and_create_tables(sync_conn):
                inspector = inspect(sync_conn)
                all_tables = set(inspector.get_table_names())
                system_tables = {'geography_columns', 'geometry_columns', 'spatial_ref_sys'}
                existing_tables = all_tables - system_tables
                
                if existing_tables:
                    logger.info(f"Tables already exist in database: {sorted(list(existing_tables))}")
                    return
                
                Base.metadata.create_all(bind=sync_conn)
                logger.info("Created all model tables")
            
            await conn.run_sync(check_and_create_tables)
    except Exception as e:
        logger.error(f"Failed to create tables via async engine: {e}")
        logger.warning("Continuing without table creation - tables may need to be created manually")

async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    if AsyncSessionLocal is None:
        raise ServiceUnavailableException("Database not initialized")
    session = None
    try:
        session = AsyncSessionLocal()
        yield session
    except Exception as e:
        if session:
            await session.rollback()
        logger.error(f"Database session error: {e}")
        raise
    finally:
        if session:
            await session.close()

def get_async_engine():
    return async_engine

async def check_database_health() -> dict:
    try:
        if async_engine:
            pool = async_engine.pool
            return {
                "status": "healthy",
                "pool_size": pool.size(),
                "checked_out": pool.checkedout(),
                "overflow": pool.overflow(),
                "checked_in": pool.checkedin(),
            }
        else:
            return {"status": "not_initialized"}
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        return {"status": "unhealthy", "error": str(e)}

async def close_database_connections():
    try:
        if async_engine:
            await async_engine.dispose()
            logger.info("Database connections closed gracefully")
    except Exception as e:
        logger.error(f"Error closing database connections: {e}")