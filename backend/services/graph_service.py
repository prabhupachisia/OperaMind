import json
import re
from pathlib import Path

from models.graph_relation import GraphRelation
from services.groq_service import client

PROMPT_FILE = Path(__file__).resolve().parents[1] / "prompts" / "graph_generation.txt"


def load_graph_prompt(document_text: str):
    prompt_template = PROMPT_FILE.read_text(encoding="utf-8")
    return prompt_template.replace("{{document}}", document_text.strip())


def extract_json_object(content: str):
    start = content.find("{")
    if start == -1:
        raise ValueError("No JSON object found in model response")

    brace_depth = 0
    in_string = False
    escape = False

    for index, char in enumerate(content[start:], start=start):
        if char == '"' and not escape:
            in_string = not in_string
        if char == "\\" and in_string and not escape:
            escape = True
            continue
        if escape:
            escape = False

        if not in_string:
            if char == "{":
                brace_depth += 1
            elif char == "}":
                brace_depth -= 1
                if brace_depth == 0:
                    return content[start:index + 1]

    raise ValueError("Could not extract complete JSON object from model response")


def parse_graph_response(content: str):
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        json_text = extract_json_object(content)
        return json.loads(json_text)


def normalize_text(value: str):
    return " ".join(value.strip().split())


def normalize_relation(value: str):
    cleaned = normalize_text(value)
    cleaned = re.sub(r"[^A-Za-z0-9 ]+", " ", cleaned)
    return re.sub(r"\s+", "_", cleaned).strip("_").upper()


def build_graph_response(graph_data):
    entities = [normalize_text(entity) for entity in graph_data.get("entities", []) if normalize_text(entity)]
    relationships = []

    for rel in graph_data.get("relationships", []):
        source = normalize_text(rel.get("source", ""))
        relation = normalize_relation(rel.get("relation", ""))
        target = normalize_text(rel.get("target", ""))

        if not source or not relation or not target:
            continue

        relationships.append({
            "source": source,
            "relation": relation,
            "target": target
        })

        if source not in entities:
            entities.append(source)
        if target not in entities:
            entities.append(target)

    nodes = [{"id": entity, "label": entity, "type": "entity"} for entity in entities]

    edges = []
    for idx, rel in enumerate(relationships):
        edges.append({
            "id": f"edge-{idx}-{re.sub(r'\s+', '_', rel['source'])}-{re.sub(r'\s+', '_', rel['target'])}",
            "source": rel["source"],
            "target": rel["target"],
            "label": rel["relation"],
            "type": "smoothstep"
        })

    return {"nodes": nodes, "edges": edges, "relationships": relationships}


def generate_graph(document_text: str):
    prompt = load_graph_prompt(document_text)

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
    raw_graph = parse_graph_response(content)

    if not isinstance(raw_graph, dict):
        raise ValueError("Graph extraction must return a JSON object")

    return build_graph_response(raw_graph)


def save_graph(
    graph_data,
    document_id,
    db
):
    relationships = graph_data.get(
        "relationships",
        []
    )

    for rel in relationships:

        source = rel["source"]
        relation = rel["relation"]
        target = rel["target"]

        existing = db.query(
            GraphRelation
        ).filter_by(
            document_id=document_id,
            source=source,
            relation=relation,
            target=target
        ).first()

        if existing is None:

            db.add(
                GraphRelation(
                    document_id=document_id,
                    source=source,
                    relation=relation,
                    target=target
                )
            )

    db.commit()


def clear_graph(db):
    db.query(GraphRelation).delete()
    db.commit()


def get_graph(
    db,
    document_id=None
):

    query = db.query(
        GraphRelation
    )

    if document_id:
        query = query.filter_by(
            document_id=document_id
        )

    relations = query.all()

    node_set = {}
    edges = []

    for rel in relations:

        source = normalize_text(
            rel.source
        )

        target = normalize_text(
            rel.target
        )

        if source not in node_set:
            node_set[source] = {
                "id": source,
                "label": source,
                "type": "entity"
            }

        if target not in node_set:
            node_set[target] = {
                "id": target,
                "label": target,
                "type": "entity"
            }

        edges.append({
            "id": (
                f"edge-{len(edges)}"
            ),
            "source": source,
            "target": target,
            "label": rel.relation,
            "type": "smoothstep"
        })

    return {
        "nodes": list(
            node_set.values()
        ),
        "edges": edges
    }

def get_entity_relations(
    entity_name,
    db
):

    relations = db.query(
        GraphRelation
    ).filter(
        (GraphRelation.source == entity_name)
        |
        (GraphRelation.target == entity_name)
    ).all()

    results = []

    for rel in relations:

        results.append({
            "source": rel.source,
            "relation": rel.relation,
            "target": rel.target
        })

    return results

def build_graph_context(
    entity_name,
    db
):

    relations = get_entity_relations(
        entity_name,
        db
    )

    if not relations:
        return ""

    lines = []

    for rel in relations:

        lines.append(
            f"{rel['source']} "
            f"{rel['relation']} "
            f"{rel['target']}"
        )

    return "\n".join(lines)