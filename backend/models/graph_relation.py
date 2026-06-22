from sqlalchemy import Column, Integer, String

from extensions import Base


class GraphRelation(Base):
    __tablename__ = "graph_relations"

    id = Column(Integer, primary_key=True)

    source = Column(String, nullable=False)
    relation = Column(String, nullable=False)
    target = Column(String, nullable=False)

    def __repr__(self):
        return f"{self.source} -[{self.relation}]-> {self.target}"