from services.embedding_service import get_embedding
from services.pinecone_service import index


def retrieve_documents(query: str, top_k: int = 5):

    query_embedding = get_embedding(query)

    results = index.query(
        vector=query_embedding,
        top_k=top_k,
        include_metadata=True
    )

    documents = []

    for match in results.matches:

        documents.append({
            "score": match.score,
            "text": match.metadata.get("text", ""),
            "source": match.metadata.get("source", "Unknown")
        })

    return documents