from datetime import datetime, timezone
from app.models.user import User
from utils.password_handler import verify_password
from fastapi import HTTPException, status

class PolicyService:
    @staticmethod
    def verify_credentials(plain_password: str, user: User) -> bool:
        """Verify plain password against hashed password."""
        if not user:
            return False
        return verify_password(plain_password, user.hashed_password)

    @staticmethod
    def check_user_active(user: User):
        """Check if user account is active."""
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is inactive."
            )

    @staticmethod
    def check_setor_exists(user: User):
        """Check if user has a setor assigned."""
        if not user.setor:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User is not associated with any setor."
            )

    @staticmethod
    def check_password_reset_token_valid(user: User, token: str) -> bool:
        """Check if password reset token is valid and not expired."""
        if not user.password_reset_token or user.password_reset_token != token:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid password reset token."
            )

        if not user.password_reset_expires_at:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password reset token has no expiration date."
            )

        if datetime.now(timezone.utc) > user.password_reset_expires_at:
            raise HTTPException(
                status_code=status.HTTP_410_GONE,
                detail="Password reset token has expired."
            )

        return True
