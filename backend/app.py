from flask import Flask
from flask_cors import CORS
from sqlalchemy import inspect, text

from extensions import Base
from extensions import engine

# Blueprints
from routes.graph import graph_bp
from routes.chat import chat_bp
from routes.upload import upload_bp
from routes.history import history_bp
from routes.compliance import compliance_bp
from routes.incidents import incidents_bp
from config import FLASK_DEBUG

# IMPORTANT
import models

app = Flask(__name__)
# Enable CORS with explicit configuration for development
CORS(app, 
     origins=["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     allow_headers=["Content-Type"],
     supports_credentials=True)

def ensure_schema():
    inspector = inspect(engine)

    if "graph_relations" in inspector.get_table_names():
        columns = [column["name"] for column in inspector.get_columns("graph_relations")]
        with engine.begin() as connection:
            if "document_id" not in columns:
                connection.execute(
                    text("ALTER TABLE graph_relations ADD COLUMN document_id VARCHAR(36)")
                )
                connection.execute(
                    text(
                        "CREATE INDEX IF NOT EXISTS idx_graph_relations_document_id ON graph_relations(document_id)"
                    )
                )
            if "source_type" not in columns:
                connection.execute(
                    text("ALTER TABLE graph_relations ADD COLUMN source_type VARCHAR(100)")
                )
            if "target_type" not in columns:
                connection.execute(
                    text("ALTER TABLE graph_relations ADD COLUMN target_type VARCHAR(100)")
                )


# Create all database tables and patch schema if needed
Base.metadata.create_all(bind=engine)
ensure_schema()


@app.route("/")
def home():
    return {
        "status": "running",
        "project": "OperaMind"
    }

# Routes
app.register_blueprint(
    graph_bp,
    url_prefix="/graph"
)

app.register_blueprint(
    graph_bp,
    url_prefix="/api/graph",
    name="api_graph"
)

# Chat / RAG routes
app.register_blueprint(
    chat_bp,
    url_prefix="/chat"
)

app.register_blueprint(
    upload_bp,
    url_prefix="/upload"
)

app.register_blueprint(
    history_bp,
    url_prefix="/history"
)

app.register_blueprint(
    compliance_bp,
    url_prefix="/compliance"
)

app.register_blueprint(
    incidents_bp,
    url_prefix="/incidents"
)

if __name__ == "__main__":
    app.run(
        debug=FLASK_DEBUG,
        host="0.0.0.0",
        port=5000
    )
