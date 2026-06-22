import json


class JSONExtractor:

    def extract(self, file_path):
        with open(file_path, "r", encoding="utf-8", errors="ignore") as file:
            data = json.load(file)

        return [{
            "page": 1,
            "text": json.dumps(data, indent=2, ensure_ascii=False)
        }]
