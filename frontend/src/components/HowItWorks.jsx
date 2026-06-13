// "Three Simple Steps" section + the "Powered by Scikit-learn" banner.
const STEPS = [
  {
    cls: 'c1', icon: '✏️', step: 'STEP 01', title: 'Enter Study Hours',
    text: 'Input the average number of hours you study per week. This is the strongest predictor in our model.',
  },
  {
    cls: 'c2', icon: '📅', step: 'STEP 02', title: 'Add Attendance',
    text: 'Provide your attendance percentage for the semester. Regular attendance significantly impacts performance.',
  },
  {
    cls: 'c3', icon: '🤖', step: 'STEP 03', title: 'ML Processing',
    text: 'Our scikit-learn Linear Regression model processes your inputs using a trained dataset of 500+ student records.',
  },
  {
    cls: 'c4', icon: '🎯', step: 'STEP 04', title: 'Get Your Score',
    text: 'Receive your predicted exam score instantly along with your grade letter and personalized improvement tips.',
  },
]

export default function HowItWorks() {
  return (
    <section className="section" id="how">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow green">🔍 How It Works</span>
          <h2>Three Simple Steps</h2>
          <p>Our ML pipeline makes grade prediction effortless. Here's what happens under the hood.</p>
        </div>

        <div className="steps">
          {STEPS.map((s) => (
            <div className={`step-card ${s.cls}`} key={s.step}>
              <div className="icon">{s.icon}</div>
              <span className="step-pill">{s.step}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>

        <div className="powered">
          <div className="pico">🧠</div>
          <div className="ptext">
            <h4>Powered by Scikit-learn Linear Regression</h4>
            <p>
              Trained on a dataset of 500+ student academic records using Python, Pandas, and
              Scikit-learn. Backend built with Flask REST API.
            </p>
          </div>
          <div className="chips">
            <span>Python</span>
            <span>Flask</span>
            <span>Scikit-learn</span>
          </div>
        </div>
      </div>
    </section>
  )
}
