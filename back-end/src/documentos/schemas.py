from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class DocumentoResponse(BaseModel):
    id_documento: str
    nome: str
    descricao: Optional[str] = None
    tipo_arquivo: str
    url: str
    data_atualizacao: datetime

class CategoriaDocumentoResponse(BaseModel):
    id_categoria: str
    titulo: str
    descricao: Optional[str] = None
    documentos: List[DocumentoResponse]