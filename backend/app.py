from flask import Flask
from flask_cors import CORS

from extensions import Base
from extensions import engine

# Blueprints
from routes.graph import graph_bp
from routes.upload import upload_bp

# IMPORTANT
import models

app = Flask(__name__)
CORS(app)

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

app.register_blueprint(
    upload_bp,
    url_prefix="/api"
)

if __name__ == "__main__":
    app.run(debug=True)