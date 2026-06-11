from datetime import datetime, timedelta, timezone
import uuid
import secrets
from utils.password_handler import hash_password
from src.auth.repositories.auth_repository import AuthRepository
from src.auth.repositories.setor_repository import SetorRepository
from src.auth.services.service import AuthService
from src.auth.services.policy import PolicyService
from fastapi import HTTPException, status

class RegistrationService:
    def __init__(self, auth_repository: AuthRepository, setor_repository: SetorRepository, auth_service: AuthService):
        self.auth_repository = auth_repository
        self.setor_repository = setor_repository
        self.auth_service = auth_service

    async def validate_setor_exists(self, setor_id: uuid.UUID):
        """Validate that setor exists."""
        setor = await self.setor_repository.get_setor_by_id(setor_id)
        if not setor:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Setor not found."
            )
        return setor

    async def validate_email_unique(self, email: str):
        """Validate that email is not already taken."""
        existing_user = await self.auth_repository.get_user_by_email(email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered."
            )

    async def validate_password_strength(self, password: str):
        """Validate password meets minimum requirements."""
        if len(password) < 8:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password must be at least 8 characters long."
            )
        # Add more rules as needed (uppercase, lowercase, numbers, special chars, etc)

    async def register_user(
        self,
        email: str,
        password: str,
        name: str,
        id_setor: uuid.UUID,
        phone: str | None = None,
    ):
        """Register a new user."""
        # 1. Validate email is unique
        await self.validate_email_unique(email)

        # 2. Validate setor exists
        await self.validate_setor_exists(id_setor)

        # 3. Validate password strength
        await self.validate_password_strength(password)

        # 4. Hash password
        hashed_password = hash_password(password)

        # 5. Create user
        user = await self.auth_repository.create_user(
            email=email,
            hashed_password=hashed_password,
            name=name,
            id_setor=id_setor,
            phone=phone,
        )

        return user

    async def request_password_reset(self, email: str) -> tuple[str, datetime]:
        """Generate and store password reset token."""
        # 1. Find user by email
        user = await self.auth_repository.get_user_by_email(email)
        if not user:
            # Don't reveal if email exists (security best practice)
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found."
            )

        # 2. Check if user is active
        PolicyService.check_user_active(user)

        # 3. Generate token
        token = self.auth_service.generate_password_reset_token()

        # 4. Set token expiry (2 hours from now)
        expires_at = datetime.now(timezone.utc) + timedelta(hours=2)

        # 5. Store token in database
        await self.auth_repository.update_password_reset_token(user.id, token, expires_at)

        return token, expires_at

    async def confirm_password_reset(self, token: str, new_password: str):
        """Confirm password reset with token."""
        # 1. Find user by token
        user = await self.auth_repository.get_user_by_password_reset_token(token)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid password reset token."
            )

        # 2. Validate token (check expiry)
        PolicyService.check_password_reset_token_valid(user, token)

        # 3. Validate new password strength
        await self.validate_password_strength(new_password)

        # 4. Hash new password
        hashed_password = hash_password(new_password)

        # 5. Update password
        await self.auth_repository.update_password(user.id, hashed_password)

        # 6. Clear reset token
        await self.auth_repository.clear_password_reset_token(user.id)

        return user

    async def admin_reset_password_request(self, user_id: uuid.UUID) -> tuple[str, str]:
        """Generate temporary password for admin password reset."""
        # 1. Get user
        user = await self.auth_repository.get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found."
            )

        # 2. Generate temporary password (16 random chars)
        temp_password = secrets.token_urlsafe(12)  # ~16 chars

        # 3. Hash and update password
        hashed_password = hash_password(temp_password)
        await self.auth_repository.update_password(user.id, hashed_password)

        return temp_password, user.email
