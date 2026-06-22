from flask import Blueprint
from flask import request
from flask import jsonify
from werkzeug.utils import secure_filename

import os
import uuid

from config import UPLOAD_FOLDER
from extensions import SessionLocal
from services.extractors.extractor_factory import get_extractor
from services.ingestion_service import process_document

upload_bp = Blueprint(
    "upload",
    __name__
)

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)


@upload_bp.route(
    "",
    methods=["POST"],
    strict_slashes=False
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

    original_filename = secure_filename(file.filename)

    extension = os.path.splitext(
        original_filename
    )[1]

    filename = f"{uuid.uuid4()}{extension}"

    file_path = os.path.join(
        UPLOAD_FOLDER,
        filename
    )

    file.save(file_path)

    document_type = request.form.get("document_type", "unknown")

    try:
        extractor = get_extractor(file_path)
        pages = extractor.extract(file_path)

        if not pages or not any(page.get("text", "").strip() for page in pages):
            return jsonify({"error": "Unable to extract text from the uploaded file."}), 400

        db = SessionLocal()
        result = process_document(
            filename=filename,
            original_filename=original_filename,
            pages=pages,
            document_type=document_type,
            db=db
        )
        return jsonify({
            "message": "Document processed successfully",
            "filename": filename,
            **result
        }), 200
    except ValueError as error:
        if "db" in locals():
            db.rollback()
        return jsonify({"error": str(error)}), 400
    except Exception as error:
        if "db" in locals():
            db.rollback()
        return jsonify({"error": "Document ingestion failed.", "details": str(error)}), 500
    finally:
        if "db" in locals():
            db.close()
