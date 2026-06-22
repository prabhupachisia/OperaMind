import os

MODEL_NAME = os.getenv(
    "EMBEDDING_MODEL",
    "sentence-transformers/all-MiniLM-L6-v2"
)

model = None


def get_model():
    global model

    if model is None:
        from sentence_transformers import SentenceTransformer

        model = SentenceTransformer(MODEL_NAME)

    return model


def get_embedding(text: str):
    """
    Generate embedding for a single text.
    """

    if not text or not text.strip():
        raise ValueError("Cannot generate embedding for empty text")

    embedding = get_model().encode(
        text,
        normalize_embeddings=True,
        convert_to_numpy=True
    )

    return embedding.tolist()


def get_embeddings(texts: list[str]):
    """
    Generate embeddings for multiple texts.
    """

    if not texts:
        return []

    cleaned_texts = [
        text.strip()
        for text in texts
        if text and text.strip()
    ]

    if not cleaned_texts:
        return []

    embeddings = get_model().encode(
        cleaned_texts,
        normalize_embeddings=True,
        convert_to_numpy=True,
        batch_size=32,
        show_progress_bar=False
    )

    return embeddings.tolist()


def embed_chunks(chunks):
    """
    Generates embeddings for chunk objects.

    Input:
    [
        {
            "chunk_id": 1,
            "text": "..."
        }
    ]

    Output:
    [
        {
            "chunk_id": 1,
            "text": "...",
            "embedding": [...]
        }
    ]
    """

    if not chunks:
        return []

    texts = [
        chunk["text"]
        for chunk in chunks
    ]

    embeddings = get_embeddings(texts)

    results = []

    for chunk, embedding in zip(
        chunks,
        embeddings
    ):
        results.append({
            **chunk,
            "embedding": embedding
        })

    return results
