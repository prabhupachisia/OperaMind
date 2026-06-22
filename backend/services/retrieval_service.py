from services.embedding_service import get_embedding
from services.pinecone_service import index, query_index



def retrieve_documents(
    query: str,
    top_k: int = 5
):

    query_embedding = get_embedding(query)

    results = query_index(
    embedding=query_embedding,
    top_k=top_k
)

    documents = []

    for match in results.matches:

        metadata = match.metadata or {}

        documents.append({
            "score": match.score,
            "text": metadata.get("text", ""),
            "source": metadata.get("source", "Unknown"),
            "page": metadata.get("page"),
            "document_type": metadata.get("document_type"),
            "chunk_id": metadata.get("chunk_id")
        })

    return documents