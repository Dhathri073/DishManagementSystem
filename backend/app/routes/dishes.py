"""
Dish CRUD routes + image upload.
GET    /api/dishes                - list all dishes
POST   /api/dishes                - create a dish
POST   /api/dishes/upload-image   - upload image, returns URL
PATCH  /api/dishes/{id}/toggle    - toggle published status
DELETE /api/dishes/{id}           - delete a dish
GET    /api/activities            - recent activity log (last 20)
"""

from fastapi import APIRouter, HTTPException, status, UploadFile, File
from fastapi.responses import JSONResponse
from datetime import datetime, timezone
import uuid
import os
import shutil

from app.database import get_db
from app.models import DishCreate, DishResponse
from app.websocket_manager import manager

router = APIRouter(prefix="/api/dishes", tags=["dishes"])
activities_router = APIRouter(prefix="/api/activities", tags=["activities"])

MAX_SIZE_MB = 5
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "uploads")

# Magic-byte signatures
_SIGNATURES = {
    "jpeg": [(0, b"\xff\xd8\xff")],
    "png":  [(0, b"\x89PNG\r\n\x1a\n")],
    "gif":  [(0, b"GIF87a"), (0, b"GIF89a")],
    "webp": [(0, b"RIFF"), (8, b"WEBP")],
}
_EXT = {"jpeg": "jpg", "png": "png", "gif": "gif", "webp": "webp"}

def _detect_image_type(data: bytes) -> str | None:
    for img_type, sigs in _SIGNATURES.items():
        if all(data[off:off+len(sig)] == sig for off, sig in sigs):
            return img_type
    return None


def _serialize(dish: dict) -> dict:
    """Convert MongoDB document to JSON-serializable dict."""
    dish.pop("_id", None)
    return dish


async def _log_activity(db, dish_id: str, dish_name: str, action: str):
    """Insert an activity record and keep only the last 100."""
    await db.activities.insert_one({
        "activityId": str(uuid.uuid4()),
        "dishId": dish_id,
        "dishName": dish_name,
        "action": action,
        "timestamp": datetime.now(timezone.utc),
    })
    # Trim to last 100 entries
    count = await db.activities.count_documents({})
    if count > 100:
        oldest = await db.activities.find().sort("timestamp", 1).limit(count - 100).to_list(length=None)
        ids = [d["_id"] for d in oldest]
        await db.activities.delete_many({"_id": {"$in": ids}})


@router.get("", response_model=list[DishResponse])
async def get_dishes():
    """Return all dishes sorted by creation date (newest first)."""
    db = get_db()
    cursor = db.dishes.find().sort("createdAt", -1)
    dishes = await cursor.to_list(length=None)
    return [_serialize(d) for d in dishes]


@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    """
    Save uploaded image to disk, return a /uploads/<filename> URL.
    Avoids base64 bloat in MongoDB and serves images efficiently.
    """
    contents = await file.read()

    if len(contents) / (1024 * 1024) > MAX_SIZE_MB:
        raise HTTPException(400, f"Image must be under {MAX_SIZE_MB}MB")

    img_type = _detect_image_type(contents)
    if img_type is None:
        raise HTTPException(400, "Only JPEG, PNG, GIF, WebP images are allowed")

    # Save with a unique filename
    ext = _EXT[img_type]
    filename = f"{uuid.uuid4()}.{ext}"
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    filepath = os.path.join(UPLOAD_DIR, filename)
    with open(filepath, "wb") as f:
        f.write(contents)

    # Return the static path — frontend prepends the backend base URL
    return {"imageUrl": f"/uploads/{filename}"}


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
    await _log_activity(db, doc["dishId"], dish.dishName, "created")
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

    action = "published" if new_status else "unpublished"
    await _log_activity(db, dish_id, dish["dishName"], action)
    await manager.broadcast({"event": "dish_updated", "dish": serialized})
    return serialized


@router.delete("/{dish_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_dish(dish_id: str):
    """Delete a dish and broadcast the deletion."""
    db = get_db()
    dish = await db.dishes.find_one({"dishId": dish_id})
    if not dish:
        raise HTTPException(status_code=404, detail="Dish not found")
    await db.dishes.delete_one({"dishId": dish_id})
    await _log_activity(db, dish_id, dish["dishName"], "deleted")
    await manager.broadcast({"event": "dish_deleted", "dishId": dish_id})


@activities_router.get("")
async def get_activities():
    """Return the 20 most recent activities."""
    db = get_db()
    cursor = db.activities.find().sort("timestamp", -1).limit(20)
    items = await cursor.to_list(length=None)
    for item in items:
        item.pop("_id", None)
    return items
