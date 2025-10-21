from typing import Dict, Any, Optional, List
from fastapi import Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.exceptions import AuthenticationException, AuthorizationException
from app.core.logging import get_logger
from app.database.base import get_supabase_client
from app.database.session import get_async_session
from app.features.auth.cruds.auth_crud import AuthCrud
from enum import Enum

logger = get_logger("role_auth")
security = HTTPBearer(auto_error=False)

class UserRole(str, Enum):
    BUYER = "buyer"
    SUPPLIER = "supplier" 
    ADMIN = "admin"

async def get_optional_user(request: Request):
    auth_header = request.headers.get("authorization")
    if not auth_header:
        return None
    try:
        return await get_user_from_token()
    except Exception:
        return None

async def get_user_from_token(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: AsyncSession = Depends(get_async_session)
) -> Dict[str, Any]:
    # TEMPORARILY DISABLED FOR REVIEW - Return mock user data
    return {
        "id": "temp-vendor-123",
        "email": "review@example.com",
        "user_role": "supplier",
        "phone": "+1234567890",
        "first_name": "Review",
        "last_name": "Vendor",
        "is_verified": True,
        "is_active": True,
        "last_login_at": None,
        "access_token": "temp-token",
    }
    
    # Original authentication code (commented out):
    # if not credentials or credentials.scheme.lower() != "bearer":
    #     raise AuthenticationException("Missing or invalid authorization header")
    # 
    # token = credentials.credentials
    # 
    # try:
    #     supabase = get_supabase_client()
    #     user_response = supabase.auth.get_user(token)
    #     
    #     if not user_response.user:
    #         raise AuthenticationException("Invalid token")
    #     
    #     user_id = user_response.user.id
    #     
    #     auth_crud = AuthCrud()
    #     user_data = await auth_crud.get_by_id(db, user_id)
    #     
    #     if not user_data:
    #         raise AuthenticationException("User not found in database")
    #     
    #     user_role = user_data.user_type if hasattr(user_data, 'user_type') else "buyer"
    #     
    #     return {
    #         "id": str(user_data.id),
    #         "email": user_data.email,
    #         "user_role": user_role,
    #         "phone": user_data.phone,
    #         "first_name": user_data.first_name,
    #         "last_name": user_data.last_name,
    #         "is_verified": user_data.is_verified,
    #         "is_active": user_data.is_active,
    #         "last_login_at": user_data.last_login_at.isoformat() if user_data.last_login_at else None,
    #         "access_token": token,
    #     }
    #     
    # except Exception as e:
    #     logger.error(f"Token verification failed: {e}")
    #     raise AuthenticationException("Token verification failed")

async def get_all_users(user: Dict[str, Any] = Depends(get_user_from_token)) -> Dict[str, Any]:
    return user

def require_roles(allowed_roles: List[UserRole]):
    async def role_checker(user: Dict[str, Any] = Depends(get_user_from_token)) -> Dict[str, Any]:
        user_role = user.get("user_role", "buyer")
        
        if user_role not in [role.value for role in allowed_roles]:
            logger.warning(f"Access denied for user {user.get('id')} with role {user_role}")
            raise AuthorizationException(f"Access denied. Required roles: {[r.value for r in allowed_roles]}")
        
        return user
    
    return role_checker

def require_supplier():
    return require_roles([UserRole.SUPPLIER])

def require_buyer():
    return require_roles([UserRole.BUYER])

def require_admin():
    return require_roles([UserRole.ADMIN])

def require_supplier_or_admin():
    return require_roles([UserRole.SUPPLIER, UserRole.ADMIN])

def require_buyer_or_supplier():
    return require_roles([UserRole.BUYER, UserRole.SUPPLIER])

def require_any_authenticated():
    return require_roles([UserRole.BUYER, UserRole.SUPPLIER, UserRole.ADMIN])
