from config import (
    PINECONE_API_KEY,
    PINECONE_INDEX_NAME
)

pc = None
index = None


def get_index():
    global pc, index

    if not PINECONE_API_KEY or not PINECONE_INDEX_NAME:
        return None

    if index is None:
        try:
            from pinecone import Pinecone
        except ImportError:
            return None

        pc = Pinecone(
            api_key=PINECONE_API_KEY
        )
        index = pc.Index(
            PINECONE_INDEX_NAME
        )

    return index


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

    pinecone_index = get_index()

    if pinecone_index is None:
        return

    for start in range(
        0,
        len(vectors),
        batch_size
    ):

        batch = vectors[
            start:start + batch_size
        ]

        pinecone_index.upsert(
            vectors=batch
        )


def delete_document_chunks(
    document_id: str
):
    """
    Delete all chunks
    belonging to a document.
    """

    pinecone_index = get_index()

    if pinecone_index is None:
        return

    pinecone_index.delete(
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

    pinecone_index = get_index()

    if pinecone_index is None:
        return None

    return pinecone_index.query(
        **kwargs
    )


def fetch_chunk(
    chunk_id: str
):
    """
    Fetch single vector.
    """

    pinecone_index = get_index()

    if pinecone_index is None:
        return None

    return pinecone_index.fetch(
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

    pinecone_index = get_index()

    if pinecone_index is None:
        return None

    return pinecone_index.query(
        vector=[0.0] * 384,
        top_k=top_k,
        include_metadata=True,
        filter={
            "document_id": {
                "$eq": document_id
            }
        }
    )
