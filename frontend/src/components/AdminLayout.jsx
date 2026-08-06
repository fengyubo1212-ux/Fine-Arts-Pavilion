import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function AdminLayout() {
  const nav = useNavigate();
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      nav('/admin/login');
    }
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sidebar = sidebarRef.current;
      const links = sidebar.querySelectorAll('a');
      gsap.set(sidebar, { opacity: 0, x: -60 });
      gsap.to(sidebar, { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' });
      gsap.set(links, { opacity: 0, x: -20 });
      gsap.to(links, { opacity: 1, x: 0, duration: 0.4, stagger: 0.06, delay: 0.2, ease: 'power2.out' });
    });
    return () => ctx.revert();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    nav('/admin/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar" ref={sidebarRef}>
        <h2>管理后台</h2>
        <NavLink to="/admin" end className={({ isActive }) => isActive ? 'active' : ''}>仪表盘</NavLink>
        <NavLink to="/admin/exhibitions" className={({ isActive }) => isActive ? 'active' : ''}>展览管理</NavLink>
        <NavLink to="/admin/artworks" className={({ isActive }) => isActive ? 'active' : ''}>艺术品管理</NavLink>
        <NavLink to="/admin/artists" className={({ isActive }) => isActive ? 'active' : ''}>艺术家管理</NavLink>
        <a onClick={logout} style={{ cursor: 'pointer', marginTop: 'auto' }}>退出登录</a>
      </aside>
      <main className="admin-main"><Outlet /></main>
    </div>
  );
}
