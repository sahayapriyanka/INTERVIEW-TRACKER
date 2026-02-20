import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const inputStyle = { background:'#1a1d27', border:'1px solid #2a2d3a', borderRadius:'8px', padding:'10px 14px', color:'#e2e8f0', fontSize:'14px', width:'100%', outline:'none', boxSizing:'border-box' };
const labelStyle = { display:'block', fontSize:'11px', fontWeight:700, color:'#6b7280', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'6px' };

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await register(form.name, form.email, form.password);
      } else {
        await login(form.email, form.password);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', background:'#080a10', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
      <div style={{ width:'100%', maxWidth:'380px' }}>
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div style={{ width:'52px', height:'52px', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius:'14px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px', margin:'0 auto 1rem' }}>🎯</div>
          <h1 style={{ color:'#fff', fontSize:'1.5rem', fontWeight:800, margin:0, fontFamily:"'Space Mono', monospace" }}>InterviewOS</h1>
          <p style={{ color:'#6b7280', fontSize:'14px', margin:'6px 0 0' }}>Track every step of your job hunt</p>
        </div>

        <div style={{ background:'#0f1117', border:'1px solid #1e2230', borderRadius:'16px', padding:'2rem' }}>
          <div style={{ display:'flex', marginBottom:'1.5rem', background:'#1a1d27', borderRadius:'8px', padding:'4px' }}>
            {['Sign In','Register'].map((label, i) => (
              <button key={label} onClick={()=>setIsRegister(i===1)} style={{ flex:1, background: isRegister===(i===1)?'#6366f1':'transparent', color: isRegister===(i===1)?'#fff':'#6b7280', border:'none', borderRadius:'6px', padding:'8px', fontSize:'13px', fontWeight:700, cursor:'pointer' }}>{label}</button>
            ))}
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            {isRegister && (
              <div><label style={labelStyle}>Full Name</label>
                <input style={inputStyle} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="John Doe" />
              </div>
            )}
            <div><label style={labelStyle}>Email</label>
              <input style={inputStyle} type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="you@email.com" />
            </div>
            <div><label style={labelStyle}>Password</label>
              <input style={inputStyle} type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} placeholder="••••••••" onKeyDown={e=>e.key==='Enter'&&handleSubmit()} />
            </div>
            {error && <p style={{ color:'#ef4444', fontSize:'12px', margin:0 }}>{error}</p>}
            <button onClick={handleSubmit} disabled={loading} style={{ background:'#6366f1', color:'#fff', border:'none', borderRadius:'8px', padding:'12px', fontSize:'14px', fontWeight:700, cursor:'pointer', opacity: loading?0.7:1 }}>
              {loading ? 'Please wait...' : isRegister ? 'Create Account →' : 'Sign In →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
