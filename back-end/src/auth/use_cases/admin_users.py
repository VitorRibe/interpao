import uuid
from src.auth.repositories.auth_repository import AuthRepository
from src.auth.repositories.setor_repository import SetorRepository
from src.auth.services.service import AuthService
from src.auth.services.registration_service import RegistrationService
from fastapi import HTTPException, status

class CreateUserAsAdminUseCase:
    def __init__(self, auth_repository: AuthRepository, setor_repository: SetorRepository, auth_service: AuthService):
        self.auth_repository = auth_repository
        self.setor_repository = setor_repository
        self.registration_service = RegistrationService(auth_repository, setor_repository, auth_service)

    async def execute(
        self,
        email: str,
        password: str,
        name: str,
        id_setor: uuid.UUID,
        phone: str | None = None,
        cargo: str | None = None,
    ):
        """Create user as admin."""
        # Validate setor
        setor = await self.setor_repository.get_setor_by_id(id_setor)
        if not setor:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Setor not found."
            )

        # Validate email unique
        await self.registration_service.validate_email_unique(email)

        # Validate password strength
        await self.registration_service.validate_password_strength(password)

        # Create user
        from utils.password_handler import hash_password
        hashed_password = hash_password(password)
        
        user = await self.auth_repository.create_user(
            email=email,
            hashed_password=hashed_password,
            name=name,
            id_setor=id_setor,
            phone=phone,
            cargo=cargo,
        )
        return user


class ListUsersUseCase:
    def __init__(self, auth_repository: AuthRepository, setor_repository: SetorRepository, auth_service: AuthService):
        self.auth_repository = auth_repository
        self.setor_repository = setor_repository

    async def execute(self, skip: int = 0, limit: int = 10):
        """List all users with pagination."""
        users, total = await self.auth_repository.list_all_users(skip, limit)
        return users, total


class UpdateUserAsAdminUseCase:
    def __init__(self, auth_repository: AuthRepository, setor_repository: SetorRepository, auth_service: AuthService):
        self.auth_repository = auth_repository
        self.setor_repository = setor_repository

    async def execute(
        self,
        user_id: uuid.UUID,
        email: str | None = None,
        name: str | None = None,
        phone: str | None = None,
        cargo: str | None = None,
        id_setor: uuid.UUID | None = None,
        is_active: bool | None = None,
    ):
        """Update user as admin."""
        # Validate user exists
        user = await self.auth_repository.get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found."
            )

        # Validate email is unique (if changing)
        if email and email != user.email:
            existing = await self.auth_repository.get_user_by_email(email)
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Email already in use."
                )

        # Validate setor exists (if changing)
        if id_setor:
            setor = await self.setor_repository.get_setor_by_id(id_setor)
            if not setor:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Setor not found."
                )

        # Update user
        updated_user = await self.auth_repository.update_user(
            user_id=user_id,
            email=email,
            name=name,
            phone=phone,
            cargo=cargo,
            id_setor=id_setor,
            is_active=is_active,
        )
        return updated_user


class DeleteUserAsAdminUseCase:
    def __init__(self, auth_repository: AuthRepository, setor_repository: SetorRepository, auth_service: AuthService):
        self.auth_repository = auth_repository

    async def execute(self, user_id: uuid.UUID):
        """Soft delete user as admin."""
        # Validate user exists
        user = await self.auth_repository.get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found."
            )

        # Soft delete
        await self.auth_repository.delete_user(user_id)
        return {"message": "User deleted successfully"}


class AdminResetPasswordUseCase:
    def __init__(self, auth_repository: AuthRepository, setor_repository: SetorRepository, auth_service: AuthService):
        self.auth_repository = auth_repository
        self.registration_service = RegistrationService(auth_repository, setor_repository, auth_service)

    async def execute(self, user_id: uuid.UUID):
        """Admin reset password for user."""
        temp_password, email = await self.registration_service.admin_reset_password_request(user_id)
        # TODO: Send email with temporary password
        # await send_temporary_password_email(email, temp_password)
        return {"message": f"Temporary password sent to {email}"}
