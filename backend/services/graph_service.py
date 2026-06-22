import json
import re
from pathlib import Path

from models.graph_relation import GraphRelation
from services.groq_service import get_groq_client

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
    nodes = []
    edges = []
    relationships = []

    if graph_data.get("nodes") is not None and graph_data.get("edges") is not None:
        for node in graph_data.get("nodes", []):
            if isinstance(node, dict):
                node_id = normalize_text(node.get("id", node.get("label", "")))
                label = normalize_text(node.get("label", node.get("id", "")))
                node_type = node.get("type", "entity")
            else:
                node_id = normalize_text(str(node))
                label = node_id
                node_type = "entity"

            if node_id:
                nodes.append({"id": node_id, "label": label, "type": node_type})

        for idx, edge in enumerate(graph_data.get("edges", [])):
            if not isinstance(edge, dict):
                continue

            source = normalize_text(edge.get("source", ""))
            target = normalize_text(edge.get("target", ""))
            label = normalize_relation(edge.get("label", ""))

            if not source or not target:
                continue

            edges.append({
                "id": f"edge-{idx}-{re.sub(r'\s+', '_', source)}-{re.sub(r'\s+', '_', target)}",
                "source": source,
                "target": target,
                "label": label,
                "type": edge.get("type", "smoothstep")
            })

        relationships = [
            {
                "source": normalize_text(rel.get("source", "")),
                "relation": normalize_relation(rel.get("relation", rel.get("label", ""))),
                "target": normalize_text(rel.get("target", ""))
            }
            for rel in graph_data.get("relationships", [])
            if isinstance(rel, dict)
        ]

        return {"nodes": nodes, "edges": edges, "relationships": relationships}

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

    for idx, rel in enumerate(relationships):
        edges.append({
            "id": f"edge-{idx}-{re.sub(r'\s+', '_', rel['source'])}-{re.sub(r'\s+', '_', rel['target'])}",
            "source": rel["source"],
            "target": rel["target"],
            "label": rel["relation"],
            "type": "smoothstep"
        })

    return {"nodes": nodes, "edges": edges, "relationships": relationships}


def generate_heuristic_graph(document_text: str):
    equipment_pattern = r"\b([A-Z][A-Za-z0-9\-\/]{2,})(?:\s+[A-Z][A-Za-z0-9\-\/]{2,})*\b"
    issue_pattern = r"\b(failure|failed|leak|wear|overheating|inspection|maintenance|repair|audit|incident|shutdown|fault|breakdown|trip|hazard|leakage)\b"

    entities = []
    relationships = []

    for match in re.finditer(equipment_pattern, document_text):
        entity = normalize_text(match.group(0))
        if entity and entity not in entities and len(entity) > 2:
            entities.append(entity)

    if not entities:
        entities = [normalize_text(token) for token in re.findall(r"\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2}\b", document_text)][:10]

    sentences = re.split(r"(?<=[.!?])\s+", document_text)

    for sentence in sentences:
        sentence_entities = [normalize_text(m.group(0)) for m in re.finditer(equipment_pattern, sentence)]
        sentence_issues = re.findall(issue_pattern, sentence, flags=re.IGNORECASE)

        if sentence_entities and sentence_issues:
            source = sentence_entities[0]
            target = normalize_text(sentence_issues[0].title())
            relation = "REFERENCED_WITH"

            if re.search(r"fail|failure", sentence, flags=re.IGNORECASE):
                relation = "FAILED_DUE_TO"
            elif re.search(r"inspect|audit", sentence, flags=re.IGNORECASE):
                relation = "INSPECTED_FOR"
            elif re.search(r"maint|repair", sentence, flags=re.IGNORECASE):
                relation = "HAS_MAINTENANCE_ACTIVITY"
            elif re.search(r"overheat|shutdown|trip", sentence, flags=re.IGNORECASE):
                relation = "IMPACTS_OPERATION"

            relationships.append({
                "source": source,
                "relation": relation,
                "target": target
            })
            continue

        if len(sentence_entities) >= 2:
            for i in range(len(sentence_entities) - 1):
                relationships.append({
                    "source": sentence_entities[i],
                    "relation": "RELATED_TO",
                    "target": sentence_entities[i + 1]
                })

    if not relationships and len(entities) >= 2:
        for i in range(min(3, len(entities) - 1)):
            relationships.append({
                "source": entities[i],
                "relation": "RELATED_TO",
                "target": entities[i + 1]
            })

    if not entities and document_text.strip():
        entities = list({normalize_text(token) for token in re.findall(r"\b[A-Z][a-z]+\b", document_text)})[:8]

    return build_graph_response({
        "entities": entities,
        "relationships": relationships
    })


def generate_graph(document_text: str):
    client = get_groq_client()

    if client is None:
        return generate_heuristic_graph(document_text)

    prompt = load_graph_prompt(document_text)

    try:
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

        graph_response = build_graph_response(raw_graph)
        if not graph_response["nodes"] and not graph_response["edges"]:
            return generate_heuristic_graph(document_text)

        return graph_response
    except Exception:
        return generate_heuristic_graph(document_text)


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
