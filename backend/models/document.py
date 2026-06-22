from extensions import db
from datetime import datetime
import uuid


class Document(db.Model):

    __tablename__ = "documents"

    id = db.Column(
        db.String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )

    filename = db.Column(
        db.String(255),
        nullable=False
    )

    original_filename = db.Column(
        db.String(255),
        nullable=False
    )

    document_type = db.Column(
        db.String(100)
    )

    uploaded_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    status = db.Column(
        db.String(50),
        default="processed"
    )

    chunks = db.relationship(
        "DocumentChunk",
        backref="document",
        lazy=True,
        cascade="all, delete-orphan"
    )