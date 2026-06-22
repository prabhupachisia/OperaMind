from services.groq_service import client
from services.pinecone_service import index
from sentence_transformers import SentenceTransformer
import os

model = SentenceTransformer(
    os.getenv(
        "EMBEDDING_MODEL",
        "sentence-transformers/all-MiniLM-L6-v2"
    )
)


class RAGService:

    @staticmethod
    def retrieve(query: str):

        query_embedding = model.encode(
            query
        ).tolist()

        results = index.query(
            vector=query_embedding,
            top_k=5,
            include_metadata=True
        )

        documents = []

        for match in results.matches:

            documents.append({
                "text": match.metadata.get(
                    "text",
                    ""
                ),
                "source": match.metadata.get(
                    "source",
                    "Unknown"
                ),
                "score": match.score
            })

        return documents

    @staticmethod
    def build_context(documents):

        context = ""

        for doc in documents:

            context += f"""

Source:
{doc["source"]}

Content:
{doc["text"]}

"""

        return context

    @staticmethod
    def generate_answer(query: str):

        documents = RAGService.retrieve(
            query
        )

        context = RAGService.build_context(
            documents
        )

        prompt = f"""
You are OperaMind.

Answer ONLY from the context.

If the answer is not present,
say:

I could not find that information
in the knowledge base.

CONTEXT:
{context}

QUESTION:
{query}
"""

        response = (
            client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.2
            )
        )

        return {
            "answer":
                response
                .choices[0]
                .message
                .content,
            "sources":
                list(
                    {
                        doc["source"]
                        for doc in documents
                    }
                )
        }