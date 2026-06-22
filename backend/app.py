from flask import Flask
from flask_cors import CORS

from extensions import Base
from extensions import engine

# Blueprints
from routes.graph import graph_bp
from routes.chat import chat_bp
from routes.upload import upload_bp
from routes.history import history_bp

# IMPORTANT
import models

app = Flask(__name__)
# Enable CORS with explicit configuration for development
CORS(app, 
     origins=["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     allow_headers=["Content-Type"],
     supports_credentials=True)

# Create all database tables
Base.metadata.create_all(bind=engine)


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

if __name__ == "__main__":
    app.run(
        debug=True,
        host="0.0.0.0",
        port=5000
    )