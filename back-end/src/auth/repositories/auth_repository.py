from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from app.models.user import User
from app.models.setor import Setor
from app.models.session import Session
from datetime import datetime, timezone
from typing import Optional
import uuid

class AuthRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_user_by_email(self, email: str) -> Optional[User]:
        # Using selectinload for the company relationship
        from sqlalchemy.orm import selectinload
        result = await self.db.execute(
            select(User).where(User.email == email).options(selectinload(User.setor)) # Alterado de company para setor
        )
        return result.scalar_one_or_none()

    async def get_user_by_id(self, user_id: uuid.UUID) -> Optional[User]:
        from sqlalchemy.orm import selectinload
        result = await self.db.execute(
            select(User).where(User.id == user_id).options(selectinload(User.setor))
        )
        return result.scalar_one_or_none()

    async def create_session(self, session_id: uuid.UUID, user_id: uuid.UUID, expires_at: datetime):
        new_session = Session(id=session_id, user_id=user_id, expires_at=expires_at)
        self.db.add(new_session)
        await self.db.commit()
        return new_session

    async def get_session(self, session_id: uuid.UUID) -> Optional[Session]:
        result = await self.db.execute(select(Session).where(Session.id == session_id))
        return result.scalar_one_or_none()

    async def delete_session(self, session_id: uuid.UUID):
        await self.db.execute(delete(Session).where(Session.id == session_id))
        await self.db.commit()

    async def delete_all_user_sessions(self, user_id: uuid.UUID):
        await self.db.execute(delete(Session).where(Session.user_id == user_id))
        await self.db.commit()

    async def create_user(
        self,
        email: str,
        name: str,
        id_setor: uuid.UUID,
        phone: Optional[str] = None,
        cargo: Optional[str] = None,
        hashed_password: str = ""
    ) -> User:
        """Cria um novo usuário no banco de dados local."""
        
        # Removemos o id=user_id, o banco vai gerar o UUID automaticamente
        new_user = User(
            email=email,
            name=name,
            id_setor=id_setor,
            phone=phone,
            cargo=cargo,
            hashed_password=hashed_password
        )
        
        self.db.add(new_user)
        await self.db.commit()
        
        # Recarrega o objeto trazendo os dados do Setor junto (igual no get_user)
        from sqlalchemy.orm import selectinload
        await self.db.refresh(new_user, ["setor"])
        
        return new_user
