from typing import Any, Dict
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.exceptions import AuthenticationException
from app.core.role_auth import get_all_users
from app.database.session import get_async_session
from app.database.base import get_supabase_client
from app.features.auth.requests.phone_referral_request import SignupPhoneRequest
from app.features.auth.requests.signup_request import SignupRequest
from app.features.auth.requests.login_request import LoginEmailRequest, LoginPhoneRequest
from app.features.auth.responses.auth_response import AuthResponse, TokenResponse
from app.features.auth.responses.user_response import UserResponse
from app.features.auth.cruds.auth_crud import AuthCrud
from app.core.logging import get_logger

auth_router = APIRouter(prefix="/auth", tags=["Authentication"])
logger = get_logger("auth.routes")

@auth_router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def signup(request: SignupRequest, db: AsyncSession = Depends(get_async_session)):
    auth_crud = AuthCrud()
    result = await auth_crud.signup_with_email(db, request.model_dump())
    
    user_response = UserResponse(**result["user"])
    session_obj = result.get("session")
    access_token = getattr(session_obj, "access_token", "") if session_obj else ""
    refresh_token = getattr(session_obj, "refresh_token", "") if session_obj else ""
    expires_in = getattr(session_obj, "expires_in", 0) if session_obj else 0
    token_response = TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=expires_in
    )
    
    return AuthResponse(
        user=user_response,
        tokens=token_response,
        requires_phone_verification=result.get("requires_phone_verification", False),
        referral_code=result.get("referral_code")
    )

@auth_router.post("/signup-phone", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def signup_phone(request: SignupPhoneRequest, db: AsyncSession = Depends(get_async_session)):
    auth_crud = AuthCrud()
    result = await auth_crud.signup_with_phone(db, request.model_dump())
    
    user_response = UserResponse(**result["user"])
    session_obj = result.get("session")
    access_token = getattr(session_obj, "access_token", "") if session_obj else ""
    refresh_token = getattr(session_obj, "refresh_token", "") if session_obj else ""
    expires_in = getattr(session_obj, "expires_in", 0) if session_obj else 0
    token_response = TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=expires_in
    )
    
    return AuthResponse(
        user=user_response,
        tokens=token_response,
        requires_phone_verification=result.get("requires_phone_verification", False),
        referral_code=result.get("referral_code")
    )

@auth_router.post("/login", response_model=AuthResponse)
async def login_email(request: LoginEmailRequest, db: AsyncSession = Depends(get_async_session)):
    auth_crud = AuthCrud()
    result = await auth_crud.login_with_email(db, request.email, request.password)
    
    user_response = UserResponse(**result["user"])
    session_obj = result.get("session")
    access_token = getattr(session_obj, "access_token", "") if session_obj else ""
    refresh_token = getattr(session_obj, "refresh_token", "") if session_obj else ""
    expires_in = getattr(session_obj, "expires_in", 0) if session_obj else 0
    token_response = TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=expires_in
    )
    
    return AuthResponse(
        user=user_response,
        tokens=token_response,
        referral_code=result["user"].get("referral_code")
    )

@auth_router.post("/login-phone", response_model=AuthResponse)
async def login_phone(request: LoginPhoneRequest, db: AsyncSession = Depends(get_async_session)):
    auth_crud = AuthCrud()
    result = await auth_crud.login_with_phone(db, request.phone, request.password)
    
    user_response = UserResponse(**result["user"])
    session_obj = result.get("session")
    access_token = getattr(session_obj, "access_token", "") if session_obj else ""
    refresh_token = getattr(session_obj, "refresh_token", "") if session_obj else ""
    expires_in = getattr(session_obj, "expires_in", 0) if session_obj else 0
    token_response = TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=expires_in
    )
    
    return AuthResponse(
        user=user_response,
        tokens=token_response,
        referral_code=result["user"].get("referral_code")
    )

@auth_router.post("/google", response_model=AuthResponse)
async def google_signin(db: AsyncSession = Depends(get_async_session)):
    auth_crud = AuthCrud()
    result = await auth_crud.google_signin(db)
    
    user_response = UserResponse(**result["user"])
    session_obj = result.get("session")
    access_token = getattr(session_obj, "access_token", "") if session_obj else ""
    refresh_token = getattr(session_obj, "refresh_token", "") if session_obj else ""
    expires_in = getattr(session_obj, "expires_in", 0) if session_obj else 0
    token_response = TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=expires_in
    )
    
    return AuthResponse(
        user=user_response,
        tokens=token_response,
        referral_code=result["user"].get("referral_code")
    )

@auth_router.post("/logout")
async def logout(current_user: Dict[str, Any] = Depends(get_all_users)):
    try:
        supabase = get_supabase_client()
        supabase.auth.sign_out()
        logger.info(f"User logged out: {current_user['id']}")
        from app.core.base import SuccessResponse
        return SuccessResponse(message="Logged out successfully")
    except Exception as e:
        logger.error(f"Logout error: {str(e)}")
        from app.core.base import SuccessResponse
        return SuccessResponse(message="Logout completed")
    
@auth_router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: Dict[str, Any] = Depends(get_all_users),
    db: AsyncSession = Depends(get_async_session)
):
    auth_crud = AuthCrud()
    user_data = await auth_crud.get_by_id(db, current_user["id"])
    
    if not user_data:
        raise AuthenticationException("User not found")
    
    if not user_data.referral_code:
        issued_referral_code = auth_crud.generate_referral_code(6)
        while await auth_crud.get_by_field(db, "referral_code", issued_referral_code):
            issued_referral_code = auth_crud.generate_referral_code(6)
        
        await auth_crud.update(db, current_user["id"], {"referral_code": issued_referral_code})
        user_data.referral_code = issued_referral_code
    
    return UserResponse(**user_data.to_dict())

@auth_router.post("/refresh")
async def refresh_token(current_user: Dict[str, Any] = Depends(get_all_users)):
    try:
        supabase = get_supabase_client()
        refresh_response = supabase.auth.refresh_session()
        
        if not refresh_response.session:
            raise AuthenticationException("Failed to refresh token")
        
        token_response = TokenResponse(
            access_token=refresh_response.session.access_token,
            refresh_token=refresh_response.session.refresh_token,
            token_type="bearer",
            expires_in=refresh_response.session.expires_in or 3600
        )
        
        return token_response
    except Exception as e:
        logger.error(f"Token refresh error: {str(e)}")
        raise AuthenticationException("Failed to refresh token")

@auth_router.post("/verify-token")
async def verify_token(current_user: Dict[str, Any] = Depends(get_all_users)):
    from app.core.base import SuccessResponse
    return SuccessResponse(message="Token is valid")

@auth_router.post("/change-email")
async def change_email(
    new_email: str,
    current_user: Dict[str, Any] = Depends(get_all_users),
    db: AsyncSession = Depends(get_async_session)
):
    try:
        auth_crud = AuthCrud()
        
        existing_user = await auth_crud.get_by_field(db, "email", new_email)
        if existing_user:
            from app.core.exceptions import ConflictException
            raise ConflictException("Email already exists")
        
        supabase = get_supabase_client()
        update_response = supabase.auth.admin.update_user_by_id(
            current_user["id"],
            {"email": new_email}
        )
        
        if not update_response.user:
            raise AuthenticationException("Failed to update email")
        
        await auth_crud.update(db, current_user["id"], {"email": new_email, "is_email_verified": False})
        
        from app.core.base import SuccessResponse
        return SuccessResponse(message="Email update initiated. Please verify your new email.")
    except Exception as e:
        logger.error(f"Email change error: {str(e)}")
        raise AuthenticationException("Failed to change email")

@auth_router.post("/resend-verification")
async def resend_email_verification(
    current_user: Dict[str, Any] = Depends(get_all_users),
    db: AsyncSession = Depends(get_async_session)
):
    try:
        auth_crud = AuthCrud()
        user_data = await auth_crud.get_by_id(db, current_user["id"])
        
        if not user_data:
            raise AuthenticationException("User not found")
        
        if user_data.is_email_verified:
            from app.core.base import SuccessResponse
            return SuccessResponse(message="Email is already verified")
        
        supabase = get_supabase_client()
        supabase.auth.resend({
            "type": "signup",
            "email": user_data.email
        })
        
        from app.core.base import SuccessResponse
        return SuccessResponse(message="Verification email sent")
    except Exception as e:
        logger.error(f"Resend verification error: {str(e)}")
        from app.core.exceptions import ValidationException
        raise ValidationException("Failed to resend verification email")

@auth_router.delete("/account")
async def delete_account(
    current_user: Dict[str, Any] = Depends(get_all_users),
    db: AsyncSession = Depends(get_async_session)
):
    try:
        auth_crud = AuthCrud()
        
        user_data = await auth_crud.get_by_id(db, current_user["id"])
        if user_data and user_data.avatar_url:
            from app.core.gcp_storage import delete_file_from_url
            try:
                delete_file_from_url(user_data.avatar_url)
            except:
                pass
        
        from app.features.auth.cruds.profile_crud import ProfileCrud
        profile_crud = ProfileCrud()
        await profile_crud.delete_profile(db, current_user["id"])
        
        try:
            supabase = get_supabase_client()
            supabase.auth.admin.delete_user(current_user["id"])
        except:
            pass
        
        await auth_crud.delete(db, current_user["id"])
        
        from app.core.base import SuccessResponse
        return SuccessResponse(message="Account deleted successfully")
    except Exception as e:
        logger.error(f"Account deletion error: {str(e)}")
        from app.core.exceptions import ValidationException
        raise ValidationException("Failed to delete account")

@auth_router.get("/sessions")
async def get_active_sessions(current_user: Dict[str, Any] = Depends(get_all_users)):
    try:
        supabase = get_supabase_client()
        user_response = supabase.auth.admin.get_user_by_id(current_user["id"])
        
        if not user_response.user:
            raise AuthenticationException("User not found")
        
        sessions = getattr(user_response.user, "sessions", [])
        
        return {
            "active_sessions": len(sessions),
            "sessions": [
                {
                    "id": session.get("id"),
                    "created_at": session.get("created_at"),
                    "updated_at": session.get("updated_at"),
                    "user_agent": session.get("user_agent"),
                    "ip": session.get("ip")
                } for session in sessions
            ] if sessions else []
        }
    except Exception as e:
        logger.error(f"Get sessions error: {str(e)}")
        return {"active_sessions": 0, "sessions": []}

@auth_router.post("/logout-all")
async def logout_all_sessions(current_user: Dict[str, Any] = Depends(get_all_users)):
    try:
        supabase = get_supabase_client()
        supabase.auth.admin.sign_out(current_user["id"], "global")
        
        from app.core.base import SuccessResponse
        return SuccessResponse(message="Logged out from all sessions")
    except Exception as e:
        logger.error(f"Logout all error: {str(e)}")
        from app.core.base import SuccessResponse
        return SuccessResponse(message="Logout completed")