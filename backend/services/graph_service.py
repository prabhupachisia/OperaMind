import json
import re
from pathlib import Path

from sqlalchemy import inspect
from sqlalchemy import text

from models.document import Document
from models.document_chunk import DocumentChunk
from models.graph_relation import GraphRelation
from services.groq_service import get_groq_client

PROMPT_FILE = Path(__file__).resolve().parents[1] / "prompts" / "graph_generation.txt"

ENTITY_TYPES = {
    "Equipment",
    "Person",
    "WorkOrder",
    "Incident",
    "NearMiss",
    "Compliance",
    "OEM",
    "Procedure",
    "Inspection",
    "Location",
    "Document",
}

RELATION_TYPES = {
    "AUTHORED_BY",
    "MAINTAINED_BY",
    "MAINTAINED",
    "AFFECTED",
    "CONNECTED_TO",
    "COMPLIES_WITH",
    "MANUFACTURED_BY",
    "HAS_INCIDENT",
    "HAS_WORKORDER",
    "REPORTED_BY",
    "RELATED_TO",
    "REFERENCED_IN",
    "LOCATED_IN",
    "HAS_PROCEDURE",
    "HAS_INSPECTION",
}

MAX_GRAPH_FIELD_LENGTH = 255


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
        return json.loads(extract_json_object(content))


def normalize_text(value):
    return " ".join(str(value or "").strip().split())


def fit_graph_field(value):
    value = normalize_text(value)
    if len(value) <= MAX_GRAPH_FIELD_LENGTH:
        return value
    return value[:MAX_GRAPH_FIELD_LENGTH].rstrip()


def normalize_relation(value):
    cleaned = normalize_text(value)
    cleaned = re.sub(r"[^A-Za-z0-9 ]+", " ", cleaned)
    relation = re.sub(r"\s+", "_", cleaned).strip("_").upper()
    return relation if relation in RELATION_TYPES else relation or "RELATED_TO"


def normalize_entity_type(value):
    cleaned = normalize_text(value).replace("_", "")
    for entity_type in ENTITY_TYPES:
        if entity_type.lower() == cleaned.lower():
            return entity_type
    return "Entity"


def add_node(nodes_by_id, node_id, node_type="Entity", label=None):
    node_id = normalize_text(node_id)
    if not node_id:
        return

    node_type = normalize_entity_type(node_type)
    existing = nodes_by_id.get(node_id)

    if existing:
        if existing["type"] == "Entity" and node_type != "Entity":
            existing["type"] = node_type
            existing["group"] = node_type
        return

    nodes_by_id[node_id] = {
        "id": node_id,
        "label": normalize_text(label) or node_id,
        "type": node_type,
        "group": node_type
    }


def add_relationship(relationships, nodes_by_id, source, relation, target, source_type="Entity", target_type="Entity"):
    source = normalize_text(source)
    target = normalize_text(target)
    relation = normalize_relation(relation)

    if not source or not target or source == target:
        return

    source_type = normalize_entity_type(source_type)
    target_type = normalize_entity_type(target_type)

    add_node(nodes_by_id, source, source_type)
    add_node(nodes_by_id, target, target_type)

    relationship = {
        "source": source,
        "source_type": source_type,
        "relation": relation,
        "target": target,
        "target_type": target_type
    }

    for existing in relationships:
        if (
            existing["source"] == source
            and existing["relation"] == relation
            and existing["target"] == target
        ):
            if existing.get("source_type") == "Entity" and source_type != "Entity":
                existing["source_type"] = source_type
            if existing.get("target_type") == "Entity" and target_type != "Entity":
                existing["target_type"] = target_type
            return

    relationships.append(relationship)


def build_graph_response(graph_data):
    nodes_by_id = {}
    relationships = []

    for node in graph_data.get("nodes", []):
        if isinstance(node, dict):
            add_node(
                nodes_by_id,
                node.get("id") or node.get("label"),
                node.get("type") or node.get("group") or "Entity",
                node.get("label")
            )
        else:
            add_node(nodes_by_id, node, "Entity")

    for entity in graph_data.get("entities", []):
        if isinstance(entity, dict):
            add_node(
                nodes_by_id,
                entity.get("id") or entity.get("name") or entity.get("label"),
                entity.get("type") or "Entity",
                entity.get("label") or entity.get("name")
            )
        else:
            add_node(nodes_by_id, entity, "Entity")

    raw_relationships = list(graph_data.get("relationships", []))
    raw_relationships.extend(graph_data.get("edges", []))
    raw_relationships.extend(graph_data.get("links", []))

    for rel in raw_relationships:
        if not isinstance(rel, dict):
            continue

        source = rel.get("source")
        target = rel.get("target")
        relation = rel.get("relation") or rel.get("type") or rel.get("label")

        add_relationship(
            relationships,
            nodes_by_id,
            source,
            relation,
            target,
            rel.get("source_type") or rel.get("sourceType") or "Entity",
            rel.get("target_type") or rel.get("targetType") or "Entity"
        )

    edges = []
    links = []

    for idx, rel in enumerate(relationships):
        edge = {
            "id": f"edge-{idx}-{re.sub(r'\\s+', '_', rel['source'])}-{re.sub(r'\\s+', '_', rel['target'])}",
            "source": rel["source"],
            "target": rel["target"],
            "label": rel["relation"],
            "type": "smoothstep"
        }
        edges.append(edge)
        links.append({
            "source": rel["source"],
            "target": rel["target"],
            "label": rel["relation"]
        })

    graph = {
        "nodes": list(nodes_by_id.values()),
        "edges": edges,
        "links": links,
        "relationships": relationships
    }
    graph["node_details"] = build_node_details(graph)
    return graph


def collect_regex_entities(document_text: str):
    patterns = {
        "WorkOrder": [
            r"\bWO[-\s]?\d{3,8}\b",
            r"Work\s*Order\s*[:#-]?\s*([A-Z]{0,3}[-\s]?\d{3,8})"
        ],
        "Incident": [
            r"\bIR[-\s]?\d{4}[-\s]?\d{2,6}\b",
            r"Incident\s*[:#-]?\s*([A-Z]{0,3}[-\s]?\d{3,8}(?:[-\s]?\d{2,6})?)"
        ],
        "NearMiss": [
            r"\bNM[-\s]?\d{3,8}\b",
            r"Near\s*Miss\s*[:#-]?\s*([A-Z]{0,3}[-\s]?\d{3,8})"
        ],
        "Equipment": [
            r"Equipment\s*(?:Tag|ID)?\s*[:#-]?\s*([A-Z]{1,5}[-]?\d{2,5}[A-Z]?)",
            r"\b[A-Z]{1,5}[-]?\d{2,5}[A-Z]?\b"
        ],
        "Compliance": [
            r"\bISO\s?\d{3,5}\b",
            r"\bOSHA\s?\d{2,5}\b",
            r"\bOISD[-\s]?\d{2,5}\b",
            r"\bPESO\b",
            r"\bFactory Act\b"
        ],
        "OEM": [
            r"(?:OEM|Manufacturer|Manufactured By)\s*[:#-]?\s*([A-Z][A-Za-z0-9&.,\- ]{2,60})"
        ],
        "Person": [
            r"(?:Prepared By|Reported By|Engineer|Technician|Inspector)\s*[:#-]?\s*([A-Z][A-Za-z]+(?:[ \t]+[A-Z][A-Za-z]+){1,3})"
        ],
        "Procedure": [
            r"\bSOP[-\s]?\d{2,8}\b",
            r"(?:Procedure|Safety Procedure)\s*[:#-]?\s*([A-Z][A-Za-z0-9\- ]{2,80})"
        ],
        "Inspection": [
            r"\bINS[-\s]?\d{3,8}\b",
            r"(?:Inspection|Audit)\s*(?:Report)?\s*[:#-]?\s*([A-Z]{0,3}[-\s]?\d{3,8})"
        ],
        "Location": [
            r"(?:Location|Unit|Area)\s*[:#-]?\s*([A-Z][A-Za-z0-9\- ]{1,50})"
        ]
    }

    entities = []
    seen = set()

    for entity_type, entity_patterns in patterns.items():
        for pattern in entity_patterns:
            for match in re.finditer(pattern, document_text, flags=re.IGNORECASE):
                value = match.group(1) if match.groups() else match.group(0)
                value = normalize_text(value).rstrip(".,;:")

                if not value:
                    continue

                if entity_type == "Equipment" and re.match(r"^(WO|IR|NM|ISO)[-\s]?\d+", value, flags=re.IGNORECASE):
                    continue

                key = (value.upper(), entity_type)
                if key in seen:
                    continue

                seen.add(key)
                entities.append({
                    "id": value,
                    "type": entity_type
                })

    return entities


def infer_relationships(entities, document_text):
    relationships = []
    nodes_by_id = {}

    for entity in entities:
        add_node(nodes_by_id, entity["id"], entity["type"])

    by_type = {}
    for entity in entities:
        by_type.setdefault(entity["type"], []).append(entity["id"])

    equipment = by_type.get("Equipment", [])

    for equipment_id in equipment:
        for work_order in by_type.get("WorkOrder", []):
            add_relationship(relationships, nodes_by_id, work_order, "MAINTAINED", equipment_id, "WorkOrder", "Equipment")
        for incident in by_type.get("Incident", []):
            add_relationship(relationships, nodes_by_id, incident, "AFFECTED", equipment_id, "Incident", "Equipment")
            add_relationship(relationships, nodes_by_id, equipment_id, "HAS_INCIDENT", incident, "Equipment", "Incident")
        for compliance in by_type.get("Compliance", []):
            add_relationship(relationships, nodes_by_id, equipment_id, "COMPLIES_WITH", compliance, "Equipment", "Compliance")
        for oem in by_type.get("OEM", []):
            add_relationship(relationships, nodes_by_id, equipment_id, "MANUFACTURED_BY", oem, "Equipment", "OEM")
        for procedure in by_type.get("Procedure", []):
            add_relationship(relationships, nodes_by_id, equipment_id, "HAS_PROCEDURE", procedure, "Equipment", "Procedure")
        for inspection in by_type.get("Inspection", []):
            add_relationship(relationships, nodes_by_id, equipment_id, "HAS_INSPECTION", inspection, "Equipment", "Inspection")
        for location in by_type.get("Location", []):
            add_relationship(relationships, nodes_by_id, equipment_id, "LOCATED_IN", location, "Equipment", "Location")

    for person in by_type.get("Person", []):
        for work_order in by_type.get("WorkOrder", []):
            add_relationship(relationships, nodes_by_id, work_order, "AUTHORED_BY", person, "WorkOrder", "Person")
        for incident in by_type.get("Incident", []):
            add_relationship(relationships, nodes_by_id, incident, "REPORTED_BY", person, "Incident", "Person")

    sentences = re.split(r"(?<=[.!?])\s+", document_text)
    all_ids = [entity["id"] for entity in entities]

    for sentence in sentences:
        mentioned = [
            entity_id for entity_id in all_ids
            if entity_id.lower() in sentence.lower()
        ]
        if len(mentioned) < 2:
            continue

        source = mentioned[0]
        for target in mentioned[1:3]:
            source_type = nodes_by_id.get(source, {}).get("type", "Entity")
            target_type = nodes_by_id.get(target, {}).get("type", "Entity")
            add_relationship(relationships, nodes_by_id, source, "RELATED_TO", target, source_type, target_type)

    return {
        "nodes": list(nodes_by_id.values()),
        "relationships": relationships
    }


def generate_heuristic_graph(document_text: str, document_name=None):
    entities = collect_regex_entities(document_text)

    if document_name:
        entities.append({
            "id": document_name,
            "type": "Document"
        })

    graph_data = infer_relationships(entities, document_text)

    if document_name:
        nodes_by_id = {node["id"]: node for node in graph_data["nodes"]}
        relationships = graph_data["relationships"]
        add_node(nodes_by_id, document_name, "Document")

        for node in list(nodes_by_id.values()):
            if node["type"] != "Document":
                add_relationship(
                    relationships,
                    nodes_by_id,
                    node["id"],
                    "REFERENCED_IN",
                    document_name,
                    node["type"],
                    "Document"
                )

        graph_data = {
            "nodes": list(nodes_by_id.values()),
            "relationships": relationships
        }

    graph = build_graph_response(graph_data)

    if document_name and not graph["nodes"]:
        graph = build_graph_response({
            "nodes": [{
                "id": document_name,
                "type": "Document"
            }],
            "relationships": []
        })

    return graph


def generate_graph(document_text: str, document_name=None):
    client = get_groq_client()

    if client is None:
        return generate_heuristic_graph(document_text, document_name=document_name)

    prompt = load_graph_prompt(document_text)

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0
        )

        raw_graph = parse_graph_response(response.choices[0].message.content)
        graph_response = build_graph_response(raw_graph)

        if not graph_response["nodes"] and not graph_response["edges"]:
            return generate_heuristic_graph(document_text, document_name=document_name)

        if document_name:
            fallback = generate_heuristic_graph(document_text, document_name=document_name)
            known = {node["id"] for node in graph_response["nodes"]}
            graph_response["nodes"].extend(node for node in fallback["nodes"] if node["id"] not in known)
            graph_response["relationships"].extend(
                rel for rel in fallback["relationships"]
                if rel not in graph_response["relationships"]
            )
            graph_response = build_graph_response(graph_response)

        return graph_response
    except Exception:
        return generate_heuristic_graph(document_text, document_name=document_name)


def save_graph(graph_data, document_id, db):
    ensure_graph_schema(db)
    relationships = graph_data.get("relationships", [])
    seen = set()

    for rel in relationships:
        source = fit_graph_field(rel["source"])
        relation = fit_graph_field(rel["relation"])
        target = fit_graph_field(rel["target"])
        source_type = normalize_entity_type(rel.get("source_type"))
        target_type = normalize_entity_type(rel.get("target_type"))
        key = (source, relation, target)

        if key in seen:
            continue

        seen.add(key)

        existing = db.query(GraphRelation).filter_by(
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
                    source_type=source_type,
                    relation=relation,
                    target=target,
                    target_type=target_type
                )
            )
        else:
            if existing.source_type in (None, "Entity") and source_type != "Entity":
                existing.source_type = source_type
            if existing.target_type in (None, "Entity") and target_type != "Entity":
                existing.target_type = target_type

    db.commit()


def ensure_graph_schema(db):
    bind = db.get_bind()
    inspector = inspect(bind)

    if "graph_relations" not in inspector.get_table_names():
        GraphRelation.__table__.create(bind=bind, checkfirst=True)
        return

    columns = {
        column["name"]
        for column in inspector.get_columns("graph_relations")
    }

    if "source_type" not in columns:
        db.execute(
            text("ALTER TABLE graph_relations ADD COLUMN source_type VARCHAR(100)")
        )

    if "target_type" not in columns:
        db.execute(
            text("ALTER TABLE graph_relations ADD COLUMN target_type VARCHAR(100)")
        )


def clear_graph(db):
    db.query(GraphRelation).delete()
    db.commit()


def get_graph(db, document_id=None):
    query = db.query(GraphRelation)

    if document_id:
        query = query.filter_by(document_id=document_id)

    relations = query.all()
    nodes_by_id = {}
    relationships = []

    for rel in relations:
        add_relationship(
            relationships,
            nodes_by_id,
            rel.source,
            rel.relation,
            rel.target,
            rel.source_type or "Entity",
            rel.target_type or "Entity"
        )

    graph = build_graph_response({
        "nodes": list(nodes_by_id.values()),
        "relationships": relationships
    })
    graph["node_details"] = build_node_details(graph)
    return graph


def build_node_details(graph):
    details = {}

    for node in graph.get("nodes", []):
        details[node["id"]] = {
            "id": node["id"],
            "label": node.get("label", node["id"]),
            "type": node.get("type", "Entity"),
            "connected_incidents": [],
            "connected_work_orders": [],
            "compliance": [],
            "oem": [],
            "procedures": [],
            "inspections": [],
            "locations": [],
            "relationships": []
        }

    for rel in graph.get("relationships", []):
        for side, other_side in (("source", "target"), ("target", "source")):
            node_id = rel[side]
            other_id = rel[other_side]
            other_type = rel.get(f"{other_side}_type", "Entity")

            if node_id not in details:
                continue

            details[node_id]["relationships"].append({
                "relation": rel["relation"],
                "node": other_id,
                "type": other_type
            })

            if other_type == "Incident":
                details[node_id]["connected_incidents"].append(other_id)
            elif other_type == "WorkOrder":
                details[node_id]["connected_work_orders"].append(other_id)
            elif other_type == "Compliance":
                details[node_id]["compliance"].append(other_id)
            elif other_type == "OEM":
                details[node_id]["oem"].append(other_id)
            elif other_type == "Procedure":
                details[node_id]["procedures"].append(other_id)
            elif other_type == "Inspection":
                details[node_id]["inspections"].append(other_id)
            elif other_type == "Location":
                details[node_id]["locations"].append(other_id)

    for detail in details.values():
        for key, value in detail.items():
            if isinstance(value, list) and key != "relationships":
                detail[key] = sorted(set(value))

    return details


def generate_graph_for_document(document_id, db):
    document = db.query(Document).filter(Document.id == document_id).first()

    if document is None:
        raise ValueError("Document not found")

    chunks = (
        db.query(DocumentChunk)
        .filter(DocumentChunk.document_id == document_id)
        .order_by(DocumentChunk.chunk_index.asc())
        .all()
    )

    document_text = "\n\n".join(chunk.text for chunk in chunks)
    graph_data = generate_graph(document_text, document_name=document.original_filename)
    save_graph(graph_data, document_id=document.id, db=db)
    graph = get_graph(db, document_id=document.id)

    return {
        "nodes": len(graph["nodes"]),
        "edges": len(graph["edges"]),
        "status": "success"
    }


def get_entity_relations(entity_name, db):
    relations = db.query(GraphRelation).filter(
        (GraphRelation.source == entity_name)
        |
        (GraphRelation.target == entity_name)
    ).all()

    return [
        {
            "source": rel.source,
            "source_type": rel.source_type,
            "relation": rel.relation,
            "target": rel.target,
            "target_type": rel.target_type
        }
        for rel in relations
    ]


def build_graph_context(entity_name, db):
    relations = get_entity_relations(entity_name, db)

    if not relations:
        return ""

    return "\n".join(
        f"{rel['source']} {rel['relation']} {rel['target']}"
        for rel in relations
    )
