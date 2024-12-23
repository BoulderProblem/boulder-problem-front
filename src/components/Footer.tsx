import { Component } from "react";
import { Link } from "react-router-dom";

class Footer extends Component {
  render() {
    return (
      <footer className="footer bg-neutral text-neutral-content p-10">
        <nav>
          <h6 className="footer-title">Services</h6>
          <Link className="text-base" to="/places">
            Branding
          </Link>
        </nav>
        <nav>
          <h6 className="footer-title">Company</h6>
          <Link className="text-base" to="/places">
            About us
          </Link>
        </nav>
        <nav>
          <h6 className="footer-title">Legal</h6>
          <Link className="text-base" to="/places">
            Terms of use
          </Link>
        </nav>
      </footer>
    );
  }
}

export default Footer; // Don’t forget to use export default!
