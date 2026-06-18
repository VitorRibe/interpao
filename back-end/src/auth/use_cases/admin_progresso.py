from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from src.auth.schemas import ProgressoFuncionario, DetalheTrilha

class GetProgressoEquipeUseCase:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def execute(self) -> list[ProgressoFuncionario]:
        # 1. Procura todas as trilhas e calcula o total de módulos de cada uma
        query_trilhas = text("""
            SELECT t.id AS trilha_id, t.titulo, COUNT(m.id) AS total_modulos
            FROM trilha t
            LEFT JOIN modulo m ON m.id_trilha = t.id
            GROUP BY t.id, t.titulo
        """)
        result_trilhas = await self.db.execute(query_trilhas)
        trilhas_dict = {str(row["trilha_id"]): row for row in result_trilhas.mappings().all()}
        total_trilhas_sistema = len(trilhas_dict)

        # 2. Mapeia a quantidade de módulos concluídos por utilizador em cada trilha
        query_progresso_modulos = text("""
            SELECT um.user_id, m.id_trilha, COUNT(um.id_modulo) AS concluidos
            FROM user_modulo um
            JOIN modulo m ON um.id_modulo = m.id
            WHERE um.concluido = true
            GROUP BY um.user_id, m.id_trilha
        """)
        result_progresso = await self.db.execute(query_progresso_modulos)
        progresso_map = {}
        for row in result_progresso.mappings().all():
            uid = str(row["user_id"])
            tid = str(row["id_trilha"])
            if uid not in progresso_map:
                progresso_map[uid] = {}
            progresso_map[uid][tid] = row["concluidos"]

        # 3. Procura todos os utilizadores ativos mapeados com os seus setores
        query_users = text("""
            SELECT u.id AS user_id, u.name AS nome, u.cargo, s.nome AS setor
            FROM "user" u
            LEFT JOIN setor s ON u.id_setor = s.id_setor
            WHERE u.is_active = true
            ORDER BY s.nome, u.name
        """)
        result_users = await self.db.execute(query_users)
        users_rows = result_users.mappings().all()

        # 4. Processa e monta a árvore hierárquica final de resposta
        resultado = []
        for u in users_rows:
            user_id_str = str(u["user_id"])
            user_progresso_trilhas = progresso_map.get(user_id_str, {})
            
            detalhes_trilhas = []
            trilhas_concluidas_count = 0
            total_modulos_sistema = 0
            total_modulos_concluidos_usuario = 0

            for tid, t_data in trilhas_dict.items():
                tot_mod = t_data["total_modulos"] or 0
                mod_concluidos = user_progresso_trilhas.get(tid, 0)
                
                if mod_concluidos > tot_mod:
                    mod_concluidos = tot_mod
                    
                pct_trilha = (mod_concluidos / tot_mod * 100) if tot_mod > 0 else 0.0
                
                if tot_mod > 0 and mod_concluidos == tot_mod:
                    trilhas_concluidas_count += 1
                    
                total_modulos_sistema += tot_mod
                total_modulos_concluidos_usuario += mod_concluidos

                detalhes_trilhas.append(DetalheTrilha(
                    trilha_id=tid,
                    titulo=t_data["titulo"],
                    modulos_concluidos=mod_concluidos,
                    total_modulos=tot_mod,
                    progresso_pct=round(pct_trilha, 2)
                ))

            progresso_geral_pct = (total_modulos_concluidos_usuario / total_modulos_sistema * 100) if total_modulos_sistema > 0 else 0.0

            resultado.append(ProgressoFuncionario(
                user_id=user_id_str,
                nome=u["nome"],
                setor=u["setor"] or "Sem Setor",
                cargo=u["cargo"],
                trilhas_concluidas=trilhas_concluidas_count,
                total_trilhas=total_trilhas_sistema,
                progresso_pct=round(progresso_geral_pct, 2),
                detalhes_trilhas=detalhes_trilhas
            ))

        return resultado