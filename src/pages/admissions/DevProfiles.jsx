import { useState } from 'react';
import useStore from '../../store/useStore';
import { PageHeader } from '../../components/Layout';
import Collapsible from '../../components/ui/Collapsible';
import Badge from '../../components/ui/Badge';

const COLORS = ['#A31060','#2B3BA6','#0B6B4A','#896B00','#0B5A6B','#6B2BA3','#0B6B6B','#6B3B0B'];

export default function DevProfiles() {
  const db = useStore(s => s.db);
  const [q, setQ] = useState('');
  const [grade, setGrade] = useState('');

  const students = db.students.filter(s =>
    (!grade || s.cls === grade) &&
    (!q || s.name.toLowerCase().includes(q.toLowerCase()))
  );
  const grades = [...new Set(db.students.map(s => s.cls))].sort();

  return (
    <div className="p-6">
      <PageHeader title="Development Profiles" subtitle="Learning styles, needs and progress milestones"
        actions={
          <div className="flex gap-2">
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search..."
              className="px-2.5 py-1.5 border border-[#E4E4E4] rounded-[6px] text-[12.5px] outline-none focus:border-[#C8202E] w-36"/>
            <select value={grade} onChange={e=>setGrade(e.target.value)}
              className="px-2.5 py-1.5 border border-[#E4E4E4] rounded-[6px] text-[12.5px] outline-none focus:border-[#C8202E]">
              <option value="">All Grades</option>
              {grades.map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
        }
      />
      {students.map((s, i) => {
        const init = s.name.split(' ').map(w=>w[0]).join('').slice(0,2);
        return (
          <Collapsible key={s.id} className="mb-2"
            header={
              <div className="flex items-center gap-3 flex-1">
                <div style={{background:COLORS[i%COLORS.length]}} className="w-9 h-9 rounded-full text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">{init}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-bold text-[#111]">{s.name}</div>
                  <div className="text-[11.5px] text-[#777]">{s.cls} {s.section} · {s.adm}</div>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {s.learningStyle && <Badge variant="grey">{s.learningStyle}</Badge>}
                  {s.diet && <Badge variant="blue">{s.diet}</Badge>}
                  {s.boarding && <Badge variant="green">Boarding</Badge>}
                  {s.needs && s.needs !== 'None' && <Badge variant="amber">SEN</Badge>}
                </div>
              </div>
            }
          >
            <div className="p-4 border-t border-[#E4E4E4]">
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[['Hobbies',s.hobbies||'—'],['Languages',s.langs||'—'],['Preferred Learning',s.expPref||'—'],
                  ['Health',s.health||'None'],['Behavioural',s.behav||'—'],['Parent',s.parentName||'—']
                ].map(([l,v]) => (
                  <div key={l} className="bg-[#F8F8F8] p-2.5 rounded-[6px]">
                    <div className="text-[10px] font-bold text-[#AAA] uppercase tracking-wider mb-1">{l}</div>
                    <div className="text-[12.5px] text-[#333]">{v}</div>
                  </div>
                ))}
              </div>
              {(s.milestones||[]).length > 0 && (
                <div className="border-t border-[#E4E4E4] pt-3">
                  <div className="text-[10px] font-bold text-[#AAA] uppercase tracking-wider mb-2">Progress Milestones</div>
                  {s.milestones.map((m,j) => (
                    <div key={j} className="text-[12px] text-[#555] mb-1.5 flex gap-2">
                      <span className="font-mono text-[#AAA] flex-shrink-0">{m.date}</span>
                      <span>{m.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Collapsible>
        );
      })}
    </div>
  );
}
