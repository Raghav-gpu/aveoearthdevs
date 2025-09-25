from fastapi import APIRouter, Depends
from typing import Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.features.auth.requests.password_request import ForgotPasswordRequest, ResetPasswordRequest
from app.features.auth.cruds.auth_crud import AuthCrud
from app.core.role_auth import get_all_users
from app.core.logging import get_logger
from app.core.exceptions import ValidationException, AuthenticationException
from app.core.base import SuccessResponse
from app.features.auth.routes.auth_routes import auth_router
from app.database.session import get_async_session

logger = get_logger("auth.routes")

@auth_router.post("/forgot-password")
async def forgot_password(request: ForgotPasswordRequest, db: AsyncSession = Depends(get_async_session)):
    auth_crud = AuthCrud()
    await auth_crud.forgot_password(db, request.email)
    return SuccessResponse(message="Password reset email sent")

@auth_router.post("/reset-password")
async def reset_password(
    request: ResetPasswordRequest,
    db: AsyncSession = Depends(get_async_session),
    current_user: Dict[str, Any] = Depends(get_all_users)
):
    auth_crud = AuthCrud()
    await auth_crud.reset_password(db, current_user["id"], request.new_password)
    return SuccessResponse(message="Password reset successful")
