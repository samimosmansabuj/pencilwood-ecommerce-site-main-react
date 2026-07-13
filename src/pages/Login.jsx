import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Breadcrumb from '../components/Breadcrumb';

export default function Login() {
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();
  const { login, signup, isLoggedIn } = useAuth();
  const toast = useToast();

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup State
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/profile');
    }
  }, [isLoggedIn, navigate]);

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      toast("Please enter email and password");
      return;
    }
    const success = await login(loginEmail, loginPassword);
    if (success) {
      toast("Logged in successfully");
      navigate('/profile');
    } else {
      toast("Login failed. Check credentials.");
    }
  };

  const handleSignup = async () => {
    if (!signupName || !signupPhone || !signupEmail || !signupPassword) {
      toast("Please fill all fields");
      return;
    }
    const success = await signup({
      email: signupEmail,
      password: signupPassword,
      username: signupPhone,
      name: signupName,
      phone: signupPhone,
      whatsapp: signupPhone
    });

    if (success) {
      toast("Account created successfully");
      // Switch to login or navigate depending on how signup is implemented in context
      setActiveTab('login');
      setLoginEmail(signupEmail);
    } else {
      toast("Signup failed. Email or phone might be in use.");
    }
  };

  return (
    <>
      <Breadcrumb items={[{ label: 'Login / Signup' }]} />

      <div className="auth-page" style={{ paddingTop: '20px' }}>
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
              />
              <input 
                type="password" 
                placeholder="Password"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
              />
              <button onClick={handleLogin}>Login</button>
            </div>
          ) : (
            <div className="auth-form" style={{ display: 'flex' }}>
              <input 
                type="text" 
                placeholder="Full Name"
                value={signupName}
                onChange={e => setSignupName(e.target.value)}
              />
              <input 
                type="text" 
                placeholder="Phone Number"
                value={signupPhone}
                onChange={e => setSignupPhone(e.target.value)}
              />
              <input 
                type="email" 
                placeholder="Email Address"
                value={signupEmail}
                onChange={e => setSignupEmail(e.target.value)}
              />
              <input 
                type="password" 
                placeholder="Password"
                value={signupPassword}
                onChange={e => setSignupPassword(e.target.value)}
              />
              <button onClick={handleSignup}>Create Account</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
