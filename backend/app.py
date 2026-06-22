from flask import Flask
from flask_cors import CORS

from routes.graph import graph_bp

from extensions import Base
from extensions import engine

# IMPORTANT
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
    app.run(debug=True)