import secrets
import uuid

from fastapi import HTTPException, status

from app.models.user import User
from src.auth.repositories.auth_repository import AuthRepository
from src.auth.repositories.setor_repository import SetorRepository
from src.auth.services.service import AuthService
from utils.password_handler import hash_password


class CreateUserAsAdminUseCase:
    def __init__(
        self,
        auth_repository: AuthRepository,
        setor_repository: SetorRepository,
        auth_service: AuthService,
    ):
        self.auth_repository = auth_repository
        self.setor_repository = setor_repository
        self.auth_service = auth_service

    async def execute(self, email, password, name, id_setor, phone=None, cargo=None) -> User:
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
            cargo=cargo,
            hashed_password=hashed,
        )
        return user


class ListUsersUseCase:
    def __init__(
        self,
        auth_repository: AuthRepository,
        setor_repository: SetorRepository,
        auth_service: AuthService,
    ):
        self.auth_repository = auth_repository
        self.setor_repository = setor_repository
        self.auth_service = auth_service

    async def execute(self, skip: int = 0, limit: int = 10) -> tuple[list[User], int]:
        users = await self.auth_repository.list_users(skip, limit)
        total = await self.auth_repository.count_users()
        return users, total


class UpdateUserAsAdminUseCase:
    def __init__(
        self,
        auth_repository: AuthRepository,
        setor_repository: SetorRepository,
        auth_service: AuthService,
    ):
        self.auth_repository = auth_repository
        self.setor_repository = setor_repository
        self.auth_service = auth_service

    async def execute(
        self,
        user_id,
        email=None,
        name=None,
        phone=None,
        cargo=None,
        id_setor=None,
        is_active=None,
    ) -> User:
        existing_user = await self.auth_repository.get_user_by_id(user_id)
        if not existing_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        if id_setor is not None:
            setor = await self.setor_repository.get_setor_by_id(id_setor)
            if not setor:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Setor not found",
                )

        if email is not None:
            user_with_email = await self.auth_repository.get_user_by_email(email)
            if user_with_email and user_with_email.id != user_id:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Email already registered",
                )

        fields = {
            "email": email,
            "name": name,
            "phone": phone,
            "cargo": cargo,
            "id_setor": id_setor,
            "is_active": is_active,
        }
        user = await self.auth_repository.update_user(user_id, **fields)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )
        return user


class DeleteUserAsAdminUseCase:
    def __init__(
        self,
        auth_repository: AuthRepository,
        setor_repository: SetorRepository,
        auth_service: AuthService,
    ):
        self.auth_repository = auth_repository
        self.setor_repository = setor_repository
        self.auth_service = auth_service

    async def execute(self, user_id: uuid.UUID) -> dict:
        user = await self.auth_repository.get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        await self.auth_repository.soft_delete_user(user_id)
        await self.auth_repository.delete_all_user_sessions(user_id)
        return {"message": "User deactivated successfully"}


class AdminResetPasswordUseCase:
    def __init__(
        self,
        auth_repository: AuthRepository,
        setor_repository: SetorRepository,
        auth_service: AuthService,
    ):
        self.auth_repository = auth_repository
        self.setor_repository = setor_repository
        self.auth_service = auth_service

    async def execute(self, user_id: uuid.UUID) -> dict:
        user = await self.auth_repository.get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        temp_password = secrets.token_urlsafe(8)
        hashed = hash_password(temp_password)
        await self.auth_repository.update_user(user_id, hashed_password=hashed)
        return {
            "message": "Temporary password generated",
            "temp_password": temp_password,
        }
