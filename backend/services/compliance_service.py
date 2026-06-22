from models.document import Document
from models.document_chunk import DocumentChunk


COMPLIANCE_CHECKS = [
    {
        "id": "safety_procedure",
        "label": "Safety procedure documented",
        "terms": ["safety", "procedure", "ppe", "lockout", "tagout", "hazard"]
    },
    {
        "id": "inspection_record",
        "label": "Inspection records available",
        "terms": ["inspection", "inspected", "audit", "checklist", "record"]
    },
    {
        "id": "maintenance_action",
        "label": "Maintenance actions captured",
        "terms": ["maintenance", "repair", "corrective", "preventive", "action"]
    },
    {
        "id": "evidence_reference",
        "label": "Evidence or reference available",
        "terms": ["evidence", "reference", "manual", "standard", "regulation", "iso", "osha"]
    }
]


def analyze_compliance(db, document_id=None):
    query = db.query(DocumentChunk, Document).join(
        Document,
        DocumentChunk.document_id == Document.id
    )

    if document_id:
        query = query.filter(Document.id == document_id)

    rows = query.all()
    combined_text = "\n".join(chunk.text for chunk, _document in rows).lower()

    checks = []
    gaps = []

    for check in COMPLIANCE_CHECKS:
        matched_terms = [
            term for term in check["terms"]
            if term in combined_text
        ]
        passed = bool(matched_terms)

        item = {
            "id": check["id"],
            "label": check["label"],
            "passed": passed,
            "matched_terms": matched_terms
        }
        checks.append(item)

        if not passed:
            gaps.append({
                "id": check["id"],
                "label": check["label"],
                "recommendation": f"Upload or reference documentation for: {check['label']}."
            })

    evidence = []

    for chunk, document in rows[:20]:
        text_lower = chunk.text.lower()
        matched = [
            check["label"]
            for check in COMPLIANCE_CHECKS
            if any(term in text_lower for term in check["terms"])
        ]

        if matched:
            evidence.append({
                "document_id": document.id,
                "source": document.original_filename,
                "page": chunk.page,
                "matched_checks": matched,
                "snippet": chunk.text[:350]
            })

    score = 0

    if checks:
        score = round(
            sum(1 for check in checks if check["passed"]) / len(checks),
            2
        )

    return {
        "score": score,
        "checks": checks,
        "gaps": gaps,
        "evidence": evidence
    }
