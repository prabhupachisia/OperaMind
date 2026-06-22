from services.groq_service import client
from services.pinecone_service import index

print("Pinecone Connected")
print(index.describe_index_stats())

response = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[
        {
            "role": "user",
            "content": "Say hello"
        }
    ]
)

print(response.choices[0].message.content)