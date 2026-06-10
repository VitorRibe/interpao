import uuid
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import delete, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.content import Setor
from app.models.recipe import Ingrediente, ItemReceita, Receita, SetorReceita


class RecipeRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def list_setores(self) -> list[Setor]:
        result = await self.db.execute(select(Setor).order_by(Setor.nome))
        return list(result.scalars().all())

    async def get_setor(self, id_setor: uuid.UUID) -> Optional[Setor]:
        result = await self.db.execute(select(Setor).where(Setor.id_setor == id_setor))
        return result.scalar_one_or_none()

    async def list_ingredientes(self) -> list[Ingrediente]:
        result = await self.db.execute(
            select(Ingrediente).order_by(Ingrediente.nome)
        )
        return list(result.scalars().all())

    async def get_ingrediente(self, id_ingr: uuid.UUID) -> Optional[Ingrediente]:
        result = await self.db.execute(
            select(Ingrediente).where(Ingrediente.id_ingr == id_ingr)
        )
        return result.scalar_one_or_none()

    async def create_ingrediente(self, data: dict) -> Ingrediente:
        ingrediente = Ingrediente(**data)
        self.db.add(ingrediente)
        await self.db.commit()
        await self.db.refresh(ingrediente)
        return ingrediente

    async def update_ingrediente(
        self,
        id_ingr: uuid.UUID,
        data: dict,
    ) -> Optional[Ingrediente]:
        data["updated_at"] = datetime.now(timezone.utc)
        await self.db.execute(
            update(Ingrediente).where(Ingrediente.id_ingr == id_ingr).values(**data)
        )
        await self.db.commit()
        return await self.get_ingrediente(id_ingr)

    async def delete_ingrediente(self, id_ingr: uuid.UUID):
        await self.db.execute(
            delete(Ingrediente).where(Ingrediente.id_ingr == id_ingr)
        )
        await self.db.commit()

    async def list_receitas(self) -> list[Receita]:
        result = await self.db.execute(
            select(Receita)
            .options(
                selectinload(Receita.itens),
                selectinload(Receita.setor_receitas).selectinload(
                    SetorReceita.setor
                ),
            )
            .order_by(Receita.titulo)
        )
        return list(result.scalars().all())

    async def get_receita(self, id_receita: uuid.UUID) -> Optional[Receita]:
        result = await self.db.execute(
            select(Receita)
            .where(Receita.id_receita == id_receita)
            .options(
                selectinload(Receita.itens).selectinload(ItemReceita.ingrediente),
                selectinload(Receita.setor_receitas).selectinload(
                    SetorReceita.setor
                ),
            )
        )
        return result.scalar_one_or_none()

    async def create_receita(self, data: dict) -> Receita:
        receita = Receita(**data)
        self.db.add(receita)
        await self.db.commit()
        await self.db.refresh(receita)
        return receita

    async def update_receita(
        self,
        id_receita: uuid.UUID,
        data: dict,
    ) -> Optional[Receita]:
        data["updated_at"] = datetime.now(timezone.utc)
        await self.db.execute(
            update(Receita).where(Receita.id_receita == id_receita).values(**data)
        )
        await self.db.commit()
        return await self.get_receita(id_receita)

    async def delete_receita(self, id_receita: uuid.UUID):
        await self.db.execute(delete(Receita).where(Receita.id_receita == id_receita))
        await self.db.commit()

    async def get_item_receita(
        self,
        id_receita: uuid.UUID,
        id_ingr: uuid.UUID,
    ) -> Optional[ItemReceita]:
        result = await self.db.execute(
            select(ItemReceita).where(
                ItemReceita.id_receita == id_receita,
                ItemReceita.id_ingr == id_ingr,
            )
        )
        return result.scalar_one_or_none()

    async def add_item_receita(
        self,
        id_receita: uuid.UUID,
        id_ingr: uuid.UUID,
        qtd: float,
    ) -> ItemReceita:
        item = ItemReceita(id_receita=id_receita, id_ingr=id_ingr, qtd=qtd)
        self.db.add(item)
        await self.db.commit()
        await self.db.refresh(item)
        return item

    async def update_item_receita(
        self,
        id_receita: uuid.UUID,
        id_ingr: uuid.UUID,
        qtd: float,
    ) -> Optional[ItemReceita]:
        await self.db.execute(
            update(ItemReceita)
            .where(
                ItemReceita.id_receita == id_receita,
                ItemReceita.id_ingr == id_ingr,
            )
            .values(qtd=qtd)
        )
        await self.db.commit()
        return await self.get_item_receita(id_receita, id_ingr)

    async def remove_item_receita(self, id_receita: uuid.UUID, id_ingr: uuid.UUID):
        await self.db.execute(
            delete(ItemReceita).where(
                ItemReceita.id_receita == id_receita,
                ItemReceita.id_ingr == id_ingr,
            )
        )
        await self.db.commit()

    async def get_setor_receita(
        self,
        id_setor: uuid.UUID,
        id_receita: uuid.UUID,
    ) -> Optional[SetorReceita]:
        result = await self.db.execute(
            select(SetorReceita).where(
                SetorReceita.id_setor == id_setor,
                SetorReceita.id_receita == id_receita,
            )
        )
        return result.scalar_one_or_none()

    async def add_setor_receita(
        self,
        id_setor: uuid.UUID,
        id_receita: uuid.UUID,
    ) -> SetorReceita:
        setor_receita = SetorReceita(id_setor=id_setor, id_receita=id_receita)
        self.db.add(setor_receita)
        await self.db.commit()
        await self.db.refresh(setor_receita)
        return setor_receita

    async def remove_setor_receita(self, id_setor: uuid.UUID, id_receita: uuid.UUID):
        await self.db.execute(
            delete(SetorReceita).where(
                SetorReceita.id_setor == id_setor,
                SetorReceita.id_receita == id_receita,
            )
        )
        await self.db.commit()
