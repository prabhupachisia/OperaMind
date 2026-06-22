from flask import Blueprint
from flask import jsonify

from sqlalchemy import func

from extensions import SessionLocal
from models.document import Document
from models.document_chunk import DocumentChunk
from models.graph_relation import GraphRelation

history_bp = Blueprint(
    "history",
    __name__
)


@history_bp.route("/", methods=["GET"])
def list_history():
    db = SessionLocal()
    try:
        documents = db.query(Document).order_by(Document.uploaded_at.desc()).all()
        history = []

        for document in documents:
            chunk_count = db.query(func.count(DocumentChunk.id)).filter(
                DocumentChunk.document_id == document.id
            ).scalar()

            graph_relations = db.query(GraphRelation).filter(
                GraphRelation.document_id == document.id
            ).all()

            node_set = set()
            for rel in graph_relations:
                node_set.add(rel.source)
                node_set.add(rel.target)

            history.append({
                "document_id": document.id,
                "filename": document.filename,
                "original_filename": document.original_filename,
                "document_type": document.document_type,
                "uploaded_at": document.uploaded_at.isoformat() if document.uploaded_at else None,
                "chunk_count": chunk_count or 0,
                "graph_nodes": len(node_set),
                "graph_edges": len(graph_relations)
            })

        return jsonify({"documents": history})
    finally:
        db.close()
