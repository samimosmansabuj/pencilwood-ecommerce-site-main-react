import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE, getAccessToken } from '../utils/config';
import { useToast } from '../context/ToastContext';
import Breadcrumb from '../components/Breadcrumb';

export default function Checkout() {
  const navigate = useNavigate();
  const toast = useToast();

  const [districts, setDistricts] = useState([]);
  const [savedAddresses, setSavedAddresses] = useState([]);
  
  const [checkoutData, setCheckoutData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');

  useEffect(() => {
    async function initCheckout() {
      await loadDistricts();
      await loadSavedAddresses();
      await loadCheckoutSummary('');
    }
    initCheckout();
  }, []);

  // Update summary when district changes (for delivery charge recalculation)
  useEffect(() => {
    if (selectedDistrict || !loading) {
      loadCheckoutSummary(selectedDistrict);
    }
  }, [selectedDistrict]);

  async function loadDistricts() {
    try {
      const res = await fetch("https://bdapi.vercel.app/api/v.1/district");
      const data = await res.json();
      if (data.status === 200 && data.success) {
        setDistricts(data.data);
      }
    } catch (err) {
      console.error("DISTRICT ERROR:", err);
    }
  }

  async function loadSavedAddresses() {
    try {
      const res = await fetch(`${API_BASE}/api/ecom/addresses/`, {
        headers: { "Authorization": `Bearer ${getAccessToken()}` }
      });
      const data = await res.json();
      if (data.status && Array.isArray(data.data)) {
        setSavedAddresses(data.data);
      }
    } catch (err) {
      console.error("ADDRESS ERROR:", err);
    }
  }

  async function loadCheckoutSummary(district) {
    setLoading(true);
    try {
      const selectedCartIds = JSON.parse(localStorage.getItem("checkout_cart_ids")) || [];
      const params = new URLSearchParams();
      selectedCartIds.forEach(id => params.append("cart_ids", id));
      if (district) {
        params.append("district", district);
      }

      const res = await fetch(`${API_BASE}/api/checkout/summary/?${params.toString()}`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${getAccessToken()}` }
      });
      const data = await res.json();

      if (!data.status) {
        toast(data.message || "Checkout failed");
        return;
      }
      setCheckoutData(data.data);
    } catch (err) {
      console.error("CHECKOUT ERROR:", err);
      toast("Failed to load checkout summary");
    } finally {
      setLoading(false);
    }
  }

  const handleAddressSelect = (e) => {
    const val = e.target.value;
    setSelectedAddressId(val);
    
    if (val) {
      const addr = savedAddresses.find(a => String(a.id) === String(val));
      if (addr) {
        setFullName(addr.full_name || '');
        setPhone(addr.phone_number || '');
        setNewAddress(addr.address || '');
        setSelectedDistrict(addr.district || '');
      }
    } else {
      setFullName('');
      setPhone('');
      setNewAddress('');
      setSelectedDistrict('');
    }
  };

  const handlePlaceOrder = async () => {
    if (!fullName || !phone) {
      toast("Name and Phone are required");
      return;
    }
    if (!selectedAddressId && (!newAddress || !selectedDistrict)) {
      toast("Please provide delivery address");
      return;
    }

    try {
      const selectedCartIds = JSON.parse(localStorage.getItem("checkout_cart_ids")) || [];
      
      const payload = {
        cart_ids: selectedCartIds,
        payment_method: paymentMethod,
        shipping_address: {
          full_name: fullName,
          phone_number: phone,
          address: newAddress,
          district: selectedDistrict
        }
      };

      if (selectedAddressId) {
        payload.shipping_address_id = selectedAddressId;
      }

      const res = await fetch(`${API_BASE}/api/orders/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAccessToken()}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.status) {
        localStorage.removeItem("checkout_cart_ids");
        if (data.data?.order_id) {
          localStorage.setItem("last_order_id", data.data.order_id);
        }
        window.location.href = "/order";
      } else {
        toast(data.message || "Failed to place order");
      }
    } catch (err) {
      console.error(err);
      toast("Something went wrong");
    }
  };

  const items = checkoutData?.items || [];
  const subtotal = checkoutData?.subtotal || 0;
  const deliveryCharge = checkoutData?.delivery_charge || 0;
  const total = Number(subtotal) + Number(deliveryCharge);

  return (
    <>
      <Breadcrumb items={[{ label: 'Checkout' }]} />

      <div className="checkout-wrap">
        <div className="checkout-left">
          
          <div className="ck-card">
            <div className="ck-title">Delivery Information</div>
            
            <div className="ck-field">
              <label>Full Name</label>
              <input 
                type="text" 
                placeholder="Your full name" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="ck-field">
              <label>Phone Number</label>
              <input 
                type="text" 
                placeholder="01XXXXXXXXX" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="ck-field">
              <label>Select Saved Address</label>
              <select value={selectedAddressId} onChange={handleAddressSelect}>
                <option value="">Select Address</option>
                {savedAddresses.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.title || 'Address'} - {a.phone_number}
                  </option>
                ))}
              </select>
            </div>

            <div className="ck-field">
              <label>Or Enter New Address</label>
              <div className="ck-address-row">
                <input
                  type="text"
                  className="ck-address-input"
                  placeholder="Area / Road / House"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  disabled={!!selectedAddressId}
                />
                <select
                  className="ck-district"
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  disabled={!!selectedAddressId}
                >
                  <option value="">Select District</option>
                  {districts.map(d => (
                    <option key={d.id} value={d.name}>{d.bn_name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="ck-card">
            <div className="ck-title">Payment Method</div>
            <div className="payment-options">
              <label className="pay-opt">
                <input 
                  type="radio" 
                  name="payment" 
                  value="cod" 
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                />
                <span className="pay-box">
                  <span className="pay-icon">💵</span>
                  <span className="pay-name">Cash on Delivery</span>
                </span>
              </label>

              <label className="pay-opt">
                <input 
                  type="radio" 
                  name="payment" 
                  value="online" 
                  checked={paymentMethod === 'online'}
                  onChange={() => setPaymentMethod('online')}
                />
                <span className="pay-box">
                  <span className="pay-icon">💳</span>
                  <span className="pay-name">Online Payment</span>
                </span>
              </label>
            </div>
          </div>

        </div>

        <div className="checkout-right">
          <div className="ck-summary">
            <div className="summary-title">Order Summary</div>
            
            <div className="ck-products">
              {loading ? (
                <div className="ck-product">Loading checkout...</div>
              ) : items.length === 0 ? (
                <div className="empty-checkout">No checkout items found</div>
              ) : (
                items.map((item, idx) => (
                  <div className="ck-product" key={idx}>
                    <div className="ck-product-info">
                      <div className="ck-product-name">{item.product}</div>
                      <div className="ck-product-meta">Qty: {item.quantity}</div>
                    </div>
                    <div className="ck-product-right">
                      <div className="ck-product-price">৳ {item.total}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>৳ {subtotal}</span>
            </div>
            
            <div className="summary-row">
              <span>Delivery Charge</span>
              <span>৳ {deliveryCharge}</span>
            </div>
            
            <div className="summary-row total-row">
              <span>Total</span>
              <span>৳ {total}</span>
            </div>

            <button className="btn-place-order" onClick={handlePlaceOrder} disabled={loading}>
              Confirm Order
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
