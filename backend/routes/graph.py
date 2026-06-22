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


@graph_bp.route("/", methods=["GET"])
def fetch_graph():
    db = SessionLocal()
    try:
        graph = get_graph(db)
        return jsonify(graph)
    finally:
        db.close()


@graph_bp.route("/", methods=["POST"])
def create_graph():
    payload = request.get_json(silent=True) or {}
    document_text = payload.get("text") or payload.get("document") or ""

    if not document_text.strip():
        return jsonify({"error": "No document text provided"}), 400

    db = SessionLocal()
    try:
        graph_data = generate_graph(document_text)
        save_graph(graph_data, db)
        graph = get_graph(db)
        return jsonify(graph)
    finally:
        db.close()


@graph_bp.route("/", methods=["DELETE"])
def delete_graph():
    db = SessionLocal()
    try:
        clear_graph(db)
        return jsonify({"status": "cleared"})
    finally:
        db.close()