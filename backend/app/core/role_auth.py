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
import os
from app.core.config import settings

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
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: AsyncSession = Depends(get_async_session),
) -> Dict[str, Any]:
    logger.info(f"get_user_from_token called: DEBUG={settings.DEBUG}, path={request.url.path if request else 'unknown'}, has_token={credentials and hasattr(credentials, 'credentials') and bool(credentials.credentials)}")
    
    # FIRST: Try to authenticate with real token if provided (even in DEBUG mode)
    if credentials and hasattr(credentials, "credentials") and credentials.credentials:
        token = credentials.credentials
        # Don't treat obvious debug tokens as real
        if token not in ["debug-token", "auth-bypass", "dev-bypass"] and len(token) > 20:
            try:
                logger.info(f"Attempting real authentication with token (length: {len(token)})")
                supabase = get_supabase_client()
                user_response = supabase.auth.get_user(token)
                
                if user_response.user:
                    logger.info(f"✅ Real user authenticated: {user_response.user.email} ({user_response.user.id})")
                    user_id = user_response.user.id
                    
                    auth_crud = AuthCrud()
                    user_data = await auth_crud.get_by_id(db, user_id)
                    
                    if not user_data:
                        logger.warning(f"User {user_id} authenticated in Supabase but not found in database")
                        # Return basic info from Supabase Auth
                        return {
                            "id": user_id,
                            "email": user_response.user.email,
                            "user_role": "buyer",
                            "phone": user_response.user.phone or "+10000000000",
                            "first_name": user_response.user.user_metadata.get("first_name") or "User",
                            "last_name": user_response.user.user_metadata.get("last_name") or "",
                            "is_verified": user_response.user.email_confirmed_at is not None,
                            "is_active": True,
                            "last_login_at": None,
                            "access_token": token,
                        }
                    
                    user_role = user_data.user_type if hasattr(user_data, 'user_type') else "buyer"
                    
                    return {
                        "id": str(user_data.id),
                        "email": user_data.email,
                        "user_role": user_role,
                        "phone": user_data.phone,
                        "first_name": user_data.first_name,
                        "last_name": user_data.last_name,
                        "is_verified": user_data.is_email_verified if hasattr(user_data, 'is_email_verified') else user_data.is_verified,
                        "is_active": user_data.is_active,
                        "last_login_at": user_data.last_login_at.isoformat() if user_data.last_login_at else None,
                        "access_token": token,
                    }
            except Exception as e:
                logger.warning(f"Real token authentication failed: {e}, falling back to DEBUG mode if enabled")
    
    # Fallback: DEBUG mode bypass (only if no real token or auth failed)
    if settings.DEBUG:
        logger.info(f"DEBUG mode: Using bypass auth for {request.url.path if request else 'unknown'}")
        assumed_role = UserRole.SUPPLIER.value if (request and str(request.url.path).startswith("/supplier")) else UserRole.BUYER.value
        import uuid as uuid_module
        if assumed_role == UserRole.SUPPLIER.value:
            user_id = "00000000-0000-0000-0000-000000000001"
        else:
            user_id = "00000000-0000-0000-0000-000000000002"
        
        token = credentials.credentials if credentials and hasattr(credentials, "credentials") else None
        email = "debug@example.com"
        if token and token not in ["debug-token", "auth-bypass", "dev-bypass"]:
            token_hash = uuid_module.uuid5(uuid_module.NAMESPACE_OID, token[:50])
            user_id = str(token_hash)
            email = f"token-{token[:8]}@example.com"
        
        return {
            "id": user_id,
            "email": email,
            "user_role": assumed_role,
            "phone": "+1234567890",
            "first_name": "Debug",
            "last_name": "User",
            "is_verified": True,
            "is_active": True,
            "last_login_at": None,
            "access_token": token or "debug-token",
        }
    
    # Development-friendly auth: allow role override via header when DEBUG
    try:
        mock_role = None
        if request is not None:
            mock_role = request.headers.get("x-user-role") or request.headers.get("x-mock-role")
        if settings.DEBUG and mock_role:
            role_value = str(mock_role).lower()
            if role_value not in [r.value for r in UserRole]:
                role_value = UserRole.BUYER.value
            return {
                "id": "dev-user-override",
                "email": "dev@example.com",
                "user_role": role_value,
                "phone": "+10000000000",
                "first_name": "Dev",
                "last_name": "User",
                "is_verified": True,
                "is_active": True,
                "last_login_at": None,
                "access_token": "dev-bypass",
            }
    except Exception:
        pass
    
    # No auth provided and not in DEBUG mode
    return None
    
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
        # Guard: handle missing user cleanly
        logger.info(f"require_roles called: user={user is not None}, DEBUG={settings.DEBUG}, allowed_roles={[r.value for r in allowed_roles]}")
        if user is None:
            # In DEBUG mode, always auto-grant access with first allowed role
            if settings.DEBUG:
                granted_role = allowed_roles[0].value if allowed_roles else UserRole.BUYER.value
                logger.info(f"DEBUG mode: Auto-granting role {granted_role} for testing (user was None)")
                return {
                    "id": "auth-bypass-user",
                    "email": "bypass@example.com",
                    "user_role": granted_role,
                    "is_verified": True,
                    "is_active": True,
                    "access_token": "auth-bypass"
                }
            logger.warning("Authentication required - user is None and DEBUG is False")
            raise AuthenticationException("Authentication required")

        user_role = str(user.get("user_role", "buyer")).lower()

        # In DEBUG, allow optional env bypass to assume required role when no auth present
        # Set AUTH_BYPASS=true to auto-grant the first required role for local testing
        if settings.DEBUG and os.getenv("AUTH_BYPASS", "false").lower() in ("1", "true", "yes"):
            user_role = allowed_roles[0].value

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
