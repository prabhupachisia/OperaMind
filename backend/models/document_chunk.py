from datetime import datetime
import uuid

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from extensions import Base


class DocumentChunk(Base):

    __tablename__ = "document_chunks"

    id = Column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )

    document_id = Column(
        String(36),
        ForeignKey("documents.id"),
        nullable=False
    )

    chunk_index = Column(
        Integer,
        nullable=False
    )

    page = Column(
        Integer
    )

    text = Column(
        Text,
        nullable=False
    )

    pinecone_id = Column(
        String(255)
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    document = relationship("Document", back_populates="chunks")