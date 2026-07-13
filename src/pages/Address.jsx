import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE, getAccessToken } from '../utils/config';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Breadcrumb from '../components/Breadcrumb';

export default function Address() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const toast = useToast();

  const [addresses, setAddresses] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressText, setAddressText] = useState('');
  const [district, setDistrict] = useState('');
  const [deliveryCharge, setDeliveryCharge] = useState(0);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    loadDistricts();
    loadAddresses();
  }, [isLoggedIn, navigate]);

  const loadDistricts = async () => {
    try {
      const res = await fetch("https://bdapi.vercel.app/api/v.1/district");
      const data = await res.json();
      if (data.status === 200 && data.success) {
        setDistricts(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadAddresses = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/ecom/addresses/`, {
        headers: { "Authorization": `Bearer ${getAccessToken()}` }
      });
      const data = await res.json();
      if (data.status && Array.isArray(data.data)) {
        setAddresses(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDistrictChange = async (e) => {
    const val = e.target.value;
    setDistrict(val);
    
    if (val) {
      try {
        const res = await fetch(`${API_BASE}/api/checkout/summary/?district=${val}`, {
          headers: { "Authorization": `Bearer ${getAccessToken()}` }
        });
        const data = await res.json();
        if (data.status && data.data?.delivery_charge) {
          setDeliveryCharge(Number(data.data.delivery_charge));
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      setDeliveryCharge(0);
    }
  };

  const handleSaveAddress = async () => {
    if (!name || !phone || !addressText || !district) {
      toast("Please fill all fields");
      return;
    }

    try {
      const payload = {
        title: "Home",
        full_name: name,
        phone_number: phone,
        address: addressText,
        district: district
      };

      const res = await fetch(`${API_BASE}/api/ecom/addresses/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAccessToken()}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (data.status) {
        toast("Address added successfully");
        setName('');
        setPhone('');
        setAddressText('');
        setDistrict('');
        setDeliveryCharge(0);
        loadAddresses();
      } else {
        toast(data.message || "Failed to add address");
      }
    } catch (err) {
      console.error(err);
      toast("An error occurred");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/ecom/addresses/${id}/delete/`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${getAccessToken()}` }
      });
      if (res.ok || res.status === 204) {
        toast("Address deleted");
        loadAddresses();
      } else {
        toast("Failed to delete address");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Breadcrumb items={[{ label: 'Address Book' }]} />
      
      <div className="page" style={{ paddingTop: '20px' }}>
        <div className="address-head">
          <h1>My Addresses</h1>
          <div className="address-count">{addresses.length} Saved</div>
        </div>

        <div className="address-list">
          {loading ? (
            <div className="addr-card">Loading addresses...</div>
          ) : addresses.length === 0 ? (
            <div className="addr-card">No addresses found</div>
          ) : (
            addresses.map(a => (
              <div className="addr-card" key={a.id}>
                <div className="addr-top">
                  <div className="addr-title">{a.title || 'Address'}</div>
                  <button className="addr-del" onClick={() => handleDelete(a.id)}>Delete</button>
                </div>
                <div className="addr-detail"><strong>Name:</strong> {a.full_name || a.name}</div>
                <div className="addr-detail"><strong>Phone:</strong> {a.phone_number || a.phone}</div>
                <div className="addr-detail"><strong>District:</strong> {a.district}</div>
                <div className="addr-detail"><strong>Address:</strong> {a.address}</div>
              </div>
            ))
          )}
        </div>

        <div className="address-form">
          <h2>Add New Address</h2>
          
          <div className="form-grid">
            <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
            <input type="text" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>

          <select value={district} onChange={handleDistrictChange}>
            <option value="">Select District</option>
            {districts.map(d => (
              <option key={d.id} value={d.name}>{d.bn_name}</option>
            ))}
          </select>

          <div className="delivery-charge-box">
            Delivery Charge: <span>৳ {deliveryCharge}</span>
          </div>

          <textarea placeholder="Full Address" value={addressText} onChange={e => setAddressText(e.target.value)}></textarea>

          <button id="addAddressBtn" onClick={handleSaveAddress}>Save Address</button>
        </div>
      </div>
    </>
  );
}
