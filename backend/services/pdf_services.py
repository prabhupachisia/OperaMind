import fitz


def extract_text_from_pdf(file_path):
    """
    Extract text from PDF using PyMuPDF
    """

    document = fitz.open(file_path)

    text = ""

    for page in document:
        text += page.get_text()

    document.close()

    return text