from services.groq_service import client
from services.retrieval_service import retrieve_documents


class RAGService:

    @staticmethod
    def build_context(documents):

        context_parts = []

        for doc in documents:

            context_parts.append(
                f"""
Source:
{doc["source"]}

Content:
{doc["text"]}
"""
            )

        return "\n".join(context_parts)

    @staticmethod
    def generate_answer(query: str):

        documents = retrieve_documents(
            query=query,
            top_k=5
        )

        if not documents:
            return {
                "answer": "No relevant information found in the knowledge base.",
                "sources": []
            }

        context = RAGService.build_context(
            documents
        )

        prompt = f"""
You are OperaMind.

Answer ONLY using the provided context.

If the answer is not present in the context, say:

"I could not find that information in the knowledge base."

CONTEXT:
{context}

QUESTION:
{query}

Provide a clear answer and mention the sources used.
"""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You are OperaMind, a helpful enterprise knowledge assistant."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.2,
            max_tokens=1000
        )

        return {
            "answer": response.choices[0].message.content,
            "sources": list(
                {
                    doc["source"]
                    for doc in documents
                }
            )
        }