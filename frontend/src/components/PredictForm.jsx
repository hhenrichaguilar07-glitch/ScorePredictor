import { useState } from 'react'
import { API_URL } from '../config.js'

// The three example students shown beneath the form (from the design).
const SAMPLES = [
  { name: 'Ananya K.', hours: 20, attendance: 95, score: 93 },
  { name: 'Vikram R.', hours: 12, attendance: 78, score: 74 },
  { name: 'Priya M.', hours: 8, attendance: 60, score: 55 },
]

export default function PredictForm() {
  const [hours, setHours] = useState('')
  const [attendance, setAttendance] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setResult(null)

    // --- Front-end validation before calling the API -----------------------
    // Mirrors the backend rules so the user gets instant, friendly feedback.
    if (hours === '' || attendance === '') {
      setError('Please enter both study hours and attendance.')
      return
    }

    const h = Number(hours)
    const a = Number(attendance)

    if (Number.isNaN(h) || Number.isNaN(a)) {
      setError('Please enter valid numbers for both fields.')
      return
    }
    if (h < 0 || a < 0) {
      setError('Values cannot be negative. Please enter positive numbers.')
      return
    }
    if (h > 60) {
      setError('That’s a lot of studying! Please enter realistic weekly study hours (0–60).')
      return
    }
    if (a > 100) {
      setError('Attendance must be a percentage between 0 and 100.')
      return
    }

    setLoading(true)
    try {
      // Call the Flask backend's /predict endpoint.
      const res = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          study_hours: h,
          attendance: a,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong.')
      } else {
        setResult(data)
      }
    } catch (err) {
      setError('Could not reach the server. Is the Flask backend running on port 5000?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="section predict" id="predict">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow blue">🤖 Prediction Engine</span>
          <h2>Predict Your Score</h2>
          <p>Enter your weekly study hours and attendance to get an instant ML-powered prediction.</p>
        </div>

        <form className="form-card" onSubmit={handleSubmit}>
          <div className="field">
            <label>📚 Study Hours per Week</label>
            <div className="input-wrap">
              <input
                type="number" min="0" max="60" step="0.5"
                placeholder="e.g. 15"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
              <span className="suffix">hrs/wk</span>
            </div>
          </div>

          <div className="field">
            <label>🎓 Attendance Percentage</label>
            <div className="input-wrap">
              <input
                type="number" min="0" max="100" step="1"
                placeholder="e.g. 85"
                value={attendance}
                onChange={(e) => setAttendance(e.target.value)}
              />
              <span className="suffix">%</span>
            </div>
          </div>

          {error && <div className="form-error">⚠ {error}</div>}

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Predicting…' : '⚡ Predict My Score'}
          </button>

          {result && (
            <div className="result" style={{ '--p': `${result.predicted_score}%` }}>
              <div className="score-badge">
                <div className="inner">
                  <b>{result.predicted_score}</b>
                  <span>/ 100</span>
                </div>
              </div>
              <div>
                <span className="grade-pill">Grade {result.grade}</span>
                <h4>{result.grade_label}</h4>
                <p className="tip">💡 {result.tip}</p>
              </div>
            </div>
          )}

          {/* About the Model — quick credibility note shown under the form. */}
          <div className="model-note">
            <span className="model-note-icon">🧠</span>
            <span>
              <b>About the model:</b> Predictions use a <b>Linear Regression</b> model
              (scikit-learn) trained on <b>500+ student records</b>, with an accuracy
              of <b>R² = 0.91</b>.
            </span>
          </div>
        </form>

        {/* Sample student result cards */}
        <div className="samples">
          {SAMPLES.map((s) => (
            <div className="sample-card" key={s.name}>
              <div className="av">👤</div>
              <div className="nm">{s.name}</div>
              <div className="meta">{s.hours}hrs · {s.attendance}%</div>
              <div className="score-pill">{s.score}/100</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
