from flask import Blueprint
from flask import jsonify
from flask import request

from extensions import SessionLocal
from services.graph_service import clear_graph
from services.graph_service import generate_graph
from services.graph_service import get_graph
from services.graph_service import save_graph

graph_bp = Blueprint(
    "graph",
    __name__
)


@graph_bp.route("", methods=["GET"], strict_slashes=False)
def fetch_graph():
    document_id = request.args.get("document_id")
    db = SessionLocal()
    try:
        graph = get_graph(db, document_id=document_id) if document_id else get_graph(db)
        return jsonify(graph)
    finally:
        db.close()


@graph_bp.route("", methods=["POST"], strict_slashes=False)
def create_graph():
    payload = request.get_json(silent=True) or {}
    document_text = payload.get("text") or payload.get("document") or ""
    document_id = payload.get("document_id")

    if not document_text.strip():
        return jsonify({"error": "No document text provided"}), 400

    graph_data = generate_graph(document_text)

    if document_id:
        db = SessionLocal()
        try:
            save_graph(graph_data, document_id=document_id, db=db)
            graph = get_graph(db, document_id=document_id)
            return jsonify(graph)
        finally:
            db.close()

    return jsonify(graph_data)


@graph_bp.route("", methods=["DELETE"], strict_slashes=False)
def delete_graph():
    db = SessionLocal()
    try:
        clear_graph(db)
        return jsonify({"status": "cleared"})
    finally:
        db.close()