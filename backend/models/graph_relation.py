from extensions import db
import uuid


class GraphRelation(db.Model):

    __tablename__ = "graph_relations"

    id = db.Column(
        db.String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )

    document_id = db.Column(
        db.String(36),
        nullable=False,
        index=True
    )

    source = db.Column(
        db.String(255),
        nullable=False
    )

    relation = db.Column(
        db.String(255),
        nullable=False
    )

    target = db.Column(
        db.String(255),
        nullable=False
    )