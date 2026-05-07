import uuid
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import text
from .base import Base

class Company(Base):
    __tablename__ = "company"
    
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()"))
    name: Mapped[str] = mapped_column(index=True)
    image_url: Mapped[str | None] = mapped_column()
    status: Mapped[str] = mapped_column(default="Active") # Active, Inactive
