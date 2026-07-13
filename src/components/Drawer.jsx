import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Drawer({ isOpen, onClose }) {
  const { isAuthenticated } = useAuth();

  return (
    <div id="drawer-container">
      <div 
        className={`drawer-overlay ${isOpen ? 'on' : ''}`} 
        onClick={onClose}
      ></div>
      <div className={`drawer ${isOpen ? 'on' : ''}`}>
        <div className="drawer-head">
          <div className="drawer-title">Menu</div>
          <button className="drawer-close" onClick={onClose}>×</button>
        </div>

        <Link to="/" onClick={onClose}>Home</Link>
        <Link to="/products" onClick={onClose}>All Products</Link>
        <Link to="/products?category=wallet" onClick={onClose}>Wallets</Link>
        <Link to="/products?category=belt" onClick={onClose}>Belts</Link>
        <Link to="/products?category=passport-holder" onClick={onClose}>Passport Holders</Link>
        <Link to="/products?category=card-holder" onClick={onClose}>Card Holders</Link>
        
        <a href="https://cradle.pencilwoodbd.com/" target="_blank" rel="noreferrer" onClick={onClose}>Cradle</a>
        
        <Link to="/products?sort=newest" onClick={onClose}>New Arrivals</Link>
        <Link to="/products?sort=popularity" onClick={onClose}>Popular</Link>

        {!isAuthenticated ? (
          <Link to="/login" className="login-btn" onClick={onClose}>👤 Login</Link>
        ) : (
          <Link to="/profile" className="account-btn" onClick={onClose}>👤 Account</Link>
        )}

        <a href="https://wa.me/" style={{ color: 'var(--wa)', fontWeight: 700 }}>💬 WhatsApp Support</a>
      </div>
    </div>
  );
}
