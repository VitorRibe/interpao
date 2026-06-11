import uuid
from fastapi import HTTPException, status
from src.auth.repositories.auth_repository import AuthRepository
from src.auth.services.policy import PolicyService
from src.auth.services.service import AuthService
from utils.password_handler import hash_password


class ChangePasswordUseCase:
    def __init__(self, repository: AuthRepository, auth_service: AuthService):
        self.repository = repository
        self.auth_service = auth_service

    async def execute(self, user_id: uuid.UUID, current_password: str, new_password: str) -> dict:
        user = await self.repository.get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

        if not PolicyService.verify_credentials(current_password, user):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current password is incorrect.",
            )

        hashed = hash_password(new_password)
        await self.repository.update_user(user_id, hashed_password=hashed)
        return {"message": "Password changed successfully."}
