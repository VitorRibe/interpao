import uuid
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, Text, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class Setor(Base):
    __tablename__ = "setor"

    id_setor: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    nome: Mapped[str] = mapped_column(Text)

    trilhas: Mapped[list["Trilha"]] = relationship("Trilha", back_populates="setor")


class Trilha(Base):
    __tablename__ = "trilha"

    id_trilha: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    titulo: Mapped[str] = mapped_column(Text)
    descricao: Mapped[Optional[str]] = mapped_column(Text)
    carga_hor: Mapped[Optional[int]] = mapped_column(Integer)
    id_setor: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("setor.id_setor"))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        server_default=text("now()"),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        server_default=text("now()"),
    )

    setor: Mapped[Optional[Setor]] = relationship("Setor", back_populates="trilhas")
    modulos: Mapped[list["Modulo"]] = relationship(
        "Modulo",
        back_populates="trilha",
        cascade="all, delete-orphan",
    )


class Modulo(Base):
    __tablename__ = "modulo"

    id_modulo: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    id_trilha: Mapped[Optional[uuid.UUID]] = mapped_column(
        ForeignKey("trilha.id_trilha", ondelete="CASCADE")
    )
    titulo: Mapped[str] = mapped_column(Text)
    descricao: Mapped[Optional[str]] = mapped_column(Text)
    conteudo: Mapped[Optional[str]] = mapped_column(Text)
    duracao: Mapped[Optional[int]] = mapped_column(Integer)
    ordem: Mapped[Optional[int]] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        server_default=text("now()"),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        server_default=text("now()"),
    )

    trilha: Mapped[Optional[Trilha]] = relationship("Trilha", back_populates="modulos")
    multimidia: Mapped[list["Multimidia"]] = relationship(
        "Multimidia",
        back_populates="modulo",
        cascade="all, delete-orphan",
    )


class Multimidia(Base):
    __tablename__ = "multimidia"

    id_multimidia: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    id_modulo: Mapped[Optional[uuid.UUID]] = mapped_column(
        ForeignKey("modulo.id_modulo", ondelete="CASCADE")
    )
    titulo: Mapped[str] = mapped_column(Text)
    url: Mapped[Optional[str]] = mapped_column(Text)
    tipo: Mapped[Optional[str]] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        server_default=text("now()"),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        server_default=text("now()"),
    )

    modulo: Mapped[Optional[Modulo]] = relationship("Modulo", back_populates="multimidia")


class UserTrilha(Base):
    __tablename__ = "user_trilha"

    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("user.id", ondelete="CASCADE"),
        primary_key=True,
    )
    id_trilha: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("trilha.id_trilha", ondelete="CASCADE"),
        primary_key=True,
    )


class UserModulo(Base):
    __tablename__ = "user_modulo"

    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("user.id", ondelete="CASCADE"),
        primary_key=True,
    )
    id_modulo: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("modulo.id_modulo", ondelete="CASCADE"),
        primary_key=True,
    )
    concluido: Mapped[bool] = mapped_column(Boolean, default=False)
