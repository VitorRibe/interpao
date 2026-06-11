import uuid
from typing import Optional
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.escala import EscalaItem


class EscalaRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_user_id(self, user_id: uuid.UUID) -> list[EscalaItem]:
        result = await self.db.execute(
            select(EscalaItem)
            .where(EscalaItem.user_id == user_id)
            .order_by(EscalaItem.dia_semana)
        )
        return list(result.scalars().all())

    async def upsert_for_user(
        self, user_id: uuid.UUID, itens: list[dict]
    ) -> list[EscalaItem]:
        await self.db.execute(
            delete(EscalaItem).where(EscalaItem.user_id == user_id)
        )
        for item in itens:
            self.db.add(EscalaItem(user_id=user_id, **item))
        await self.db.commit()
        return await self.get_by_user_id(user_id)
