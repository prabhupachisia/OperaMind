from flask import Blueprint
from flask import request
from flask import jsonify

import os
import uuid

from config import UPLOAD_FOLDER
from services.document_processor import process_document

upload_bp = Blueprint(
    "upload",
    __name__
)

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)


@upload_bp.route(
    "/",
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

    extension = os.path.splitext(
        file.filename
    )[1]

    filename = f"{uuid.uuid4()}{extension}"

    file_path = os.path.join(
        UPLOAD_FOLDER,
        filename
    )

    file.save(file_path)

    result = process_document(
        file_path=file_path
    )

    return jsonify({
        "message": "Document processed successfully",
        "filename": filename,
        **result
    }), 200