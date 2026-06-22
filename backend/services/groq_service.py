from config import GROQ_API_KEY

client = None


def get_groq_client():
    global client

    if not GROQ_API_KEY:
        return None

    if client is None:
        try:
            from groq import Groq
        except ImportError:
            return None

        client = Groq(
            api_key=GROQ_API_KEY
        )

    return client
