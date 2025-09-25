from pydantic import BaseModel, field_serializer
from typing import Optional, List, Dict, Any
from datetime import datetime
from decimal import Decimal
from enum import Enum

class ProductStatusEnum(str, Enum):
    DRAFT = "draft"
    PENDING = "pending"
    ACTIVE = "active"
    INACTIVE = "inactive"
    REJECTED = "rejected"

class ProductApprovalEnum(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class ProductVisibilityEnum(str, Enum):
    VISIBLE = "visible"
    HIDDEN = "hidden"
    SCHEDULED = "scheduled"

class ProductImageResponse(BaseModel):
    id: str
    url: str
    alt_text: Optional[str] = None
    sort_order: int
    is_primary: bool

class ProductVariantResponse(BaseModel):
    id: str
    sku: str
    title: Optional[str] = None
    price: Decimal
    compare_at_price: Optional[Decimal] = None
    weight: Optional[Decimal] = None
    dimensions: Dict[str, Any] = {}
    option1_name: Optional[str] = None
    option1_value: Optional[str] = None
    option2_name: Optional[str] = None
    option2_value: Optional[str] = None
    option3_name: Optional[str] = None
    option3_value: Optional[str] = None
    image_url: Optional[str] = None
    is_default: bool

    @field_serializer("price", "compare_at_price", "weight")
    def serialize_decimal(self, value: Optional[Decimal]) -> Optional[float]:
        return float(value) if value is not None else None

class ProductInventoryResponse(BaseModel):
    id: str
    quantity: int
    reserved_quantity: int
    available_quantity: int
    low_stock_threshold: int
    location: Optional[str] = None
    last_restocked_at: Optional[datetime] = None

class ProductSustainabilityScoreResponse(BaseModel):
    id: str
    overall_score: Decimal
    environmental_score: Optional[Decimal] = None
    social_score: Optional[Decimal] = None
    governance_score: Optional[Decimal] = None
    carbon_footprint: Optional[Decimal] = None
    water_usage: Optional[Decimal] = None
    calculated_at: datetime
    expires_at: Optional[datetime] = None

    @field_serializer("overall_score", "environmental_score", "social_score", "governance_score", "carbon_footprint", "water_usage")
    def serialize_decimal(self, value: Optional[Decimal]) -> Optional[float]:
        return float(value) if value is not None else None

class ProductResponse(BaseModel):
    id: str
    supplier_id: str
    category_id: str
    brand_id: Optional[str] = None
    sku: str
    name: str
    slug: str
    short_description: Optional[str] = None
    description: Optional[str] = None
    price: Decimal
    compare_at_price: Optional[Decimal] = None
    cost_per_item: Optional[Decimal] = None
    track_quantity: bool
    continue_selling: bool
    weight: Optional[Decimal] = None
    dimensions: Dict[str, Any] = {}
    materials: List[str] = []
    care_instructions: Optional[str] = None
    origin_country: Optional[str] = None
    manufacturing_details: Dict[str, Any] = {}
    status: ProductStatusEnum
    approval_status: ProductApprovalEnum
    approval_notes: Optional[str] = None
    approved_at: Optional[datetime] = None
    approved_by: Optional[str] = None
    visibility: ProductVisibilityEnum
    published_at: Optional[datetime] = None
    tags: List[str] = []
    seo_meta: Dict[str, Any] = {}
    images: List[ProductImageResponse] = []
    created_at: datetime
    updated_at: datetime

    @field_serializer("price", "compare_at_price", "cost_per_item", "weight")
    def serialize_decimal(self, value: Optional[Decimal]) -> Optional[float]:
        return float(value) if value is not None else None

class ProductDetailResponse(BaseModel):
    id: str
    supplier_id: str
    category_id: str
    brand_id: Optional[str] = None
    sku: str
    name: str
    slug: str
    short_description: Optional[str] = None
    description: Optional[str] = None
    price: Decimal
    compare_at_price: Optional[Decimal] = None
    weight: Optional[Decimal] = None
    dimensions: Dict[str, Any] = {}
    materials: List[str] = []
    care_instructions: Optional[str] = None
    origin_country: Optional[str] = None
    manufacturing_details: Dict[str, Any] = {}
    status: ProductStatusEnum
    approval_status: ProductApprovalEnum
    visibility: ProductVisibilityEnum
    published_at: Optional[datetime] = None
    tags: List[str] = []
    seo_meta: Dict[str, Any] = {}
    category: Optional[Dict[str, Any]] = None
    brand: Optional[Dict[str, Any]] = None
    images: List[ProductImageResponse] = []
    variants: List[ProductVariantResponse] = []
    inventory: List[ProductInventoryResponse] = []
    sustainability_scores: List[ProductSustainabilityScoreResponse] = []
    is_in_wishlist: Optional[bool] = None
    view_count: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    @field_serializer("price", "compare_at_price", "weight")
    def serialize_decimal(self, value: Optional[Decimal]) -> Optional[float]:
        return float(value) if value is not None else None

class ProductListResponse(BaseModel):
    id: str
    supplier_id: str
    category_id: str
    brand_id: Optional[str] = None
    sku: str
    name: str
    slug: str
    short_description: Optional[str] = None
    price: Decimal
    compare_at_price: Optional[Decimal] = None
    status: ProductStatusEnum
    approval_status: ProductApprovalEnum
    visibility: ProductVisibilityEnum
    tags: List[str] = []
    category: Optional[Dict[str, Any]] = None
    brand: Optional[Dict[str, Any]] = None
    images: List[ProductImageResponse] = []
    sustainability_scores: List[ProductSustainabilityScoreResponse] = []
    created_at: datetime

    @field_serializer("price", "compare_at_price")
    def serialize_decimal(self, value: Optional[Decimal]) -> Optional[float]:
        return float(value) if value is not None else None
