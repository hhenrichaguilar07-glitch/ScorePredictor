# ScorePredictor 🧠

A Machine Learning web app that predicts a student's exam score from their
weekly **study hours** and **attendance percentage**, using a scikit-learn
**Linear Regression** model.

Built as a 3-part project: **ML model → Flask API → React frontend**.

```
scorepredictor/
├── ml_model/      # Part 1 — generate data, train model, save model.pkl
├── backend/       # Part 2 — Flask REST API (/predict) that serves the model
└── frontend/      # Part 3 — React + Recharts UI
```

---

## How to run (do these in order)

### 1. Train the ML model
```bash
cd ml_model
pip install -r requirements.txt
python train_model.py
```
Creates `model.pkl`, `student_data.csv`, and `metrics.json`.
Result: **R² ≈ 0.91** on 600 student records.

### 2. Start the Flask backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```
API runs at **http://localhost:5000**

Test it:
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d "{\"study_hours\":15,\"attendance\":85}"
```

### 3. Start the React frontend
```bash
cd frontend
npm install
npm run dev
```
App opens at **http://localhost:5173** and calls the Flask API.

> Keep the backend (step 2) and frontend (step 3) running at the same time
> in two separate terminals.

---

## API reference

`POST /predict`
```json
// request
{ "study_hours": 15, "attendance": 85 }

// response
{
  "predicted_score": 80,
  "grade": "B+",
  "grade_label": "Good",
  "tip": "Solid effort. Pushing attendance above 85% could lift you...",
  "study_hours": 15,
  "attendance": 85
}
```

Other endpoints: `GET /health`, `GET /stats`.

---

## Project info
- **Course:** Machine Learning (CS401)
- **Semester:** 6th Semester, 2025–26
- **Type:** College Mini Project
- **Stack:** Python · Flask · Scikit-learn · React · Recharts
