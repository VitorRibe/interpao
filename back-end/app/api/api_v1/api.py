from fastapi import APIRouter
from src.auth.routes import router as auth_router
from src.auth.routes_admin import router as admin_router
from src.beneficios.routes import router as beneficios_router
from src.content.routes import router as content_router
from src.escala.routes import router as escala_router
from src.recipes.routes import router as recipes_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(admin_router)
api_router.include_router(beneficios_router)
api_router.include_router(content_router)
api_router.include_router(escala_router)
api_router.include_router(recipes_router)

@api_router.get("/health-check")
async def health_check():
    return {"status": "ok"}
