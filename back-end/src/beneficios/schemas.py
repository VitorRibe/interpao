import uuid
from typing import Optional
from pydantic import BaseModel

class BeneficioBase(BaseModel):
    titulo: str
    descricao: Optional[str] = None
    como_usar: Optional[str] = None
    categoria: str
    icone: str
    tipo: Optional[str] = None
    detalhes_padrao: Optional[str] = None

class BeneficioCreate(BeneficioBase):
    pass

class BeneficioUpdate(BaseModel):
    titulo: Optional[str] = None
    descricao: Optional[str] = None
    como_usar: Optional[str] = None
    categoria: Optional[str] = None
    icone: Optional[str] = None
    tipo: Optional[str] = None
    detalhes_padrao: Optional[str] = None

class BeneficioDTO(BeneficioBase):
    id_beneficio: uuid.UUID

    class Config:
        from_attributes = True

class UserBeneficioDTO(BaseModel):
    id_beneficio: uuid.UUID
    titulo: str
    descricao: Optional[str] = None
    como_usar: Optional[str] = None
    categoria: str
    icone: str
    tipo: Optional[str] = None
    detalhes_padrao: Optional[str] = None
    valor_customizado: Optional[str] = None
    is_active: bool = False

    class Config:
        from_attributes = True

class BeneficioAssignRequest(BaseModel):
    valor_customizado: Optional[str] = None
