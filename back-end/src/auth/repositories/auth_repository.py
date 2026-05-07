from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from app.models.user import User
from app.models.company import Company
from app.models.session import Session
from datetime import datetime, timezone
from typing import Optional

class AuthRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_user_by_email(self, email: str) -> Optional[User]:
        result = await self.db.execute(
            select(User).where(User.email == email).options(
                # Ensure company is loaded
                # In SQLAlchemy 2.0 with AsyncSession, we might need selectinload
            )
        )
        # Using selectinload for the company relationship
        from sqlalchemy.orm import selectinload
        result = await self.db.execute(
            select(User).where(User.email == email).options(selectinload(User.company))
        )
        return result.scalar_one_or_none()

    async def get_user_by_id(self, user_id: int) -> Optional[User]:
        from sqlalchemy.orm import selectinload
        result = await self.db.execute(
            select(User).where(User.id == user_id).options(selectinload(User.company))
        )
        return result.scalar_one_or_none()

    async def create_session(self, session_id: str, user_id: int, expires_at: datetime):
        new_session = Session(id=session_id, user_id=user_id, expires_at=expires_at)
        self.db.add(new_session)
        await self.db.commit()
        return new_session

    async def get_session(self, session_id: str) -> Optional[Session]:
        result = await self.db.execute(select(Session).where(Session.id == session_id))
        return result.scalar_one_or_none()

    async def delete_session(self, session_id: str):
        await self.db.execute(delete(Session).where(Session.id == session_id))
        await self.db.commit()

    async def delete_all_user_sessions(self, user_id: int):
        await self.db.execute(delete(Session).where(Session.user_id == user_id))
        await self.db.commit()
