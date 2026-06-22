# OperaMind

<p align="center">
  <h3 align="center">The Unified Operations Brain for Industrial Intelligence</h3>
  <p align="center">
    Transform scattered industrial documents into actionable intelligence using AI, Knowledge Graphs, and Semantic Search.
  </p>
</p>

---

## Overview

Industrial organizations generate enormous volumes of operational knowledge across maintenance reports, SOPs, inspection records, OEM manuals, audit documents, and compliance reports. Unfortunately, this information often remains fragmented across systems, departments, and document repositories.

**OperaMind** is an AI-powered Industrial Knowledge Intelligence Platform that consolidates organizational knowledge into a unified, searchable, and explainable system. By combining Retrieval-Augmented Generation (RAG), Knowledge Graphs, Semantic Search, and Large Language Models, OperaMind enables engineers and operations teams to quickly find answers, identify patterns, and make informed decisions.

---

## Problem Statement

Industrial enterprises commonly face:

* Knowledge silos across departments
* Time-consuming document searches
* Repeated operational failures due to inaccessible historical data
* Compliance and audit challenges
* Loss of institutional knowledge
* Difficulty identifying relationships between assets, incidents, and procedures

Engineers spend valuable time searching for information instead of solving problems.

---

## Solution

OperaMind converts industrial documentation into an intelligent operational knowledge system by:

* Ingesting and processing industrial documents
* Extracting entities and relationships
* Building a dynamic industrial knowledge graph
* Enabling natural language querying
* Performing semantic similarity analysis
* Supporting compliance and audit workflows
* Providing explainable AI-generated responses with source citations

---

## Key Features

### Document Intelligence

Upload and process:

* Maintenance Reports
* Standard Operating Procedures (SOPs)
* Inspection Reports
* OEM Manuals
* Audit Reports
* Safety Documentation
* Engineering Records
* Project Documentation

Processing Pipeline:

```text
Document Upload
       ↓
Text Extraction
       ↓
Chunking
       ↓
Embedding Generation
       ↓
Vector Indexing
       ↓
Knowledge Extraction
       ↓
Knowledge Graph Creation
```

---

### AI Knowledge Copilot

Ask operational questions in natural language:

* Why did Pump P101 fail repeatedly?
* Show incidents involving Compressor C201.
* What maintenance recommendations exist for Boiler B501?
* Which procedures apply to this equipment?

The system retrieves relevant knowledge and generates contextual answers backed by source references.

---

### Industrial Knowledge Graph

Automatically extracts:

* Equipment
* Components
* Failures
* Maintenance Activities
* Personnel
* Locations
* Compliance References

Example Relationship Mapping:

```text
Pump P101
   ├── Failed Due To ──► Seal Wear
   ├── Located In ─────► Unit A
   └── Referenced In ──► Maintenance Report #12
```

The graph reveals hidden relationships across documents and departments, enabling deeper operational insights.

---

### Compliance Intelligence

Automatically analyze uploaded records against compliance requirements.

Capabilities include:

* Missing procedure detection
* Compliance gap identification
* Audit readiness assessment
* Traceable evidence generation
* Regulatory documentation support

---

### Incident Similarity Engine

Identify:

* Similar historical failures
* Recurring incident patterns
* Repeated root causes
* Related maintenance events

Helping organizations learn from historical operational data and reduce repeated failures.

---

## Architecture

```text
┌─────────────────┐
│     Frontend    │
│ React + Vite    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Flask Backend   │
└────────┬────────┘
         │
 ┌───────┼─────────────┐
 │       │             │
 ▼       ▼             ▼

Groq   Pinecone    PostgreSQL
LLM    Vector DB      (Neon)

         │
         ▼
 Knowledge Graph
```

---

## Technology Stack

### Frontend

* React
* Vite
* Tailwind CSS
* React Flow

### Backend

* Flask
* SQLAlchemy
* PostgreSQL (Neon)

### AI & NLP

* Groq API
* Llama 3.3 70B Versatile
* Sentence Transformers

### Vector Search

* Pinecone

### Document Processing

* PyMuPDF
* OCR Support (Extensible)

### Knowledge Graph

* Graph Relationships in PostgreSQL
* React Flow Visualization

---

## Core Components

### Retrieval-Augmented Generation (RAG)

Provides contextual and accurate responses by combining:

* Semantic Search
* Vector Retrieval
* Source Grounding
* LLM Reasoning

### Knowledge Graph Engine

Extracts and connects industrial entities to provide:

* Cross-document intelligence
* Relationship discovery
* Asset-centric exploration

### Semantic Search

Find relevant operational information beyond exact keyword matching.

### Explainable AI

Every generated response is traceable back to source documents, improving trust and auditability.

---

## Database Structure

### documents

Stores uploaded industrial documents.

### document_chunks

Stores processed chunks and vector references.

### graph_relations

Stores extracted entities and relationships.

### incidents

Stores historical operational incidents.

### assets

Stores equipment and asset information.

---

## Demo Workflow

1. Upload industrial documents.
2. System extracts and indexes knowledge.
3. Generate embeddings and build the knowledge graph.
4. Ask operational questions in natural language.
5. Receive AI-generated answers with citations.
6. Explore connected entities through graph visualization.
7. Analyze compliance gaps.
8. Discover similar historical incidents.

---

## Future Enhancements

* Multi-document reasoning agents
* Predictive maintenance recommendations
* Real-time IoT integration
* Automated root cause analysis
* Digital twin integration
* Multi-site industrial intelligence platform

---

## Impact

OperaMind transforms static industrial documentation into an intelligent operational knowledge network that:

* Reduces information retrieval time
* Improves maintenance decision-making
* Preserves institutional knowledge
* Enhances compliance readiness
* Enables data-driven operational excellence

---

## Team

| Name                | Role                   | Email                                                               | LinkedIn                                              |
| ------------------- | ---------------------- | ------------------------------------------------------------------- | ----------------------------------------------------- |
| **Prabhu Pachisia** | Backend & RAG Engineer | [prabhupachisia@gmail.com](mailto:prabhupachisia@gmail.com)         | https://www.linkedin.com/in/prabhupachisia/           |
| **Shreyes Jaiswal** | Frontend Engineer      | [shreyesjaiswal7@gmail.com](mailto:shreyesjaiswal7@gmail.com)       | https://www.linkedin.com/in/shreyes07/                |
| **Abhinav Pandey**  | AI/ML Engineer         | [abhinavpandeydel42@gmail.com](mailto:abhinavpandeydel42@gmail.com) | https://www.linkedin.com/in/abhinav-pandey-b0242428b/ |

---

### Built by Team OperaMind

Transforming industrial knowledge into operational intelligence through AI, Knowledge Graphs, and Semantic Search.

---

## License

MIT License

---

Built to empower industrial teams with AI-driven operational intelligence.