import json

from models.graph_relation import GraphRelation
from services.groq_service import client


def generate_graph(document_text: str):

    prompt = f"""
You are an industrial knowledge graph extraction system.

Extract entities and relationships.

Return ONLY valid JSON.

Example:

{{
  "entities": [
    "Pump P101",
    "Seal Failure",
    "Unit A"
  ],
  "relationships": [
    {{
      "source": "Pump P101",
      "relation": "FAILED_DUE_TO",
      "target": "Seal Failure"
    }}
  ]
}}

Document:
{document_text}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0
    )

    content = response.choices[0].message.content

    try:
        return json.loads(content)
    except Exception:
        print(content)
        raise Exception("Failed to parse graph JSON")


def save_graph(graph_data, db):

    relationships = graph_data.get(
        "relationships",
        []
    )

    for rel in relationships:

        relation = GraphRelation(
            source=rel["source"],
            relation=rel["relation"],
            target=rel["target"]
        )

        db.add(relation)

    db.commit()


def get_graph(db):

    relations = db.query(
        GraphRelation
    ).all()

    node_set = set()

    edges = []

    for rel in relations:

        node_set.add(rel.source)
        node_set.add(rel.target)

        edges.append({
            "source": rel.source,
            "target": rel.target,
            "label": rel.relation
        })

    nodes = []

    for node in node_set:

        nodes.append({
            "id": node,
            "label": node
        })

    return {
        "nodes": nodes,
        "edges": edges
    }