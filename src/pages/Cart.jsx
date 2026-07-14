import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { API_BASE } from '../utils/config';
import { useToast } from '../context/ToastContext';
import Breadcrumb from '../components/Breadcrumb';

export default function Cart() {
  const { cartItems, loading, changeQty, removeCartItem } = useCart();
  const navigate = useNavigate();
  const toast = useToast();

  const [selectedIds, setSelectedIds] = useState([]);

  // Default to selecting all items when cart loads
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      setSelectedIds(cartItems.map(item => item.id));
    }
  }, [cartItems]);

  const handleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectedItems = (cartItems || []).filter(item => selectedIds.includes(item.id));
  const totalQty = selectedItems.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  const subtotal = selectedItems.reduce((sum, item) => sum + (Number(item.total) || 0), 0);

  const goToCheckout = () => {
    if (selectedIds.length === 0) {
      toast("Select at least one product");
      return;
    }
    localStorage.setItem("checkout_cart_ids", JSON.stringify(selectedIds));
    navigate('/checkout');
  };

  // Safe image URL builder
  const getImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return API_BASE + img;
  };

  return (
    <>
      <Breadcrumb items={[{ label: 'My Cart' }]} />

      <div className="cart-head">
        <h1 className="cart-title">My Cart</h1>
        <div className="cart-count">{totalQty} Items</div>
      </div>

      {loading ? (
        <p style={{ padding: '20px' }}>Loading cart...</p>
      ) : !cartItems || cartItems.length === 0 ? (
        <div className="cart-empty">
          <div className="empty-icon">🛒</div>
          <div className="empty-title">Your cart is empty</div>
          <div className="empty-sub">Browse premium Pencilwood products</div>
          <button className="btn-checkout" onClick={() => navigate('/products')}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-left">
            <div className="cart-items">
              {cartItems.map((item) => {
                const img = getImageUrl(item.image);
                const productName = item.product || item.name || 'Product';
                const price = item.price || 0;
                const total = item.total || 0;
                const quantity = item.quantity || 0;
                
                return (
                  <div className="cart-item" key={item.id}>
                    <input
                      type="checkbox"
                      className="cart-check"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => handleSelect(item.id)}
                    />
                    {img ? (
                      <img className="cart-img" src={img} alt={productName} />
                    ) : (
                      <div className="cart-img" style={{ background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📦</div>
                    )}
                    
                    <div className="cart-info">
                      <div className="cart-name">{productName}</div>
                      <div className="cart-total-price">৳ {total}</div>
                      <div className="cart-subtotal-mini">
                        {quantity} × ৳ {price}
                      </div>
                    </div>

                    <div className="cart-qty">
                      <button onClick={() => changeQty(item.id, quantity - 1)}>−</button>
                      <span>{quantity}</span>
                      <button onClick={() => changeQty(item.id, quantity + 1)}>+</button>
                    </div>

                    <button className="remove-btn" onClick={() => removeCartItem(item.id)}>×</button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="cart-right">
            <div className="cart-summary">
              <div className="summary-title">Order Summary</div>
              
              <div id="cartSummaryList">
                {selectedItems.map(item => (
                  <div className="summary-row" key={item.id}>
                    <span>{item.product || item.name || 'Product'} × {item.quantity || 0}</span>
                    <span>৳ {item.total || 0}</span>
                  </div>
                ))}
              </div>

              <div className="summary-row">
                <span>Subtotal</span>
                <span id="cartSubtotal">৳ {subtotal}</span>
              </div>

              <button className="btn-checkout" onClick={goToCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
