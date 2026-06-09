import uuid
from fastapi import APIRouter, Depends, Response, Cookie, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_async_db
from src.auth.schemas import (
    LoginRequest, 
    TokenResponse, 
    LoggedUserDTO,
    UserRegisterRequest,
    UserRegisterResponse,
    PasswordResetRequest,
    PasswordResetConfirm,
    PasswordResetResponse,
)
from src.auth.repositories.auth_repository import AuthRepository
from src.auth.services.service import AuthService
from src.auth.use_cases.authenticate import AuthenticateUseCase
from src.auth.dependencies import ValidateUserAccess
from datetime import datetime, timezone

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login", response_model=TokenResponse)
async def login(
    request: LoginRequest,
    response: Response,
    db: AsyncSession = Depends(get_async_db)
):
    repository = AuthRepository(db)
    auth_service = AuthService(repository)
    use_case = AuthenticateUseCase(repository, auth_service)
    
    access_token, session_id = await use_case.execute_login(request.email, request.password)
    
    # Set session_id cookie
    response.set_cookie(
        key="session_id",
        value=str(session_id),
        httponly=True,
        secure=True, # In production this should be True
        samesite="lax",
        max_age=7 * 24 * 60 * 60 # 7 days
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/refresh", response_model=TokenResponse)
async def refresh(
    session_id: str = Cookie(None),
    db: AsyncSession = Depends(get_async_db)
):
    if not session_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session cookie missing")
    
    try:
        session_uuid = uuid.UUID(session_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid session ID format")

    repository = AuthRepository(db)
    session = await repository.get_session(session_uuid)
    
    if not session or session.expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired session")
    
    user = await repository.get_user_by_id(session.user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    
    auth_service = AuthService(repository)
    access_token = auth_service.generate_jwt_for_user(user)
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.delete("/logout")
async def logout(
    response: Response,
    session_id: str = Cookie(None),
    db: AsyncSession = Depends(get_async_db)
):
    if session_id:
        try:
            session_uuid = uuid.UUID(session_id)
            repository = AuthRepository(db)
            await repository.delete_session(session_uuid)
        except ValueError:
            pass # Ignore invalid UUID on logout
    
    response.delete_cookie("session_id")
    return {"message": "Logged out successfully"}

@router.get("/current_user", response_model=LoggedUserDTO)
async def current_user(user: LoggedUserDTO = Depends(ValidateUserAccess)):
    return user

# ==========================================
# User Registration Routes
# ==========================================

@router.post("/register", response_model=LoggedUserDTO)
async def register(
    request: "UserRegisterRequest",
    db: AsyncSession = Depends(get_async_db)
):
    """Register a new user."""
    from src.auth.repositories.setor_repository import SetorRepository
    from src.auth.use_cases.register import RegisterUseCase
    
    auth_repository = AuthRepository(db)
    setor_repository = SetorRepository(db)
    auth_service = AuthService(auth_repository)
    use_case = RegisterUseCase(auth_repository, setor_repository, auth_service)
    
    user = await use_case.execute_register(
        email=request.email,
        password=request.password,
        name=request.name,
        id_setor=request.id_setor,
        phone=request.phone,
    )
    
    return auth_service.build_logged_user_dto(user)

# ==========================================
# Password Reset Routes
# ==========================================

@router.post("/password-reset")
async def password_reset_request(
    request: "PasswordResetRequest",
    db: AsyncSession = Depends(get_async_db)
):
    """Request password reset (sends email with token)."""
    from src.auth.repositories.setor_repository import SetorRepository
    from src.auth.use_cases.password_reset import PasswordResetRequestUseCase
    
    auth_repository = AuthRepository(db)
    setor_repository = SetorRepository(db)
    auth_service = AuthService(auth_repository)
    use_case = PasswordResetRequestUseCase(auth_repository, setor_repository, auth_service)
    
    token, expires_at = await use_case.execute_request(request.email)
    
    # TODO: Send password reset email
    # await send_password_reset_email(request.email, token)

    return {"message": "Password reset email sent. Check your inbox."}

@router.post("/password-reset/confirm")
async def password_reset_confirm(
    request: "PasswordResetConfirm",
    db: AsyncSession = Depends(get_async_db)
):
    """Confirm password reset with token."""
    from src.auth.repositories.setor_repository import SetorRepository
    from src.auth.use_cases.password_reset import PasswordResetConfirmUseCase
    
    auth_repository = AuthRepository(db)
    setor_repository = SetorRepository(db)
    auth_service = AuthService(auth_repository)
    use_case = PasswordResetConfirmUseCase(auth_repository, setor_repository, auth_service)

    user = await use_case.execute_confirm(request.token, request.new_password)

    return {"message": "Password reset successfully."}