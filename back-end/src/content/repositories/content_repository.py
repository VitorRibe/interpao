import uuid
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import delete, func, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.content import Modulo, Multimidia, Setor, Trilha


class ContentRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_setor(self, id_setor: uuid.UUID) -> Optional[Setor]:
        result = await self.db.execute(select(Setor).where(Setor.id_setor == id_setor))
        return result.scalar_one_or_none()

    async def list_trilhas(self) -> list[Trilha]:
        result = await self.db.execute(
            select(Trilha)
            .options(selectinload(Trilha.setor), selectinload(Trilha.modulos))
            .order_by(Trilha.titulo)
        )
        return list(result.scalars().all())

    async def get_trilha(self, id_trilha: uuid.UUID) -> Optional[Trilha]:
        result = await self.db.execute(
            select(Trilha)
            .where(Trilha.id_trilha == id_trilha)
            .options(
                selectinload(Trilha.setor),
                selectinload(Trilha.modulos).selectinload(Modulo.multimidia),
            )
        )
        return result.scalar_one_or_none()

    async def list_modulos(self, id_trilha: uuid.UUID) -> list[Modulo]:
        result = await self.db.execute(
            select(Modulo)
            .where(Modulo.id_trilha == id_trilha)
            .options(selectinload(Modulo.multimidia))
            .order_by(Modulo.ordem, Modulo.titulo)
        )
        return list(result.scalars().all())

    async def get_modulo(self, id_modulo: uuid.UUID) -> Optional[Modulo]:
        result = await self.db.execute(
            select(Modulo)
            .where(Modulo.id_modulo == id_modulo)
            .options(selectinload(Modulo.multimidia))
        )
        return result.scalar_one_or_none()

    async def get_multimidia(self, id_multimidia: uuid.UUID) -> Optional[Multimidia]:
        result = await self.db.execute(
            select(Multimidia).where(Multimidia.id_multimidia == id_multimidia)
        )
        return result.scalar_one_or_none()

    async def get_next_modulo_ordem(self, id_trilha: uuid.UUID) -> int:
        result = await self.db.execute(
            select(func.max(Modulo.ordem)).where(Modulo.id_trilha == id_trilha)
        )
        max_ordem = result.scalar_one_or_none()
        return (max_ordem or 0) + 1

    async def create_trilha(self, data: dict) -> Trilha:
        trilha = Trilha(**data)
        self.db.add(trilha)
        await self.db.commit()
        await self.db.refresh(trilha)
        return trilha

    async def update_trilha(self, id_trilha: uuid.UUID, data: dict) -> Optional[Trilha]:
        data["updated_at"] = datetime.now(timezone.utc)
        await self.db.execute(
            update(Trilha).where(Trilha.id_trilha == id_trilha).values(**data)
        )
        await self.db.commit()
        return await self.get_trilha(id_trilha)

    async def delete_trilha(self, id_trilha: uuid.UUID):
        await self.db.execute(delete(Trilha).where(Trilha.id_trilha == id_trilha))
        await self.db.commit()

    async def create_modulo(self, data: dict) -> Modulo:
        modulo = Modulo(**data)
        self.db.add(modulo)
        await self.db.commit()
        await self.db.refresh(modulo)
        return modulo

    async def update_modulo(self, id_modulo: uuid.UUID, data: dict) -> Optional[Modulo]:
        data["updated_at"] = datetime.now(timezone.utc)
        await self.db.execute(
            update(Modulo).where(Modulo.id_modulo == id_modulo).values(**data)
        )
        await self.db.commit()
        return await self.get_modulo(id_modulo)

    async def delete_modulo(self, id_modulo: uuid.UUID):
        await self.db.execute(delete(Modulo).where(Modulo.id_modulo == id_modulo))
        await self.db.commit()

    async def create_multimidia(self, data: dict) -> Multimidia:
        multimidia = Multimidia(**data)
        self.db.add(multimidia)
        await self.db.commit()
        await self.db.refresh(multimidia)
        return multimidia

    async def delete_multimidia(self, id_multimidia: uuid.UUID):
        await self.db.execute(
            delete(Multimidia).where(Multimidia.id_multimidia == id_multimidia)
        )
        await self.db.commit()
