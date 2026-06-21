from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from app.db.session import get_async_db
from src.auth.dependencies import ValidateUserAccess, ValidateAdminAccess
from src.documentos.schemas import CategoriaDocumentoResponse, DocumentoResponse
from src.documentos.use_cases.documento_use_cases import DocumentoUseCase

router = APIRouter(prefix="/documentos", tags=["documentos"])

@router.get("", response_model=List[CategoriaDocumentoResponse])
async def listar_documentos(
    current_user: dict = Depends(ValidateUserAccess),
    db: AsyncSession = Depends(get_async_db)
):
    use_case = DocumentoUseCase(db)
    return await use_case.listar_categorias_e_documentos()

@router.post("/upload", response_model=DocumentoResponse, status_code=status.HTTP_201_CREATED)
async def upload_documento(
    file: UploadFile = File(...),
    nome: str = Form(...),
    id_categoria: Optional[str] = Form(None),
    nova_categoria: Optional[str] = Form(None),
    current_user: dict = Depends(ValidateAdminAccess),
    db: AsyncSession = Depends(get_async_db)
):
    if not id_categoria and not nova_categoria:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Falta de parâmetros: envie o 'id_categoria' ou digite o nome de uma 'nova_categoria'."
        )
        
    use_case = DocumentoUseCase(db)
    try:
        return await use_case.criar_documento(
            file=file,
            nome=nome,
            id_categoria=id_categoria,
            nova_categoria=nova_categoria
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Falha na execução do upload: {str(e)}"
        )

@router.delete("/{id_documento}", status_code=status.HTTP_200_OK)
async def deletar_documento(
    id_documento: str,
    current_user: dict = Depends(ValidateAdminAccess),
    db: AsyncSession = Depends(get_async_db)
):
    use_case = DocumentoUseCase(db)
    await use_case.deletar_documento(id_documento)
    return {"detail": "Documento removido com sucesso."}