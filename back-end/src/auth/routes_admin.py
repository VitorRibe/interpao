import uuid
from typing import List
from src.auth.dependencies import ValidateUserAccess
from src.auth.schemas import ProgressoFuncionario
from src.auth.use_cases.admin_progresso import GetProgressoEquipeUseCase
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_async_db
from src.auth.schemas import (
    AdminCreateUserRequest,
    AdminCreateUserResponse,
    AdminUpdateUserRequest,
    AdminUpdateUserResponse,
    AdminListUsersResponse,
    AdminResetPasswordRequest,
)
from src.auth.repositories.auth_repository import AuthRepository
from src.auth.repositories.setor_repository import SetorRepository
from src.auth.services.service import AuthService
from src.auth.dependencies import ValidateAdminAccess
from src.auth.use_cases.admin_users import (
    CreateUserAsAdminUseCase,
    ListUsersUseCase,
    UpdateUserAsAdminUseCase,
    DeleteUserAsAdminUseCase,
    AdminResetPasswordUseCase,
)

router = APIRouter(prefix="/admin", tags=["admin"])

# ==========================================
# Admin User Management Routes
# ==========================================

@router.post("/users", response_model=AdminCreateUserResponse)
async def create_user_admin(
    request: AdminCreateUserRequest,
    admin: dict = Depends(ValidateAdminAccess),
    db: AsyncSession = Depends(get_async_db),
):
    """Create a new user (admin only)."""
    auth_repository = AuthRepository(db)
    setor_repository = SetorRepository(db)
    auth_service = AuthService(auth_repository)
    use_case = CreateUserAsAdminUseCase(auth_repository, setor_repository, auth_service)
    
    user = await use_case.execute(
        email=request.email,
        password=request.password,
        name=request.name,
        id_setor=request.id_setor,
        phone=request.phone,
        cargo=request.cargo,
    )
    
    setor_dto = {
        "id_setor": user.setor.id_setor,
        "nome": user.setor.nome,
    }
    
    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "phone": user.phone,
        "cargo": user.cargo,
        "setor": setor_dto,
        "is_active": user.is_active,
    }

@router.get("/users", response_model=AdminListUsersResponse)
async def list_users_admin(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    admin: dict = Depends(ValidateAdminAccess),
    db: AsyncSession = Depends(get_async_db),
):
    """List all users (admin only)."""
    auth_repository = AuthRepository(db)
    setor_repository = SetorRepository(db)
    auth_service = AuthService(auth_repository)
    use_case = ListUsersUseCase(auth_repository, setor_repository, auth_service)
    
    users, total = await use_case.execute(skip=skip, limit=limit)
    
    users_data = []
    for user in users:
        setor_dto = {
            "id_setor": user.setor.id_setor,
            "nome": user.setor.nome,
        }
        users_data.append({
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "phone": user.phone,
            "cargo": user.cargo,
            "setor": setor_dto,
            "is_active": user.is_active,
        })
    
    return {
        "total": total,
        "page": skip // limit + 1,
        "size": limit,
        "users": users_data,
    }

@router.get("/users/{user_id}", response_model=AdminCreateUserResponse)
async def get_user_admin(
    user_id: uuid.UUID,
    admin: dict = Depends(ValidateAdminAccess),
    db: AsyncSession = Depends(get_async_db),
):
    """Get user details (admin only)."""
    auth_repository = AuthRepository(db)
    user = await auth_repository.get_user_by_id(user_id)
    
    if not user:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found."
        )
    
    setor_dto = {
        "id_setor": user.setor.id_setor,
        "nome": user.setor.nome,
    }
    
    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "phone": user.phone,
        "cargo": user.cargo,
        "setor": setor_dto,
        "is_active": user.is_active,
    }

@router.put("/users/{user_id}", response_model=AdminUpdateUserResponse)
async def update_user_admin(
    user_id: uuid.UUID,
    request: AdminUpdateUserRequest,
    admin: dict = Depends(ValidateAdminAccess),
    db: AsyncSession = Depends(get_async_db),
):
    """Update user details (admin only)."""
    auth_repository = AuthRepository(db)
    setor_repository = SetorRepository(db)
    auth_service = AuthService(auth_repository)
    use_case = UpdateUserAsAdminUseCase(auth_repository, setor_repository, auth_service)
    
    user = await use_case.execute(
        user_id=user_id,
        email=request.email,
        name=request.name,
        phone=request.phone,
        cargo=request.cargo,
        id_setor=request.id_setor,
        is_active=request.is_active,
    )
    
    setor_dto = {
        "id_setor": user.setor.id_setor,
        "nome": user.setor.nome,
    }
    
    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "phone": user.phone,
        "cargo": user.cargo,
        "setor": setor_dto,
        "is_active": user.is_active,
    }

@router.delete("/users/{user_id}")
async def delete_user_admin(
    user_id: uuid.UUID,
    admin: dict = Depends(ValidateAdminAccess),
    db: AsyncSession = Depends(get_async_db),
):
    """Delete user (soft delete - admin only)."""
    auth_repository = AuthRepository(db)
    setor_repository = SetorRepository(db)
    auth_service = AuthService(auth_repository)
    use_case = DeleteUserAsAdminUseCase(auth_repository, setor_repository, auth_service)
    
    result = await use_case.execute(user_id)
    return result

@router.post("/users/{user_id}/reset-password")
async def admin_reset_password(
    user_id: uuid.UUID,
    admin: dict = Depends(ValidateAdminAccess),
    db: AsyncSession = Depends(get_async_db),
):
    """Admin reset password for user (sends temporary password via email)."""
    auth_repository = AuthRepository(db)
    setor_repository = SetorRepository(db)
    auth_service = AuthService(auth_repository)
    use_case = AdminResetPasswordUseCase(auth_repository, setor_repository, auth_service)
    
    result = await use_case.execute(user_id)
    # TODO: Send email with temporary password
    # await send_temporary_password_email(user.email, temp_password)
    return result

# ==========================================
# Setor Listing Route
# ==========================================

@router.get("/setores")
async def list_setores_admin(
    admin: dict = Depends(ValidateAdminAccess),
    db: AsyncSession = Depends(get_async_db),
):
    """List all setores (for dropdowns in UI)."""
    setor_repository = SetorRepository(db)
    setores = await setor_repository.get_all_setores()
    
    return {
        "setores": [
            {"id_setor": s.id_setor, "nome": s.nome}
            for s in setores
        ]
    }


# Adicione no final do arquivo router de admin (o primeiro que você mandou)

@router.get("/progresso", response_model=List[ProgressoFuncionario])
async def get_progresso_equipe(
    # ATENÇÃO: Usando ValidateUserAccess em vez de ValidateAdminAccess
    # para permitir que a Nayara (que pode não ser admin global) veja a tela baseada no setor dela.
    current_user: dict = Depends(ValidateUserAccess), 
    db: AsyncSession = Depends(get_async_db),
):
    """Get team progress (Admin or Administrative/Office Sectors only)."""
    
    # 1. Validação de Acesso Customizada
    setor_nome = current_user.setor.nome.lower() if current_user.setor and getattr(current_user.setor, "nome", None) else ""
    is_authorized = (
        current_user.is_admin or 
        "administrativo" in setor_nome or 
        "escritório" in setor_nome or 
        "escritorio" in setor_nome
    )
    
    if not is_authorized:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Acesso negado. Apenas gestores podem visualizar o progresso da equipe."
        )

    # 2. Executa a regra de negócio (O arquivo do Use Case deve ser criado pelo seu colega)
    use_case = GetProgressoEquipeUseCase(db)
    progresso_data = await use_case.execute()
    
    return progresso_data