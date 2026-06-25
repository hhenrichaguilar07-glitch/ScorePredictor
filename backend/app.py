"""
ScorePredictor — Flask REST API
================================
Serves the trained Linear Regression model to the React frontend.

Endpoints:
  GET  /health   -> simple "is the server up?" check
  GET  /stats    -> dataset metrics (for the Statistics section, optional)
  POST /predict  -> { "study_hours": 15, "attendance": 85 }
                    returns predicted score + letter grade + improvement tip

Run it with:  python app.py
The API will be available at  http://localhost:5000
"""

import os
import json
import pickle

import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

# ---------------------------------------------------------------------------
# Load the trained model (created by ml_model/train_model.py)
# ---------------------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "..", "ml_model", "model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "..", "ml_model", "scaler.pkl")
METRICS_PATH = os.path.join(BASE_DIR, "..", "ml_model", "metrics.json")

with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)

# The model is trained on StandardScaler-scaled features, so we must apply the
# SAME scaler (fitted during training) to incoming inputs before predicting.
with open(SCALER_PATH, "rb") as f:
    scaler = pickle.load(f)

# Load dataset metrics if available (used by /stats).
try:
    with open(METRICS_PATH, "r") as f:
        METRICS = json.load(f)
except FileNotFoundError:
    METRICS = {}

# ---------------------------------------------------------------------------
# Flask app setup
# ---------------------------------------------------------------------------
app = Flask(__name__)
CORS(app)  # allow the React frontend (different port) to call this API


def grade_for_score(score):
    """Convert a numeric score (0-100) into a letter grade and a label."""
    if score >= 90:
        return "A", "Excellent"
    if score >= 85:
        return "A-", "Very Good"
    if score >= 80:
        return "B+", "Good"
    if score >= 75:
        return "B", "Above Average"
    if score >= 70:
        return "B-", "Satisfactory"
    if score >= 65:
        return "C+", "Fair"
    if score >= 60:
        return "C", "Average"
    if score >= 50:
        return "D", "Needs Improvement"
    return "F", "At Risk"


def improvement_tip(study_hours, attendance, score):
    """Give one short, actionable tip based on the weakest input."""
    if study_hours < 10:
        return ("Your study hours are low. Adding 3-5 more hours per week "
                "is the fastest way to raise your score.")
    if attendance < 75:
        return ("Attendance is holding you back. Aim for 85%+ to capture "
                "key in-class material and boost your grade.")
    if score >= 90:
        return ("Outstanding work! Keep your routine consistent to maintain "
                "this excellent performance.")
    if attendance < 85:
        return ("Solid effort. Pushing attendance above 85% could lift you "
                "into the next grade band.")
    return ("Great balance of study and attendance. A few extra focused "
            "study hours could push you even higher.")


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model_loaded": True})


@app.route("/stats", methods=["GET"])
def stats():
    return jsonify(METRICS)


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(silent=True) or {}

    # --- Validate the inputs -------------------------------------------------
    try:
        study_hours = float(data["study_hours"])
        attendance = float(data["attendance"])
    except (KeyError, TypeError, ValueError):
        return jsonify({
            "error": "Please provide numeric 'study_hours' and 'attendance'."
        }), 400

    if not (0 <= study_hours <= 60):
        return jsonify({"error": "study_hours must be between 0 and 60."}), 400
    if not (0 <= attendance <= 100):
        return jsonify({"error": "attendance must be between 0 and 100."}), 400

    # --- Run the model -------------------------------------------------------
    # The model expects a 2D array: [[study_hours, attendance]]. Because the
    # model was trained on scaled features, transform the raw inputs with the
    # same scaler BEFORE predicting (otherwise predictions are way off).
    features = np.array([[study_hours, attendance]])
    features_scaled = scaler.transform(features)
    raw_score = float(model.predict(features_scaled)[0])
    score = round(max(0, min(100, raw_score)))  # clamp to 0-100 and round

    grade, label = grade_for_score(score)
    tip = improvement_tip(study_hours, attendance, score)

    return jsonify({
        "study_hours": study_hours,
        "attendance": attendance,
        "predicted_score": score,
        "grade": grade,
        "grade_label": label,
        "tip": tip,
    })


if __name__ == "__main__":
    print("ScorePredictor API running at http://localhost:5000")
    app.run(host="0.0.0.0", port=5000, debug=True)
