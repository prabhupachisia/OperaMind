import uuid

from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, String, Text

from extensions import Base


class Incident(Base):

    __tablename__ = "incidents"

    id = Column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )

    document_id = Column(
        String(36),
        ForeignKey("documents.id"),
        nullable=False,
        index=True
    )

    title = Column(
        String(255),
        nullable=False
    )

    description = Column(
        Text,
        nullable=False
    )

    asset_tag = Column(
        String(100),
        index=True
    )

    incident_type = Column(
        String(100)
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )
