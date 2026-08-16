import logging
from pathlib import Path
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncEngine

from app.db.session import async_engine
from app.models import *  # noqa: F403
from app.models.base import Base

logger = logging.getLogger(__name__)

SEED_FILE_PATH = Path(__file__).parent / "seeds" / "seed_admin.sql"

async def init_db(engine: AsyncEngine = async_engine) -> None:
    async with engine.begin() as connection:
        # 1. Cria a estrutura do banco
        await connection.run_sync(Base.metadata.create_all)
        
        # 2. Executa o seed dividindo os comandos
        if SEED_FILE_PATH.exists():
            logger.info(f"Executando arquivo de seed: {SEED_FILE_PATH}")
            sql_script = SEED_FILE_PATH.read_text(encoding="utf-8")
            
            # Divide o script por ';' e executa cada comando isoladamente
            comandos = [cmd.strip() for cmd in sql_script.split(';') if cmd.strip()]
            
            for comando in comandos:
                await connection.execute(text(comando))
                
            logger.info("Seed executado com sucesso.")
        else:
            logger.warning(f"Arquivo de seed não encontrado no caminho: {SEED_FILE_PATH}")