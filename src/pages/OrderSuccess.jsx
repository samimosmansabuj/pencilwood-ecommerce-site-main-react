import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API_BASE, getAccessToken } from '../utils/config';
import { useAuth } from '../context/AuthContext';
import Breadcrumb from '../components/Breadcrumb';

export default function OrderSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isLoggedIn } = useAuth();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    async function loadOrder() {
      let orderId = searchParams.get('id');
      
      // Fallback to last order placed in checkout if no ID provided in URL
      if (!orderId) {
        orderId = localStorage.getItem('last_order_id');
      }

      if (!orderId) {
        setError('Order ID missing');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/order/${orderId}/`, {
          method: "GET",
          headers: { "Authorization": `Bearer ${getAccessToken()}` }
        });

        const data = await res.json();
        if (data.status && data.data) {
          setOrder(data.data);
        } else {
          setError(data.message || 'Order not found');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load order');
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [isLoggedIn, navigate, searchParams]);

  const getStatusLabel = (status) => {
    const s = status ? status.toLowerCase() : "";
    if (s === "new") return "Pending";
    if (s === "follow_up") return "Follow Up";
    if (s === "confirmed") return "Confirmed";
    if (s === "shipped") return "Shipped";
    if (s === "delivered") return "Delivered";
    if (s === "cancelled") return "Cancelled";
    if (s === "returned") return "Returned";
    return status;
  };

  return (
    <>
      <Breadcrumb items={[{ label: 'Order Details' }]} />

      <div className="page order-page" style={{ paddingTop: '20px' }}>
        {loading ? (
          <p style={{ textAlign: 'center' }}>Loading order details...</p>
        ) : error ? (
          <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>
        ) : order ? (
          <>
            <div className="order-header">
              <div>
                <h1>Order #{order.order_id}</h1>
                <p className="order-date">
                  Placed on: {new Date(order.date || order.created_at).toLocaleString()}
                </p>
              </div>
              <div className={`order-status ${order.status?.toLowerCase()}`}>
                {getStatusLabel(order.status)}
              </div>
            </div>

            <div className="order-grid">
              <div className="order-left">
                <div className="card">
                  <h2>Items</h2>
                  <div className="order-items">
                    {order.items?.map((item, idx) => (
                      <div className="oi-row" key={idx}>
                        <div className="oi-img">
                          {item.image ? (
                            <img src={item.image.startsWith('http') ? item.image : API_BASE + item.image} alt={item.name} />
                          ) : "👜"}
                        </div>
                        <div className="oi-info">
                          <div className="oi-name">{item.name}</div>
                          {item.variant && Object.entries(item.variant).map(([k, v]) => (
                            <div className="oi-meta" key={k}>{k}: {v}</div>
                          ))}
                          <div className="oi-meta">Qty: {item.qty}</div>
                        </div>
                        <div className="oi-price">৳ {item.price || item.total}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card" id="orderDelivery">
                  <h2>Delivery Information</h2>
                  <p><strong>Name:</strong> {order.shipping_address?.full_name}</p>
                  <p><strong>Phone:</strong> {order.shipping_address?.phone_number}</p>
                  <p><strong>Address:</strong> {order.shipping_address?.address}, {order.shipping_address?.district}</p>
                </div>

                <div className="card">
                  <h2>Payment</h2>
                  <p>{order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
                </div>
              </div>

              <div className="order-right">
                <div className="card" id="orderSummary">
                  <h2>Summary</h2>
                  <div className="s-row">
                    <span>Subtotal</span>
                    <span>৳ {order.subtotal || order.total - order.delivery_charge}</span>
                  </div>
                  <div className="s-row">
                    <span>Delivery Charge</span>
                    <span>৳ {order.delivery_charge}</span>
                  </div>
                  <hr style={{ margin: '15px 0', borderColor: '#eee' }} />
                  <div className="s-row total">
                    <span>Total</span>
                    <span>৳ {order.total}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}
