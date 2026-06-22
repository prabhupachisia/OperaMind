from services.ocr_service import extract_text_from_image_file


class ImageExtractor:

    def extract(self, file_path):
        return [{
            "page": 1,
            "text": extract_text_from_image_file(file_path)
        }]
