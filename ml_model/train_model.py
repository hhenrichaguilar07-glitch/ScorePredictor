"""
ScorePredictor — Model Training Script (full preprocessing on messy data)
=========================================================================
This script demonstrates the COMPLETE machine learning workflow, including
real data preprocessing on a dataset that contains realistic imperfections.

  1. DATA GENERATION   — create a RAW dataset of student records that includes
                         realistic, simulated data-collection problems:
                         missing values, duplicate rows, and a few outliers.
  2. DATA INSPECTION   — examine the raw data (shape, types, statistics).
  3. DATA CLEANING     — detect and HANDLE missing values, duplicates, outliers.
  4. PREPROCESSING     — separate features/target and apply feature scaling.
  5. TRAIN/TEST SPLIT  — divide the cleaned data for evaluation (80/20).
  6. MODEL TRAINING    — train a scikit-learn LinearRegression model.
  7. MODEL EVALUATION  — measure performance with R-squared and MAE.
  8. SAVE ARTIFACTS    — save the model, the scaler, and the metrics.

NOTE ON THE DATA: Because real student academic records are private, we
generate a synthetic dataset and deliberately inject realistic imperfections
(missing values, duplicates, outliers) to simulate raw, real-world data. This
lets us demonstrate the full preprocessing pipeline handling those problems.

Run it with:  python train_model.py
"""

import sys
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import r2_score, mean_absolute_error
import pickle
import json

# Print UTF-8 so symbols like "≈" don't crash on the Windows cp1252 console.
try:
    sys.stdout.reconfigure(encoding="utf-8")
except (AttributeError, ValueError):
    pass

RNG = np.random.default_rng(42)
N_STUDENTS = 640  # extra rows because cleaning will remove some -> ends up 500+


# =============================================================================
# STEP 1 — DATA GENERATION (raw, with realistic imperfections)
# =============================================================================
def generate_raw_dataset(n=N_STUDENTS):
    """
    Create a RAW dataset that simulates real-world data collection, including
    common data-quality problems that preprocessing must handle:
      - missing values (blank entries)
      - duplicate records (same student entered twice)
      - a few outliers (data-entry errors)
    """
    study_hours = np.clip(RNG.normal(14.2, 5.0, n), 2, 30)
    attendance = np.clip(RNG.normal(81, 10, n), 50, 100)
    noise = RNG.normal(0, 3.4, n)
    exam_score = np.clip(11 + 2.1 * study_hours + 0.45 * attendance + noise, 0, 100)

    df = pd.DataFrame({
        "study_hours": np.round(study_hours, 1),
        "attendance": np.round(attendance, 1),
        "exam_score": np.round(exam_score, 1),
    })

    # --- Inject MISSING VALUES (simulate blank entries during data collection) ---
    # Randomly blank out ~3% of study_hours and ~3% of attendance cells.
    n_missing = int(0.03 * n)
    miss_idx_sh = RNG.choice(df.index, n_missing, replace=False)
    miss_idx_att = RNG.choice(df.index, n_missing, replace=False)
    df.loc[miss_idx_sh, "study_hours"] = np.nan
    df.loc[miss_idx_att, "attendance"] = np.nan

    # --- Inject DUPLICATE ROWS (simulate the same record entered twice) ---
    n_dupes = 15
    dupe_rows = df.sample(n=n_dupes, random_state=1)
    df = pd.concat([df, dupe_rows], ignore_index=True)

    # --- Inject a few OUTLIERS (simulate data-entry errors) ---
    # e.g. impossible study hours like 250 (a typo for 25.0).
    outlier_idx = RNG.choice(df.index, 5, replace=False)
    df.loc[outlier_idx, "study_hours"] = [250.0, 300.0, 180.0, 220.0, 275.0]

    # Shuffle so the problems are spread throughout.
    df = df.sample(frac=1, random_state=7).reset_index(drop=True)
    return df


# =============================================================================
# STEP 2 — DATA INSPECTION
# =============================================================================
def inspect_data(df, label):
    print(f"  [{label}] shape (rows, columns):", df.shape)
    print(f"  [{label}] summary statistics:")
    print(df.describe().round(2).to_string().replace("\n", "\n    "))
    print()


# =============================================================================
# STEP 3 — DATA CLEANING (handle missing values, duplicates, outliers)
# =============================================================================
def clean_data(df):
    """Detect and handle the data-quality problems, reporting before/after."""
    rows_before = len(df)

    # --- 3a. Missing values: report, then fill with the column mean (imputation) ---
    missing = df.isnull().sum()
    total_missing = int(missing.sum())
    print("  Missing values per column (BEFORE):")
    print(missing.to_string().replace("\n", "\n    "))
    if total_missing > 0:
        df = df.fillna(df.mean(numeric_only=True))
        print(f"    -> Imputed {total_missing} missing value(s) using the column mean.")
    print(f"  Missing values AFTER cleaning: {int(df.isnull().sum().sum())}")
    print()

    # --- 3b. Duplicate rows: detect and remove ---
    n_dupes = int(df.duplicated().sum())
    print(f"  Duplicate rows found: {n_dupes}")
    if n_dupes > 0:
        df = df.drop_duplicates().reset_index(drop=True)
        print(f"    -> Removed {n_dupes} duplicate row(s).")
    print()

    # --- 3c. Outliers: remove impossible study_hours (valid range ~0-40) ---
    before_outlier = len(df)
    df = df[(df["study_hours"] >= 0) & (df["study_hours"] <= 40)].reset_index(drop=True)
    removed_outliers = before_outlier - len(df)
    print(f"  Outliers (study_hours > 40) removed: {removed_outliers}")
    print()

    rows_after = len(df)
    print(f"  Rows: {rows_before} (raw) -> {rows_after} (cleaned).")
    print()
    return df


# =============================================================================
# STEP 4 — PREPROCESSING (feature/target split + feature scaling)
# =============================================================================
def preprocess(df):
    X = df[["study_hours", "attendance"]]
    y = df["exam_score"]
    print("  Features (X): study_hours, attendance   |   Target (y): exam_score")

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    print("  Applied StandardScaler (mean 0, std 1) so features share one scale.")
    print(f"    Means before scaling: {X.mean().round(2).to_dict()}")
    print(f"    Means after scaling : "
          f"{dict(zip(X.columns, np.round(X_scaled.mean(axis=0), 2)))}  (≈ 0)")
    print()
    return X_scaled, y, scaler


def main():
    print("=" * 64)
    print("STEP 1/8 — Generating RAW dataset (with missing/duplicate/outlier data)")
    print("=" * 64)
    raw = generate_raw_dataset()
    raw.to_csv("student_data_raw.csv", index=False)
    print(f"  Created {len(raw)} raw records -> student_data_raw.csv")
    print("  First rows of RAW data (note the NaN = missing values):")
    print(raw.head(8).to_string(), "\n")

    print("=" * 64)
    print("STEP 2/8 — Inspecting the RAW data")
    print("=" * 64)
    inspect_data(raw, "RAW")

    print("=" * 64)
    print("STEP 3/8 — Cleaning the data")
    print("=" * 64)
    df = clean_data(raw.copy())

    # Save the cleaned dataset for reference / the app's stats.
    df.to_csv("student_data.csv", index=False)
    print(f"  Saved cleaned dataset -> student_data.csv ({len(df)} records)\n")

    print("=" * 64)
    print("STEP 4/8 — Preprocessing (feature/target split + scaling)")
    print("=" * 64)
    X_scaled, y, scaler = preprocess(df)

    print("=" * 64)
    print("STEP 5/8 — Splitting into train/test sets (80/20)")
    print("=" * 64)
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.2, random_state=42
    )
    print(f"  Training set: {X_train.shape[0]} records (80%)")
    print(f"  Testing set : {X_test.shape[0]} records (20%)\n")

    print("=" * 64)
    print("STEP 6/8 — Training the LinearRegression model")
    print("=" * 64)
    model = LinearRegression()
    model.fit(X_train, y_train)
    print(f"  Coefficients (scaled): study_hours={model.coef_[0]:.3f}, "
          f"attendance={model.coef_[1]:.3f}  |  Intercept: {model.intercept_:.3f}\n")

    print("=" * 64)
    print("STEP 7/8 — Evaluating on the unseen test set")
    print("=" * 64)
    y_pred = model.predict(X_test)
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    accuracy = 100 - mae
    print(f"  R-squared : {r2:.3f}  (≈ {r2*100:.0f}% of variance explained)")
    print(f"  MAE       : {mae:.2f} points")
    print(f"  Accuracy  : {accuracy:.1f}%\n")

    print("=" * 64)
    print("STEP 8/8 — Saving model, scaler, and metrics")
    print("=" * 64)
    with open("model.pkl", "wb") as f:
        pickle.dump(model, f)
    with open("scaler.pkl", "wb") as f:
        pickle.dump(scaler, f)
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
    print("  Saved model.pkl, scaler.pkl, metrics.json")
    print("\nDone! Final metrics:")
    print(json.dumps(metrics, indent=2))


if __name__ == "__main__":
    main()
