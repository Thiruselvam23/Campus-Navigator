from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import cv2
from pathfinder import astar
import os
import json

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MAP_PATH = os.path.join(BASE_DIR, "static", "Map.png")

map_img = cv2.imread(MAP_PATH)
map_gray = cv2.cvtColor(map_img, cv2.COLOR_BGR2GRAY)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
LOCATIONS_PATH = os.path.join(BASE_DIR, "locations.json")

with open(LOCATIONS_PATH, "r") as f:
    LOCATIONS = json.load(f)

@app.route("/locations", methods=["GET"])
def get_locations():
    return jsonify(list(LOCATIONS.keys()))

@app.route("/find-path", methods=["POST"])
def find_path():
    data = request.json
    start_name = data["start"]
    end_name = data["end"]

    if start_name not in LOCATIONS or end_name not in LOCATIONS:
        return jsonify({"error": "Invalid location"}), 400

    start = tuple(LOCATIONS[start_name])
    end = tuple(LOCATIONS[end_name])

    path = astar(map_gray, start, end)

    if not path:
        return jsonify({"error": "No path found"}), 404

    return jsonify({"path": path})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)

