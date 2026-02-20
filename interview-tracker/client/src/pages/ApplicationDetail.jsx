import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Layout from './Layout';
import ApplicationForm from './ApplicationForm';

const STAGES = ['Applied', 'HR Round', 'Technical', 'Final Round', 'Offer', 'Rejected'];
const STAGE_COLORS = { 'Applied':'#6366f1','HR Round':'#f59e0b','Technical':'#3b82f6','Final Round':'#8b5cf6','Offer':'#10b981','Rejected':'#ef4444' };

export default function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);

  const fetchApp = async () => {
    try {
      const res = await api.get(`/applications/${id}`);
      setApp(res.data.data);
    } catch (err) {
      navigate('/applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApp(); }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this application?')) return;
    await api.delete(`/applications/${id}`);
    navigate('/applications');
  };

  if (loading) return <Layout><div style={{ color:'#6b7280', padding:'3rem', textAlign:'center' }}>Loading...</div></Layout>;
  if (!app) return null;

  const currentIdx = STAGES.indexOf(app.stage);

  return (
    <Layout>
      <button onClick={()=>navigate('/applications')} style={{ background:'transparent', color:'#9ca3af', border:'1px solid #2a2d3a', borderRadius:'8px', padding:'6px 14px', fontSize:'13px', fontWeight:600, cursor:'pointer', marginBottom:'1.5rem' }}>← Back</button>

      <div style={{ background:'#0f1117', border:'1px solid #1e2230', borderRadius:'16px', padding:'2rem' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.5rem', flexWrap:'wrap', gap:'12px' }}>
          <div>
            <h2 style={{ margin:0, fontSize:'1.5rem', fontWeight:800 }}>{app.company}</h2>
            <p style={{ color:'#9ca3af', margin:'4px 0 0', fontSize:'15px' }}>
              {app.role} {app.salary && <span style={{ color:'#6366f1' }}>· {app.salary}</span>}
            </p>
            {app.dateApplied && <p style={{ color:'#4b5563', margin:'4px 0 0', fontSize:'13px' }}>Applied: {new Date(app.dateApplied).toLocaleDateString()}</p>}
          </div>
          <div style={{ display:'flex', gap:'8px' }}>
            <span style={{ background:STAGE_COLORS[app.stage]+'22', color:STAGE_COLORS[app.stage], border:`1px solid ${STAGE_COLORS[app.stage]}44`, borderRadius:'20px', padding:'4px 12px', fontSize:'12px', fontWeight:700, textTransform:'uppercase' }}>{app.stage}</span>
            <button onClick={()=>setShowEdit(true)} style={{ background:'transparent', color:'#9ca3af', border:'1px solid #2a2d3a', borderRadius:'8px', padding:'6px 12px', fontSize:'12px', fontWeight:600, cursor:'pointer' }}>Edit</button>
            <button onClick={handleDelete} style={{ background:'#ef444422', color:'#ef4444', border:'1px solid #ef444433', borderRadius:'8px', padding:'6px 12px', fontSize:'12px', fontWeight:600, cursor:'pointer' }}>Delete</button>
          </div>
        </div>

        {/* Stage progression */}
        <div style={{ marginBottom:'1.5rem' }}>
          <div style={{ fontSize:'11px', fontWeight:700, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'10px' }}>Stage Progression</div>
          <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', alignItems:'center' }}>
            {STAGES.map((s, i) => (
              <div key={s} style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                <div style={{ padding:'4px 10px', borderRadius:'6px', fontSize:'12px', fontWeight:600,
                  background: i===currentIdx?STAGE_COLORS[s]+'33':i<currentIdx?'#1a1d27':'transparent',
                  color: i===currentIdx?STAGE_COLORS[s]:i<currentIdx?'#4b5563':'#2a2d3a',
                  border:`1px solid ${i===currentIdx?STAGE_COLORS[s]+'55':i<currentIdx?'#2a2d3a':'#1a1d27'}` }}>
                  {s}
                </div>
                {i < STAGES.length-1 && <span style={{ color:'#2a2d3a' }}>→</span>}
              </div>
            ))}
          </div>
        </div>

        {app.notes && (
          <div style={{ background:'#0a0c13', border:'1px solid #1e2230', borderRadius:'10px', padding:'1rem', marginBottom:'12px' }}>
            <div style={{ fontSize:'11px', fontWeight:700, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'6px' }}>Notes & Feedback</div>
            <p style={{ margin:0, fontSize:'14px', color:'#d1d5db', lineHeight:1.6 }}>{app.notes}</p>
          </div>
        )}

        {app.rejectionReason && (
          <div style={{ background:'#ef444411', border:'1px solid #ef444422', borderRadius:'10px', padding:'1rem' }}>
            <div style={{ fontSize:'11px', fontWeight:700, color:'#ef4444', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'6px' }}>Rejection Reason</div>
            <p style={{ margin:0, fontSize:'14px', color:'#fca5a5', lineHeight:1.6 }}>{app.rejectionReason}</p>
          </div>
        )}

        {/* Interview Rounds */}
        {app.rounds?.length > 0 && (
          <div style={{ marginTop:'1rem' }}>
            <div style={{ fontSize:'11px', fontWeight:700, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'10px' }}>Interview Rounds</div>
            <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
              {app.rounds.map((r, i) => (
                <div key={i} style={{ background:'#0a0c13', border:'1px solid #1e2230', borderRadius:'8px', padding:'10px 14px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between' }}>
                    <span style={{ fontWeight:700, fontSize:'13px' }}>{r.name}</span>
                    <span style={{ color: r.passed?'#10b981':'#ef4444', fontSize:'12px', fontWeight:700 }}>{r.passed?'Passed':'Did not pass'}</span>
                  </div>
                  {r.feedback && <p style={{ margin:'6px 0 0', color:'#9ca3af', fontSize:'13px' }}>{r.feedback}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showEdit && <ApplicationForm existing={app} onClose={()=>setShowEdit(false)} onSaved={()=>{ setShowEdit(false); fetchApp(); }} />}
    </Layout>
  );
}
