import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import './App.css';

const API_URL = 'https://fullstackprojectbackend-production.up.railway.app';

function Auth({ onAuthSuccess, defaultIsLogin }) {
  const [isLogin, setIsLogin] = useState(defaultIsLogin);
  const [identifier, setIdentifier] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [bsod, setBsod] = useState(false);

  useEffect(() => {
    setIsLogin(defaultIsLogin);
    setError('');
    setIdentifier('');
    setUsername('');
    setEmail('');
    setPassword('');
  }, [defaultIsLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isLogin && identifier.toLowerCase() === 'bsod') {
      setBsod(true);
      return;
    }

    const endpoint = isLogin ? '/api/login' : '/api/signup';
    const payload = isLogin ? { identifier, password } : { username, email, password };
    
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        onAuthSuccess(data.user, !isLogin);
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (err) {
      setError('Failed to connect to server');
    }
  };

  if (bsod) {
    return (
      <div style={{ backgroundColor: '#0000AA', width: '100vw', height: '100vh', color: '#FFFFFF', fontFamily: 'monospace', padding: '50px', boxSizing: 'border-box' }}>
        <div style={{ backgroundColor: '#AAAAAA', color: '#0000AA', display: 'inline-block', padding: '2px 10px', fontWeight: 'bold', marginBottom: '30px', marginLeft: 'calc(50% - 40px)' }}>Windows</div>
        <p>A fatal exception 0E has occurred at 028:C0011E36 in VXD VMM(01) + 00010E36. The current application will be terminated.</p>
        <p>* Press CTRL+ALT+DEL again to restart your computer. You will lose any unsaved information in all applications.</p>
        <p style={{ textAlign: 'center', marginTop: '50px' }}>Press any key to continue _</p>
      </div>
    );
  }

  return (
    <div className="auth-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-color)' }}>
      <div className="auth-card" style={{ backgroundColor: 'var(--card-bg)', padding: '40px', borderRadius: '16px', border: '1px solid var(--border)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px', color: '#f8fafc' }}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        {error && <div style={{ backgroundColor: 'rgba(248, 113, 113, 0.1)', color: '#f87171', padding: '12px', borderRadius: '8px', marginBottom: '16px', textAlign: 'center', fontSize: '14px' }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {isLogin ? (
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#94a3b8' }}>Username or Email</label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'rgba(15, 23, 42, 0.5)', color: '#f8fafc', boxSizing: 'border-box' }}
                required
              />
            </div>
          ) : (
            <>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#94a3b8' }}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'rgba(15, 23, 42, 0.5)', color: '#f8fafc', boxSizing: 'border-box' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#94a3b8' }}>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'rgba(15, 23, 42, 0.5)', color: '#f8fafc', boxSizing: 'border-box' }}
                  required
                />
              </div>
            </>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#94a3b8' }}>Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '12px', paddingRight: '40px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'rgba(15, 23, 42, 0.5)', color: '#f8fafc', boxSizing: 'border-box' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button type="submit" style={{ backgroundColor: '#818cf8', color: '#ffffff', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' }}>
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#94a3b8' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => setIsLogin(!isLogin)} style={{ color: '#818cf8', cursor: 'pointer', fontWeight: 'bold' }}>
            {isLogin ? 'Sign Up' : 'Log In'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Auth;