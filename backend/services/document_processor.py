from services.extractors.extractor_factory import get_extractor
from services.chunking_service import chunk_text


def process_document(file_path):

    extractor = get_extractor(file_path)

    pages = extractor.extract(file_path)

    text = "\n".join(
        page["text"]
        for page in pages
    )

    if not text.strip():
        raise ValueError(
            "Could not extract text"
        )

    chunks = chunk_text(text)

    return {
        "pages": pages,
        "text_length": len(text),
        "chunk_count": len(chunks),
        "sample_chunk": (
            chunks[0]
            if chunks
            else None
        )
    }