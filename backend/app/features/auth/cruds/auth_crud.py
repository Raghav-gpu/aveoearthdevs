from typing import Dict, Any, Optional
from datetime import datetime
import uuid
import secrets
import string
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database.base import get_supabase_client
from app.core.base import BaseCrud
from app.features.auth.models.user import User
from app.core.exceptions import (
    ValidationException,
    AuthenticationException,
    NotFoundException,
    ConflictException
)
from app.core.logging import get_logger
from app.features.auth.cruds.profile_crud import ProfileCrud
from app.features.auth.cruds.referral_crud import ReferralCrud

logger = get_logger("auth.crud")

async def get_referrer_by_code(db: AsyncSession, referral_code: str) -> Optional[User]:
    referral_code = (referral_code or "").upper()
    crud = AuthCrud()
    return await crud.get_by_field(db, "referral_code", referral_code)

class AuthCrud(BaseCrud[User]):
    def __init__(self):
        super().__init__(get_supabase_client(), User)
    
    def _user_to_dict(self, user: User) -> Dict[str, Any]:
        return {
            "id": str(user.id),
            "email": user.email,
            "phone": user.phone,
            "user_type": user.user_type,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "avatar_url": user.avatar_url,
            "is_verified": user.is_verified,
            "is_active": user.is_active,
            "is_phone_verified": user.is_phone_verified,
            "is_email_verified": user.is_email_verified,
            "google_id": user.google_id,
            "last_login_at": user.last_login_at.isoformat() if user.last_login_at else None,
            "referral_code": user.referral_code,
            "created_at": user.created_at.isoformat() if user.created_at else None,
            "updated_at": user.updated_at.isoformat() if user.updated_at else None
        }
    
    async def signup_with_email(self, db: AsyncSession, signup_data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            incoming_referral: Optional[str] = signup_data.get("referral_code")
            if incoming_referral:
                referrer = await get_referrer_by_code(db, incoming_referral)
                if not referrer:
                    raise ValidationException("Invalid referral code")

            existing_user = await self.get_by_field(db, "email", signup_data["email"])
            if existing_user:
                raise ConflictException("User with this email already exists")
            if signup_data.get("phone"):
                existing_phone = await self.get_by_field(db, "phone", signup_data["phone"])
                if existing_phone:
                    raise ConflictException("User with this phone already exists")
            try:
                admin_user = self.client.auth.admin.get_user_by_email(signup_data["email"])
                if getattr(admin_user, "user", None):
                    raise ConflictException("User with this email already exists")
            except Exception:
                pass

            auth_response = self.client.auth.sign_up({
                "email": signup_data["email"],
                "password": signup_data["password"],
                "options": {
                    "data": {
                        "first_name": signup_data.get("first_name"),
                        "last_name": signup_data.get("last_name"),
                        "user_type": (signup_data.get("user_type") or "buyer").lower()
                    }
                }
            })
            if not getattr(auth_response, "user", None):
                raise ValidationException("Failed to create user account")
            
            issued_referral_code = self.generate_referral_code(6)
            while await self.get_by_field(db, "referral_code", issued_referral_code):
                issued_referral_code = self.generate_referral_code(6)

            user_data = {
                "id": auth_response.user.id,
                "email": signup_data["email"],
                "phone": signup_data.get("phone"),
                "user_type": (signup_data.get("user_type") or "buyer").lower(),
                "first_name": signup_data.get("first_name"),
                "last_name": signup_data.get("last_name"),
                "is_verified": False,
                "is_active": True,
                "is_phone_verified": False,
                "is_email_verified": getattr(auth_response.user, "email_confirmed_at", None) is not None,
                "last_login_at": datetime.utcnow(),
                "referral_code": issued_referral_code
            }
            
            created_user = await self.create(db, user_data)
            if not created_user:
                raise ValidationException("Failed to create user profile")

            try:
                profile_crud = ProfileCrud()
                profile_data = {
                    "user_id": str(created_user.id),
                    "preferences": {},
                    "social_links": {},
                    "notification_settings": {}
                }
                await profile_crud.create(db, profile_data)
            except Exception as e:
                logger.warning(f"Could not create user profile for {created_user.id}: {e}")

            if incoming_referral:
                await self.handle_referral(db, str(created_user.id), incoming_referral)

            logger.info(f"User created successfully: {created_user.id}")
            
            user_dict = {
                "id": str(created_user.id),
                "email": created_user.email,
                "phone": created_user.phone,
                "user_type": created_user.user_type,
                "first_name": created_user.first_name,
                "last_name": created_user.last_name,
                "is_verified": created_user.is_verified,
                "is_active": created_user.is_active,
                "is_phone_verified": created_user.is_phone_verified,
                "is_email_verified": created_user.is_email_verified,
                "last_login_at": created_user.last_login_at.isoformat() if created_user.last_login_at else None,
                "referral_code": created_user.referral_code,
                "created_at": created_user.created_at.isoformat() if created_user.created_at else None,
                "updated_at": created_user.updated_at.isoformat() if created_user.updated_at else None
            }
            
            return {
                "user": user_dict,
                "session": auth_response.session,
                "requires_phone_verification": bool(signup_data.get("phone")),
                "referral_code": issued_referral_code
            }
        except (ConflictException, ValidationException):
            raise
        except Exception as e:
            logger.error(f"Signup error: {str(e)}")
            raise ValidationException(f"Registration failed: {str(e)}")
    
    async def signup_with_phone(self, db: AsyncSession, signup_data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            incoming_referral: Optional[str] = signup_data.get("referral_code")
            if incoming_referral:
                referrer = await get_referrer_by_code(db, incoming_referral)
                if not referrer:
                    raise ValidationException("Invalid referral code")

            existing_user = await self.get_by_field(db, "email", signup_data["email"])
            if existing_user:
                raise ConflictException("User with this email already exists")
            
            existing_phone = await self.get_by_field(db, "phone", signup_data["phone"])
            if existing_phone:
                raise ConflictException("User with this phone already exists")

            # Use Supabase for OTP authentication only
            auth_response = self.client.auth.sign_in_with_otp({
                "phone": signup_data["phone"],
                "options": {
                    "data": {
                        "email": signup_data["email"],
                        "first_name": signup_data.get("first_name"),
                        "last_name": signup_data.get("last_name"),
                        "user_type": (signup_data.get("user_type") or "buyer").lower()
                    }
                }
            })
            
            issued_referral_code = self.generate_referral_code(6)
            while await self.get_by_field(db, "referral_code", issued_referral_code):
                issued_referral_code = self.generate_referral_code(6)

            user_data = {
                "id": str(uuid.uuid4()),
                "email": signup_data["email"],
                "phone": signup_data["phone"],
                "user_type": (signup_data.get("user_type") or "buyer").lower(),
                "first_name": signup_data.get("first_name"),
                "last_name": signup_data.get("last_name"),
                "is_verified": False,
                "is_active": True,
                "is_phone_verified": False,
                "is_email_verified": False,
                "last_login_at": datetime.utcnow(),
                "referral_code": issued_referral_code
            }
            
            created_user = await self.create(db, user_data)
            if not created_user:
                raise ValidationException("Failed to create user profile")

            try:
                profile_crud = ProfileCrud()
                profile_data = {
                    "user_id": str(created_user.id),
                    "preferences": {},
                    "social_links": {},
                    "notification_settings": {}
                }
                await profile_crud.create(db, profile_data)
            except Exception as e:
                logger.warning(f"Could not create user profile for {created_user.id}: {e}")

            if incoming_referral:
                await self.handle_referral(db, str(created_user.id), incoming_referral)

            logger.info(f"User created successfully: {created_user.id}")

            user_dict = {
                "id": str(created_user.id),
                "email": created_user.email,
                "phone": created_user.phone,
                "user_type": created_user.user_type,
                "first_name": created_user.first_name,
                "last_name": created_user.last_name,
                "is_verified": created_user.is_verified,
                "is_active": created_user.is_active,
                "is_phone_verified": created_user.is_phone_verified,
                "is_email_verified": created_user.is_email_verified,
                "last_login_at": created_user.last_login_at.isoformat() if created_user.last_login_at else None,
                "referral_code": created_user.referral_code,
                "created_at": created_user.created_at.isoformat() if created_user.created_at else None,
                "updated_at": created_user.updated_at.isoformat() if created_user.updated_at else None
            }
            
            return {
                "user": user_dict,
                "session": auth_response.session if hasattr(auth_response, 'session') else None,
                "requires_phone_verification": True,
                "referral_code": issued_referral_code
            }
        except (ConflictException, ValidationException):
            raise
        except Exception as e:
            logger.error(f"Phone signup error: {str(e)}")
            raise ValidationException(f"Registration failed: {str(e)}")
    
    async def login_with_email(self, db: AsyncSession, email: str, password: str) -> Dict[str, Any]:
        try:
            auth_response = self.client.auth.sign_in_with_password({
                "email": email,
                "password": password
            })
            if not getattr(auth_response, "user", None) or not getattr(auth_response, "session", None):
                raise AuthenticationException("Invalid credentials")
            
            user_obj = await self.get_by_field(db, "email", email)
            if not user_obj:
                raise NotFoundException("User profile not found")

            user_data = self._user_to_dict(user_obj)
            
            if not user_data.get("referral_code"):
                issued_referral_code = self.generate_referral_code(6)
                while await self.get_by_field(db, "referral_code", issued_referral_code):
                    issued_referral_code = self.generate_referral_code(6)
                await self.update(db, user_data["id"], {"referral_code": issued_referral_code})
                user_obj = await self.get_by_field(db, "email", email)
                user_data = self._user_to_dict(user_obj)
            
            await self.update_last_login(db, user_data["id"])
            user_obj = await self.get_by_field(db, "email", email)
            user_data = self._user_to_dict(user_obj)
            logger.info(f"User logged in: {user_data['id']}")
            return {
                "user": user_data,
                "session": auth_response.session
            }
        except (AuthenticationException, NotFoundException):
            raise
        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            raise AuthenticationException("Login failed")
    
    async def login_with_phone(self, db: AsyncSession, phone: str, password: str) -> Dict[str, Any]:
        try:
            user_obj = await self.get_by_field(db, "phone", phone)
            if not user_obj:
                raise AuthenticationException("Invalid credentials")
            
            user_data = self._user_to_dict(user_obj)
            
            auth_response = self.client.auth.sign_in_with_password({
                "email": user_data["email"],
                "password": password
            })
            if not getattr(auth_response, "user", None) or not getattr(auth_response, "session", None):
                raise AuthenticationException("Invalid credentials")

            if not user_data.get("referral_code"):
                issued_referral_code = self.generate_referral_code(6)
                while await self.get_by_field(db, "referral_code", issued_referral_code):
                    issued_referral_code = self.generate_referral_code(6)
                await self.update(db, user_data["id"], {"referral_code": issued_referral_code})
                user_obj = await self.get_by_field(db, "phone", phone)
                user_data = self._user_to_dict(user_obj)

            await self.update_last_login(db, user_data["id"])
            user_obj = await self.get_by_field(db, "phone", phone)
            user_data = self._user_to_dict(user_obj)
            logger.info(f"User logged in with phone: {user_data['id']}")
            return {
                "user": user_data,
                "session": auth_response.session
            }
        except AuthenticationException:
            raise
        except Exception as e:
            logger.error(f"Phone login error: {str(e)}")
            raise AuthenticationException("Login failed")
    
    async def google_signin(self, db: AsyncSession) -> Dict[str, Any]:
        try:
            auth_response = self.client.auth.sign_in_with_oauth({
                "provider": "google",
                "options": {
                    "redirect_to": "http://localhost:3000"
                }
            })
            if not getattr(auth_response, "user", None):
                raise AuthenticationException("Google authentication failed")
            
            user_obj = await self.get_by_id(db, auth_response.user.id)
            if not user_obj:
                issued_referral_code = self.generate_referral_code(6)
                while await self.get_by_field(db, "referral_code", issued_referral_code):
                    issued_referral_code = self.generate_referral_code(6)
                new_user = {
                    "id": auth_response.user.id,
                    "email": auth_response.user.email,
                    "user_type": "buyer",
                    "first_name": getattr(auth_response.user, "user_metadata", {}).get("first_name", ""),
                    "last_name": getattr(auth_response.user, "user_metadata", {}).get("last_name", ""),
                    "avatar_url": getattr(auth_response.user, "user_metadata", {}).get("avatar_url"),
                    "google_id": auth_response.user.id,
                    "is_verified": True,
                    "is_active": True,
                    "is_phone_verified": False,
                    "is_email_verified": True,
                    "last_login_at": datetime.utcnow(),
                    "referral_code": issued_referral_code
                }

                user_obj = await self.create(db, new_user)
            else:
                user_data = self._user_to_dict(user_obj)
                if not user_data.get("referral_code"):
                    issued_referral_code = self.generate_referral_code(6)
                    while await self.get_by_field(db, "referral_code", issued_referral_code):
                        issued_referral_code = self.generate_referral_code(6)
                    await self.update(db, str(user_obj.id), {"referral_code": issued_referral_code})
            
            await self.update_last_login(db, str(user_obj.id))
            user_obj = await self.get_by_id(db, str(user_obj.id))
            user_data = self._user_to_dict(user_obj)
            logger.info(f"Google signin successful: {user_data['id']}")
            return {
                "user": user_data,
                "session": auth_response.session
            }
        except Exception as e:
            logger.error(f"Google signin error: {str(e)}")
            raise AuthenticationException("Google authentication failed")

    async def update_phone_and_referral(self, db: AsyncSession, user_id: str, phone: str, referral_code: Optional[str] = None) -> Dict[str, Any]:
        try:
            user_obj = await self.get_by_id(db, user_id)
            if not user_obj:
                raise NotFoundException("User not found")

            if phone:
                existing_phone_obj = await self.get_by_field(db, "phone", phone)
                if existing_phone_obj and str(existing_phone_obj.id) != user_id:
                    raise ConflictException("Phone number already exists")
                await self.update(db, user_id, {"phone": phone})

            if referral_code:
                referrer = await get_referrer_by_code(db, referral_code)
                if referrer and str(referrer.id) != user_id:
                    await self.handle_referral(db, user_id, referral_code)

            updated_user_obj = await self.get_by_id(db, user_id)
            return self._user_to_dict(updated_user_obj)
        except Exception as e:
            logger.error(f"Update phone and referral error: {str(e)}")
            raise

    async def forgot_password(self, db: AsyncSession, email: str) -> Dict[str, Any]:
        try:
            user_obj = await self.get_by_field(db, "email", email)
            if not user_obj:
                raise NotFoundException("User not found")

            reset_response = self.client.auth.reset_password_email(email)
            logger.info(f"Password reset email sent to: {email}")
            return {"message": "Password reset email sent", "email": email}
        except Exception as e:
            logger.error(f"Forgot password error: {str(e)}")
            raise ValidationException("Failed to send password reset email")

    async def reset_password(self, db: AsyncSession, user_id: str, new_password: str) -> Dict[str, Any]:
        try:
            result = self.client.auth.admin.update_user_by_id(user_id, {"password": new_password})
            if not result.user:
                raise AuthenticationException("Failed to update password")
            
            logger.info(f"Password reset successful for user: {user_id}")
            return {"message": "Password reset successful"}
        except Exception as e:
            logger.error(f"Reset password error: {str(e)}")
            raise AuthenticationException("Failed to reset password")
    
    async def update_last_login(self, db: AsyncSession, user_id: str):
        try:
            await self.update(db, user_id, {"last_login_at": datetime.utcnow()})
        except Exception as e:
            logger.error(f"Failed to update last login for {user_id}: {str(e)}")
    
    async def handle_referral(self, db: AsyncSession, user_id: str, referral_code: str):
        try:
            referrer = await get_referrer_by_code(db, referral_code)
            if not referrer:
                logger.warning(f"Invalid referral code: {referral_code}")
                return
            if str(referrer.id) == user_id:
                logger.warning(f"User cannot refer themselves: {referral_code}")
                return
            
            referral_crud = ReferralCrud()
            await referral_crud.create_referral_record(
                db,
                referrer_id=str(referrer.id),
                referee_id=user_id,
                referral_code=referral_code
            )
            logger.info(f"Referral completed: {referral_code} -> {user_id}")
        except Exception as e:
            logger.error(f"Referral handling error: {str(e)}")
    
    def generate_referral_code(self, length: int = 6) -> str:
        chars = string.ascii_uppercase + string.digits
        return "".join(secrets.choice(chars) for _ in range(length))

    async def get_user_referral_stats(self, db: AsyncSession, user_id: str) -> Dict[str, Any]:
        try:
            referral_crud = ReferralCrud()
            referral_data = await referral_crud.get_user_referrals(db, user_id)
            
            user_obj = await self.get_by_id(db, user_id)
            user_referral_code = user_obj.referral_code if user_obj else None
            
            return {
                "user_referral_code": user_referral_code,
                "referral_stats": referral_data
            }
        except Exception as e:
            self.logger.error(f"Error getting referral stats for {user_id}: {str(e)}")
            return {
                "user_referral_code": None,
                "referral_stats": {
                    "total_referrals": 0,
                    "completed_referrals": 0,
                    "pending_referrals": 0,
                    "referrals": []
                }
            }
    
    async def update_user_profile(self, db: AsyncSession, user_id: str, profile_data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            user_obj = await self.get_by_id(db, user_id)
            if not user_obj:
                raise NotFoundException("User not found")
            
            user_update_data = {}
            if "first_name" in profile_data:
                user_update_data["first_name"] = profile_data["first_name"]
            if "last_name" in profile_data:
                user_update_data["last_name"] = profile_data["last_name"]
            if "phone" in profile_data:
                existing_phone = await self.get_by_field(db, "phone", profile_data["phone"])
                if existing_phone and str(existing_phone.id) != user_id:
                    raise ConflictException("Phone number already exists")
                user_update_data["phone"] = profile_data["phone"]
            if "avatar_url" in profile_data:
                user_update_data["avatar_url"] = profile_data["avatar_url"]
            
            if user_update_data:
                await self.update(db, user_id, user_update_data)
            
            updated_user = await self.get_by_id(db, user_id)
            return self._user_to_dict(updated_user)
        except Exception as e:
            logger.error(f"Error updating user profile for {user_id}: {str(e)}")
            raise
    
    async def update_avatar(self, db: AsyncSession, user_id: str, avatar_url: str) -> Dict[str, Any]:
        try:
            user_obj = await self.get_by_id(db, user_id)
            if not user_obj:
                raise NotFoundException("User not found")
            
            await self.update(db, user_id, {"avatar_url": avatar_url})
            updated_user = await self.get_by_id(db, user_id)
            return self._user_to_dict(updated_user)
        except Exception as e:
            logger.error(f"Error updating avatar for {user_id}: {str(e)}")
            raise
    
    async def delete_avatar(self, db: AsyncSession, user_id: str) -> Dict[str, Any]:
        try:
            user_obj = await self.get_by_id(db, user_id)
            if not user_obj:
                raise NotFoundException("User not found")
            
            await self.update(db, user_id, {"avatar_url": None})
            updated_user = await self.get_by_id(db, user_id)
            return self._user_to_dict(updated_user)
        except Exception as e:
            logger.error(f"Error deleting avatar for {user_id}: {str(e)}")
            raise
    
    async def deactivate_account(self, db: AsyncSession, user_id: str) -> Dict[str, Any]:
        try:
            user_obj = await self.get_by_id(db, user_id)
            if not user_obj:
                raise NotFoundException("User not found")
            
            await self.update(db, user_id, {"is_active": False})
            updated_user = await self.get_by_id(db, user_id)
            return self._user_to_dict(updated_user)
        except Exception as e:
            logger.error(f"Error deactivating account for {user_id}: {str(e)}")
            raise
    
    async def reactivate_account(self, db: AsyncSession, user_id: str) -> Dict[str, Any]:
        try:
            user_obj = await self.get_by_id(db, user_id)
            if not user_obj:
                raise NotFoundException("User not found")
            
            await self.update(db, user_id, {"is_active": True})
            updated_user = await self.get_by_id(db, user_id)
            return self._user_to_dict(updated_user)
        except Exception as e:
            logger.error(f"Error reactivating account for {user_id}: {str(e)}")
            raise
    
    async def get_full_user_profile(self, db: AsyncSession, user_id: str) -> Dict[str, Any]:
        try:
            user_obj = await self.get_by_id(db, user_id)
            if not user_obj:
                raise NotFoundException("User not found")
            
            profile_crud = ProfileCrud()
            profile_data = await profile_crud.get_profile_dict(db, user_id)
            
            user_data = self._user_to_dict(user_obj)
            user_data["profile"] = profile_data
            
            return user_data
        except Exception as e:
            logger.error(f"Error getting full user profile for {user_id}: {str(e)}")
            raise