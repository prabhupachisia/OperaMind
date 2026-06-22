from flask import Blueprint
from flask import jsonify

from extensions import SessionLocal
from services.graph_service import get_graph

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