import { useState } from 'react';
import api from '../api/axios';

const STAGES = ['Applied', 'HR Round', 'Technical', 'Final Round', 'Offer', 'Rejected'];
const inputStyle = { background:'#1a1d27', border:'1px solid #2a2d3a', borderRadius:'8px', padding:'10px 14px', color:'#e2e8f0', fontSize:'14px', width:'100%', outline:'none', boxSizing:'border-box' };
const labelStyle = { display:'block', fontSize:'11px', fontWeight:700, color:'#6b7280', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'6px' };

export default function ApplicationForm({ onClose, onSaved, existing }) {
  const [form, setForm] = useState(existing ? {
    company: existing.company, role: existing.role, stage: existing.stage,
    dateApplied: existing.dateApplied?.split('T')[0] || '',
    salary: existing.salary || '', notes: existing.notes || '', rejectionReason: existing.rejectionReason || '',
  } : { company:'', role:'', stage:'Applied', dateApplied:'', salary:'', notes:'', rejectionReason:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.company || !form.role) { setError('Company and role are required'); return; }
    setLoading(true);
    try {
      if (existing) {
        await api.put(`/applications/${existing._id}`, form);
      } else {
        await api.post('/applications', form);
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const F = (key) => ({ value: form[key], onChange: e => setForm(f => ({ ...f, [key]: e.target.value })) });

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(4px)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ background:'#0f1117', border:'1px solid #1e2230', borderRadius:'16px', padding:'2rem', width:'100%', maxWidth:'500px', boxShadow:'0 25px 60px rgba(0,0,0,0.5)' }}>
        <h3 style={{ margin:'0 0 1.25rem', fontFamily:"'Space Mono', monospace", fontSize:'16px', color:'#fff' }}>
          {existing ? 'Edit Application' : 'Add Application'}
        </h3>

        <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            <div><label style={labelStyle}>Company *</label><input style={inputStyle} {...F('company')} placeholder="e.g. Stripe" /></div>
            <div><label style={labelStyle}>Role *</label><input style={inputStyle} {...F('role')} placeholder="e.g. Frontend Engineer" /></div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            <div><label style={labelStyle}>Stage</label>
              <select style={inputStyle} {...F('stage')}>
                {STAGES.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div><label style={labelStyle}>Date Applied</label><input type="date" style={inputStyle} {...F('dateApplied')} /></div>
          </div>
          <div><label style={labelStyle}>Salary / Package</label><input style={inputStyle} {...F('salary')} placeholder="e.g. 170k, ₹28 LPA" /></div>
          <div><label style={labelStyle}>Notes</label><textarea style={{...inputStyle, minHeight:'72px', resize:'vertical'}} {...F('notes')} placeholder="Interview notes, feedback..." /></div>
          {form.stage === 'Rejected' && (
            <div><label style={labelStyle}>Rejection Reason</label><input style={inputStyle} {...F('rejectionReason')} placeholder="e.g. Failed system design" /></div>
          )}
          {error && <p style={{ color:'#ef4444', fontSize:'12px', margin:0 }}>{error}</p>}
        </div>

        <div style={{ display:'flex', gap:'10px', marginTop:'1.25rem', justifyContent:'flex-end' }}>
          <button onClick={onClose} style={{ background:'transparent', color:'#9ca3af', border:'1px solid #2a2d3a', borderRadius:'8px', padding:'10px 20px', fontSize:'14px', cursor:'pointer' }}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading} style={{ background:'#6366f1', color:'#fff', border:'none', borderRadius:'8px', padding:'10px 20px', fontSize:'14px', fontWeight:700, cursor:'pointer', opacity:loading?0.7:1 }}>
            {loading ? 'Saving...' : existing ? 'Save Changes' : 'Add Application'}
          </button>
        </div>
      </div>
    </div>
  );
}
