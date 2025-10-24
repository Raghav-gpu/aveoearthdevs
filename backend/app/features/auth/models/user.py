from sqlalchemy import Column, String, Boolean, DateTime, Text, Enum, UUID
from sqlalchemy.orm import relationship
from enum import Enum as PyEnum
from app.core.base import Base, BaseTimeStamp, BaseUUID

class UserTypeEnum(str, PyEnum):
    BUYER = "buyer"
    SUPPLIER = "supplier"
    ADMIN = "admin"

class User(BaseUUID, BaseTimeStamp, Base):
    __tablename__ = "users"
    
    email = Column(String(255), unique=True, nullable=False, index=True)
    phone = Column(String(25), unique=True, nullable=True)
    user_type = Column(Enum(UserTypeEnum, native_enum=False), nullable=False, default=UserTypeEnum.BUYER)
    first_name = Column(String(100))
    last_name = Column(String(100))
    avatar_url = Column(Text)
    is_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    is_phone_verified = Column(Boolean, default=False)
    is_email_verified = Column(Boolean, default=False)
    google_id = Column(String(255))
    last_login_at = Column(DateTime)
    referral_code = Column(String(10), unique=True, nullable=True, index=True)

    profile = relationship("UserProfile", back_populates="user", uselist=False, passive_deletes=True)
    addresses = relationship("Address", back_populates="user", passive_deletes=True)
    referrals_made = relationship("Referral", foreign_keys="Referral.referrer_id", back_populates="referrer", passive_deletes=True)
    referrals_received = relationship("Referral", foreign_keys="Referral.referee_id", back_populates="referee", passive_deletes=True)
    supplier_business = relationship("SupplierBusiness", foreign_keys="SupplierBusiness.supplier_id", back_populates="supplier", uselist=False, passive_deletes=True)
    activities = relationship("UserActivity", back_populates="user", passive_deletes=True)
    behavior_profile = relationship("UserBehaviorProfile", back_populates="user", uselist=False, passive_deletes=True)

    def to_dict(self):
        return {
            "id": str(self.id),
            "email": self.email,
            "phone": self.phone,
            "user_type": self.user_type.value if self.user_type else None,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "avatar_url": self.avatar_url,
            "is_verified": self.is_verified,
            "is_active": self.is_active,
            "is_phone_verified": self.is_phone_verified,
            "is_email_verified": self.is_email_verified,
            "google_id": self.google_id,
            "last_login_at": self.last_login_at.isoformat() if self.last_login_at else None,
            "referral_code": self.referral_code,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }