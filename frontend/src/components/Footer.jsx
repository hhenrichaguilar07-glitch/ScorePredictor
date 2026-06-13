import { STATS } from '../config.js'

// Dark footer with project info (matches the college-project design).
export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Column 1: brand + description */}
          <div>
            <div className="brand">
              <span className="brand-logo">🧠</span>
              ScorePredictor
            </div>
            <p className="fdesc">
              A Machine Learning web application that predicts student exam scores using
              Linear Regression. Built with Python Flask and Scikit-learn.
            </p>
            <div className="fchips">
              <span>Python</span><span>Flask</span><span>Scikit-learn</span><span>React</span>
            </div>
          </div>

          {/* Column 2: about project */}
          <div>
            <h4>About Project</h4>
            <ul className="about">
              <li>Linear Regression Model</li>
              <li>Dataset: 500+ Student Records</li>
              <li>Accuracy: {STATS.accuracy}% (R² = {STATS.r2})</li>
              <li>Inputs: Study Hours + Attendance</li>
              <li>Output: Predicted Exam Score</li>
            </ul>
          </div>

          {/* Column 3: contact / course info */}
          <div>
            <h4>Contact</h4>
            <div className="contact-item">
              <span className="ci-ico">🏫</span>
              <div>
                <div className="ci-label">Department</div>
                <div className="ci-val">Computer Science &amp; Engineering</div>
              </div>
            </div>
            <div className="contact-item">
              <span className="ci-ico">📖</span>
              <div>
                <div className="ci-label">Course</div>
                <div className="ci-val">Machine Learning (CS401)</div>
              </div>
            </div>
            <div className="contact-item">
              <span className="ci-ico">📅</span>
              <div>
                <div className="ci-label">Semester</div>
                <div className="ci-val">6th Semester, 2025–26</div>
              </div>
            </div>
            <div className="contact-item">
              <span className="ci-ico">🎓</span>
              <div>
                <div className="ci-label">Project Type</div>
                <div className="ci-val">College Mini Project</div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>Developed for College Machine Learning Project · CS401 · 2025–26</p>
          <p>Built with <span className="heart">❤</span> using Python · Flask · Scikit-learn · React · Recharts</p>
        </div>
      </div>
    </footer>
  )
}
