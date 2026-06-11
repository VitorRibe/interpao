import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_async_db
from src.auth.dependencies import ValidateUserAccess, ValidateAdminAccess
from src.auth.schemas import LoggedUserDTO
from src.escala.schemas import EscalaResponse, UpsertEscalaRequest
from src.escala.repositories.escala_repository import EscalaRepository

router = APIRouter(prefix="/escala", tags=["escala"])


def _to_response(user_id: uuid.UUID, itens) -> dict:
    return {
        "user_id": user_id,
        "itens": [
            {
                "dia_semana": i.dia_semana,
                "folga": i.folga,
                "entrada": i.entrada,
                "saida": i.saida,
                "intervalo_min": i.intervalo_min,
                "turno": i.turno,
                "notas": i.notas,
            }
            for i in itens
        ],
    }


@router.get("/me", response_model=EscalaResponse)
async def get_my_escala(
    user: LoggedUserDTO = Depends(ValidateUserAccess),
    db: AsyncSession = Depends(get_async_db),
):
    """Return the authenticated user's weekly schedule."""
    repo = EscalaRepository(db)
    itens = await repo.get_by_user_id(user.id)
    return _to_response(user.id, itens)


@router.get("/admin/{user_id}", response_model=EscalaResponse)
async def get_user_escala(
    user_id: uuid.UUID,
    admin: LoggedUserDTO = Depends(ValidateAdminAccess),
    db: AsyncSession = Depends(get_async_db),
):
    """Return a specific user's weekly schedule (admin only)."""
    repo = EscalaRepository(db)
    itens = await repo.get_by_user_id(user_id)
    return _to_response(user_id, itens)


@router.put("/admin/{user_id}", response_model=EscalaResponse)
async def upsert_user_escala(
    user_id: uuid.UUID,
    request: UpsertEscalaRequest,
    admin: LoggedUserDTO = Depends(ValidateAdminAccess),
    db: AsyncSession = Depends(get_async_db),
):
    """Replace a user's full weekly schedule (admin only)."""
    repo = EscalaRepository(db)
    itens = await repo.upsert_for_user(
        user_id, [item.model_dump() for item in request.itens]
    )
    return _to_response(user_id, itens)
