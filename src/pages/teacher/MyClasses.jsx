import { useState } from 'react';
import useStore from '../../store/useStore';
import { PageHeader } from '../../components/Layout';
import Collapsible from '../../components/ui/Collapsible';
import Badge from '../../components/ui/Badge';

const COLORS = ['#A31060','#2B3BA6','#0B6B4A','#896B00','#0B5A6B','#6B2BA3','#0B6B6B','#6B3B0B'];
const MY_CLASSES = ['Grade 6 B','Grade 7 B','Grade 8 A','Grade 9 A','Grade 10 A'];

export default function MyClasses() {
  const db = useStore(s => s.db);
  const [selCls, setSelCls] = useState('Grade 8 A');

  const students = db.students.filter(s => `${s.cls} ${s.section}`.trim() === selCls);

  return (
    <div className="p-6">
      <PageHeader title="My Classes" subtitle="Student roster for each class you teach"
        actions={
          <select value={selCls} onChange={e => setSelCls(e.target.value)}
            className="px-2.5 py-1.5 border border-[#E4E4E4] rounded-[6px] text-[12.5px] outline-none focus:border-[#C8202E]">
            {MY_CLASSES.map(c => <option key={c}>{c}</option>)}
          </select>
        }
      />

      {/* Class summary cards */}
      <div className="grid grid-cols-5 gap-2 mb-5">
        {MY_CLASSES.map(c => {
          const n = db.students.filter(s => `${s.cls} ${s.section}`.trim() === c).length;
          return (
            <div key={c} onClick={() => setSelCls(c)}
              className={`p-3 rounded-[8px] border cursor-pointer transition-all text-center
                ${selCls === c ? 'bg-[#FEF4F4] border-[#C8202E]' : 'bg-white border-[#E4E4E4] hover:border-[#C8202E]'}`}>
              <div className={`text-[18px] font-extrabold ${selCls === c ? 'text-[#C8202E]' : 'text-[#111]'}`}>{n}</div>
              <div className="text-[10px] text-[#AAA] font-medium mt-0.5">{c}</div>
            </div>
          );
        })}
      </div>

      {/* Student table */}
      <div className="bg-white border border-[#E4E4E4] rounded-[10px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,.07)]">
        <div className="px-4 py-3 border-b border-[#E4E4E4] bg-[#F8F8F8] flex items-center justify-between">
          <div className="text-[13.5px] font-bold text-[#111]">{selCls} — {students.length} students</div>
        </div>
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>
              {['Student','Roll','Learning Style','Diet','Health','Parent Contact'].map(h => (
                <th key={h} className="px-3.5 py-2.5 text-left text-[10px] font-bold text-[#AAA] uppercase tracking-wider border-b border-[#E4E4E4] bg-[#F8F8F8]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.length === 0
              ? <tr><td colSpan={6} className="text-center py-10 text-[#AAA]">No students in this class</td></tr>
              : students.map((s, i) => (
                <tr key={s.id} className="border-b border-[#E4E4E4] last:border-b-0 hover:bg-[#F8F8F8]">
                  <td className="px-3.5 py-2.5">
                    <div className="flex items-center gap-2">
                      <div style={{background:COLORS[i%COLORS.length]}} className="w-7 h-7 rounded-full text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                        {s.name.split(' ').map(w=>w[0]).join('').slice(0,2)}
                      </div>
                      <span className="font-semibold text-[#111]">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-3.5 py-2.5 text-[#555]">{s.roll}</td>
                  <td className="px-3.5 py-2.5"><Badge variant="grey">{s.learningStyle||'—'}</Badge></td>
                  <td className="px-3.5 py-2.5 text-[#555]">{s.diet||'—'}</td>
                  <td className="px-3.5 py-2.5">
                    {s.health && s.health !== 'None'
                      ? <Badge variant="amber">{s.health.slice(0,30)}{s.health.length>30?'…':''}</Badge>
                      : <span className="text-[#AAA]">None</span>}
                  </td>
                  <td className="px-3.5 py-2.5 text-[#555]">{s.parentName} <span className="font-mono text-[11px]">{s.parentPhone}</span></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
