from services.extractors.extractor_factory import (get_extractor)
from services.chunking_service import chunk_text


def process_document(file_path):

    extractor = get_extractor(file_path)

    text = extractor.extract(file_path)

    if not text.strip():
        raise ValueError(
            "Could not extract text"
        )

    chunks = chunk_text(text)

    return {
        "text_length": len(text),
        "chunk_count": len(chunks),
        "sample_chunk": (
            chunks[0]
            if chunks
            else None
        )
    }