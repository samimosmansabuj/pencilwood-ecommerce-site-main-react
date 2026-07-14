import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE, getAccessToken } from '../utils/config';
import { useAuth } from '../context/AuthContext';
import Breadcrumb from '../components/Breadcrumb';

export default function MyOrders() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    async function loadOrders() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/order/my-orders/`, {
          headers: { "Authorization": `Bearer ${getAccessToken()}` }
        });
        const data = await res.json();
        if (data.status && Array.isArray(data.data)) {
          setOrders(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    loadOrders();
  }, [isAuthenticated, navigate]);

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

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status?.toLowerCase() === filter);

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'new', label: 'Pending' },
    { id: 'follow_up', label: 'Follow Up' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'shipped', label: 'Shipped' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'cancelled', label: 'Cancelled' },
    { id: 'returned', label: 'Returned' },
  ];

  return (
    <>
      <Breadcrumb items={[{ label: 'My Orders' }]} />

      <div className="page" style={{ paddingTop: '20px' }}>
        <h1 className="orders-title">My Orders</h1>

        <div className="orders-filter">
          {filters.map(f => (
            <button 
              key={f.id}
              className={`of-btn ${filter === f.id ? 'active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="orders-list">
          {loading ? (
            <p style={{ textAlign: 'center' }}>Loading orders...</p>
          ) : filteredOrders.length === 0 ? (
            <p style={{ textAlign: 'center' }}>No orders found 😢</p>
          ) : (
            filteredOrders.map(order => (
              <div className="order-card" key={order.order_id}>
                <div className="order-top">
                  <div>
                    <div className="order-id">Order #{order.order_id}</div>
                    <div className="order-date">
                      Placed on: {new Date(order.date || order.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className={`order-status ${order.status?.toLowerCase()}`}>
                    {getStatusLabel(order.status)}
                  </div>
                </div>

                <div className="order-items">
                  {order.items?.map((item, idx) => (
                    <div className="order-item" key={idx}>
                      <div className="oi-img">
                        {item.image ? (
                          <img src={item.image.startsWith('http') ? item.image : API_BASE + item.image} alt={item.name} />
                        ) : "👜"}
                      </div>
                      <div className="oi-info">
                        <div className="oi-name">{item.name}</div>
                        <div className="oi-meta">Qty: {item.qty}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-bottom">
                  <div className="order-total">Total: ৳ {order.total}</div>
                  <button className="btn-view" onClick={() => navigate(`/order/${order.order_id}`)}>
                    View Details →
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
