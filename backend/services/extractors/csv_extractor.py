import csv


class CSVExtractor:

    def extract(self, file_path):
        rows = []

        with open(file_path, "r", encoding="utf-8", errors="ignore", newline="") as file:
            reader = csv.DictReader(file)

            if reader.fieldnames:
                for row_index, row in enumerate(reader, start=1):
                    values = [
                        f"{key}: {value}"
                        for key, value in row.items()
                        if value not in (None, "")
                    ]
                    rows.append(f"Row {row_index}: " + "; ".join(values))
            else:
                file.seek(0)
                plain_reader = csv.reader(file)
                for row_index, row in enumerate(plain_reader, start=1):
                    rows.append(f"Row {row_index}: " + "; ".join(row))

        return [{
            "page": 1,
            "text": "\n".join(rows)
        }]
