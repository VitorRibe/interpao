from pydantic import BaseModel, EmailStr
from typing import Optional

class CompanyDTO(BaseModel):
    id: int
    name: str
    image_url: Optional[str]

class LoggedUserDTO(BaseModel):
    id: int
    email: EmailStr
    name: str
    phone: Optional[str]
    image_url: Optional[str]
    is_admin: bool
    is_superuser: bool
    company: CompanyDTO

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
