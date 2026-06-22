import uuid

from sqlalchemy import Column, String

from extensions import Base


class GraphRelation(Base):

    __tablename__ = "graph_relations"

    id = Column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )

    document_id = Column(
        String(36),
        nullable=False,
        index=True
    )

    source = Column(
        String(255),
        nullable=False
    )

    relation = Column(
        String(255),
        nullable=False
    )

    target = Column(
        String(255),
        nullable=False
    )