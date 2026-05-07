from fastapi import APIRouter, Depends, Response, Cookie, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_async_db
from src.auth.schemas import LoginRequest, TokenResponse, LoggedUserDTO
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
        value=session_id,
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
    
    repository = AuthRepository(db)
    session = await repository.get_session(session_id)
    
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
        repository = AuthRepository(db)
        await repository.delete_session(session_id)
    
    response.delete_cookie("session_id")
    return {"message": "Logged out successfully"}

@router.get("/current_user", response_model=LoggedUserDTO)
async def current_user(user: LoggedUserDTO = Depends(ValidateUserAccess)):
    return user
