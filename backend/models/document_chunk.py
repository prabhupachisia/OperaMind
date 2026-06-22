from extensions import db
from datetime import datetime
import uuid


class DocumentChunk(db.Model):

    __tablename__ = "document_chunks"

    id = db.Column(
        db.String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )

    document_id = db.Column(
        db.String(36),
        db.ForeignKey("documents.id"),
        nullable=False
    )

    chunk_index = db.Column(
        db.Integer,
        nullable=False
    )

    page = db.Column(
        db.Integer
    )

    text = db.Column(
        db.Text,
        nullable=False
    )

    pinecone_id = db.Column(
        db.String(255)
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )