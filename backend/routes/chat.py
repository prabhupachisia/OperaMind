from flask import Blueprint, request, jsonify

from services.rag_service import RAGService

chat_bp = Blueprint(
    "chat",
    __name__
)


@chat_bp.route("/", methods=["POST"])
def chat():

    data = request.get_json()

    query = data.get("query")

    if not query:
        return jsonify({
            "error": "query is required"
        }), 400

    response = RAGService.generate_answer(
        query
    )

    return jsonify(response)