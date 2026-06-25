import uuid
from typing import Optional
from sqlalchemy import delete, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.beneficio import Beneficio, UserBeneficio

class BeneficioRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def list_beneficios(self) -> list[Beneficio]:
        result = await self.db.execute(select(Beneficio).order_by(Beneficio.titulo))
        return list(result.scalars().all())

    async def get_beneficio(self, id_beneficio: uuid.UUID) -> Optional[Beneficio]:
        result = await self.db.execute(
            select(Beneficio).where(Beneficio.id_beneficio == id_beneficio)
        )
        return result.scalar_one_or_none()

    async def create_beneficio(self, data: dict) -> Beneficio:
        beneficio = Beneficio(**data)
        self.db.add(beneficio)
        await self.db.commit()
        await self.db.refresh(beneficio)
        return beneficio

    async def update_beneficio(
        self, id_beneficio: uuid.UUID, data: dict
    ) -> Optional[Beneficio]:
        await self.db.execute(
            update(Beneficio)
            .where(Beneficio.id_beneficio == id_beneficio)
            .values(**data)
        )
        await self.db.commit()
        return await self.get_beneficio(id_beneficio)

    async def delete_beneficio(self, id_beneficio: uuid.UUID) -> None:
        await self.db.execute(
            delete(Beneficio).where(Beneficio.id_beneficio == id_beneficio)
        )
        await self.db.commit()

    async def get_user_beneficio(
        self, user_id: uuid.UUID, id_beneficio: uuid.UUID
    ) -> Optional[UserBeneficio]:
        result = await self.db.execute(
            select(UserBeneficio).where(
                UserBeneficio.user_id == user_id,
                UserBeneficio.id_beneficio == id_beneficio
            )
        )
        return result.scalar_one_or_none()

    async def list_user_beneficios(self, user_id: uuid.UUID) -> list[UserBeneficio]:
        result = await self.db.execute(
            select(UserBeneficio).where(UserBeneficio.user_id == user_id)
        )
        return list(result.scalars().all())

    async def assign_beneficio(
        self, user_id: uuid.UUID, id_beneficio: uuid.UUID, valor_customizado: Optional[str]
    ) -> UserBeneficio:
        existing = await self.get_user_beneficio(user_id, id_beneficio)
        if existing:
            await self.db.execute(
                update(UserBeneficio)
                .where(
                    UserBeneficio.user_id == user_id,
                    UserBeneficio.id_beneficio == id_beneficio
                )
                .values(valor_customizado=valor_customizado)
            )
            await self.db.commit()
            return await self.get_user_beneficio(user_id, id_beneficio)
        
        user_beneficio = UserBeneficio(
            user_id=user_id,
            id_beneficio=id_beneficio,
            valor_customizado=valor_customizado
        )
        self.db.add(user_beneficio)
        await self.db.commit()
        await self.db.refresh(user_beneficio)
        return user_beneficio

    async def unassign_beneficio(self, user_id: uuid.UUID, id_beneficio: uuid.UUID) -> None:
        await self.db.execute(
            delete(UserBeneficio).where(
                UserBeneficio.user_id == user_id,
                UserBeneficio.id_beneficio == id_beneficio
            )
        )
        await self.db.commit()
