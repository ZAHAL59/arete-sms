import { useState } from 'react';
import useStore from '../../store/useStore';
import { PageHeader } from '../../components/Layout';
import Badge from '../../components/ui/Badge';

const COLORS = ['#A31060','#2B3BA6','#0B6B4A','#896B00','#0B5A6B','#6B2BA3','#0B6B6B','#6B3B0B'];
const GRADES = ['Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12'];

export default function Students() {
  const db = useStore(s => s.db);
  const [grade, setGrade] = useState('');
  const [section, setSection] = useState('');
  const [q, setQ] = useState('');

  const students = db.students.filter(s =>
    (!grade   || s.cls === grade) &&
    (!section || s.section === section) &&
    (!q       || s.name.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="p-6">
      <PageHeader title="All Students" subtitle={`${db.students.length} enrolled · ${students.length} showing`}
        actions={
          <div className="flex gap-2 flex-wrap">
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search student..."
              className="px-2.5 py-1.5 border border-[#E4E4E4] rounded-[6px] text-[12.5px] outline-none focus:border-[#C8202E] w-40"/>
            <select value={grade} onChange={e=>setGrade(e.target.value)}
              className="px-2.5 py-1.5 border border-[#E4E4E4] rounded-[6px] text-[12.5px] outline-none focus:border-[#C8202E]">
              <option value="">All Grades</option>
              {GRADES.map(g => <option key={g}>{g}</option>)}
            </select>
            <select value={section} onChange={e=>setSection(e.target.value)}
              className="px-2.5 py-1.5 border border-[#E4E4E4] rounded-[6px] text-[12.5px] outline-none focus:border-[#C8202E]">
              <option value="">All Sections</option>
              {['A','B','C'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        }
      />
      <div className="bg-white border border-[#E4E4E4] rounded-[10px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,.07)]">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>{['Student','Class','Learning Style','Travel','Parent','Phone','Status'].map(h =>
              <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold text-[#AAA] uppercase tracking-wider border-b border-[#E4E4E4] bg-[#F8F8F8]">{h}</th>
            )}</tr>
          </thead>
          <tbody>
            {!students.length
              ? <tr><td colSpan={7} className="text-center py-12 text-[#AAA]">No students found</td></tr>
              : students.map((s, i) => (
                <tr key={s.id} className="border-b border-[#E4E4E4] last:border-b-0 hover:bg-[#F8F8F8]">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div style={{background:COLORS[i%COLORS.length]}} className="w-7 h-7 rounded-full text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                        {s.name.split(' ').map(w=>w[0]).join('').slice(0,2)}
                      </div>
                      <span className="font-semibold text-[#111]">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-[#555]">{s.cls} {s.section}</td>
                  <td className="px-4 py-2.5"><Badge variant="grey">{s.learningStyle||'—'}</Badge></td>
                  <td className="px-4 py-2.5">
                    {s.boarding ? <Badge variant="blue">Boarding</Badge>
                      : s.travel === 'Bus' ? <Badge variant="amber">Bus</Badge>
                      : <span className="text-[#AAA] text-[12px]">Own</span>}
                  </td>
                  <td className="px-4 py-2.5 text-[#555]">{s.parentName}</td>
                  <td className="px-4 py-2.5 font-mono text-[11.5px] text-[#555]">{s.parentPhone}</td>
                  <td className="px-4 py-2.5"><Badge variant="green">{s.status}</Badge></td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
