from pathlib import Path

from services.extractors.pdf_extractor import PDFExtractor


def get_extractor(file_path):

    extension = Path(file_path).suffix.lower()

    if extension == ".pdf":
        return PDFExtractor()

    raise ValueError(
        f"Unsupported file type: {extension}"
    )