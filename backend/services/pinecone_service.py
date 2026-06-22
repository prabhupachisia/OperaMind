from pinecone import Pinecone

from config import (
    PINECONE_API_KEY,
    PINECONE_INDEX_NAME
)

pc = Pinecone(
    api_key=PINECONE_API_KEY
)

index = pc.Index(
    PINECONE_INDEX_NAME
)


def upsert_chunks(
    vectors,
    batch_size=100
):
    """
    Upsert vectors into Pinecone.

    Expected format:

    [
        {
            "id": "...",
            "values": [...],
            "metadata": {...}
        }
    ]
    """

    if not vectors:
        return

    for start in range(
        0,
        len(vectors),
        batch_size
    ):

        batch = vectors[
            start:start + batch_size
        ]

        index.upsert(
            vectors=batch
        )


def delete_document_chunks(
    document_id: str
):
    """
    Delete all chunks
    belonging to a document.
    """

    index.delete(
        filter={
            "document_id": {
                "$eq": document_id
            }
        }
    )


def query_index(
    embedding,
    top_k=5,
    filter_metadata=None
):
    """
    Wrapper around Pinecone query.
    """

    kwargs = {
        "vector": embedding,
        "top_k": top_k,
        "include_metadata": True
    }

    if filter_metadata:
        kwargs["filter"] = filter_metadata

    return index.query(
        **kwargs
    )


def fetch_chunk(
    chunk_id: str
):
    """
    Fetch single vector.
    """

    return index.fetch(
        ids=[chunk_id]
    )


def get_document_chunks(
    document_id: str,
    top_k=1000
):
    """
    Retrieve all chunks
    for a document.
    """

    return index.query(
        vector=[0.0] * 384,
        top_k=top_k,
        include_metadata=True,
        filter={
            "document_id": {
                "$eq": document_id
            }
        }
    )