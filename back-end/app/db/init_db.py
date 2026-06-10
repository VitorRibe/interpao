from sqlalchemy.ext.asyncio import AsyncEngine

from app.db.session import async_engine
from app.models import *  # noqa: F403
from app.models.base import Base


async def init_db(engine: AsyncEngine = async_engine) -> None:
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)
