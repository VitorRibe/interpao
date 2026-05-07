from src.auth.repositories.auth_repository import AuthRepository
from src.auth.services.service import AuthService
from src.auth.services.policy import PolicyService
from fastapi import HTTPException, status

class AuthenticateUseCase:
    def __init__(self, repository: AuthRepository, auth_service: AuthService):
        self.repository = repository
        self.auth_service = auth_service
        self.policy_service = PolicyService()

    async def execute_login(self, email: str, password: str):
        # 1. Get user
        user = await self.repository.get_user_by_email(email)
        
        # 2. Verify credentials
        if not user or not self.policy_service.verify_credentials(password, user):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # 3. Check user and company status
        self.policy_service.check_user_active(user)
        self.policy_service.check_company_status(user)
        
        # 4. Create session (Enforces Single Active Session)
        session_id = await self.auth_service.create_auth_session(user)
        
        # 5. Generate JWT
        access_token = self.auth_service.generate_jwt_for_user(user)
        
        return access_token, session_id
