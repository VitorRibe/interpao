import uuid
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import DateTime, ForeignKey, Integer, Numeric, Text, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.content import Setor

from .base import Base


class Ingrediente(Base):
    __tablename__ = "ingrediente"

    id_ingr: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    nome: Mapped[str] = mapped_column(Text)
    unidade_med: Mapped[str] = mapped_column(Text)
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

    itens: Mapped[list["ItemReceita"]] = relationship(
        "ItemReceita",
        back_populates="ingrediente",
        cascade="all, delete-orphan",
    )


class Receita(Base):
    __tablename__ = "receita"

    id_receita: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    titulo: Mapped[str] = mapped_column(Text)
    descricao: Mapped[Optional[str]] = mapped_column(Text)
    inst_preparo: Mapped[Optional[str]] = mapped_column(Text)
    image_url: Mapped[Optional[str]] = mapped_column(Text)
    tempo_preparo: Mapped[Optional[int]] = mapped_column(Integer)
    porcoes: Mapped[Optional[int]] = mapped_column(Integer)
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

    itens: Mapped[list["ItemReceita"]] = relationship(
        "ItemReceita",
        back_populates="receita",
        cascade="all, delete-orphan",
    )
    setor_receitas: Mapped[list["SetorReceita"]] = relationship(
        "SetorReceita",
        back_populates="receita",
        cascade="all, delete-orphan",
    )


class ItemReceita(Base):
    __tablename__ = "item_receita"

    id_receita: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("receita.id_receita", ondelete="CASCADE"),
        primary_key=True,
    )
    id_ingr: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("ingrediente.id_ingr", ondelete="CASCADE"),
        primary_key=True,
    )
    qtd: Mapped[float] = mapped_column(Numeric(10, 3))

    receita: Mapped["Receita"] = relationship("Receita", back_populates="itens")
    ingrediente: Mapped["Ingrediente"] = relationship(
        "Ingrediente",
        back_populates="itens",
    )


class SetorReceita(Base):
    __tablename__ = "setor_receita"

    id_setor: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("setor.id_setor", ondelete="CASCADE"),
        primary_key=True,
    )
    id_receita: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("receita.id_receita", ondelete="CASCADE"),
        primary_key=True,
    )

    receita: Mapped["Receita"] = relationship(
        "Receita",
        back_populates="setor_receitas",
    )
    setor: Mapped["Setor"] = relationship("Setor")
