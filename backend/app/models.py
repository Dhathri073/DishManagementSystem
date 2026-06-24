"""
Pydantic models for request/response validation.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class DishCreate(BaseModel):
    """Schema for creating a new dish."""
    dishName: str = Field(..., min_length=1, max_length=200)
    imageUrl: str = Field(default="")
    description: str = Field(default="")
    category: str = Field(default="Main Course")
    price: float = Field(default=0.0, ge=0)
    isPublished: bool = Field(default=False)


class DishUpdate(BaseModel):
    """Schema for partial updates to a dish."""
    dishName: Optional[str] = Field(None, min_length=1, max_length=200)
    imageUrl: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = Field(None, ge=0)
    isPublished: Optional[bool] = None


class DishResponse(BaseModel):
    """Schema for dish responses sent to client."""
    dishId: str
    dishName: str
    imageUrl: str
    description: str = ""
    category: str = "Main Course"
    price: float = 0.0
    isPublished: bool
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True


class ActivityLog(BaseModel):
    """Schema for a recent activity entry."""
    activityId: str
    dishId: str
    dishName: str
    action: str   # "created" | "updated" | "published" | "unpublished" | "deleted"
    timestamp: datetime


class WSMessage(BaseModel):
    """WebSocket broadcast message schema."""
    event: str          # "dish_created" | "dish_updated" | "dish_deleted"
    dish: Optional[dict] = None
    dishId: Optional[str] = None
