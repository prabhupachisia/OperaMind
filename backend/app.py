from flask import Flask
from flask_cors import CORS

from routes.graph import graph_bp
from routes.chat import chat_bp

from extensions import Base
from extensions import engine

import models

app = Flask(__name__)
CORS(app)

# Create database tables
Base.metadata.create_all(bind=engine)


@app.route("/")
def home():
    return {
        "status": "running",
        "service": "OperaMind API"
    }


# Graph routes
app.register_blueprint(
    graph_bp,
    url_prefix="/graph"
)

# Chat / RAG routes
app.register_blueprint(
    chat_bp,
    url_prefix="/chat"
)


if __name__ == "__main__":
    app.run(
        debug=True,
        host="0.0.0.0",
        port=5000
    )