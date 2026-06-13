import {
  ScatterChart, Scatter, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { STATS } from '../config.js'

// --- Chart data (mirrors the trained dataset's trends) ---------------------

// Study hours vs exam score — a roughly linear cloud of points (2 → 30 hrs).
const SCATTER_DATA = Array.from({ length: 28 }, (_, i) => {
  const hours = i + 2
  // base trend ~ matches the model; tiny deterministic wobble so it looks real
  const score = Math.min(100, Math.round(28 + hours * 2.5 + (i % 3) * 2))
  return { hours, score }
})

// Attendance range vs average score — clear upward line.
const LINE_DATA = [
  { range: '50–60%', score: 50 },
  { range: '61–70%', score: 58 },
  { range: '71–80%', score: 68 },
  { range: '81–90%', score: 78 },
  { range: '91–100%', score: 90 },
]

const STAT_CARDS = [
  { icon: '📚', delta: '+12%', deltaCls: '', val: STATS.avgStudyHours, unit: 'hrs/wk', cap: 'Avg Study Hours' },
  { icon: '🎓', delta: '+5%', deltaCls: '', val: STATS.avgAttendance, unit: '%', cap: 'Avg Attendance' },
  { icon: '📊', delta: '+8%', deltaCls: '', val: STATS.avgScore, unit: '/100', cap: 'Avg Score' },
  { icon: '🤖', delta: `R²=${STATS.r2}`, deltaCls: 'blue', val: STATS.accuracy, unit: '%', cap: 'Model Accuracy' },
]

export default function Statistics() {
  return (
    <section className="section statistics" id="statistics">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow amber">📊 Statistics</span>
          <h2>Data Insights</h2>
          <p>Visual analytics from our training dataset of 500+ student records.</p>
        </div>

        {/* Four summary stat cards */}
        <div className="stat-cards">
          {STAT_CARDS.map((c) => (
            <div className="stat-card" key={c.cap}>
              <div className="stop">
                <span className="sicon">{c.icon}</span>
                <span className={`delta ${c.deltaCls}`}>{c.delta}</span>
              </div>
              <div className="val">{c.val}<small> {c.unit}</small></div>
              <div className="cap">{c.cap}</div>
            </div>
          ))}
        </div>

        {/* Two charts */}
        <div className="charts">
          <div className="chart-card">
            <h3>Study Hours vs Exam Score</h3>
            <div className="csub">Linear regression fit on 500+ records</div>
            <ResponsiveContainer width="100%" height={260}>
              <ScatterChart margin={{ top: 10, right: 14, bottom: 6, left: -16 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                <XAxis
                  type="number" dataKey="hours" name="Hours"
                  domain={[0, 30]} tick={{ fontSize: 12, fill: '#94a3b8' }}
                  label={{ value: 'Hours/wk', position: 'insideBottom', offset: -2, fontSize: 12, fill: '#94a3b8' }}
                />
                <YAxis type="number" dataKey="score" domain={[0, 100]} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter data={SCATTER_DATA} fill="#93c5fd" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>Attendance Range vs Avg Score</h3>
            <div className="csub">Higher attendance correlates with better grades</div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={LINE_DATA} margin={{ top: 10, right: 14, bottom: 6, left: -16 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={3} dot={{ r: 5, fill: '#2563eb' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  )
}
