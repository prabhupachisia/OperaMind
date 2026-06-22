class TextExtractor:

    def extract(self, file_path):
        with open(file_path, "r", encoding="utf-8", errors="ignore") as file:
            text = file.read()

        return [{
            "page": 1,
            "text": text
        }]
