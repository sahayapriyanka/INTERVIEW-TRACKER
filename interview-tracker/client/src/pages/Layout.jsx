import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import ApplicationForm from './ApplicationForm';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showAdd, setShowAdd] = useState(false);

  const nav = [['/', '📊 Dashboard'], ['/applications', '📋 Applications']];

  return (
    <div style={{ minHeight:'100vh', background:'#080a10', color:'#e2e8f0', fontFamily:"'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ borderBottom:'1px solid #1e2230', padding:'0 1.5rem', display:'flex', alignItems:'center', justifyContent:'space-between', height:'56px', background:'#0a0c13', position:'sticky', top:0, zIndex:100 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <span style={{ fontSize:'18px' }}>🎯</span>
          <span style={{ fontWeight:800, fontFamily:"'Space Mono', monospace", fontSize:'14px', letterSpacing:'0.05em' }}>InterviewOS</span>
        </div>
        <nav style={{ display:'flex', gap:'4px' }}>
          {nav.map(([path, label]) => (
            <button key={path} onClick={()=>navigate(path)} style={{ background: location.pathname===path?'#1e2230':'transparent', color: location.pathname===path?'#fff':'#6b7280', border:'none', borderRadius:'8px', padding:'6px 14px', fontSize:'13px', fontWeight:600, cursor:'pointer' }}>{label}</button>
          ))}
        </nav>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <span style={{ color:'#4b5563', fontSize:'13px' }}>{user?.name}</span>
          <button onClick={()=>setShowAdd(true)} style={{ background:'#6366f1', color:'#fff', border:'none', borderRadius:'8px', padding:'6px 14px', fontSize:'13px', fontWeight:700, cursor:'pointer' }}>+ Add</button>
          <button onClick={()=>{ logout(); navigate('/login'); }} style={{ background:'transparent', color:'#6b7280', border:'1px solid #2a2d3a', borderRadius:'8px', padding:'6px 12px', fontSize:'12px', fontWeight:600, cursor:'pointer' }}>Logout</button>
        </div>
      </div>

      <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'2rem 1.5rem' }}>
        {children}
      </div>

      {showAdd && <ApplicationForm onClose={()=>setShowAdd(false)} onSaved={()=>{ setShowAdd(false); window.location.reload(); }} />}
    </div>
  );
}
