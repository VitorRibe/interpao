import uuid

from fastapi import HTTPException, status

from app.models.content import Setor
from app.models.recipe import Ingrediente, ItemReceita, Receita, SetorReceita
from src.recipes.repositories.recipe_repository import RecipeRepository
from src.recipes.schemas import (
    IngredienteCreate,
    IngredienteDTO,
    IngredienteUpdate,
    ItemReceitaCreate,
    ItemReceitaDTO,
    ReceitaCreate,
    ReceitaDTO,
    ReceitaSummaryDTO,
    ReceitaUpdate,
    SetorDTO,
)


class RecipeService:
    def __init__(self, repository: RecipeRepository):
        self.repository = repository

    def build_setor_dto(self, setor: Setor) -> SetorDTO:
        return SetorDTO.model_validate(setor)

    def build_ingrediente_dto(self, ingr: Ingrediente) -> IngredienteDTO:
        return IngredienteDTO.model_validate(ingr)

    def build_item_receita_dto(self, item: ItemReceita) -> ItemReceitaDTO:
        return ItemReceitaDTO(
            id_ingr=item.id_ingr,
            nome=item.ingrediente.nome,
            unidade_med=item.ingrediente.unidade_med,
            qtd=float(item.qtd),
        )

    def build_receita_summary_dto(self, receita: Receita) -> ReceitaSummaryDTO:
        return ReceitaSummaryDTO(
            id_receita=receita.id_receita,
            titulo=receita.titulo,
            descricao=receita.descricao,
            inst_preparo=receita.inst_preparo,
            image_url=receita.image_url,
            tempo_preparo=receita.tempo_preparo,
            porcoes=receita.porcoes,
            created_at=receita.created_at,
            updated_at=receita.updated_at,
            item_count=len(receita.itens),
            setores=[
                SetorDTO(id_setor=sr.id_setor, nome=sr.setor.nome)
                for sr in receita.setor_receitas
            ],
        )

    def build_receita_dto(self, receita: Receita) -> ReceitaDTO:
        return ReceitaDTO(
            id_receita=receita.id_receita,
            titulo=receita.titulo,
            descricao=receita.descricao,
            inst_preparo=receita.inst_preparo,
            image_url=receita.image_url,
            tempo_preparo=receita.tempo_preparo,
            porcoes=receita.porcoes,
            created_at=receita.created_at,
            updated_at=receita.updated_at,
            item_count=len(receita.itens),
            setores=[
                SetorDTO(id_setor=sr.id_setor, nome=sr.setor.nome)
                for sr in receita.setor_receitas
            ],
            itens=[self.build_item_receita_dto(item) for item in receita.itens],
        )

    def ensure_ingrediente(self, ingrediente: Ingrediente | None) -> Ingrediente:
        if not ingrediente:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Ingrediente not found",
            )
        return ingrediente

    def ensure_receita(self, receita: Receita | None) -> Receita:
        if not receita:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Receita not found",
            )
        return receita

    def ensure_item_receita(self, item: ItemReceita | None) -> ItemReceita:
        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Item receita not found",
            )
        return item

    def ensure_setor_receita(
        self,
        setor_receita: SetorReceita | None,
    ) -> SetorReceita:
        if not setor_receita:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Setor receita not found",
            )
        return setor_receita

    async def list_setores(self) -> list[SetorDTO]:
        setores = await self.repository.list_setores()
        return [self.build_setor_dto(setor) for setor in setores]

    async def list_ingredientes(self) -> list[IngredienteDTO]:
        ingredientes = await self.repository.list_ingredientes()
        return [
            self.build_ingrediente_dto(ingrediente)
            for ingrediente in ingredientes
        ]

    async def get_ingrediente(self, id_ingr: uuid.UUID) -> IngredienteDTO:
        ingrediente = await self.repository.get_ingrediente(id_ingr)
        return self.build_ingrediente_dto(self.ensure_ingrediente(ingrediente))

    async def create_ingrediente(
        self,
        request: IngredienteCreate,
    ) -> IngredienteDTO:
        ingrediente = await self.repository.create_ingrediente(request.model_dump())
        return self.build_ingrediente_dto(ingrediente)

    async def update_ingrediente(
        self,
        id_ingr: uuid.UUID,
        request: IngredienteUpdate,
    ) -> IngredienteDTO:
        ingrediente = await self.repository.get_ingrediente(id_ingr)
        if not ingrediente:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Ingrediente not found",
            )

        updated = await self.repository.update_ingrediente(
            id_ingr,
            request.model_dump(exclude_unset=True),
        )
        return self.build_ingrediente_dto(self.ensure_ingrediente(updated))

    async def delete_ingrediente(self, id_ingr: uuid.UUID):
        ingrediente = await self.repository.get_ingrediente(id_ingr)
        if not ingrediente:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Ingrediente not found",
            )
        await self.repository.delete_ingrediente(id_ingr)

    async def list_receitas(self) -> list[ReceitaSummaryDTO]:
        receitas = await self.repository.list_receitas()
        return [self.build_receita_summary_dto(receita) for receita in receitas]

    async def get_receita(self, id_receita: uuid.UUID) -> ReceitaDTO:
        receita = await self.repository.get_receita(id_receita)
        return self.build_receita_dto(self.ensure_receita(receita))

    async def create_receita(self, request: ReceitaCreate) -> ReceitaDTO:
        receita = await self.repository.create_receita(request.model_dump())
        created = await self.repository.get_receita(receita.id_receita)
        return self.build_receita_dto(self.ensure_receita(created))

    async def update_receita(
        self,
        id_receita: uuid.UUID,
        request: ReceitaUpdate,
    ) -> ReceitaDTO:
        receita = await self.repository.get_receita(id_receita)
        if not receita:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Receita not found",
            )

        updated = await self.repository.update_receita(
            id_receita,
            request.model_dump(exclude_unset=True),
        )
        return self.build_receita_dto(self.ensure_receita(updated))

    async def delete_receita(self, id_receita: uuid.UUID):
        receita = await self.repository.get_receita(id_receita)
        if not receita:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Receita not found",
            )
        await self.repository.delete_receita(id_receita)

    async def add_item_receita(
        self,
        id_receita: uuid.UUID,
        request: ItemReceitaCreate,
    ) -> ReceitaDTO:
        receita = await self.repository.get_receita(id_receita)
        if not receita:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Receita not found",
            )
        ingrediente = await self.repository.get_ingrediente(request.id_ingr)
        if not ingrediente:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ingrediente not found",
            )
        item = await self.repository.get_item_receita(id_receita, request.id_ingr)
        if item:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ingrediente already in recipe",
            )
        await self.repository.add_item_receita(id_receita, request.id_ingr, request.qtd)
        created = await self.repository.get_receita(id_receita)
        return self.build_receita_dto(self.ensure_receita(created))

    async def update_item_receita(
        self,
        id_receita: uuid.UUID,
        id_ingr: uuid.UUID,
        qtd: float,
    ) -> ReceitaDTO:
        item = await self.repository.get_item_receita(id_receita, id_ingr)
        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Item receita not found",
            )
        await self.repository.update_item_receita(id_receita, id_ingr, qtd)
        updated = await self.repository.get_receita(id_receita)
        return self.build_receita_dto(self.ensure_receita(updated))

    async def remove_item_receita(self, id_receita: uuid.UUID, id_ingr: uuid.UUID):
        item = await self.repository.get_item_receita(id_receita, id_ingr)
        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Item receita not found",
            )
        await self.repository.remove_item_receita(id_receita, id_ingr)

    async def add_setor_receita(
        self,
        id_receita: uuid.UUID,
        id_setor: uuid.UUID,
    ) -> ReceitaDTO:
        receita = await self.repository.get_receita(id_receita)
        if not receita:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Receita not found",
            )
        setor = await self.repository.get_setor(id_setor)
        if not setor:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Setor not found",
            )
        setor_receita = await self.repository.get_setor_receita(
            id_setor,
            id_receita,
        )
        if setor_receita:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Setor already linked",
            )
        await self.repository.add_setor_receita(id_setor, id_receita)
        updated = await self.repository.get_receita(id_receita)
        return self.build_receita_dto(self.ensure_receita(updated))

    async def remove_setor_receita(
        self,
        id_receita: uuid.UUID,
        id_setor: uuid.UUID,
    ):
        setor_receita = await self.repository.get_setor_receita(
            id_setor,
            id_receita,
        )
        if not setor_receita:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Setor receita not found",
            )
        await self.repository.remove_setor_receita(id_setor, id_receita)
