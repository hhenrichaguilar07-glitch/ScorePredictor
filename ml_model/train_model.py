"""
ScorePredictor — Model Training Script
=======================================
This script:
  1. Generates a realistic synthetic dataset of 500+ student records
     (weekly study hours, attendance %, and the resulting exam score).
  2. Trains a scikit-learn LinearRegression model on that data.
  3. Reports the model's R-squared and an "accuracy" figure.
  4. Saves the trained model to 'model.pkl' so the Flask backend can load it.

Run it with:  python train_model.py
"""

import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error
import pickle
import json

# A fixed random seed makes the generated data the same every run (reproducible).
RNG = np.random.default_rng(42)
N_STUDENTS = 600  # "500+" records


def generate_dataset(n=N_STUDENTS):
    """Create a believable dataset where more study + attendance -> higher score."""
    # Weekly study hours: most students study ~14 hrs, clipped to a sensible 2-30 range.
    study_hours = np.clip(RNG.normal(14.2, 5.0, n), 2, 30)

    # Attendance percentage: centered around 81%, clipped to 50-100.
    attendance = np.clip(RNG.normal(81, 10, n), 50, 100)

    # The "true" relationship the model will try to learn:
    #   score = 11 (base) + 2.1 * study_hours + 0.45 * attendance + random noise
    # The noise represents real-world factors we don't measure (sleep, difficulty, luck).
    # A smaller noise std gives a tighter fit -> higher R-squared (~0.91).
    noise = RNG.normal(0, 3.4, n)
    exam_score = 11 + 2.1 * study_hours + 0.45 * attendance + noise

    # Exam scores can't go below 0 or above 100.
    exam_score = np.clip(exam_score, 0, 100)

    return pd.DataFrame({
        "study_hours": np.round(study_hours, 1),
        "attendance": np.round(attendance, 1),
        "exam_score": np.round(exam_score, 1),
    })


def main():
    print("Step 1/4 — Generating dataset...")
    df = generate_dataset()
    df.to_csv("student_data.csv", index=False)
    print(f"  Created {len(df)} student records -> student_data.csv")
    print(df.head(), "\n")

    # Features (inputs) = X, target (what we predict) = y
    X = df[["study_hours", "attendance"]]
    y = df["exam_score"]

    print("Step 2/4 — Splitting into train/test sets (80/20)...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    print("Step 3/4 — Training LinearRegression model...")
    model = LinearRegression()
    model.fit(X_train, y_train)

    # Evaluate on the unseen test set.
    y_pred = model.predict(X_test)
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    # A friendly "accuracy" %: on average, how close predictions are (out of 100 points).
    accuracy = 100 - mae

    print(f"  Coefficients : study_hours={model.coef_[0]:.3f}, "
          f"attendance={model.coef_[1]:.3f}")
    print(f"  Intercept    : {model.intercept_:.3f}")
    print(f"  R-squared    : {r2:.3f}   (target ~0.91)")
    print(f"  MAE          : {mae:.2f} points")
    print(f"  Accuracy     : {accuracy:.1f}%   (target ~94%)\n")

    print("Step 4/4 — Saving model to model.pkl...")
    with open("model.pkl", "wb") as f:
        pickle.dump(model, f)

    # Also save the metrics so the website/footer can display real numbers.
    metrics = {
        "r2": round(float(r2), 2),
        "accuracy": round(float(accuracy), 1),
        "avg_study_hours": round(float(df["study_hours"].mean()), 1),
        "avg_attendance": round(float(df["attendance"].mean()), 0),
        "avg_score": round(float(df["exam_score"].mean()), 1),
        "n_records": len(df),
    }
    with open("metrics.json", "w") as f:
        json.dump(metrics, f, indent=2)

    print("  Saved model.pkl and metrics.json")
    print("\nDone! Dataset stats:")
    print(json.dumps(metrics, indent=2))


if __name__ == "__main__":
    main()
