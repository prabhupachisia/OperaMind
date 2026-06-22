def chunk_text(
    pages,
    chunk_size=1000,
    overlap=200
):
    """Split page text into overlapping chunks for embeddings."""

    def split_text(text: str):
        text = text.strip()
        if not text:
            return []

        chunks = []
        start = 0
        text_length = len(text)
        step = max(chunk_size - overlap, 1)

        while start < text_length:
            end = min(start + chunk_size, text_length)
            chunk = text[start:end].strip()

            if chunk:
                chunks.append(chunk)

            if end >= text_length:
                break

            start += step

        return chunks

    chunks = []
    chunk_id = 0

    for page in pages:
        page_text = page.get("text", "")
        page_chunks = split_text(page_text)

        for chunk in page_chunks:
            chunks.append({
                "chunk_id": chunk_id,
                "page": page.get("page"),
                "text": chunk,
            })
            chunk_id += 1

    return chunks