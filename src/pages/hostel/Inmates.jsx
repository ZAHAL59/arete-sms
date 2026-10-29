import { useState } from 'react';
import useStore from '../../store/useStore';
import { PageHeader } from '../../components/Layout';
import Badge from '../../components/ui/Badge';
import { COLORS } from '../teacher/constants';

export default function Inmates({ h }) {
  const db = useStore(s => s.db);
  const [q, setQ] = useState('');
  const boarders = db.students.filter(s => s.boarding && (!q || s.name.toLowerCase().includes(q.toLowerCase())));
  const roomOf = name => h.rooms.find(r => r.inmates.includes(name))?.id;

  return (
    <div className="p-6">
      <PageHeader title="Inmate Records" subtitle={`${boarders.length} boarders`}
        actions={<input value={q} onChange={e => setQ(e.target.value)} placeholder="Search inmate..."
          className="px-2.5 py-1.5 border border-[#E4E4E4] rounded-[6px] text-[12.5px] outline-none focus:border-[#C8202E] w-44" />} />
      <div className="bg-white border border-[#E4E4E4] rounded-[10px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,.07)]">
        <table className="w-full border-collapse text-[13px]">
          <thead><tr>{['Student','Class','Room','Diet','Health','Parent','Phone','Admitted'].map(t =>
            <th key={t} className="px-4 py-2.5 text-left text-[10px] font-bold text-[#AAA] uppercase tracking-wider border-b border-[#E4E4E4] bg-[#F8F8F8]">{t}</th>)}</tr></thead>
          <tbody>
            {!boarders.length
              ? <tr><td colSpan={8} className="text-center py-10 text-[#AAA]">No boarders found</td></tr>
              : boarders.map((s, i) => (
                <tr key={s.id} className="border-b border-[#E4E4E4] last:border-b-0 hover:bg-[#F8F8F8]">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div style={{ background: COLORS[i % COLORS.length] }} className="w-7 h-7 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                        {s.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                      </div>
                      <span className="font-semibold text-[#111]">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-[#555]">{s.cls} {s.section}</td>
                  <td className="px-4 py-2.5">{roomOf(s.name) ? <Badge variant="blue">{roomOf(s.name)}</Badge> : <Badge variant="amber">Unplaced</Badge>}</td>
                  <td className="px-4 py-2.5 text-[#555]">{s.diet || '—'}</td>
                  <td className="px-4 py-2.5">{s.health && s.health !== 'None' ? <Badge variant="amber">{s.health.slice(0, 24)}{s.health.length > 24 ? '…' : ''}</Badge> : <span className="text-[#AAA]">None</span>}</td>
                  <td className="px-4 py-2.5 text-[#555]">{s.parentName}</td>
                  <td className="px-4 py-2.5 font-mono text-[11.5px] text-[#555]">{s.parentPhone}</td>
                  <td className="px-4 py-2.5 text-[#555]">{s.adm}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
