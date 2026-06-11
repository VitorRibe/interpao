import uuid
from typing import Optional
from sqlalchemy import ForeignKey, Text, UniqueConstraint, text
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base


class EscalaItem(Base):
    __tablename__ = "escala_item"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()")
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("user.id", ondelete="CASCADE"), index=True
    )
    # 0=Segunda, 1=Terça, 2=Quarta, 3=Quinta, 4=Sexta, 5=Sábado, 6=Domingo
    dia_semana: Mapped[int] = mapped_column()
    folga: Mapped[bool] = mapped_column(default=False, server_default=text("false"))
    entrada: Mapped[Optional[str]] = mapped_column()   # "HH:MM"
    saida: Mapped[Optional[str]] = mapped_column()     # "HH:MM"
    intervalo_min: Mapped[int] = mapped_column(default=60, server_default=text("60"))
    turno: Mapped[Optional[str]] = mapped_column()
    notas: Mapped[Optional[str]] = mapped_column(Text)

    __table_args__ = (UniqueConstraint("user_id", "dia_semana", name="uq_escala_user_dia"),)
