from app.models.user import User
from utils.password_handler import verify_password
from fastapi import HTTPException, status

class PolicyService:
    @staticmethod
    def verify_credentials(plain_password: str, user: User) -> bool:
        if not user:
            return False
        return verify_password(plain_password, user.hashed_password)

    @staticmethod
    def check_company_status(user: User):
        if not user.company:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User is not associated with any company."
            )
        if user.company.status != "Active":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Company is inactive. Please contact support."
            )

    @staticmethod
    def check_user_active(user: User):
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is inactive."
            )
        return True
