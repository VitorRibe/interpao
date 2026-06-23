import uuid
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import delete, func, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy.dialects.postgresql import insert

from app.models.content import Modulo, Multimidia, Setor, Trilha, UserModulo, UserTrilha

class ContentRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def list_setores(self) -> list[Setor]:
        result = await self.db.execute(select(Setor).order_by(Setor.nome))
        return list(result.scalars().all())

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

    async def upsert_user_modulo(self, user_id: uuid.UUID, id_modulo: uuid.UUID) -> None:
        stmt = insert(UserModulo).values(user_id=user_id, id_modulo=id_modulo, concluido=True)
        stmt = stmt.on_conflict_do_update(
            index_elements=['user_id', 'id_modulo'],
            set_=dict(concluido=True)
        )
        await self.db.execute(stmt)
        await self.db.commit()

    async def upsert_user_trilha(self, user_id: uuid.UUID, id_trilha: uuid.UUID) -> None:
        stmt = insert(UserTrilha).values(user_id=user_id, id_trilha=id_trilha)
        stmt = stmt.on_conflict_do_nothing(
            index_elements=['user_id', 'id_trilha']
        )
        await self.db.execute(stmt)
        await self.db.commit()

    async def get_progresso_trilha(self, user_id: uuid.UUID, id_trilha: uuid.UUID) -> dict:
        query_total = select(func.count(Modulo.id_modulo)).where(Modulo.id_trilha == id_trilha)
        res_total = await self.db.execute(query_total)
        total_modulos = res_total.scalar() or 0

        query_concluidos = (
            select(func.count(UserModulo.id_modulo))
            .select_from(UserModulo)
            .join(Modulo, UserModulo.id_modulo == Modulo.id_modulo)
            .where(
                Modulo.id_trilha == id_trilha,
                UserModulo.user_id == user_id,
                UserModulo.concluido == True
            )
        )
        res_concluidos = await self.db.execute(query_concluidos)
        modulos_concluidos = res_concluidos.scalar() or 0

        return {
            "total_modulos": total_modulos,
            "modulos_concluidos": modulos_concluidos
        }

    async def get_user_progresso_geral(self, user_id: uuid.UUID) -> dict:
        """Puxa todos os IDs de módulos e trilhas concluídos pelo usuário."""
        query_modulos = select(UserModulo.id_modulo).where(UserModulo.user_id == user_id, UserModulo.concluido == True)
        res_modulos = await self.db.execute(query_modulos)
        
        query_trilhas = select(UserTrilha.id_trilha).where(UserTrilha.user_id == user_id)
        res_trilhas = await self.db.execute(query_trilhas)

        return {
            "modulos": [str(m) for m in res_modulos.scalars().all()],
            "trilhas": [str(t) for t in res_trilhas.scalars().all()]
        }