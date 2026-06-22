from models.document import Document
from models.document_chunk import DocumentChunk

from services.graph_service import (
    generate_graph,
    save_graph
)

from services.embedding_service import (
    get_embeddings
)

from services.pinecone_service import (
    upsert_chunks
)

from services.chunking_service import (
    chunk_text
)


def process_document(
    *,
    filename: str,
    original_filename: str,
    pages: list[dict],
    db,
    document_type: str = "unknown"
):
    """
    Complete ingestion pipeline

    1. Save document
    2. Chunk document
    3. Save chunks
    4. Generate embeddings
    5. Store in Pinecone
    6. Generate graph
    7. Save graph
    """

    # --------------------------------------------------
    # Save Document
    # --------------------------------------------------

    document = Document(
        filename=filename,
        original_filename=original_filename,
        document_type=document_type
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    # --------------------------------------------------
    # Chunk Document
    # --------------------------------------------------

    chunks = chunk_text(pages)

    saved_chunks = []

    for index, chunk in enumerate(chunks):

        chunk_text_content = (
            chunk["text"]
            if isinstance(chunk, dict)
            else chunk
        )

        page = (
            chunk.get("page")
            if isinstance(chunk, dict)
            else None
        )

        chunk_obj = DocumentChunk(
            document_id=document.id,
            chunk_index=index,
            page=page,
            text=chunk_text_content
        )

        db.add(chunk_obj)
        saved_chunks.append(chunk_obj)

    db.commit()

    for chunk in saved_chunks:
        db.refresh(chunk)

    # --------------------------------------------------
    # Embeddings
    # --------------------------------------------------

    chunk_texts = [
        chunk.text
        for chunk in saved_chunks
    ]

    embeddings = get_embeddings(
        chunk_texts
    )

    # --------------------------------------------------
    # Pinecone
    # --------------------------------------------------

    vectors = []

    for chunk, embedding in zip(
        saved_chunks,
        embeddings
    ):

        vectors.append({
            "id": str(chunk.id),
            "values": embedding,
            "metadata": {
                "document_id": str(document.id),
                "chunk_id": str(chunk.id),
                "source": original_filename,
                "document_type": document_type,
                "page": chunk.page,
                "text": chunk.text
            }
        })

    if vectors:
        upsert_chunks(vectors)

    # --------------------------------------------------
    # Graph Generation
    # --------------------------------------------------

    document_text = "\n\n".join(
        page.get("text", "") for page in pages
    )

    graph_data = generate_graph(
        document_text
    )

    save_graph(
        graph_data=graph_data,
        document_id=document.id,
        db=db
    )

    # --------------------------------------------------
    # Return Summary
    # --------------------------------------------------

    return {
        "document_id": document.id,
        "filename": filename,
        "original_filename": original_filename,
        "document_type": document_type,
        "chunk_count": len(saved_chunks),
        "graph_nodes": len(
            graph_data.get("nodes", [])
        ),
        "graph_edges": len(
            graph_data.get("edges", [])
        )
    }