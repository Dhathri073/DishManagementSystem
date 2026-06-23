"""
Pydantic models for request/response validation.
"""

from pydantic import BaseModel, Field, HttpUrl
from typing import Optional
from datetime import datetime
import uuid


class DishCreate(BaseModel):
    """Schema for creating a new dish."""
    dishName: str = Field(..., min_length=1, max_length=200)
    imageUrl: str = Field(default="", )
    isPublished: bool = Field(default=False)


class ActivityLog(BaseModel):
    """Schema for a recent activity entry."""
    activityId: str
    dishId: str
    dishName: str
    action: str          # "created" | "published" | "unpublished" | "deleted"
    timestamp: datetime


class DishUpdate(BaseModel):
    """Schema for updating dish fields."""
    dishName: Optional[str] = Field(None, min_length=1, max_length=200)
    imageUrl: Optional[str] = None
    isPublished: Optional[bool] = None


class DishResponse(BaseModel):
    """Schema for dish responses sent to client."""
    dishId: str
    dishName: str
    imageUrl: str
    isPublished: bool
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True


class WSMessage(BaseModel):
    """WebSocket broadcast message schema."""
    event: str          # e.g. "dish_updated", "dish_created", "dish_deleted"
    dish: Optional[dict] = None
    dishId: Optional[str] = None
