from sentence_transformers import SentenceTransformer
import os

model = SentenceTransformer(
    os.getenv(
        "EMBEDDING_MODEL",
        "sentence-transformers/all-MiniLM-L6-v2"
    )
)

def get_embedding(text: str):
    return model.encode(
        text,
        normalize_embeddings=True
    ).tolist()


def get_embeddings(texts: list[str]):
    return model.encode(
        texts,
        normalize_embeddings=True
    ).tolist()