// Sticky top navigation bar.
export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="brand">
          <span className="brand-logo">🧠</span>
          ScorePredictor
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how">How It Works</a>
          <a href="#statistics">Statistics</a>
        </div>
        <a href="#predict" className="btn btn-primary">Try It Free →</a>
      </div>
    </nav>
  )
}
