import uuid

from datetime import datetime
from sqlalchemy import Column, DateTime, String, Text

from extensions import Base


class Asset(Base):

    __tablename__ = "assets"

    id = Column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )

    asset_tag = Column(
        String(100),
        nullable=False,
        unique=True,
        index=True
    )

    name = Column(
        String(255),
        nullable=False
    )

    location = Column(
        String(255)
    )

    description = Column(
        Text
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )
