from datetime import datetime
from typing import Optional
import uuid

from sqlalchemy import delete, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.models.content import Setor
from app.models.session import Session
from sqlalchemy.orm import selectinload

class AuthRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_user_by_email(self, email: str) -> Optional[User]:
        result = await self.db.execute(
            select(User).where(User.email == email).options(selectinload(User.setor))
        )
        return result.scalar_one_or_none()

    async def get_user_by_id(self, user_id: uuid.UUID) -> Optional[User]:
        result = await self.db.execute(
            select(User).where(User.id == user_id).options(selectinload(User.setor))
        )
        return result.scalar_one_or_none()

    async def list_users(self, skip: int = 0, limit: int = 10) -> list[User]:
        result = await self.db.execute(
            select(User)
            .options(selectinload(User.setor))
            .order_by(User.name)
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())

    async def count_users(self) -> int:
        result = await self.db.execute(select(func.count()).select_from(User))
        return int(result.scalar_one())

    async def update_user(self, user_id: uuid.UUID, **fields) -> Optional[User]:
        user = await self.get_user_by_id(user_id)
        if not user:
            return None

        for field, value in fields.items():
            if value is not None:
                setattr(user, field, value)

        await self.db.commit()
        await self.db.refresh(user, attribute_names=["setor"])
        return user

    async def soft_delete_user(self, user_id: uuid.UUID) -> bool:
        user = await self.get_user_by_id(user_id)
        if not user:
            return False

        user.is_active = False
        await self.db.commit()
        return True

    async def set_password_reset_token(self, user_id: uuid.UUID, token: str, expires_at: datetime):
        user = await self.get_user_by_id(user_id)
        if not user:
            return None

        user.password_reset_token = token
        user.password_reset_expires_at = expires_at
        await self.db.commit()
        return user

    async def clear_password_reset_token(self, user_id: uuid.UUID):
        user = await self.get_user_by_id(user_id)
        if not user:
            return None

        user.password_reset_token = None
        user.password_reset_expires_at = None
        await self.db.commit()
        return user

    async def get_user_by_reset_token(self, token: str) -> Optional[User]:
        result = await self.db.execute(
            select(User)
            .where(User.password_reset_token == token)
            .options(selectinload(User.setor))
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
        hashed_password: str = "",
        is_admin: bool = False,  
        is_superuser: bool = False  
    ) -> User:
        """Cria um novo usuário no banco de dados local."""
        
        new_user = User(
            email=email,
            name=name,
            id_setor=id_setor,
            phone=phone,
            cargo=cargo,
            hashed_password=hashed_password,
            is_admin=is_admin,       
            is_superuser=is_superuser 
        )
        
        self.db.add(new_user)
        await self.db.commit()
        await self.db.refresh(new_user, ["setor"])
        return new_user
