import uuid
from datetime import datetime, timezone
from sqlalchemy import ForeignKey, UUID, DateTime, text
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base

class Session(Base):
    __tablename__ = "session"
    
    id: Mapped[uuid.UUID] = mapped_column(UUID, primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()"))
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("user.id"), index=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
