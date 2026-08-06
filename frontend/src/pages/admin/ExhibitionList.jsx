import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { getExhibitions, deleteExhibition } from '../../api';

export default function ExhibitionList() {
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

  const fetch = () => getExhibitions({ keyword }).then((res) => setList(res.data));

  useEffect(() => { fetch(); }, [keyword]);

  const handleDelete = async (id) => {
    if (!confirm('确定删除？')) return;
    await deleteExhibition(id);
    fetch();
  };

  return (
    <div>
      <h1>展览管理</h1>
      <div className="toolbar">
        <input placeholder="搜索展览..." value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        <Link to="/admin/exhibitions/new" className="btn btn-primary">新增展览</Link>
      </div>
      <table className="admin-table">
        <thead>
          <tr><th>海报</th><th>标题</th><th>日期</th><th>地点</th><th>操作</th></tr>
        </thead>
        <tbody ref={tbodyRef}>
          {list.map((e) => (
            <tr key={e.id}>
              <td>{e.poster_url ? <img src={e.poster_url} width="60" style={{ borderRadius: 4 }} /> : '-'}</td>
              <td>{e.title}</td>
              <td>{e.start_date ? `${e.start_date} ~ ${e.end_date}` : '-'}</td>
              <td>{e.location || '-'}</td>
              <td>
                <button className="btn btn-primary" style={{ marginRight: 8, padding: '6px 14px', fontSize: 12 }}
                  onClick={() => nav(`/admin/exhibitions/${e.id}/edit`)}>编辑</button>
                <button className="btn btn-danger" style={{ padding: '6px 14px', fontSize: 12 }}
                  onClick={() => handleDelete(e.id)}>删除</button>
              </td>
            </tr>
          ))}
          {list.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', color: '#aaa', padding: 32 }}>暂无数据</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
