import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy import DateTime, ForeignKey, text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base

class User(Base):
    __tablename__ = "user"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()"))
    email: Mapped[str] = mapped_column(unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column()
    name: Mapped[str] = mapped_column()
    phone: Mapped[Optional[str]] = mapped_column()
    image_url: Mapped[Optional[str]] = mapped_column()
    cargo: Mapped[Optional[str]] = mapped_column()
    is_active: Mapped[bool] = mapped_column(default=True)
    is_admin: Mapped[bool] = mapped_column(default=False)
    is_superuser: Mapped[bool] = mapped_column(default=False)
    password_reset_token: Mapped[Optional[str]] = mapped_column(default=None)
    password_reset_expires_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), default=None)
    id_setor: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("setor.id_setor"))
    setor: Mapped[Optional["Setor"]] = relationship("Setor", back_populates="usuarios")
    beneficios: Mapped[list["UserBeneficio"]] = relationship("UserBeneficio", back_populates="user", cascade="all, delete-orphan")
