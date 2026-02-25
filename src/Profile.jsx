import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Database, Shield, Zap, Mail } from 'lucide-react';

const API_URL = 'https://fullstackprojectbackend-production.up.railway.app';

function Profile({ user }) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/api/profile/${user.name}`);
        if (!response.ok) throw new Error('Failed to fetch profile data');
        const data = await response.json();
        setProfileData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.name) {
      fetchProfile();
    }
  }, [user]);

  if (loading) return <div style={{ padding: '40px', color: '#f8fafc' }}>Loading profile data...</div>;
  if (error) return <div style={{ padding: '40px', color: '#fca5a5' }}>Error: {error}</div>;
  if (!profileData) return <div style={{ padding: '40px', color: '#f8fafc' }}>No profile data found.</div>;

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', color: '#f8fafc' }}>
        <User size={32} color="#818cf8" />
        Account Profile
      </h2>

      <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '16px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '24px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={16} /> User ID
            </div>
            <div style={{ fontSize: '18px', fontWeight: '500', color: '#f8fafc' }}>{profileData.user_id}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '24px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={16} /> Username
            </div>
            <div style={{ fontSize: '18px', fontWeight: '500', color: '#f8fafc' }}>{profileData.name}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '24px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={16} /> Email Address
            </div>
            <div style={{ fontSize: '18px', fontWeight: '500', color: '#f8fafc' }}>{profileData.email}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '24px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={16} /> Password
            </div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', maxWidth: '300px' }}>
              <input
                type={showPassword ? "text" : "password"}
                value={profileData.password}
                readOnly
                style={{ width: '100%', padding: '12px', paddingRight: '40px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'rgba(15, 23, 42, 0.5)', color: '#f8fafc', fontSize: '16px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', background: 'transparent', border: 'none', color: '#818cf8', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={16} /> Subscription Plan
            </div>
            <div style={{ fontSize: '18px', fontWeight: '500', color: '#818cf8', display: 'inline-block', padding: '4px 12px', backgroundColor: 'rgba(129, 140, 248, 0.1)', borderRadius: '20px', marginTop: '8px' }}>
              {profileData.plan}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Profile;