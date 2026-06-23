"""
Dish CRUD routes.
GET    /api/dishes          - list all dishes
POST   /api/dishes          - create a dish
PATCH  /api/dishes/{id}/toggle - toggle published status
DELETE /api/dishes/{id}     - delete a dish
"""

from fastapi import APIRouter, HTTPException, status
from datetime import datetime, timezone
import uuid

from app.database import get_db
from app.models import DishCreate, DishResponse
from app.websocket_manager import manager

router = APIRouter(prefix="/api/dishes", tags=["dishes"])


def _serialize(dish: dict) -> dict:
    """Convert MongoDB document to JSON-serializable dict."""
    dish.pop("_id", None)
    return dish


@router.get("", response_model=list[DishResponse])
async def get_dishes():
    """Return all dishes sorted by creation date (newest first)."""
    db = get_db()
    cursor = db.dishes.find().sort("createdAt", -1)
    dishes = await cursor.to_list(length=None)
    return [_serialize(d) for d in dishes]


@router.post("", response_model=DishResponse, status_code=status.HTTP_201_CREATED)
async def create_dish(dish: DishCreate):
    """Create a new dish and broadcast the event."""
    db = get_db()
    now = datetime.now(timezone.utc)
    doc = {
        "dishId": str(uuid.uuid4()),
        "dishName": dish.dishName,
        "imageUrl": dish.imageUrl,
        "isPublished": dish.isPublished,
        "createdAt": now,
        "updatedAt": now,
    }
    await db.dishes.insert_one(doc)
    serialized = _serialize(doc)

    # Broadcast to all WebSocket clients
    await manager.broadcast({"event": "dish_created", "dish": serialized})
    return serialized


@router.patch("/{dish_id}/toggle", response_model=DishResponse)
async def toggle_published(dish_id: str):
    """Toggle the isPublished field of a dish and broadcast the change."""
    db = get_db()
    dish = await db.dishes.find_one({"dishId": dish_id})
    if not dish:
        raise HTTPException(status_code=404, detail="Dish not found")

    new_status = not dish["isPublished"]
    now = datetime.now(timezone.utc)

    await db.dishes.update_one(
        {"dishId": dish_id},
        {"$set": {"isPublished": new_status, "updatedAt": now}},
    )

    dish["isPublished"] = new_status
    dish["updatedAt"] = now
    serialized = _serialize(dish)

    # Broadcast toggle event
    await manager.broadcast({"event": "dish_updated", "dish": serialized})
    return serialized


@router.delete("/{dish_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_dish(dish_id: str):
    """Delete a dish and broadcast the deletion."""
    db = get_db()
    result = await db.dishes.delete_one({"dishId": dish_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Dish not found")

    # Broadcast deletion event
    await manager.broadcast({"event": "dish_deleted", "dishId": dish_id})
