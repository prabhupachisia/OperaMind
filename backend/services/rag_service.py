from services.groq_service import client
from services.retrieval_service import retrieve_documents
from prompts.rag_prompt import RAG_PROMPT


class RAGService:

    @staticmethod
    def build_context(documents):

        context_parts = []

        for index, doc in enumerate(documents, start=1):

            context_parts.append(
                f"""
Document {index}

Source:
{doc.get("source", "Unknown")}

Page:
{doc.get("page", "N/A")}

Content:
{doc.get("text", "")}
"""
            )

        return "\n\n".join(context_parts)

    @staticmethod
    def generate_answer(query: str):

        documents = retrieve_documents(
            query=query,
            top_k=5
        )

        if not documents:
            return {
                "answer": (
                    "No relevant information found "
                    "in the knowledge base."
                ),
                "sources": [],
                "confidence": 0
            }

        context = RAGService.build_context(
            documents
        )

        # Placeholder for future graph retrieval
        graph_context = ""

        full_context = f"""
VECTOR CONTEXT:
{context}

GRAPH CONTEXT:
{graph_context}
"""

        prompt = RAG_PROMPT.format(
            context=full_context,
            query=query
        )

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are OperaMind, an Industrial "
                        "Knowledge Intelligence Assistant."
                    )
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.2,
            max_tokens=1000
        )

        sources = sorted(
            {
                doc.get("source")
                for doc in documents
                if doc.get("source")
            }
        )

        confidence = round(
            sum(
                doc.get("score", 0)
                for doc in documents
            ) / len(documents),
            2
        )

        return {
            "answer": response.choices[0].message.content,
            "sources": sources,
            "confidence": confidence
        }