import uuid
from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_async_db
from src.auth.dependencies import ValidateAdminAccess, ValidateUserAccess
from src.auth.schemas import LoggedUserDTO
from src.beneficios.repositories.beneficio_repository import BeneficioRepository
from src.beneficios.services.service import BeneficioService
from src.beneficios.schemas import (
    BeneficioCreate,
    BeneficioDTO,
    BeneficioUpdate,
    UserBeneficioDTO,
    BeneficioAssignRequest,
)

router = APIRouter(prefix="/beneficios", tags=["beneficios"])

@router.get("", response_model=list[UserBeneficioDTO])
async def list_my_beneficios(
    db: AsyncSession = Depends(get_async_db),
    current_user: LoggedUserDTO = Depends(ValidateUserAccess),
):
    repository = BeneficioRepository(db)
    service = BeneficioService(repository)
    return await service.list_beneficios_for_user(current_user.id)

@router.get("/user/{user_id}", response_model=list[UserBeneficioDTO])
async def list_user_beneficios(
    user_id: uuid.UUID,
    db: AsyncSession = Depends(get_async_db),
    _admin: LoggedUserDTO = Depends(ValidateAdminAccess),
):
    repository = BeneficioRepository(db)
    service = BeneficioService(repository)
    return await service.list_beneficios_for_user(user_id)

@router.post("", response_model=BeneficioDTO, status_code=status.HTTP_201_CREATED)
async def create_beneficio(
    request: BeneficioCreate,
    db: AsyncSession = Depends(get_async_db),
    _admin: LoggedUserDTO = Depends(ValidateAdminAccess),
):
    repository = BeneficioRepository(db)
    service = BeneficioService(repository)
    return await service.create_beneficio(request)

@router.put("/{id_beneficio}", response_model=BeneficioDTO)
async def update_beneficio(
    id_beneficio: uuid.UUID,
    request: BeneficioUpdate,
    db: AsyncSession = Depends(get_async_db),
    _admin: LoggedUserDTO = Depends(ValidateAdminAccess),
):
    repository = BeneficioRepository(db)
    service = BeneficioService(repository)
    return await service.update_beneficio(id_beneficio, request)

@router.delete("/{id_beneficio}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_beneficio(
    id_beneficio: uuid.UUID,
    db: AsyncSession = Depends(get_async_db),
    _admin: LoggedUserDTO = Depends(ValidateAdminAccess),
):
    repository = BeneficioRepository(db)
    service = BeneficioService(repository)
    await service.delete_beneficio(id_beneficio)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.post("/user/{user_id}/assign/{id_beneficio}", status_code=status.HTTP_200_OK)
async def assign_beneficio(
    user_id: uuid.UUID,
    id_beneficio: uuid.UUID,
    request: BeneficioAssignRequest,
    db: AsyncSession = Depends(get_async_db),
    _admin: LoggedUserDTO = Depends(ValidateAdminAccess),
):
    repository = BeneficioRepository(db)
    service = BeneficioService(repository)
    await service.assign_beneficio(user_id, id_beneficio, request.valor_customizado)
    return {"message": "Benefício atribuído com sucesso"}

@router.delete("/user/{user_id}/unassign/{id_beneficio}", status_code=status.HTTP_200_OK)
async def unassign_beneficio(
    user_id: uuid.UUID,
    id_beneficio: uuid.UUID,
    db: AsyncSession = Depends(get_async_db),
    _admin: LoggedUserDTO = Depends(ValidateAdminAccess),
):
    repository = BeneficioRepository(db)
    service = BeneficioService(repository)
    await service.unassign_beneficio(user_id, id_beneficio)
    return {"message": "Benefício removido com sucesso"}
