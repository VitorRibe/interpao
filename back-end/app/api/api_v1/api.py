from fastapi import APIRouter

api_router = APIRouter()

# Example router inclusion
# from app.api.api_v1.endpoints import items
# api_router.include_router(items.router, prefix="/items", tags=["items"])

@api_router.get("/health-check")
async def health_check():
    return {"status": "ok"}
