import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Layout from './Layout';

const STAGE_COLORS = { 'Applied':'#6366f1','HR Round':'#f59e0b','Technical':'#3b82f6','Final Round':'#8b5cf6','Offer':'#10b981','Rejected':'#ef4444' };

const StatCard = ({ label, value, color }) => (
  <div style={{ background:'#0f1117', border:'1px solid #1e2230', borderRadius:'12px', padding:'1.25rem 1.5rem', flex:1, minWidth:'130px' }}>
    <div style={{ fontSize:'2rem', fontWeight:800, color, fontFamily:"'Space Mono', monospace" }}>{value}</div>
    <div style={{ fontSize:'11px', color:'#6b7280', marginTop:'4px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em' }}>{label}</div>
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/applications/analytics'),
      api.get('/applications?limit=5'),
    ]).then(([analyticsRes, appsRes]) => {
      setAnalytics(analyticsRes.data.data);
      setRecent(appsRes.data.data.slice(0, 5));
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Layout><div style={{ color:'#6b7280', padding:'3rem', textAlign:'center' }}>Loading analytics...</div></Layout>;

  const stages = Object.keys(STAGE_COLORS);

  return (
    <Layout>
      <h2 style={{ fontFamily:"'Space Mono', monospace", fontSize:'1.3rem', marginBottom:'1.5rem', color:'#fff' }}>
        Welcome back, {user?.name?.split(' ')[0]} 👋
      </h2>

      {/* Stats */}
      <div style={{ display:'flex', gap:'12px', marginBottom:'1.5rem', flexWrap:'wrap' }}>
        <StatCard label="Total Applied" value={analytics?.total ?? 0} color="#6366f1" />
        <StatCard label="Active" value={analytics?.active ?? 0} color="#f59e0b" />
        <StatCard label="Offers" value={analytics?.offers ?? 0} color="#10b981" />
        <StatCard label="Rejected" value={analytics?.rejected ?? 0} color="#ef4444" />
        <StatCard label="Success Rate" value={`${analytics?.successRate ?? 0}%`} color="#8b5cf6" />
      </div>

      {/* Pipeline */}
      <div style={{ background:'#0f1117', border:'1px solid #1e2230', borderRadius:'16px', padding:'1.5rem', marginBottom:'1.5rem' }}>
        <h3 style={{ margin:'0 0 1.25rem', fontSize:'13px', fontWeight:700, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.08em' }}>Pipeline</h3>
        <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
          {stages.map(s => {
            const count = analytics?.stageCounts?.[s] || 0;
            const pct = analytics?.total ? (count / analytics.total) * 100 : 0;
            return (
              <div key={s} style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                <div style={{ width:'110px', fontSize:'13px', color:'#9ca3af' }}>{s}</div>
                <div style={{ flex:1, background:'#1a1d27', borderRadius:'4px', height:'8px' }}>
                  <div style={{ width:`${pct}%`, height:'100%', background:STAGE_COLORS[s], borderRadius:'4px', transition:'width 0.6s ease' }} />
                </div>
                <div style={{ width:'24px', textAlign:'right', fontSize:'13px', fontWeight:700, color:STAGE_COLORS[s], fontFamily:"'Space Mono', monospace" }}>{count}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent */}
      <div style={{ background:'#0f1117', border:'1px solid #1e2230', borderRadius:'16px', padding:'1.5rem' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem' }}>
          <h3 style={{ margin:0, fontSize:'13px', fontWeight:700, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.08em' }}>Recent Applications</h3>
          <button onClick={()=>navigate('/applications')} style={{ background:'transparent', color:'#6366f1', border:'none', fontSize:'13px', fontWeight:600, cursor:'pointer' }}>View all →</button>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
          {recent.length === 0 && <div style={{ color:'#4b5563', fontSize:'14px', textAlign:'center', padding:'2rem' }}>No applications yet. Add your first one!</div>}
          {recent.map(c => (
            <div key={c._id} onClick={()=>navigate(`/applications/${c._id}`)} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', background:'#0a0c13', borderRadius:'10px', cursor:'pointer', border:'1px solid #1e2230' }}>
              <div>
                <div style={{ fontWeight:700, fontSize:'14px' }}>{c.company}</div>
                <div style={{ color:'#6b7280', fontSize:'12px' }}>{c.role}</div>
              </div>
              <span style={{ background:STAGE_COLORS[c.stage]+'22', color:STAGE_COLORS[c.stage], border:`1px solid ${STAGE_COLORS[c.stage]}44`, borderRadius:'20px', padding:'2px 10px', fontSize:'11px', fontWeight:700, textTransform:'uppercase' }}>{c.stage}</span>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
