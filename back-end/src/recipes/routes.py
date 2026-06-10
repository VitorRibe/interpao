import uuid

from fastapi import APIRouter, Depends, Response, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_async_db
from src.auth.dependencies import ValidateAdminAccess, ValidateUserAccess
from src.recipes.repositories.recipe_repository import RecipeRepository
from src.recipes.schemas import (
    IngredienteCreate,
    IngredienteDTO,
    IngredienteUpdate,
    ItemReceitaCreate,
    ReceitaCreate,
    ReceitaDTO,
    ReceitaSummaryDTO,
    ReceitaUpdate,
    SetorDTO,
)
from src.recipes.services.service import RecipeService

router = APIRouter(prefix="/recipes", tags=["recipes"])


class UpdateQtd(BaseModel):
    qtd: float


@router.get("/setores", response_model=list[SetorDTO])
async def list_setores(
    db: AsyncSession = Depends(get_async_db),
    _user=Depends(ValidateUserAccess),
):
    repository = RecipeRepository(db)
    service = RecipeService(repository)
    return await service.list_setores()


@router.get("/ingredientes", response_model=list[IngredienteDTO])
async def list_ingredientes(
    db: AsyncSession = Depends(get_async_db),
    _user=Depends(ValidateUserAccess),
):
    repository = RecipeRepository(db)
    service = RecipeService(repository)
    return await service.list_ingredientes()


@router.post(
    "/ingredientes",
    response_model=IngredienteDTO,
    status_code=status.HTTP_201_CREATED,
)
async def create_ingrediente(
    request: IngredienteCreate,
    db: AsyncSession = Depends(get_async_db),
    _user=Depends(ValidateAdminAccess),
):
    repository = RecipeRepository(db)
    service = RecipeService(repository)
    return await service.create_ingrediente(request)


@router.put("/ingredientes/{id_ingr}", response_model=IngredienteDTO)
async def update_ingrediente(
    id_ingr: uuid.UUID,
    request: IngredienteUpdate,
    db: AsyncSession = Depends(get_async_db),
    _user=Depends(ValidateAdminAccess),
):
    repository = RecipeRepository(db)
    service = RecipeService(repository)
    return await service.update_ingrediente(id_ingr, request)


@router.delete("/ingredientes/{id_ingr}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_ingrediente(
    id_ingr: uuid.UUID,
    db: AsyncSession = Depends(get_async_db),
    _user=Depends(ValidateAdminAccess),
):
    repository = RecipeRepository(db)
    service = RecipeService(repository)
    await service.delete_ingrediente(id_ingr)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/receitas", response_model=list[ReceitaSummaryDTO])
async def list_receitas(
    db: AsyncSession = Depends(get_async_db),
    _user=Depends(ValidateUserAccess),
):
    repository = RecipeRepository(db)
    service = RecipeService(repository)
    return await service.list_receitas()


@router.get("/receitas/{id_receita}", response_model=ReceitaDTO)
async def get_receita(
    id_receita: uuid.UUID,
    db: AsyncSession = Depends(get_async_db),
    _user=Depends(ValidateUserAccess),
):
    repository = RecipeRepository(db)
    service = RecipeService(repository)
    return await service.get_receita(id_receita)


@router.post(
    "/receitas",
    response_model=ReceitaDTO,
    status_code=status.HTTP_201_CREATED,
)
async def create_receita(
    request: ReceitaCreate,
    db: AsyncSession = Depends(get_async_db),
    _user=Depends(ValidateAdminAccess),
):
    repository = RecipeRepository(db)
    service = RecipeService(repository)
    return await service.create_receita(request)


@router.put("/receitas/{id_receita}", response_model=ReceitaDTO)
async def update_receita(
    id_receita: uuid.UUID,
    request: ReceitaUpdate,
    db: AsyncSession = Depends(get_async_db),
    _user=Depends(ValidateAdminAccess),
):
    repository = RecipeRepository(db)
    service = RecipeService(repository)
    return await service.update_receita(id_receita, request)


@router.delete("/receitas/{id_receita}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_receita(
    id_receita: uuid.UUID,
    db: AsyncSession = Depends(get_async_db),
    _user=Depends(ValidateAdminAccess),
):
    repository = RecipeRepository(db)
    service = RecipeService(repository)
    await service.delete_receita(id_receita)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post(
    "/receitas/{id_receita}/itens",
    response_model=ReceitaDTO,
    status_code=status.HTTP_201_CREATED,
)
async def add_item_receita(
    id_receita: uuid.UUID,
    request: ItemReceitaCreate,
    db: AsyncSession = Depends(get_async_db),
    _user=Depends(ValidateAdminAccess),
):
    repository = RecipeRepository(db)
    service = RecipeService(repository)
    return await service.add_item_receita(id_receita, request)


@router.put("/receitas/{id_receita}/itens/{id_ingr}", response_model=ReceitaDTO)
async def update_item_receita(
    id_receita: uuid.UUID,
    id_ingr: uuid.UUID,
    request: UpdateQtd,
    db: AsyncSession = Depends(get_async_db),
    _user=Depends(ValidateAdminAccess),
):
    repository = RecipeRepository(db)
    service = RecipeService(repository)
    return await service.update_item_receita(id_receita, id_ingr, request.qtd)


@router.delete(
    "/receitas/{id_receita}/itens/{id_ingr}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def remove_item_receita(
    id_receita: uuid.UUID,
    id_ingr: uuid.UUID,
    db: AsyncSession = Depends(get_async_db),
    _user=Depends(ValidateAdminAccess),
):
    repository = RecipeRepository(db)
    service = RecipeService(repository)
    await service.remove_item_receita(id_receita, id_ingr)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post(
    "/receitas/{id_receita}/setores/{id_setor}",
    response_model=ReceitaDTO,
    status_code=status.HTTP_201_CREATED,
)
async def add_setor_receita(
    id_receita: uuid.UUID,
    id_setor: uuid.UUID,
    db: AsyncSession = Depends(get_async_db),
    _user=Depends(ValidateAdminAccess),
):
    repository = RecipeRepository(db)
    service = RecipeService(repository)
    return await service.add_setor_receita(id_receita, id_setor)


@router.delete(
    "/receitas/{id_receita}/setores/{id_setor}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def remove_setor_receita(
    id_receita: uuid.UUID,
    id_setor: uuid.UUID,
    db: AsyncSession = Depends(get_async_db),
    _user=Depends(ValidateAdminAccess),
):
    repository = RecipeRepository(db)
    service = RecipeService(repository)
    await service.remove_setor_receita(id_receita, id_setor)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
