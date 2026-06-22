from extensions import db
from datetime import datetime
import uuid

class Entity(db.Model):

    __tablename__ = "entities"

    id = db.Column(
        db.String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )

    name = db.Column(
        db.String(255),
        nullable=False
    )

    entity_type = db.Column(
        db.String(100),
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )