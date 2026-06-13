import { STATS } from '../config.js'

// A circular progress ring drawn with SVG (used for the sample student's score).
function Ring({ value }) {
  const radius = 64
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference
  return (
    <div className="gauge">
      <div className="ring">
        <svg width="150" height="150">
          <circle cx="75" cy="75" r={radius} stroke="rgba(255,255,255,0.18)" strokeWidth="11" fill="none" />
          <circle
            cx="75" cy="75" r={radius}
            stroke="#93c5fd" strokeWidth="11" fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 75 75)"
          />
        </svg>
        <div className="value">
          <div className="big">{value}</div>
          <div className="out">out of 100</div>
        </div>
      </div>
    </div>
  )
}

export default function Hero() {
  return (
    <header className="hero">
      <div className="container">
        {/* Left column: headline + actions + stats */}
        <div className="hero-copy">
          <span className="hero-badge">⚡ AI-POWERED · LINEAR REGRESSION</span>
          <h1>
            Student Score
            <span className="accent">Predictor</span>
          </h1>
          <p className="lead">
            Predict your exam score based on study hours and attendance using
            Machine Learning. Get instant, data-driven insights to plan your
            academic success.
          </p>
          <div className="hero-actions">
            <a href="#predict" className="btn btn-white">Try Prediction</a>
            <a href="#how" className="btn btn-ghost">Learn How It Works</a>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="num">{STATS.accuracy}%</div>
              <div className="label">Prediction Accuracy</div>
            </div>
            <div className="hero-stat">
              <div className="num">{STATS.records}</div>
              <div className="label">Records Trained</div>
            </div>
            <div className="hero-stat">
              <div className="num">2s</div>
              <div className="label">Instant Results</div>
            </div>
          </div>
        </div>

        {/* Right column: sample student preview card */}
        <div className="student-card">
          <span className="chip">✓ Instant Results</span>
          <div className="who">
            <div className="avatar">👤</div>
            <div>
              <div className="name">Rahul Sharma</div>
              <div className="sub">CSE · Year 2</div>
            </div>
          </div>
          <Ring value={88} />
          <div className="bar-row">
            <div className="top"><span>Study Hours</span><span>18 hrs/wk</span></div>
            <div className="bar-track"><div className="bar-fill" style={{ width: '75%' }} /></div>
          </div>
          <div className="bar-row">
            <div className="top"><span>Attendance Rate</span><span>92%</span></div>
            <div className="bar-track"><div className="bar-fill" style={{ width: '92%' }} /></div>
          </div>
          <div className="card-footer-grade">
            <span>Predicted Grade</span>
            <strong>Grade A · Excellent</strong>
          </div>
        </div>
      </div>
    </header>
  )
}
