import re

from models.document import Document
from models.document_chunk import DocumentChunk
from services.retrieval_service import retrieve_documents

INCIDENT_TERMS = [
    "failure",
    "failed",
    "incident",
    "leak",
    "trip",
    "shutdown",
    "overheating",
    "wear",
    "fault",
    "breakdown"
]


def extract_incident_candidates(db):
    rows = (
        db.query(DocumentChunk, Document)
        .join(Document, DocumentChunk.document_id == Document.id)
        .all()
    )

    incidents = []

    for chunk, document in rows:
        text_lower = chunk.text.lower()

        if not any(term in text_lower for term in INCIDENT_TERMS):
            continue

        asset_match = re.search(r"\b[A-Z]{1,4}\d{2,4}\b", chunk.text)
        incident_type = next(
            (term for term in INCIDENT_TERMS if term in text_lower),
            "incident"
        )

        incidents.append({
            "document_id": document.id,
            "source": document.original_filename,
            "page": chunk.page,
            "asset_tag": asset_match.group(0) if asset_match else None,
            "incident_type": incident_type,
            "summary": chunk.text[:500],
            "chunk_id": chunk.id
        })

    return incidents


def find_similar_incidents(query: str, top_k: int = 5):
    documents = retrieve_documents(
        query=query,
        top_k=top_k
    )

    return {
        "query": query,
        "incidents": [
            {
                "score": doc.get("score", 0),
                "document_id": doc.get("document_id"),
                "source": doc.get("source"),
                "page": doc.get("page"),
                "summary": doc.get("text", "")[:500],
                "chunk_id": doc.get("chunk_id")
            }
            for doc in documents
        ]
    }
