import uuid
from typing import Optional, List
from datetime import datetime
from sqlalchemy import ForeignKey, Text, text, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base

class CategoriaDocumento(Base):
    __tablename__ = "categoria_documento"

    id_categoria: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    titulo: Mapped[str] = mapped_column(Text)
    descricao: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    documentos: Mapped[List["Documento"]] = relationship(
        "Documento",
        back_populates="categoria",
        cascade="all, delete-orphan",
    )


class Documento(Base):
    __tablename__ = "documento"

    id_documento: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    nome: Mapped[str] = mapped_column(Text)
    descricao: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    tipo_arquivo: Mapped[str] = mapped_column(Text)
    url: Mapped[str] = mapped_column(Text)
    data_atualizacao: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        server_default=text("timezone('utc', now())"),
    )
    id_categoria: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("categoria_documento.id_categoria", ondelete="CASCADE"),
        nullable=False,
    )

    categoria: Mapped[CategoriaDocumento] = relationship("CategoriaDocumento", back_populates="documentos")
