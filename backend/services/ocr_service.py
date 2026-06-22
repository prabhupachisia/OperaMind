try:
    import pytesseract
    from PIL import Image
except ImportError:
    pytesseract = None
    Image = None


def is_ocr_available():
    return pytesseract is not None and Image is not None


def image_from_bytes(mode, size, samples):
    if Image is None:
        return None

    return Image.frombytes(mode, size, samples)


def extract_text_from_image(image):
    if not is_ocr_available() or image is None:
        return ""

    try:
        return pytesseract.image_to_string(image).strip()
    except Exception:
        return ""


def extract_text_from_image_file(file_path):
    if not is_ocr_available():
        return ""

    try:
        with Image.open(file_path) as image:
            return extract_text_from_image(image)
    except Exception:
        return ""
