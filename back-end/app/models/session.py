from datetime import datetime, timezone
from sqlalchemy import ForeignKey, String, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base

class Session(Base):
    __tablename__ = "session"
    
    id: Mapped[str] = mapped_column(String, primary_key=True) # session_id
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), index=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
