import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Database, Shield, Zap, Mail, Edit2 } from 'lucide-react';

const API_URL = 'https://fullstackprojectbackend-production.up.railway.app';

function Profile({ user, setUser }) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showPassword, setShowPassword] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  
  const [isEditingPlan, setIsEditingPlan] = useState(false);
  const [dropdownPlan, setDropdownPlan] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [customUnit, setCustomUnit] = useState("TB");

  const [message, setMessage] = useState({ type: '', text: '' });

  const defaultPlans = ['Free Plan', 'Upgrade 1', 'Upgrade 2', 'Pro'];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/api/profile/${user.name}`);
        if (!response.ok) throw new Error('Failed to fetch profile data');
        const data = await response.json();
        setProfileData(data);
        setNewPassword(data.password);
        
        const isStandard = defaultPlans.includes(data.plan);
        setDropdownPlan(isStandard ? data.plan : 'Custom');
        setCustomAmount("");
        setCustomUnit("TB");
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

  const handleUpdatePassword = async () => {
    try {
      const response = await fetch(`${API_URL}/api/profile/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: profileData.user_id, newPassword })
      });
      if (!response.ok) throw new Error("Failed to update password");
      
      setProfileData({ ...profileData, password: newPassword });
      setIsEditingPassword(false);
      setMessage({ type: 'success', text: 'Password updated successfully' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const handleUpdatePlan = async () => {
    try {
      let payload = { userId: profileData.user_id };

      if (dropdownPlan === 'Custom') {
        const amt = parseInt(customAmount);
        if (!amt || amt < 1) throw new Error("Minimum custom plan size is 1 TB");
        if (customUnit === 'PB' && amt > 1) throw new Error("Maximum custom plan size is 1 PB");
        if (customUnit === 'TB' && amt > 1024) throw new Error("Maximum custom plan size is 1024 TB (1 PB)");

        payload.isCustom = true;
        payload.customAmount = customAmount;
        payload.customUnit = customUnit;
      } else {
        payload.newPlanName = dropdownPlan;
      }

      const response = await fetch(`${API_URL}/api/profile/plan`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update plan");

      setProfileData({ ...profileData, plan: data.planName });
      if (setUser) {
        setUser(prevUser => ({ ...prevUser, plan: data.planName }));
      }

      setIsEditingPlan(false);
      setMessage({ type: 'success', text: 'Plan updated successfully' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const cancelPlanEdit = () => {
    setIsEditingPlan(false);
    const isStandard = defaultPlans.includes(profileData.plan);
    setDropdownPlan(isStandard ? profileData.plan : 'Custom');
    setCustomAmount("");
    setCustomUnit("TB");
  };

  if (loading) return <div style={{ padding: '40px', color: '#f8fafc' }}>Loading profile data...</div>;
  if (error) return <div style={{ padding: '40px', color: '#fca5a5' }}>Error: {error}</div>;
  if (!profileData) return <div style={{ padding: '40px', color: '#f8fafc' }}>No profile data found.</div>;

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', color: '#f8fafc' }}>
        <User size={32} color="#818cf8" />
        Account Profile
      </h2>

      {message.text && (
        <div style={{ padding: '12px', marginBottom: '24px', borderRadius: '8px', textAlign: 'center', backgroundColor: message.type === 'error' ? 'rgba(248, 113, 113, 0.1)' : 'rgba(74, 222, 128, 0.1)', color: message.type === 'error' ? '#f87171' : '#4ade80' }}>
          {message.text}
        </div>
      )}

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
            {isEditingPassword ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', maxWidth: '300px', flex: 1 }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{ width: '100%', padding: '12px', paddingRight: '40px', borderRadius: '8px', border: '1px solid #818cf8', backgroundColor: 'rgba(15, 23, 42, 0.5)', color: '#f8fafc', fontSize: '16px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '12px', background: 'transparent', border: 'none', color: '#818cf8', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <button onClick={handleUpdatePassword} style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#818cf8', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>Save</button>
                <button onClick={() => { setIsEditingPassword(false); setNewPassword(profileData.password); }} style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'transparent', color: '#94a3b8', cursor: 'pointer' }}>Cancel</button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
                <button onClick={() => setIsEditingPassword(true)} style={{ background: 'transparent', border: 'none', color: '#818cf8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}>
                  <Edit2 size={16} /> Edit
                </button>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={16} /> Subscription Plan
            </div>
            {isEditingPlan ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <select
                  value={dropdownPlan}
                  onChange={(e) => setDropdownPlan(e.target.value)}
                  style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #818cf8', backgroundColor: 'rgba(15, 23, 42, 0.5)', color: '#f8fafc', fontSize: '16px', minWidth: '150px' }}
                >
                  <option value="Free Plan">Free Plan</option>
                  <option value="Upgrade 1">Upgrade 1</option>
                  <option value="Upgrade 2">Upgrade 2</option>
                  <option value="Pro">Pro</option>
                  <option value="Custom">Custom...</option>
                </select>
                
                {dropdownPlan === 'Custom' && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="Amount"
                      min="1"
                      max={customUnit === 'PB' ? "1" : "1024"}
                      style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #818cf8', backgroundColor: 'rgba(15, 23, 42, 0.5)', color: '#f8fafc', fontSize: '16px', width: '100px' }}
                    />
                    <select
                      value={customUnit}
                      onChange={(e) => {
                        setCustomUnit(e.target.value);
                        if (e.target.value === 'PB' && parseInt(customAmount) > 1) {
                          setCustomAmount("1");
                        }
                      }}
                      style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #818cf8', backgroundColor: 'rgba(15, 23, 42, 0.5)', color: '#f8fafc', fontSize: '16px' }}
                    >
                      <option value="TB">TB</option>
                      <option value="PB">PB</option>
                    </select>
                  </div>
                )}

                <button onClick={handleUpdatePlan} style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#818cf8', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>Save</button>
                <button onClick={cancelPlanEdit} style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'transparent', color: '#94a3b8', cursor: 'pointer' }}>Cancel</button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '18px', fontWeight: '500', color: '#818cf8', display: 'inline-block', padding: '6px 16px', backgroundColor: 'rgba(129, 140, 248, 0.1)', borderRadius: '20px' }}>
                  {profileData.plan}
                </div>
                <button onClick={() => setIsEditingPlan(true)} style={{ background: 'transparent', border: 'none', color: '#818cf8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}>
                  <Edit2 size={16} /> Edit
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Profile;