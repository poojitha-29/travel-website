from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field


class APIMessage(BaseModel):
    message: str


class Package(BaseModel):
    id: int
    name: str
    slug: str
    description: str
    destination: str
    duration_days: int = Field(..., description="Duration in days")
    price: float
    currency: str = "USD"
    is_featured: bool = False
    thumbnail_url: Optional[str] = None
    category: Optional[str] = None
    poster_url: Optional[str] = None


class GalleryImage(BaseModel):
    id: int
    title: str
    image_url: str
    package_id: Optional[int] = None
    destination: Optional[str] = None


class Review(BaseModel):
    id: int
    package_id: Optional[int] = None
    name: str
    rating: int = Field(..., ge=1, le=5)
    comment: str
    created_at: datetime


class ReviewCreate(BaseModel):
    name: str
    rating: int = Field(..., ge=1, le=5)
    comment: str


class FAQ(BaseModel):
    id: int
    question: str
    answer: str
    category: Optional[str] = None


class Video(BaseModel):
    id: int
    title: str
    video_url: str
    thumbnail_url: Optional[str] = None
    duration_seconds: Optional[int] = None


class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    message: str
    package_id: Optional[int] = None


class ContactMessageResponse(BaseModel):
    message: str
    reference_id: Optional[str] = None
