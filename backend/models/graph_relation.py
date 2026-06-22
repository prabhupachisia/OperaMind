from sqlalchemy import Column, Integer, String

from extensions import Base


class GraphRelation(Base):

    __tablename__ = "graph_relations"

    id = Column(
        Integer,
        primary_key=True,
        autoincrement=True
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

    source_type = Column(
        String(100),
        default="Entity"
    )

    relation = Column(
        String(255),
        nullable=False
    )

    target = Column(
        String(255),
        nullable=False
    )

    target_type = Column(
        String(100),
        default="Entity"
    )
