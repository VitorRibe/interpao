from sqlalchemy.orm import Mapped, mapped_column
from .base import Base

class Company(Base):
    __tablename__ = "company"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(index=True)
    image_url: Mapped[str | None] = mapped_column()
    status: Mapped[str] = mapped_column(default="Active") # Active, Inactive
