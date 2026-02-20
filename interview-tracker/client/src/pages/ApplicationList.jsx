import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Layout from './Layout';

const STAGES = ['All', 'Applied', 'HR Round', 'Technical', 'Final Round', 'Offer', 'Rejected'];
const STAGE_COLORS = { 'Applied':'#6366f1','HR Round':'#f59e0b','Technical':'#3b82f6','Final Round':'#8b5cf6','Offer':'#10b981','Rejected':'#ef4444' };

export default function ApplicationList() {
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStage, setFilterStage] = useState('All');
  const [search, setSearch] = useState('');

  const fetchApps = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStage !== 'All') params.stage = filterStage;
      if (search) params.search = search;
      const res = await api.get('/applications', { params });
      setApps(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApps(); }, [filterStage]);

  const handleSearch = (e) => {
    if (e.key === 'Enter') fetchApps();
  };

  const inputStyle = { background:'#1a1d27', border:'1px solid #2a2d3a', borderRadius:'8px', padding:'8px 14px', color:'#e2e8f0', fontSize:'14px', outline:'none', width:'240px' };

  return (
    <Layout>
      <div style={{ display:'flex', gap:'12px', marginBottom:'1.5rem', flexWrap:'wrap', alignItems:'center' }}>
        <input style={inputStyle} placeholder="Search company or role... (Enter)" value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={handleSearch} />
        <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
          {STAGES.map(s => (
            <button key={s} onClick={()=>setFilterStage(s)} style={{ background: filterStage===s?(STAGE_COLORS[s]||'#6366f1'):'#1a1d27', color: filterStage===s?'#fff':'#9ca3af', border:`1px solid ${filterStage===s?(STAGE_COLORS[s]||'#6366f1'):'#2a2d3a'}`, borderRadius:'20px', padding:'4px 12px', fontSize:'12px', fontWeight:600, cursor:'pointer' }}>{s}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ color:'#6b7280', textAlign:'center', padding:'3rem' }}>Loading...</div>
      ) : apps.length === 0 ? (
        <div style={{ color:'#4b5563', textAlign:'center', padding:'3rem' }}>No applications found</div>
      ) : (
        <div style={{ display:'grid', gap:'10px' }}>
          {apps.map(c => (
            <div key={c._id} onClick={()=>navigate(`/applications/${c._id}`)} style={{ background:'#0f1117', border:'1px solid #1e2230', borderRadius:'12px', padding:'1rem 1.25rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
                <div style={{ width:'40px', height:'40px', background:STAGE_COLORS[c.stage]+'22', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, color:STAGE_COLORS[c.stage], fontSize:'16px' }}>
                  {c.company[0]}
                </div>
                <div>
                  <div style={{ fontWeight:700, fontSize:'15px' }}>{c.company}</div>
                  <div style={{ color:'#6b7280', fontSize:'13px' }}>{c.role} {c.salary && <span style={{ color:'#4b5563' }}>· {c.salary}</span>}</div>
                </div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                {c.dateApplied && <span style={{ color:'#4b5563', fontSize:'12px' }}>{new Date(c.dateApplied).toLocaleDateString()}</span>}
                <span style={{ background:STAGE_COLORS[c.stage]+'22', color:STAGE_COLORS[c.stage], border:`1px solid ${STAGE_COLORS[c.stage]}44`, borderRadius:'20px', padding:'2px 10px', fontSize:'11px', fontWeight:700, textTransform:'uppercase' }}>{c.stage}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
