import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import './App.css';

// CLEAN URL - No port needed here
const API_URL = 'https://fullstackprojectbackend-production.up.railway.app';

function Auth({ onAuthSuccess, defaultIsLogin }) {
  const [isLogin, setIsLogin] = useState(defaultIsLogin);
  const [identifier, setIdentifier] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsLogin(defaultIsLogin);
    setError('');
  }, [defaultIsLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

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

  return (
    <div className="auth-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-color)' }}>
      <div className="auth-card" style={{ backgroundColor: 'var(--card-bg)', padding: '40px', borderRadius: '16px', border: '1px solid var(--border)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px', color: '#f8fafc' }}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        {error && <div style={{ backgroundColor: 'rgba(248, 113, 113, 0.1)', color: '#f87171', padding: '12px', borderRadius: '8px', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {isLogin ? (
            <input type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="Username or Email" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'rgba(15, 23, 42, 0.5)', color: '#f8fafc' }} required />
          ) : (
            <>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'rgba(15, 23, 42, 0.5)', color: '#f8fafc' }} required />
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'rgba(15, 23, 42, 0.5)', color: '#f8fafc' }} required />
            </>
          )}
          <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'rgba(15, 23, 42, 0.5)', color: '#f8fafc' }} required />
          <button type="submit" style={{ backgroundColor: '#818cf8', color: '#fff', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>{isLogin ? 'Sign In' : 'Sign Up'}</button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '20px', color: '#94a3b8' }}>
          {isLogin ? "No account? " : "Already have one? "}
          <span onClick={() => setIsLogin(!isLogin)} style={{ color: '#818cf8', cursor: 'pointer', fontWeight: 'bold' }}>{isLogin ? 'Sign Up' : 'Log In'}</span>
        </div>
      </div>
    </div>
  );
}

export default Auth;