from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, status

from app.models.user import User
from src.auth.repositories.auth_repository import AuthRepository
from src.auth.repositories.setor_repository import SetorRepository
from src.auth.services.policy import PolicyService
from src.auth.services.service import AuthService
from utils.password_handler import hash_password


class PasswordResetRequestUseCase:
    def __init__(
        self,
        auth_repository: AuthRepository,
        setor_repository: SetorRepository,
        auth_service: AuthService,
    ):
        self.auth_repository = auth_repository
        self.setor_repository = setor_repository
        self.auth_service = auth_service

    async def execute_request(self, email: str) -> tuple[str, datetime]:
        user = await self.auth_repository.get_user_by_email(email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        token = self.auth_service.generate_password_reset_token()
        expires_at = datetime.now(timezone.utc) + timedelta(hours=1)
        await self.auth_repository.set_password_reset_token(user.id, token, expires_at)
        return token, expires_at


class PasswordResetConfirmUseCase:
    def __init__(
        self,
        auth_repository: AuthRepository,
        setor_repository: SetorRepository,
        auth_service: AuthService,
    ):
        self.auth_repository = auth_repository
        self.setor_repository = setor_repository
        self.auth_service = auth_service

    async def execute_confirm(self, token: str, new_password: str) -> User:
        user = await self.auth_repository.get_user_by_reset_token(token)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid password reset token",
            )

        PolicyService.check_password_reset_token_valid(user, token)
        hashed = hash_password(new_password)
        updated_user = await self.auth_repository.update_user(user.id, hashed_password=hashed)
        await self.auth_repository.clear_password_reset_token(user.id)
        return updated_user or user
