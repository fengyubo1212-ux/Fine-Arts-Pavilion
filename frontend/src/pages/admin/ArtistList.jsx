import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { getArtists, deleteArtist } from '../../api';

export default function ArtistList() {
  const [list, setList] = useState([]);
  const [keyword, setKeyword] = useState('');
  const nav = useNavigate();
  const tbodyRef = useRef(null);

  useEffect(() => {
    if (list.length === 0) return;
    const ctx = gsap.context(() => {
      const rows = tbodyRef.current.querySelectorAll('tr');
      gsap.set(rows, { opacity: 0, x: -20 });
      gsap.to(rows, { opacity: 1, x: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' });
    });
    return () => ctx.revert();
  }, [list]);

  const fetch = () => getArtists({ keyword }).then((res) => setList(res.data));

  useEffect(() => { fetch(); }, [keyword]);

  const handleDelete = async (id) => {
    if (!confirm('确定删除？')) return;
    await deleteArtist(id);
    fetch();
  };

  return (
    <div>
      <h1>艺术家管理</h1>
      <div className="toolbar">
        <input placeholder="搜索艺术家..." value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        <Link to="/admin/artists/new" className="btn btn-primary">新增艺术家</Link>
      </div>
      <table className="admin-table">
        <thead>
          <tr><th>头像</th><th>姓名</th><th>简介</th><th>操作</th></tr>
        </thead>
        <tbody ref={tbodyRef}>
          {list.map((a) => (
            <tr key={a.id}>
              <td>{a.avatar_url ? <img src={a.avatar_url} width="48" style={{ borderRadius: '50%' }} /> : '-'}</td>
              <td>{a.name}</td>
              <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.bio || '-'}</td>
              <td>
                <button className="btn btn-primary" style={{ marginRight: 8, padding: '6px 14px', fontSize: 12 }}
                  onClick={() => nav(`/admin/artists/${a.id}/edit`)}>编辑</button>
                <button className="btn btn-danger" style={{ padding: '6px 14px', fontSize: 12 }}
                  onClick={() => handleDelete(a.id)}>删除</button>
              </td>
            </tr>
          ))}
          {list.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', color: '#aaa', padding: 32 }}>暂无数据</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
