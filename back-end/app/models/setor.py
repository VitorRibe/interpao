import uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base

class Setor(Base):
    __tablename__ = "setor"
    __table_args__ = {"schema": "public"}
    
    id_setor: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    nome: Mapped[str] = mapped_column(unique=True, index=True)
    
    # O relacionamento continua igualzinho
    usuarios: Mapped[list["User"]] = relationship("User", back_populates="setor")