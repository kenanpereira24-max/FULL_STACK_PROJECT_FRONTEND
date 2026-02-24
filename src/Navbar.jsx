import React from 'react';
import { Link } from 'react-router-dom';
import { Cloud, LogOut, LogIn, UserPlus } from 'lucide-react';

function Navbar({ user, onLogout }) {
  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-color)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Cloud color="#818cf8" size={28} />
        <h1 style={{ color: '#818cf8', margin: 0, fontSize: '24px' }}>Cloud Solutions</h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Link to="/" style={{ color: '#f8fafc', textDecoration: 'none', fontWeight: '500' }}>Home</Link>
        <Link to="/pricing" style={{ color: '#f8fafc', textDecoration: 'none', fontWeight: '500' }}>View Pricing</Link>
        
        {user ? (
          <>
            <Link to="/profile" style={{ color: '#f8fafc', textDecoration: 'none', fontWeight: '500' }}>Profile</Link>
            <Link to="/dashboard" style={{ color: '#f8fafc', textDecoration: 'none', fontWeight: '500' }}>Dashboard</Link>
            <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: '#fca5a5', cursor: 'pointer', fontWeight: '500', fontSize: '16px' }}>
              <LogOut size={18} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f8fafc', textDecoration: 'none', fontWeight: '500' }}>
              <LogIn size={18} /> Log In
            </Link>
            <Link to="/signup" style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#818cf8', color: '#ffffff', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
              <UserPlus size={18} /> Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;