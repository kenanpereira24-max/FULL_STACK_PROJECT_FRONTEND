import React from 'react';
import { Link } from 'react-router-dom';
import { Cloud } from 'lucide-react';

function Home() {
  return (
    <div className="page-container">
      <Cloud size={80} color="#818cf8" style={{ marginBottom: '24px' }} />
      <h1 style={{ fontSize: '48px', marginBottom: '16px' }}>Welcome to Cloud Solutions</h1>
      <p style={{ fontSize: '20px', color: '#94a3b8', maxWidth: '600px', marginBottom: '40px' }}>
        Secure, fast, and reliable cloud storage for all your personal and business needs.
      </p>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link to="/pricing" style={styles.buttonOutline}>View Pricing</Link>
        <Link to="/login" style={styles.buttonPrimary}>Get Started</Link>
      </div>
    </div>
  );
}

const styles = {
  buttonPrimary: {
    padding: '14px 28px',
    backgroundColor: '#818cf8',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '12px',
    fontWeight: 'bold',
    fontSize: '18px'
  },
  buttonOutline: {
    padding: '14px 28px',
    backgroundColor: 'transparent',
    border: '2px solid #818cf8',
    color: '#818cf8',
    textDecoration: 'none',
    borderRadius: '12px',
    fontWeight: 'bold',
    fontSize: '18px'
  }
};

export default Home;