import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE, getAccessToken } from '../utils/config';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Breadcrumb from '../components/Breadcrumb';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, isLoggedIn } = useAuth();
  const toast = useToast();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    async function loadProfile() {
      try {
        const res = await fetch(`${API_BASE}/api/accounts/profile/`, {
          headers: { "Authorization": `Bearer ${getAccessToken()}` }
        });
        const data = await res.json();
        
        if (data.status) {
          const profile = data.data;
          setFullName(profile.full_name || profile.name || '');
          setPhone(profile.phone_number || profile.phone || '');
          setWhatsapp(profile.whatsapp_number || profile.whatsapp || '');
          setEmail(profile.email || '');
        }
      } catch (err) {
        console.error("PROFILE ERROR:", err);
      } finally {
        setLoading(false);
      }
    }
    
    loadProfile();
  }, [isLoggedIn, navigate]);

  const saveProfile = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/accounts/profile/update/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAccessToken()}`
        },
        body: JSON.stringify({
          full_name: fullName,
          phone_number: phone,
          whatsapp_number: whatsapp,
          email: email
        })
      });
      
      const data = await res.json();
      
      if (data.status) {
        toast("Profile updated successfully");
      } else {
        toast(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      toast("An error occurred");
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <Breadcrumb items={[{ label: 'My Profile' }]} />

      <div className="page" style={{ paddingTop: '20px' }}>
        <h1>My Profile</h1>

        {loading ? (
          <p>Loading profile...</p>
        ) : (
          <div className="profile-card">
            <div className="profile-row">
              <label>Full Name</label>
              <input type="text" placeholder="Enter your full name" value={fullName} onChange={e => setFullName(e.target.value)} />
            </div>

            <div className="profile-row">
              <label>Phone</label>
              <input type="text" placeholder="Enter your phone number" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>

            <div className="profile-row">
              <label>WhatsApp Number</label>
              <input type="text" placeholder="Enter WhatsApp number" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} />
            </div>

            <div className="profile-row">
              <label>Email</label>
              <input type="text" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>

            <button onClick={saveProfile}>Save Changes</button>
          </div>
        )}

        <div className="account-links">
          <Link to="/my-orders">📦 My Orders</Link>
          <Link to="/address">📍 Address Book</Link>
          <Link to="/cart">🛒 Cart</Link>
          <button className="logout-btn-profile" onClick={handleLogout}>
            ⏻ Logout
          </button>
        </div>
      </div>
    </>
  );
}
