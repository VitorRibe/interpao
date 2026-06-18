# Crie o arquivo: src/auth/use_cases/admin_progresso.py

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from src.auth.schemas import ProgressoFuncionario

class GetProgressoEquipeUseCase:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def execute(self) -> list[ProgressoFuncionario]:
        # 1. Busca o total de módulos existentes no sistema
        query_total = text("SELECT COUNT(*) FROM modulo")
        result_total = await self.db.execute(query_total)
        total_modulos = result_total.scalar() or 1  # Evita divisão por zero

        # 2. Busca os usuários, cruza com o setor e conta os módulos concluídos
        # Utilizamos aspas duplas em "user" pois é uma palavra reservada no Postgres
        query_users = text("""
            SELECT 
                u.id AS user_id,
                u.name AS nome,
                u.cargo,
                s.nome AS setor,
                COUNT(um.id_modulo) AS concluidos
            FROM "user" u
            LEFT JOIN setor s ON u.id_setor = s.id_setor
            LEFT JOIN user_modulo um ON u.id = um.user_id AND um.concluido = true
            WHERE u.is_active = true
            GROUP BY u.id, u.name, u.cargo, s.nome
            ORDER BY s.nome, u.name
        """)
        
        result_users = await self.db.execute(query_users)
        rows = result_users.mappings().all()

        # 3. Monta e calcula a porcentagem exata de cada funcionário
        progresso_list = []
        for row in rows:
            qtd = row["concluidos"]
            pct = (qtd / total_modulos) * 100 if total_modulos > 0 else 0.0
            
            progresso_list.append(ProgressoFuncionario(
                user_id=str(row["user_id"]),
                nome=row["nome"],
                setor=row["setor"] or "Sem Setor",
                cargo=row["cargo"],
                trilhas_concluidas=qtd,
                total_trilhas=total_modulos,
                progresso_pct=round(pct, 2)
            ))

        return progresso_list