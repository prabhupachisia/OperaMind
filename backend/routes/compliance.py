from flask import Blueprint, jsonify, request

from extensions import SessionLocal
from services.compliance_service import analyze_compliance

compliance_bp = Blueprint(
    "compliance",
    __name__
)


@compliance_bp.route("", methods=["GET"], strict_slashes=False)
def compliance_report():
    document_id = request.args.get("document_id")
    db = SessionLocal()

    try:
        return jsonify(
            analyze_compliance(
                db,
                document_id=document_id
            )
        )
    finally:
        db.close()
