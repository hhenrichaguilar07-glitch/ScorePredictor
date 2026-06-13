// "Everything You Need" — 6 feature cards.
const FEATURES = [
  {
    icon: '🤖', iconBg: 'bg-violet', tag: 'Core Feature', tagCls: 'tg-blue',
    title: 'Machine Learning Prediction',
    text: "Uses scikit-learn's Linear Regression algorithm trained on real student data to deliver accurate score predictions.",
  },
  {
    icon: '⚡', iconBg: 'bg-green', tag: 'Performance', tagCls: 'tg-green',
    title: 'Fast Results',
    text: 'Get your predicted score in under 2 seconds. No waiting, no sign-up required — just instant academic insights.',
  },
  {
    icon: '🎓', iconBg: 'bg-violet', tag: 'UX', tagCls: 'tg-violet',
    title: 'Student Friendly',
    text: 'Designed specifically for college students. Clean interface, simple inputs, and clear grade interpretations.',
  },
  {
    icon: '📊', iconBg: 'bg-amber', tag: 'Analytics', tagCls: 'tg-amber',
    title: 'Data Visualization',
    text: 'Visual charts help you understand how study habits affect scores across a real dataset of 500+ students.',
  },
  {
    icon: '🔒', iconBg: 'bg-red', tag: 'Privacy', tagCls: 'tg-red',
    title: 'No Data Stored',
    text: 'Your inputs are processed in-memory only. We never save or share your academic information with anyone.',
  },
  {
    icon: '📱', iconBg: 'bg-teal', tag: 'Design', tagCls: 'tg-green',
    title: 'Fully Responsive',
    text: 'Works seamlessly on desktop, tablet, and mobile. Access your predictions anywhere, anytime.',
  },
]

export default function Features() {
  return (
    <section className="section" id="features">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow amber">✨ Features</span>
          <h2>Everything You Need</h2>
          <p>Built for college students, powered by real ML technology, and designed for clarity.</p>
        </div>

        <div className="features-grid">
          {FEATURES.map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="fhead">
                <div className={`ficon ${f.iconBg}`}>{f.icon}</div>
                <span className={`tag ${f.tagCls}`}>{f.tag}</span>
              </div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
