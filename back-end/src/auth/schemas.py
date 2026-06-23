from pydantic import BaseModel, EmailStr
from typing import Optional, List
from uuid import UUID

# ==========================================
# DTOs (Data Transfer Objects)
# ==========================================

class SetorDTO(BaseModel):
    id_setor: UUID
    nome: str

class LoggedUserDTO(BaseModel):
    id: UUID
    email: EmailStr
    name: str
    phone: Optional[str]
    image_url: Optional[str]
    cargo: Optional[str]
    is_admin: bool
    is_superuser: bool
    setor: SetorDTO

# ==========================================
# Authentication Requests/Responses
# ==========================================

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

# ==========================================
# User Registration
# ==========================================

class UserRegisterRequest(BaseModel):
    email: EmailStr
    password: str
    name: str
    phone: Optional[str] = None
    id_setor: UUID

class UserRegisterResponse(BaseModel):
    id: UUID
    email: EmailStr
    name: str
    phone: Optional[str]
    cargo: Optional[str]
    setor: SetorDTO

# ==========================================
# Password Reset
# ==========================================

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str

class PasswordResetResponse(BaseModel):
    message: str

# ==========================================
# Admin Operations
# ==========================================

class AdminCreateUserRequest(BaseModel):
    email: EmailStr
    password: str
    name: str
    phone: Optional[str] = None
    cargo: Optional[str] = None
    id_setor: UUID
    is_admin: bool = False            
    is_superuser: bool = False       

class AdminCreateUserResponse(BaseModel):
    id: UUID
    email: EmailStr
    name: str
    phone: Optional[str]
    cargo: Optional[str]
    setor: SetorDTO
    is_active: bool

class AdminUpdateUserRequest(BaseModel):
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    phone: Optional[str] = None
    cargo: Optional[str] = None
    id_setor: Optional[UUID] = None
    is_active: Optional[bool] = None
    is_admin: Optional[bool] = None  
    is_superuser: Optional[bool] = None

class AdminUpdateUserResponse(BaseModel):
    id: UUID
    email: EmailStr
    name: str
    phone: Optional[str]
    cargo: Optional[str]
    setor: SetorDTO
    is_active: bool

class AdminResetPasswordRequest(BaseModel):
    message: str = "Password reset email sent"

class AdminListUsersResponse(BaseModel):
    total: int
    page: int
    size: int
    users: list["AdminCreateUserResponse"]

# ==========================================
# Self-service password change
# ==========================================

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str




class DetalheTrilha(BaseModel):
    trilha_id: str
    titulo: str
    modulos_concluidos: int
    total_modulos: int
    progresso_pct: float

class ProgressoFuncionario(BaseModel):
    user_id: str
    nome: str
    setor: str
    cargo: Optional[str] = None
    trilhas_concluidas: int
    total_trilhas: int
    progresso_pct: float
    detalhes_trilhas: List[DetalheTrilha]

class AdminProgressoResponse(BaseModel):
    progresso: List[ProgressoFuncionario]