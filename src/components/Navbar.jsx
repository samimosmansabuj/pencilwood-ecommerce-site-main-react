import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function Navbar({ onOpenDrawer }) {
  const { isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
    }
  };

  return (
    <>
      <div className="topnav">
        <div className="topnav-in">
          
          <button className="hburg" onClick={onOpenDrawer} aria-label="Menu">
            <span></span><span></span><span></span>
          </button>

          <Link className="logo-wrap" to="/">
            <div className="logo-icon">PW</div>
            <div className="logo-name">
              Pencilwood
              <small>Premium Goods</small>
            </div>
          </Link>

          <div className="search-wrap">
            <input 
              className="search-in" 
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="search-go" onClick={handleSearch}>🔍</button>
          </div>

          <div className="search-actions">
            <button className="mobile-search-open" onClick={() => setSearchOpen(true)}>
              🔍
            </button>
          </div>

          <div className="nav-actions" style={{ display: 'flex', gap: '20px' }}>
            {!isAuthenticated ? (
              <div className="nav-ic login-btn" onClick={() => navigate('/login')}>
                <span className="nav-ic-icon">👤</span>
                Login
              </div>
            ) : (
              <div className="nav-ic account-btn" onClick={() => navigate('/profile')}>
                <span className="nav-ic-icon">👤</span>
                Account
              </div>
            )}

            <div className="nav-ic" onClick={() => navigate('/wishlist')}>
              <span className="nav-ic-icon">
                ❤️
                <span className="cart-dot">{wishlistCount}</span>
              </span>
              Wishlist
            </div>

            <div className="nav-ic cart-wrap" onClick={() => navigate('/cart')}>
              <span className="nav-ic-icon">
                🛒
                <span className="cart-dot">{cartCount}</span>
              </span>
              Cart
            </div>
          </div>

        </div>
      </div>

      <div className="subnav">
        <div className="subnav-in">
          <Link to="/">Home</Link>
          <Link to="/products">All Product</Link>
          <Link to="/products?category=wallet">Wallets</Link>
          <Link to="/products?category=belt">Belts</Link>
          <a href="https://cradle.pencilwoodbd.com/" target="_blank" rel="noreferrer">Cradle</a>
          <Link to="/products?category=accessories">Accessories</Link>
          <Link to="/products?sort=newest">New Arrivals</Link>
          <Link to="/products?sort=popularity">Popularity</Link>
        </div>
      </div>

      {/* SEARCH OVERLAY */}
      {searchOpen && (
        <div className="search-overlay show" style={{ display: 'flex' }}>
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch}>🔍</button>
            <button onClick={() => setSearchOpen(false)}>✕</button>
          </div>
        </div>
      )}
    </>
  );
}
