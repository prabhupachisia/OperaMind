import os
import uuid

from flask import Blueprint
from flask import request
from flask import jsonify

from services.pdf_service import extract_text_from_pdf
from services.chunking_service import chunk_text

upload_bp = Blueprint(
    "upload",
    __name__
)

UPLOAD_FOLDER = "uploads"

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

    filename = f"{uuid.uuid4()}.pdf"

    path = os.path.join(
        UPLOAD_FOLDER,
        filename
    )

    file.save(path)

    text = extract_text_from_pdf(path)

    chunks = chunk_text(text)

    return jsonify({
        "filename": filename,
        "text_length": len(text),
        "chunk_count": len(chunks)
    })