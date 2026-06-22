from extensions import SessionLocal
from models.document import Document
from models.document_chunk import DocumentChunk
from services.embedding_service import get_embedding
from services.pinecone_service import query_index


def score_text(query: str, text: str):
    query_terms = {
        term.strip().lower()
        for term in query.split()
        if len(term.strip()) > 2
    }

    if not query_terms:
        return 0

    text_lower = text.lower()
    matches = sum(
        1 for term in query_terms
        if term in text_lower
    )

    return matches / len(query_terms)


def retrieve_documents_from_database(
    query: str,
    top_k: int = 5
):
    db = SessionLocal()

    try:
        rows = (
            db.query(DocumentChunk, Document)
            .join(Document, DocumentChunk.document_id == Document.id)
            .all()
        )

        documents = []

        for chunk, document in rows:
            score = score_text(query, chunk.text)

            if score <= 0:
                continue

            documents.append({
                "score": round(score, 3),
                "text": chunk.text,
                "source": document.original_filename,
                "page": chunk.page,
                "document_type": document.document_type,
                "chunk_id": chunk.id,
                "document_id": document.id
            })

        return sorted(
            documents,
            key=lambda item: item["score"],
            reverse=True
        )[:top_k]
    finally:
        db.close()


def retrieve_documents(
    query: str,
    top_k: int = 5
):
    try:
        query_embedding = get_embedding(query)
        results = query_index(
            embedding=query_embedding,
            top_k=top_k
        )
    except Exception:
        return retrieve_documents_from_database(
            query=query,
            top_k=top_k
        )

    if results is None:
        return retrieve_documents_from_database(
            query=query,
            top_k=top_k
        )

    documents = []

    for match in getattr(results, "matches", []):
        metadata = match.metadata or {}

        documents.append({
            "score": match.score,
            "text": metadata.get("text", ""),
            "source": metadata.get("source", "Unknown"),
            "page": metadata.get("page"),
            "document_type": metadata.get("document_type"),
            "chunk_id": metadata.get("chunk_id"),
            "document_id": metadata.get("document_id")
        })

    return documents
