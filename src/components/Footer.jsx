import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      <div className="footer-content" id="footer-container" style={{ textAlign: 'center', padding: '20px 0', borderTop: '1px solid var(--border)', marginTop: '20px' }}>
        <p id="copy-right-footer" style={{ marginBottom: '10px' }}>© {new Date().getFullYear()} Pencilwood. All rights reserved.</p>
        <div className="footer-links" style={{ display: 'flex', gap: '15px', justifyContent: 'center', fontSize: '13px' }}>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="#">Privacy Policy</Link>
          <Link to="#">Terms & Conditions</Link>
        </div>
      </div>
    </footer>
  );
}
