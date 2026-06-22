from flask import Blueprint, jsonify, request

from extensions import SessionLocal
from services.incident_service import extract_incident_candidates, find_similar_incidents

incidents_bp = Blueprint(
    "incidents",
    __name__
)


@incidents_bp.route("", methods=["GET"], strict_slashes=False)
def list_incidents():
    db = SessionLocal()

    try:
        return jsonify({
            "incidents": extract_incident_candidates(db)
        })
    finally:
        db.close()


@incidents_bp.route("/similar", methods=["POST"], strict_slashes=False)
def similar_incidents():
    payload = request.get_json(silent=True) or {}
    query = payload.get("query", "").strip()
    top_k = int(payload.get("top_k", 5))

    if not query:
        return jsonify({
            "error": "query is required"
        }), 400

    return jsonify(
        find_similar_incidents(
            query=query,
            top_k=top_k
        )
    )
