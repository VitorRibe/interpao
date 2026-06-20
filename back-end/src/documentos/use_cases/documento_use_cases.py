import os
import uuid
import httpx
from datetime import datetime, timezone
from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from src.documentos.schemas import CategoriaDocumentoResponse, DocumentoResponse

class DocumentoUseCase:
    def __init__(self, db: AsyncSession):
        self.db = db
        # Recupera as credenciais do Supabase configuradas na VPS
        self.supabase_url = os.getenv("SUPABASE_URL", "http://localhost:8000")
        self.supabase_key = os.getenv("SUPABASE_KEY", "")
        self.bucket_name = "documentos"

    async def _upload_to_supabase(self, file: UploadFile, file_name: str) -> str:
        """Faz o upload do arquivo binário diretamente para o bucket do Supabase via HTTP Async."""
        url = f"{self.supabase_url}/storage/v1/object/{self.bucket_name}/{file_name}"
        headers = {
            "Authorization": f"Bearer {self.supabase_key}",
            "ApiKey": self.supabase_key,
            "Content-Type": file.content_type or "application/octet-stream"
        }
        
        file_content = await file.read()
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, headers=headers, content=file_content)
            if response.status_code != 200:
                raise Exception(f"Erro no storage do Supabase: {response.text}")
                
        # Retorna a URL pública do objeto carregado
        return f"{self.supabase_url}/storage/v1/object/public/{self.bucket_name}/{file_name}"

    async def _delete_from_supabase(self, file_url: str):
        """Remove o arquivo físico de dentro do bucket do Supabase."""
        file_name = file_url.split("/")[-1]
        url = f"{self.supabase_url}/storage/v1/object/{self.bucket_name}/{file_name}"
        headers = {
            "Authorization": f"Bearer {self.supabase_key}",
            "ApiKey": self.supabase_key
        }
        async with httpx.AsyncClient() as client:
            await client.delete(url, headers=headers)

    async def listar_categorias_e_documentos(self) -> list[CategoriaDocumentoResponse]:
        # Busca todas as categorias estruturadas
        query_categorias = text("""
            SELECT id_categoria, titulo, descricao 
            FROM categoria_documento 
            ORDER BY titulo ASC
        """)
        res_cat = await self.db.execute(query_categorias)
        categorias_rows = res_cat.mappings().all()

        # Busca todos os documentos vinculados
        query_documentos = text("""
            SELECT id_documento, nome, descricao, tipo_arquivo, url, data_atualizacao, id_categoria 
            FROM documento 
            ORDER BY data_atualizacao DESC
        """)
        res_doc = await self.db.execute(query_documentos)
        documentos_rows = res_doc.mappings().all()

        # Agrupa os documentos por categoria correspondente
        resultado = []
        for cat in categorias_rows:
            docs_da_categoria = []
            for doc in documentos_rows:
                if str(doc["id_categoria"]) == str(cat["id_categoria"]):
                    docs_da_categoria.append(DocumentoResponse(
                        id_documento=str(doc["id_documento"]),
                        nome=doc["nome"],
                        descricao=doc["descricao"],
                        tipo_arquivo=doc["tipo_arquivo"],
                        url=doc["url"],
                        data_atualizacao=doc["data_atualizacao"]
                    ))
            
            resultado.append(CategoriaDocumentoResponse(
                id_categoria=str(cat["id_categoria"]),
                titulo=cat["titulo"],
                descricao=cat["descricao"],
                documentos=docs_da_categoria
            ))
        return resultado

    async def criar_documento(
        self, 
        file: UploadFile, 
        nome: str, 
        id_categoria: str | None, 
        nova_categoria: str | None
    ) -> DocumentoResponse:
        
        # Caso o usuário tenha optado por criar uma categoria inline no Front-end
        if nova_categoria:
            id_categoria = str(uuid.uuid4())
            query_nova_cat = text("""
                INSERT INTO categoria_documento (id_categoria, titulo, descricao) 
                VALUES (:id_cat, :titulo, :desc)
            """)
            await self.db.execute(query_nova_cat, {"id_cat": id_categoria, "titulo": nova_categoria, "desc": None})
            await self.db.commit()

        # Define extensões e chaves únicas
        extensao = file.filename.split(".")[-1] if file.filename else "pdf"
        tipo_arquivo = "pdf" if extensao.lower() == "pdf" else "doc"
        id_documento = str(uuid.uuid4())
        unique_file_name = f"{id_documento}_{int(datetime.now().timestamp())}.{extensao}"

        # Executa o upload físico para o Supabase Storage
        public_url = await self._upload_to_supabase(file, unique_file_name)

        # Salva o registro e os metadados no banco PostgreSQL
        agora = datetime.now(timezone.utc)
        query_ins_doc = text("""
            INSERT INTO documento (id_documento, nome, descricao, tipo_arquivo, url, data_atualizacao, id_categoria) 
            VALUES (:id_doc, :nome, :desc, :tipo, :url, :data, :id_cat)
        """)
        await self.db.execute(query_ins_doc, {
            "id_doc": id_documento,
            "nome": nome,
            "desc": None,
            "tipo": tipo_arquivo,
            "url": public_url,
            "data": agora,
            "id_cat": id_categoria
        })
        await self.db.commit()

        return DocumentoResponse(
            id_documento=id_documento,
            nome=nome,
            descricao=None,
            tipo_arquivo=tipo_arquivo,
            url=public_url,
            data_atualizacao=agora
        )

    async def deletar_documento(self, id_documento: str) -> None:
        # Recupera os dados do documento para extrair a URL do storage
        query_select = text("SELECT url FROM documento WHERE id_documento = :id_doc")
        res = await self.db.execute(query_select, {"id_doc": id_documento})
        doc = res.mappings().first()
        
        if doc:
            # Remove o arquivo do Supabase Storage
            try:
                await self._delete_from_supabase(doc["url"])
            except Exception as e:
                print(f"Aviso: Erro ao deletar arquivo físico no Supabase: {e}")

            # Remove a linha correspondente do banco relacional
            query_delete = text("DELETE FROM documento WHERE id_documento = :id_doc")
            await self.db.execute(query_delete, {"id_doc": id_documento})
            await self.db.commit()