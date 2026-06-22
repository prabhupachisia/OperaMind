import uuid

from datetime import datetime
from sqlalchemy import Column, DateTime, String

from extensions import Base


class Entity(Base):

    __tablename__ = "entities"

    id = Column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )

    name = Column(
        String(255),
        nullable=False
    )

    entity_type = Column(
        String(100),
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )