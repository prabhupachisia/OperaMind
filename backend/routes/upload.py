import os
import uuid
from config import UPLOAD_FOLDER
from flask import Blueprint
from flask import request
from flask import jsonify

from services.pdf_services import extract_text_from_pdf
from services.chunking_service import chunk_text

upload_bp = Blueprint(
    "upload",
    __name__
)

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)


@upload_bp.route(
    "/upload",
    methods=["POST"]
)
def upload_document():

    if "file" not in request.files:
        return jsonify({
            "error": "No file provided"
        }), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({
            "error": "No file selected"
        }), 400

    filename = f"{uuid.uuid4()}.pdf"

    file_path = os.path.join(
        UPLOAD_FOLDER,
        filename
    )

    file.save(file_path)

    text = extract_text_from_pdf(
        file_path
    )

    if not text.strip():
        return jsonify({
            "error": "Could not extract text from PDF"
        }), 400

    chunks = chunk_text(text)

    return jsonify({
        "message": "Document processed successfully",
        "filename": filename,
        "text_length": len(text),
        "chunk_count": len(chunks),
        "sample_chunk": chunks[0] if chunks else None
    }), 200