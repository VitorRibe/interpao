from fastapi import Depends, HTTPException, status
from config.security.jwt_bearer_authentication import JWTBearerAuthentication
from src.auth.schemas import LoggedUserDTO

jwt_bearer = JWTBearerAuthentication()

async def ValidateUserAccess(payload: dict = Depends(jwt_bearer)) -> LoggedUserDTO:
    """Decodes the Bearer token and returns the user DTO."""
    try:
        return LoggedUserDTO(**payload)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )

async def ValidateAdminAccess(user: LoggedUserDTO = Depends(ValidateUserAccess)) -> LoggedUserDTO:
    """Checks if is_admin is True."""
    if not user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return user

async def ValidateSuperUserAccess(user: LoggedUserDTO = Depends(ValidateUserAccess)) -> LoggedUserDTO:
    """Checks if is_superuser is True."""
    if not user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="SuperUser access required",
        )
    return user
