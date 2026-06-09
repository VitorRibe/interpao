from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class SetorDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id_setor: UUID
    nome: str


class MultimidiaDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id_multimidia: UUID
    id_modulo: Optional[UUID]
    titulo: str
    url: Optional[str]
    tipo: Optional[str]
    created_at: datetime
    updated_at: datetime


class ModuloDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id_modulo: UUID
    id_trilha: Optional[UUID]
    titulo: str
    descricao: Optional[str]
    conteudo: Optional[str]
    duracao: Optional[int]
    ordem: Optional[int]
    created_at: datetime
    updated_at: datetime
    multimidia: list[MultimidiaDTO] = Field(default_factory=list)


class TrilhaSummaryDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id_trilha: UUID
    titulo: str
    descricao: Optional[str]
    carga_hor: Optional[int]
    id_setor: Optional[UUID]
    created_at: datetime
    updated_at: datetime
    setor: Optional[SetorDTO]
    module_count: int


class TrilhaDTO(TrilhaSummaryDTO):
    modulos: list[ModuloDTO] = Field(default_factory=list)


class TrilhaCreate(BaseModel):
    titulo: str
    descricao: Optional[str] = None
    carga_hor: Optional[int] = None
    id_setor: Optional[UUID] = None


class TrilhaUpdate(BaseModel):
    titulo: Optional[str] = None
    descricao: Optional[str] = None
    carga_hor: Optional[int] = None
    id_setor: Optional[UUID] = None


class ModuloCreate(BaseModel):
    id_trilha: UUID
    titulo: str
    descricao: Optional[str] = None
    conteudo: Optional[str] = None
    duracao: Optional[int] = None
    ordem: Optional[int] = None


class ModuloUpdate(BaseModel):
    id_trilha: Optional[UUID] = None
    titulo: Optional[str] = None
    descricao: Optional[str] = None
    conteudo: Optional[str] = None
    duracao: Optional[int] = None
    ordem: Optional[int] = None


class MultimidiaCreate(BaseModel):
    titulo: str
    url: Optional[str] = None
    tipo: Optional[str] = None
