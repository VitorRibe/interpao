from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class SetorDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id_setor: UUID
    nome: str


class IngredienteDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id_ingr: UUID
    nome: str
    unidade_med: str
    created_at: datetime
    updated_at: datetime


class ItemReceitaDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id_ingr: UUID
    nome: str
    unidade_med: str
    qtd: float


class ReceitaSummaryDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id_receita: UUID
    titulo: str
    descricao: Optional[str]
    inst_preparo: Optional[str]
    image_url: Optional[str]
    tempo_preparo: Optional[int]
    porcoes: Optional[int]
    created_at: datetime
    updated_at: datetime
    item_count: int
    setores: list[SetorDTO]


class ReceitaDTO(ReceitaSummaryDTO):
    itens: list[ItemReceitaDTO]


class ReceitaCreate(BaseModel):
    titulo: str
    descricao: Optional[str] = None
    inst_preparo: Optional[str] = None
    image_url: Optional[str] = None
    tempo_preparo: Optional[int] = None
    porcoes: Optional[int] = None


class ReceitaUpdate(BaseModel):
    titulo: Optional[str] = None
    descricao: Optional[str] = None
    inst_preparo: Optional[str] = None
    image_url: Optional[str] = None
    tempo_preparo: Optional[int] = None
    porcoes: Optional[int] = None


class IngredienteCreate(BaseModel):
    nome: str
    unidade_med: str


class IngredienteUpdate(BaseModel):
    nome: Optional[str] = None
    unidade_med: Optional[str] = None


class ItemReceitaCreate(BaseModel):
    id_ingr: UUID
    qtd: float
