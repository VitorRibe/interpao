import uuid
from typing import Optional
from sqlalchemy import ForeignKey, Text, text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base

class UserBeneficio(Base):
    __tablename__ = "user_beneficio"

    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("user.id", ondelete="CASCADE"),
        primary_key=True,
    )
    id_beneficio: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("beneficio.id_beneficio", ondelete="CASCADE"),
        primary_key=True,
    )
    valor_customizado: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    beneficio: Mapped["Beneficio"] = relationship("Beneficio", back_populates="usuarios")
    user: Mapped["User"] = relationship("User", back_populates="beneficios")


class Beneficio(Base):
    __tablename__ = "beneficio"

    id_beneficio: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    titulo: Mapped[str] = mapped_column(Text)
    descricao: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    como_usar: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    categoria: Mapped[str] = mapped_column(Text)
    icone: Mapped[str] = mapped_column(Text)
    tipo: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # Legacy field
    detalhes_padrao: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    usuarios: Mapped[list[UserBeneficio]] = relationship(
        "UserBeneficio",
        back_populates="beneficio",
        cascade="all, delete-orphan",
    )
