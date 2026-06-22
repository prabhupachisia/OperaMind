import fitz

class PDFExtractor:

    def extract(self, file_path):

        document = fitz.open(file_path)

        pages = []

        try:
            for page_num, page in enumerate(document):
                pages.append({
                    "page": page_num + 1,
                    "text": page.get_text()
                })

        finally:
            document.close()

        return pages