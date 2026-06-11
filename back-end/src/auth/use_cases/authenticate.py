import uuid

from fastapi import HTTPException, status

from src.auth.repositories.auth_repository import AuthRepository
from src.auth.services.policy import PolicyService
from src.auth.services.service import AuthService


class AuthenticateUseCase:
    def __init__(self, repository: AuthRepository, auth_service: AuthService):
        self.repository = repository
        self.auth_service = auth_service

    async def execute_login(self, email: str, password: str) -> tuple[str, uuid.UUID]:
        user = await self.repository.get_user_by_email(email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials",
            )

        if not PolicyService.verify_credentials(password, user):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials",
            )

        PolicyService.check_user_active(user)
        PolicyService.check_setor_exists(user)

        session_id = await self.auth_service.create_auth_session(user)
        access_token = self.auth_service.generate_jwt_for_user(user)
        return access_token, session_id
