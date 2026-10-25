import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="footer-logo-icon">📖</span>

            <div>
              <div className="footer-logo-name">
                Neuro<span>Pathways</span>
              </div>

              <div className="footer-tagline">
                Read • Learn • Grow • Your Way
              </div>
            </div>
          </div>

          <p className="footer-description">
            Personalized reading support designed to help neurodivergent
            learners build confidence, strengthen skills, and progress at
            their own pace.
          </p>
        </div>

        <div className="footer-links">
          <div className="footer-column">
            <h4>Explore</h4>

            <Link to="/">Home</Link>
            <a href="#journey">How It Works</a>
            <a href="#tools">Adaptive Tools</a>
            <a href="#about">About</a>
          </div>

          <div className="footer-column">
            <h4>Your Journey</h4>

            <Link to="/signup">Create Profile</Link>
            <Link to="/assessment">Take Assessment</Link>
            <Link to="/learning-path">Learning Path</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>

          <div className="footer-column">
            <h4>Support</h4>

            <Link to="/resources">Resources</Link>
            <Link to="/accessibility">Accessibility</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 NeuroPathways. All rights reserved.</p>

        <p className="footer-message">
          Different minds. Different pathways.
        </p>
      </div>
      <p className="footer-disclaimer">
        NeuroPathways provides educational reading support.
        It does not diagnose learning conditions or replace
        professional educational evaluations.
      </p>
    </footer>
  );
}

export default Footer;
