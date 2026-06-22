from flask import Flask
from flask_cors import CORS
from routes.chat import chat_bp

from extensions import Base
from extensions import engine

# Blueprints
from routes.graph import graph_bp
from routes.upload import upload_bp

# Blueprints
from routes.graph import graph_bp
from routes.upload import upload_bp

import models

app = Flask(__name__)
CORS(app)

# Create tables
Base.metadata.create_all(bind=engine)


@app.route("/")
def home():
    return {
        "status": "running"
    }

app.register_blueprint(
    graph_bp,
    url_prefix="/graph"
)

if __name__ == "__main__":
    app.run(
        debug=True,
        host="0.0.0.0",
        port=5000
    )