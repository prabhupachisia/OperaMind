import fitz

from services.ocr_service import extract_text_from_image
from services.ocr_service import image_from_bytes


class PDFExtractor:

    def extract(self, file_path):
        document = fitz.open(file_path)
        pages = []

        try:
            for page_num, page in enumerate(document):
                text = page.get_text().strip()

                if not text:
                    pix = page.get_pixmap(alpha=False)
                    image = image_from_bytes("RGB", [pix.width, pix.height], pix.samples)
                    text = extract_text_from_image(image)

                pages.append({
                    "page": page_num + 1,
                    "text": text or ""
                })

        finally:
            document.close()

        return pages
