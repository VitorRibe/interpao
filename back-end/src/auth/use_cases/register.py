import uuid
from typing import Optional

from fastapi import HTTPException, status

from app.models.user import User
from src.auth.repositories.auth_repository import AuthRepository
from src.auth.repositories.setor_repository import SetorRepository
from src.auth.services.service import AuthService
from utils.password_handler import hash_password


class RegisterUseCase:
    def __init__(
        self,
        auth_repository: AuthRepository,
        setor_repository: SetorRepository,
        auth_service: AuthService,
    ):
        self.auth_repository = auth_repository
        self.setor_repository = setor_repository
        self.auth_service = auth_service

    async def execute_register(
        self,
        email: str,
        password: str,
        name: str,
        id_setor: uuid.UUID,
        phone: Optional[str] = None,
    ) -> User:
        setor = await self.setor_repository.get_setor_by_id(id_setor)
        if not setor:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Setor not found",
            )

        existing_user = await self.auth_repository.get_user_by_email(email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered",
            )

        hashed = hash_password(password)
        user = await self.auth_repository.create_user(
            email=email,
            name=name,
            id_setor=id_setor,
            phone=phone,
            hashed_password=hashed,
        )
        return user
