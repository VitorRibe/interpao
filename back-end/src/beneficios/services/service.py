import uuid
from typing import Optional
from fastapi import HTTPException, status
from src.beneficios.repositories.beneficio_repository import BeneficioRepository
from src.beneficios.schemas import (
    BeneficioCreate,
    BeneficioDTO,
    BeneficioUpdate,
    UserBeneficioDTO,
)

class BeneficioService:
    def __init__(self, repository: BeneficioRepository):
        self.repository = repository

    async def list_beneficios_for_user(self, user_id: uuid.UUID) -> list[UserBeneficioDTO]:
        all_benefits = await self.repository.list_beneficios()
        user_assignments = await self.repository.list_user_beneficios(user_id)
        
        assignments_map = {ua.id_beneficio: ua.valor_customizado for ua in user_assignments}
        
        dtos = []
        for b in all_benefits:
            is_active = b.id_beneficio in assignments_map
            val = assignments_map.get(b.id_beneficio) if is_active else None
            dtos.append(
                UserBeneficioDTO(
                    id_beneficio=b.id_beneficio,
                    titulo=b.titulo,
                    descricao=b.descricao,
                    como_usar=b.como_usar,
                    categoria=b.categoria,
                    icone=b.icone,
                    tipo=b.tipo,
                    detalhes_padrao=b.detalhes_padrao,
                    valor_customizado=val,
                    is_active=is_active
                )
            )
        return dtos

    async def get_beneficio(self, id_beneficio: uuid.UUID) -> BeneficioDTO:
        b = await self.repository.get_beneficio(id_beneficio)
        if not b:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Benefício não encontrado"
            )
        return BeneficioDTO.model_validate(b)

    async def create_beneficio(self, request: BeneficioCreate) -> BeneficioDTO:
        b = await self.repository.create_beneficio(request.model_dump())
        return BeneficioDTO.model_validate(b)

    async def update_beneficio(
        self, id_beneficio: uuid.UUID, request: BeneficioUpdate
    ) -> BeneficioDTO:
        b = await self.repository.get_beneficio(id_beneficio)
        if not b:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Benefício não encontrado"
            )
        
        dump = request.model_dump(exclude_unset=True)
        updated = await self.repository.update_beneficio(id_beneficio, dump)
        return BeneficioDTO.model_validate(updated)

    async def delete_beneficio(self, id_beneficio: uuid.UUID) -> None:
        b = await self.repository.get_beneficio(id_beneficio)
        if not b:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Benefício não encontrado"
            )
        await self.repository.delete_beneficio(id_beneficio)

    async def assign_beneficio(
        self, user_id: uuid.UUID, id_beneficio: uuid.UUID, valor_customizado: Optional[str]
    ) -> None:
        b = await self.repository.get_beneficio(id_beneficio)
        if not b:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Benefício não encontrado"
            )
            
        await self.repository.assign_beneficio(user_id, id_beneficio, valor_customizado)

    async def unassign_beneficio(self, user_id: uuid.UUID, id_beneficio: uuid.UUID) -> None:
        await self.repository.unassign_beneficio(user_id, id_beneficio)
