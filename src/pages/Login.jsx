import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Breadcrumb from '../components/Breadcrumb';

export default function Login() {
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();
  const { login, signup, isAuthenticated } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup State
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  // If already authenticated, redirect to profile
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      toast("Please enter email and password");
      return;
    }
    setLoading(true);
    try {
      const success = await login(loginEmail, loginPassword);
      if (success) {
        toast("Logged in successfully ✅");
        navigate('/profile');
      } else {
        toast("Invalid credentials ❌");
      }
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      toast("Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!signupName || !signupPhone || !signupEmail || !signupPassword) {
      toast("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const success = await signup({
        email: signupEmail,
        password: signupPassword,
        username: signupPhone,
        name: signupName,
        phone: signupPhone,
        whatsapp: signupPhone
      });

      if (success) {
        toast("Account created successfully ✅");
        navigate('/profile');
      } else {
        toast("Signup failed. Email or phone might be in use. ❌");
      }
    } catch (err) {
      console.error("SIGNUP ERROR:", err);
      toast("Signup failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  return (
    <>
      <Breadcrumb items={[{ label: 'Login / Signup' }]} />

      <div className="auth-page">
        <div className="auth-box">
          <div className="auth-tabs">
            <button 
              className={`tab ${activeTab === 'login' ? 'on' : ''}`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button 
              className={`tab ${activeTab === 'signup' ? 'on' : ''}`}
              onClick={() => setActiveTab('signup')}
            >
              Signup
            </button>
          </div>

          {activeTab === 'login' ? (
            <div className="auth-form" style={{ display: 'flex' }}>
              <input 
                type="email" 
                placeholder="Email Address"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                onKeyPress={e => handleKeyPress(e, handleLogin)}
              />
              <input 
                type="password" 
                placeholder="Password"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                onKeyPress={e => handleKeyPress(e, handleLogin)}
              />
              <button onClick={handleLogin} disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          ) : (
            <div className="auth-form" style={{ display: 'flex' }}>
              <input 
                type="text" 
                placeholder="Full Name"
                value={signupName}
                onChange={e => setSignupName(e.target.value)}
                onKeyPress={e => handleKeyPress(e, handleSignup)}
              />
              <input 
                type="text" 
                placeholder="Phone Number"
                value={signupPhone}
                onChange={e => setSignupPhone(e.target.value)}
                onKeyPress={e => handleKeyPress(e, handleSignup)}
              />
              <input 
                type="email" 
                placeholder="Email Address"
                value={signupEmail}
                onChange={e => setSignupEmail(e.target.value)}
                onKeyPress={e => handleKeyPress(e, handleSignup)}
              />
              <input 
                type="password" 
                placeholder="Password"
                value={signupPassword}
                onChange={e => setSignupPassword(e.target.value)}
                onKeyPress={e => handleKeyPress(e, handleSignup)}
              />
              <button onClick={handleSignup} disabled={loading}>
                {loading ? 'Creating...' : 'Create Account'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Login Loader */}
      {loading && (
        <div className="login-loader" style={{ display: 'flex' }}>
          <div className="loader-box">
            <div className="spinner"></div>
            <p>{activeTab === 'login' ? 'Logging in...' : 'Creating account...'}</p>
          </div>
        </div>
      )}
    </>
  );
}
