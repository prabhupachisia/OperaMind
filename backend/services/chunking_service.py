from langchain_text_splitters import (
    RecursiveCharacterTextSplitter
)


def chunk_text(
    pages,
    chunk_size=1000,
    overlap=200
):

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=overlap,
        separators=[
            "\n\n",
            "\n",
            ". ",
            " ",
            ""
        ]
    )

    chunks = []

    chunk_id = 0

    for page in pages:

        page_chunks = splitter.split_text(
            page["text"]
        )

        for chunk in page_chunks:

            chunks.append({
                "chunk_id": chunk_id,
                "page": page["page"],
                "text": chunk
            })

            chunk_id += 1

    return chunks