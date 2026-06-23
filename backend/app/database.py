"""
Database connection and configuration for MongoDB Atlas.
Uses Motor (async MongoDB driver) for non-blocking operations.
"""

import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "dish_management")

# Global client instance
client: AsyncIOMotorClient = None
db = None


async def connect_db():
    """Initialize MongoDB connection."""
    global client, db
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client[DATABASE_NAME]
    # Create indexes for performance
    await db.dishes.create_index("dishId", unique=True)
    await db.dishes.create_index("dishName")
    await db.dishes.create_index("createdAt")
    print(f"Connected to MongoDB: {DATABASE_NAME}")


async def close_db():
    """Close MongoDB connection."""
    global client
    if client:
        client.close()
        print("MongoDB connection closed.")


def get_db():
    """Return the database instance."""
    return db
