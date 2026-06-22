from flask import Blueprint, request, jsonify

from services.rag_service import RAGService

chat_bp = Blueprint(
    "chat",
    __name__
)


@chat_bp.route("", methods=["POST"], strict_slashes=False)
def chat():

    data = request.get_json(silent=True) or {}

    query = data.get("query")

    if not query:
        return jsonify({
            "error": "query is required"
        }), 400

    try:
        response = RAGService.generate_answer(
            query
        )
    except Exception as error:
        return jsonify({
            "error": "Chat request failed.",
            "details": str(error)
        }), 500

    return jsonify(response)
