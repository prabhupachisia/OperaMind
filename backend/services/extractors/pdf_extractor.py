import fitz

try:
    import pytesseract
    from PIL import Image
except ImportError:
    pytesseract = None
    Image = None


class PDFExtractor:

    def extract(self, file_path):
        document = fitz.open(file_path)
        pages = []

        try:
            for page_num, page in enumerate(document):
                text = page.get_text().strip()

                if not text and pytesseract and Image:
                    pix = page.get_pixmap(alpha=False)
                    image = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                    try:
                        text = pytesseract.image_to_string(image)
                    except Exception:
                        text = ""

                pages.append({
                    "page": page_num + 1,
                    "text": text or ""
                })

        finally:
            document.close()

        return pages