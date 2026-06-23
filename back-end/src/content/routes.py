import uuid

from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_async_db
from src.auth.dependencies import ValidateAdminAccess, ValidateUserAccess
from src.content.repositories.content_repository import ContentRepository
from src.content.schemas import (
    ModuloCreate,
    ModuloDTO,
    ModuloUpdate,
    MultimidiaCreate,
    MultimidiaDTO,
    SetorDTO,
    TrilhaCreate,
    TrilhaDTO,
    TrilhaSummaryDTO,
    TrilhaUpdate,
)
from src.content.services.service import ContentService

router = APIRouter(prefix="/content", tags=["content"])


@router.get("/setores", response_model=list[SetorDTO])
async def list_setores(
    db: AsyncSession = Depends(get_async_db),
    _user=Depends(ValidateUserAccess),
):
    repository = ContentRepository(db)
    service = ContentService(repository)
    return await service.list_setores()


@router.get("/trilhas", response_model=list[TrilhaSummaryDTO])
async def list_trilhas(
    db: AsyncSession = Depends(get_async_db),
    _user=Depends(ValidateUserAccess),
):
    repository = ContentRepository(db)
    service = ContentService(repository)
    return await service.list_trilhas()


@router.get("/trilhas/{id_trilha}", response_model=TrilhaDTO)
async def get_trilha(
    id_trilha: uuid.UUID,
    db: AsyncSession = Depends(get_async_db),
    _user=Depends(ValidateUserAccess),
):
    repository = ContentRepository(db)
    service = ContentService(repository)
    return await service.get_trilha(id_trilha)


@router.post(
    "/trilhas",
    response_model=TrilhaDTO,
    status_code=status.HTTP_201_CREATED,
)
async def create_trilha(
    request: TrilhaCreate,
    db: AsyncSession = Depends(get_async_db),
    _user=Depends(ValidateAdminAccess),
):
    repository = ContentRepository(db)
    service = ContentService(repository)
    return await service.create_trilha(request)


@router.put("/trilhas/{id_trilha}", response_model=TrilhaDTO)
async def update_trilha(
    id_trilha: uuid.UUID,
    request: TrilhaUpdate,
    db: AsyncSession = Depends(get_async_db),
    _user=Depends(ValidateAdminAccess),
):
    repository = ContentRepository(db)
    service = ContentService(repository)
    return await service.update_trilha(id_trilha, request)


@router.delete("/trilhas/{id_trilha}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_trilha(
    id_trilha: uuid.UUID,
    db: AsyncSession = Depends(get_async_db),
    _user=Depends(ValidateAdminAccess),
):
    repository = ContentRepository(db)
    service = ContentService(repository)
    await service.delete_trilha(id_trilha)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/trilhas/{id_trilha}/modulos", response_model=list[ModuloDTO])
async def list_modulos(
    id_trilha: uuid.UUID,
    db: AsyncSession = Depends(get_async_db),
    _user=Depends(ValidateUserAccess),
):
    repository = ContentRepository(db)
    service = ContentService(repository)
    return await service.list_modulos(id_trilha)


@router.post(
    "/modulos",
    response_model=ModuloDTO,
    status_code=status.HTTP_201_CREATED,
)
async def create_modulo(
    request: ModuloCreate,
    db: AsyncSession = Depends(get_async_db),
    _user=Depends(ValidateAdminAccess),
):
    repository = ContentRepository(db)
    service = ContentService(repository)
    return await service.create_modulo(request)


@router.put("/modulos/{id_modulo}", response_model=ModuloDTO)
async def update_modulo(
    id_modulo: uuid.UUID,
    request: ModuloUpdate,
    db: AsyncSession = Depends(get_async_db),
    _user=Depends(ValidateAdminAccess),
):
    repository = ContentRepository(db)
    service = ContentService(repository)
    return await service.update_modulo(id_modulo, request)


@router.delete("/modulos/{id_modulo}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_modulo(
    id_modulo: uuid.UUID,
    db: AsyncSession = Depends(get_async_db),
    _user=Depends(ValidateAdminAccess),
):
    repository = ContentRepository(db)
    service = ContentService(repository)
    await service.delete_modulo(id_modulo)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post(
    "/modulos/{id_modulo}/multimidia",
    response_model=MultimidiaDTO,
    status_code=status.HTTP_201_CREATED,
)
async def create_multimidia(
    id_modulo: uuid.UUID,
    request: MultimidiaCreate,
    db: AsyncSession = Depends(get_async_db),
    _user=Depends(ValidateAdminAccess),
):
    repository = ContentRepository(db)
    service = ContentService(repository)
    return await service.create_multimidia(id_modulo, request)

@router.post(
    "/modulos/{id_modulo}/concluir",
    status_code=status.HTTP_200_OK,
)
async def concluir_modulo(
    id_modulo: uuid.UUID,
    db: AsyncSession = Depends(get_async_db),
    user=Depends(ValidateUserAccess), # O Depends que já configurou
):
    repository = ContentRepository(db)
    service = ContentService(repository)
    
    # O objeto 'user' retornado por ValidateUserAccess deve conter o ID do utilizador (ex: user.id)
    # Adapte user.id conforme a estrutura do objeto retornado pela sua dependência
    return await service.concluir_modulo(user_id=user.id, id_modulo=id_modulo)


@router.delete("/multimidia/{id_multimidia}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_multimidia(
    id_multimidia: uuid.UUID,
    db: AsyncSession = Depends(get_async_db),
    _user=Depends(ValidateAdminAccess),
):
    repository = ContentRepository(db)
    service = ContentService(repository)
    await service.delete_multimidia(id_multimidia)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
