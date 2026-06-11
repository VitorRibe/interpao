from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.content import Setor
from typing import Optional
import uuid

class SetorRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all_setores(self) -> list[Setor]:
        """Get all setores (for UI dropdowns)."""
        result = await self.db.execute(select(Setor).order_by(Setor.nome))
        return result.scalars().all()

    async def get_setor_by_id(self, setor_id: uuid.UUID) -> Optional[Setor]:
        """Get setor by ID."""
        result = await self.db.execute(select(Setor).where(Setor.id_setor == setor_id))
        return result.scalar_one_or_none()

    async def get_setor_by_name(self, nome: str) -> Optional[Setor]:
        """Get setor by name."""
        result = await self.db.execute(select(Setor).where(Setor.nome == nome))
        return result.scalar_one_or_none()
