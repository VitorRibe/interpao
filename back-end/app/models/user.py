import uuid
from typing import Optional
from sqlalchemy import ForeignKey, text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base

class User(Base):
    __tablename__ = "user"
    __table_args__ = {"schema": "public"}
    
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
    
    id_setor: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("public.setor.id_setor")) # Atualize a ForeignKey também!
    setor: Mapped[Optional["Setor"]] = relationship("Setor", back_populates="usuarios")