import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { API_BASE } from '../utils/config';
import Breadcrumb from '../components/Breadcrumb';

export default function Wishlist() {
  const navigate = useNavigate();
  const { wishlistItems, wishlistCount, loading, removeWishlist } = useWishlist();
  const { quickAddCart } = useCart();

  const handleOpenProduct = (slug) => {
    if (slug) navigate(`/product/${slug}`);
  };

  return (
    <>
      <Breadcrumb items={[{ label: 'My Wishlist' }]} />

      <div className="wishlist-head">
        <h1 className="wishlist-title">My Wishlist ❤️</h1>
        <div className="wishlist-count" id="wishlistCountText">
          {wishlistCount} Item{wishlistCount !== 1 ? 's' : ''}
        </div>
      </div>

      {loading ? (
        <div className="wishlist-grid">
          <p style={{ padding: '20px' }}>Loading wishlist...</p>
        </div>
      ) : wishlistItems.length === 0 ? (
        <div className="wishlist-empty" id="emptyWishlist">
          <div className="empty-icon">❤️</div>
          <div className="empty-title">Your wishlist is empty</div>
          <div className="empty-sub">Save your favorite Pencilwood products</div>
          <button className="btn-shop" onClick={() => navigate('/products')}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="wishlist-grid" id="wishlistContainer">
          {wishlistItems.map((item) => {
            const image = item.image 
              ? (item.image.startsWith("http") ? item.image : API_BASE + item.image) 
              : "";
            const slug = item.slug || "";
            
            return (
              <div className="wishlist-row" key={item.id}>
                <div className="wishlist-image" onClick={() => handleOpenProduct(slug)}>
                  <img src={image} alt={item.name} />
                </div>
                
                <div className="wishlist-info">
                  <div className="wishlist-name" onClick={() => handleOpenProduct(slug)}>
                    {item.name}
                  </div>
                  
                  <div className="wishlist-price">
                    ৳ {item.discount_price || item.price}
                    {item.discount_price && (
                      <span className="wishlist-old"> ৳ {item.price}</span>
                    )}
                  </div>
                </div>
                
                <div className="wishlist-actions">
                  <button 
                    className="icon-btn cart-btn" 
                    onClick={() => quickAddCart(item.product_id)} 
                    title="Add to Cart"
                  >
                    🛒
                  </button>
                  <button 
                    className="icon-btn remove-btn" 
                    onClick={() => removeWishlist(item.id)} 
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
