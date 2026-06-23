"""
FastAPI application entry point.
Configures CORS, WebSocket endpoint, and API routes.
"""

import os
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.database import connect_db, close_db
from app.routes.dishes import router as dish_router
from app.websocket_manager import manager

load_dotenv()

ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000"
).split(",")

app = FastAPI(
    title="Dish Management API",
    description="Production-grade dish management with real-time updates",
    version="1.0.0",
)

# CORS — allow frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register dish routes
app.include_router(dish_router)


@app.on_event("startup")
async def startup():
    await connect_db()


@app.on_event("shutdown")
async def shutdown():
    await close_db()


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "ok"}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for real-time dish updates.
    Clients connect here and receive broadcast messages on every dish change.
    """
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive; we only send, rarely receive
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
