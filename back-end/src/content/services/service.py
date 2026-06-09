import uuid

from fastapi import HTTPException, status

from app.models.content import Modulo, Multimidia, Trilha
from src.content.repositories.content_repository import ContentRepository
from src.content.schemas import (
    ModuloCreate,
    ModuloDTO,
    ModuloUpdate,
    MultimidiaCreate,
    MultimidiaDTO,
    SetorDTO,
    TrilhaCreate,
    TrilhaDTO,
    TrilhaSummaryDTO,
    TrilhaUpdate,
)


class ContentService:
    def __init__(self, repository: ContentRepository):
        self.repository = repository

    def build_multimidia_dto(self, multimidia: Multimidia) -> MultimidiaDTO:
        return MultimidiaDTO.model_validate(multimidia)

    def build_modulo_dto(self, modulo: Modulo) -> ModuloDTO:
        return ModuloDTO(
            id_modulo=modulo.id_modulo,
            id_trilha=modulo.id_trilha,
            titulo=modulo.titulo,
            descricao=modulo.descricao,
            conteudo=modulo.conteudo,
            duracao=modulo.duracao,
            ordem=modulo.ordem,
            created_at=modulo.created_at,
            updated_at=modulo.updated_at,
            multimidia=[
                self.build_multimidia_dto(item) for item in modulo.multimidia
            ],
        )

    def build_trilha_summary_dto(self, trilha: Trilha) -> TrilhaSummaryDTO:
        return TrilhaSummaryDTO(
            id_trilha=trilha.id_trilha,
            titulo=trilha.titulo,
            descricao=trilha.descricao,
            carga_hor=trilha.carga_hor,
            id_setor=trilha.id_setor,
            created_at=trilha.created_at,
            updated_at=trilha.updated_at,
            setor=SetorDTO.model_validate(trilha.setor) if trilha.setor else None,
            module_count=len(trilha.modulos),
        )

    def build_trilha_dto(self, trilha: Trilha) -> TrilhaDTO:
        return TrilhaDTO(
            id_trilha=trilha.id_trilha,
            titulo=trilha.titulo,
            descricao=trilha.descricao,
            carga_hor=trilha.carga_hor,
            id_setor=trilha.id_setor,
            created_at=trilha.created_at,
            updated_at=trilha.updated_at,
            setor=SetorDTO.model_validate(trilha.setor) if trilha.setor else None,
            module_count=len(trilha.modulos),
            modulos=[self.build_modulo_dto(modulo) for modulo in trilha.modulos],
        )

    def ensure_trilha(self, trilha: Trilha | None) -> Trilha:
        if not trilha:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trilha not found",
            )
        return trilha

    def ensure_modulo(self, modulo: Modulo | None) -> Modulo:
        if not modulo:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Modulo not found",
            )
        return modulo

    async def list_trilhas(self) -> list[TrilhaSummaryDTO]:
        trilhas = await self.repository.list_trilhas()
        return [self.build_trilha_summary_dto(trilha) for trilha in trilhas]

    async def get_trilha(self, id_trilha: uuid.UUID) -> TrilhaDTO:
        trilha = await self.repository.get_trilha(id_trilha)
        if not trilha:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trilha not found",
            )
        return self.build_trilha_dto(trilha)

    async def list_modulos(self, id_trilha: uuid.UUID) -> list[ModuloDTO]:
        trilha = await self.repository.get_trilha(id_trilha)
        if not trilha:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trilha not found",
            )
        modulos = await self.repository.list_modulos(id_trilha)
        return [self.build_modulo_dto(modulo) for modulo in modulos]

    async def create_trilha(self, request: TrilhaCreate) -> TrilhaDTO:
        if request.id_setor and not await self.repository.get_setor(request.id_setor):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Setor not found",
            )
        trilha = await self.repository.create_trilha(request.model_dump())
        created = await self.repository.get_trilha(trilha.id_trilha)
        return self.build_trilha_dto(self.ensure_trilha(created))

    async def update_trilha(
        self,
        id_trilha: uuid.UUID,
        request: TrilhaUpdate,
    ) -> TrilhaDTO:
        trilha = await self.repository.get_trilha(id_trilha)
        if not trilha:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trilha not found",
            )

        data = request.model_dump(exclude_unset=True)
        if "id_setor" in data and data["id_setor"]:
            setor = await self.repository.get_setor(data["id_setor"])
            if not setor:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Setor not found",
                )
        updated = await self.repository.update_trilha(id_trilha, data)
        return self.build_trilha_dto(self.ensure_trilha(updated))

    async def delete_trilha(self, id_trilha: uuid.UUID):
        trilha = await self.repository.get_trilha(id_trilha)
        if not trilha:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trilha not found",
            )
        await self.repository.delete_trilha(id_trilha)

    async def create_modulo(self, request: ModuloCreate) -> ModuloDTO:
        trilha = await self.repository.get_trilha(request.id_trilha)
        if not trilha:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Trilha not found",
            )
        data = request.model_dump()
        if data["ordem"] is None:
            data["ordem"] = await self.repository.get_next_modulo_ordem(
                request.id_trilha
            )
        modulo = await self.repository.create_modulo(data)
        created = await self.repository.get_modulo(modulo.id_modulo)
        return self.build_modulo_dto(self.ensure_modulo(created))

    async def update_modulo(
        self,
        id_modulo: uuid.UUID,
        request: ModuloUpdate,
    ) -> ModuloDTO:
        modulo = await self.repository.get_modulo(id_modulo)
        if not modulo:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Modulo not found",
            )

        data = request.model_dump(exclude_unset=True)
        if "id_trilha" in data and data["id_trilha"]:
            trilha = await self.repository.get_trilha(data["id_trilha"])
            if not trilha:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Trilha not found",
                )
            # Reparented to a different trilha without an explicit order:
            # append it to the end of the target trilha's sequence.
            if data["id_trilha"] != modulo.id_trilha and data.get("ordem") is None:
                data["ordem"] = await self.repository.get_next_modulo_ordem(
                    data["id_trilha"]
                )
        updated = await self.repository.update_modulo(id_modulo, data)
        return self.build_modulo_dto(self.ensure_modulo(updated))

    async def delete_modulo(self, id_modulo: uuid.UUID):
        modulo = await self.repository.get_modulo(id_modulo)
        if not modulo:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Modulo not found",
            )
        await self.repository.delete_modulo(id_modulo)

    async def create_multimidia(
        self,
        id_modulo: uuid.UUID,
        request: MultimidiaCreate,
    ) -> MultimidiaDTO:
        modulo = await self.repository.get_modulo(id_modulo)
        if not modulo:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Modulo not found",
            )
        data = request.model_dump()
        data["id_modulo"] = id_modulo
        multimidia = await self.repository.create_multimidia(data)
        return self.build_multimidia_dto(multimidia)

    async def delete_multimidia(self, id_multimidia: uuid.UUID):
        multimidia = await self.repository.get_multimidia(id_multimidia)
        if not multimidia:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Multimidia not found",
            )
        await self.repository.delete_multimidia(id_multimidia)
