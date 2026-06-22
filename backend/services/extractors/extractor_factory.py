from pathlib import Path

from services.extractors.pdf_extractor import PDFExtractor


def get_extractor(file_path):

    ext = Path(file_path).suffix.lower()

    if ext == ".pdf":
        return PDFExtractor()

    elif ext == ".csv":
        from services.extractors.csv_extractor import CSVExtractor
        return CSVExtractor()

    elif ext == ".json":
        from services.extractors.json_extractor import JSONExtractor
        return JSONExtractor()

    elif ext == ".txt":
        from services.extractors.text_extractor import TextExtractor
        return TextExtractor()

    raise ValueError(f"Unsupported file type: {ext}")