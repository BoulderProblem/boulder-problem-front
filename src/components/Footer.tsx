import { Component } from 'react';
import { Link } from 'react-router-dom';

class Footer extends Component {
  render() {
    return (
      <footer
        className={`footer bg-neutral text-neutral-content p-10 ${
          location.pathname === '/messages' ? 'hidden' : ''
        }`}
      >
        <nav>
          <h6 className="footer-title">Services</h6>
          <Link className="text-base" to="/">
            Branding
          </Link>
        </nav>
        <nav>
          <h6 className="footer-title">Company</h6>
          <Link className="text-base" to="/">
            About us
          </Link>
        </nav>
        <nav>
          <h6 className="footer-title">Legal</h6>
          <Link className="text-base" to="/">
            Terms of use
          </Link>
        </nav>
      </footer>
    );
  }
}

export default Footer; // Don’t forget to use export default!
