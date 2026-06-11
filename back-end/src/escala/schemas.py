from pydantic import BaseModel
from typing import Optional
from uuid import UUID


class EscalaItemSchema(BaseModel):
    dia_semana: int           # 0=Segunda … 6=Domingo
    folga: bool = False
    entrada: Optional[str] = None   # "HH:MM"
    saida: Optional[str] = None     # "HH:MM"
    intervalo_min: int = 60
    turno: Optional[str] = None
    notas: Optional[str] = None

    class Config:
        from_attributes = True


class EscalaResponse(BaseModel):
    user_id: UUID
    itens: list[EscalaItemSchema]


class UpsertEscalaRequest(BaseModel):
    itens: list[EscalaItemSchema]
