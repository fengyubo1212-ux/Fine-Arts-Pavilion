import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { login } from '../../api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const nav = useNavigate();
  const boxRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(boxRef.current, { opacity: 0, y: 30 });
      gsap.to(boxRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
    });
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await login(username, password);
      if (res.code === 0) {
        localStorage.setItem('token', res.data.token);
        nav('/admin');
      } else {
        setError(res.message);
      }
    } catch {
      setError('网络错误');
    }
  };

  return (
    <div className="login-page">
      <form className="login-box" ref={boxRef} onSubmit={handleSubmit}>
        <h1>展览管理系统</h1>
        {error && <p className="error">{error}</p>}
        <div className="form-group">
          <label>用户名</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} autoFocus />
        </div>
        <div className="form-group">
          <label>密码</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8 }}>登录</button>
      </form>
    </div>
  );
}
