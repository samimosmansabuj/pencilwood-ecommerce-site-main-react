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
    if (cartItems.length > 0) {
      setSelectedIds(cartItems.map(item => item.id));
    }
  }, [cartItems]);

  const handleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectedItems = cartItems.filter(item => selectedIds.includes(item.id));
  const totalQty = selectedItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const subtotal = selectedItems.reduce((sum, item) => sum + Number(item.total || 0), 0);

  const goToCheckout = () => {
    if (selectedIds.length === 0) {
      toast("Select at least one product");
      return;
    }
    localStorage.setItem("checkout_cart_ids", JSON.stringify(selectedIds));
    navigate('/checkout');
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
      ) : cartItems.length === 0 ? (
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
                const img = item.image ? (item.image.startsWith("http") ? item.image : API_BASE + item.image) : "";
                const newPrice = item.price;
                
                return (
                  <div className="cart-item" key={item.id}>
                    <input
                      type="checkbox"
                      className="cart-check"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => handleSelect(item.id)}
                    />
                    <img className="cart-img" src={img} alt={item.product} />
                    
                    <div className="cart-info">
                      <div className="cart-name">{item.product}</div>
                      <div className="cart-total-price">৳ {item.total}</div>
                      <div className="cart-subtotal-mini">
                        {item.quantity} × ৳ {newPrice}
                      </div>
                    </div>

                    <div className="cart-qty">
                      <button onClick={() => changeQty(item.id, item.quantity - 1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => changeQty(item.id, item.quantity + 1)}>+</button>
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
                    <span>{item.product} × {item.quantity}</span>
                    <span>৳ {item.total}</span>
                  </div>
                ))}
              </div>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>৳ {subtotal}</span>
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
