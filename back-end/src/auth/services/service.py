import uuid
from datetime import datetime, timedelta, timezone
from src.auth.schemas import LoggedUserDTO, CompanyDTO
from app.models.user import User
from src.auth.repositories.auth_repository import AuthRepository
from utils.jwt_handler import create_access_token

class AuthService:
    def __init__(self, repository: AuthRepository):
        self.repository = repository

    def build_logged_user_dto(self, user: User) -> LoggedUserDTO:
        """Builder Service: Assembles all necessary user and company data into the LoggedUserDTO."""
        company_dto = CompanyDTO(
            id=user.company.id,
            name=user.company.name,
            image_url=user.company.image_url
        )
        return LoggedUserDTO(
            id=user.id,
            email=user.email,
            name=user.name,
            phone=user.phone,
            image_url=user.image_url,
            is_admin=user.is_admin,
            is_superuser=user.is_superuser,
            company=company_dto
        )

    async def create_auth_session(self, user: User) -> uuid.UUID:
        """Enforce 'Single Active Session' and create a new session."""
        # 1. Delete old sessions for this user
        await self.repository.delete_all_user_sessions(user.id)
        
        # 2. Create new session ID
        session_id = uuid.uuid4()
        
        # 3. Set expiration (e.g., 7 days)
        expires_at = datetime.now(timezone.utc) + timedelta(days=7)
        
        # 4. Store in DB
        await self.repository.create_session(session_id, user.id, expires_at)
        
        return session_id

    def generate_jwt_for_user(self, user: User) -> str:
        dto = self.build_logged_user_dto(user)
        return create_access_token(data=dto.model_dump(mode='json'))
