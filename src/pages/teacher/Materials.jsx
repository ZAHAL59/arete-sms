import { useState } from 'react';
import { PageHeader } from '../../components/Layout';
import Badge from '../../components/ui/Badge';

const TYPE_VARIANT = { 'Animation':'purple','Video':'blue','Curated Link':'grey','Simulation':'green','Interactive Activity':'green','VR Experience':'purple','AR Experience':'purple','PDF / Document':'amber','Quiz':'red' };

const LMS = [
  {id:'L002',thumb:'📐',title:'Understanding Linear Equations',type:'Video',subj:'Mathematics',grade:'Grade 8',topic:'Algebra Ch.2',dur:'9 min',by:'Ms. Latha R.',rating:4.7,desc:'Visual explanation of forming and solving one-variable linear equations.'},
  {id:'V004',thumb:'📐',title:'Geometry in 3D — AR Shapes',type:'AR Experience',subj:'Mathematics',grade:'Grade 6',topic:'Geometry Ch.1',dur:'15 min',by:'Ms. Latha R.',rating:4.7,desc:'View and rotate 3D geometric solids, measuring faces, edges and vertices.'},
  {id:'A001',thumb:'🎮',title:'Fraction Explorer — Digital Manipulative',type:'Interactive Activity',subj:'Mathematics',grade:'Grade 5',topic:'Fractions',dur:'15 min',by:'Ms. Latha R.',rating:4.7,desc:'Drag and combine fraction tiles to visualise equivalence and operations.'},
  {id:'R001',thumb:'🔗',title:'Khan Academy — Algebra Basics',type:'Curated Link',subj:'Mathematics',grade:'Grade 7',topic:'Algebra Foundations',dur:'Self-paced',by:'Curated',rating:4.9,desc:'Vetted Khan Academy playlist: expressions, equations and inequalities.',url:'https://khanacademy.org'},
  {id:'R004',thumb:'⚗️',title:'PhET Simulations — Forces and Motion',type:'Simulation',subj:'Science',grade:'Grade 8',topic:'Physics Ch.4',dur:'Open-ended',by:'External',rating:5.0,desc:'University of Colorado interactive physics simulation.',url:'https://phet.colorado.edu'},
  {id:'E001',thumb:'📄',title:'Class 8 — Mid-term Revision Pack',type:'PDF / Document',subj:'Mathematics',grade:'Grade 8',topic:'Term 1 Revision',dur:'45 min',by:'Ms. Latha R.',rating:4.6,desc:'PDF with 30 practice problems and full answer key.'},
  {id:'M001',thumb:'📐',title:'Algebra Foundations — Grade 7 Notes',type:'PDF / Document',subj:'Mathematics',grade:'Grade 7',topic:'Algebra Foundations',dur:'—',by:'Ms. Latha R.',rating:4.8,desc:'Class notes covering expressions, variables and simple equations.'},
  {id:'M004',thumb:'🎮',title:'Coordinate Geometry — Interactive Grapher',type:'Interactive Activity',subj:'Mathematics',grade:'Grade 9',topic:'Coordinate Geometry',dur:'20 min',by:'External',rating:4.9,desc:'Plot points, lines and curves interactively.',url:'https://desmos.com'},
  {id:'V001',thumb:'🪐',title:'Solar System — VR Immersive Tour',type:'VR Experience',subj:'Science',grade:'Grade 8',topic:'Astronomy',dur:'20 min',by:'External',rating:5.0,desc:'Full 360 immersive tour of the solar system with scale models.'},
];

export default function Materials() {
  const [subj, setSubj] = useState('');
  const [grade, setGrade] = useState('');
  const [type, setType] = useState('');
  const [q, setQ] = useState('');

  const grades  = [...new Set(LMS.map(m => m.grade))].sort();
  const types   = [...new Set(LMS.map(m => m.type))].sort();
  const subjects = [...new Set(LMS.map(m => m.subj))].sort();

  const filtered = LMS.filter(m =>
    (!subj  || m.subj === subj) &&
    (!grade || m.grade === grade) &&
    (!type  || m.type === type) &&
    (!q     || m.title.toLowerCase().includes(q.toLowerCase()) || m.topic.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="p-6">
      <PageHeader title="Study Materials" subtitle="Videos, simulations, AR/VR and resources"
        actions={
          <div className="flex gap-2 flex-wrap">
            <select value={subj} onChange={e=>setSubj(e.target.value)} className="px-2.5 py-1.5 border border-[#E4E4E4] rounded-[6px] text-[12.5px] outline-none focus:border-[#C8202E]">
              <option value="">All Subjects</option>{subjects.map(s=><option key={s}>{s}</option>)}
            </select>
            <select value={grade} onChange={e=>setGrade(e.target.value)} className="px-2.5 py-1.5 border border-[#E4E4E4] rounded-[6px] text-[12.5px] outline-none focus:border-[#C8202E]">
              <option value="">All Grades</option>{grades.map(g=><option key={g}>{g}</option>)}
            </select>
            <select value={type} onChange={e=>setType(e.target.value)} className="px-2.5 py-1.5 border border-[#E4E4E4] rounded-[6px] text-[12.5px] outline-none focus:border-[#C8202E]">
              <option value="">All Types</option>{types.map(t=><option key={t}>{t}</option>)}
            </select>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search topic..."
              className="px-2.5 py-1.5 border border-[#E4E4E4] rounded-[6px] text-[12.5px] outline-none focus:border-[#C8202E] w-40"/>
          </div>
        }
      />

      {/* KPI */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          ['Showing', filtered.length, `of ${LMS.length} total`],
          ['Your Resources', LMS.filter(m=>m.by==='Ms. Latha R.').length, 'created by you'],
          ['AR / VR', LMS.filter(m=>m.type.includes('AR')||m.type.includes('VR')).length, 'immersive'],
          ['Interactive', LMS.filter(m=>m.type==='Interactive Activity'||m.type==='Simulation').length, 'hands-on'],
        ].map(([l,v,n],i) => (
          <div key={l} className="bg-white border border-[#E4E4E4] rounded-[10px] p-3.5 shadow-[0_1px_4px_rgba(0,0,0,.07)]">
            <div className="text-[10.5px] font-semibold text-[#AAA] uppercase tracking-wider mb-1">{l}</div>
            <div className="text-[22px] font-extrabold text-[#C8202E]">{v}</div>
            <div className="text-[11.5px] text-[#AAA] mt-1">{n}</div>
          </div>
        ))}
      </div>

      {/* Material cards */}
      {!filtered.length
        ? <div className="bg-white border border-[#E4E4E4] rounded-[10px] p-12 text-center text-[#AAA]">No materials match your filter</div>
        : <div className="space-y-2">
          {filtered.map(m => (
            <div key={m.id} className="bg-white border border-[#E4E4E4] rounded-[10px] p-4 flex items-start gap-4 hover:shadow-[0_4px_18px_rgba(0,0,0,.11)] hover:-translate-y-0.5 transition-all">
              <div className="w-11 h-11 rounded-[8px] bg-[#F8F8F8] flex items-center justify-center text-[22px] flex-shrink-0">{m.thumb}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 mb-1">
                  <div className="text-[13.5px] font-bold text-[#111] flex-1">{m.title}</div>
                  <Badge variant={TYPE_VARIANT[m.type]||'grey'}>{m.type}</Badge>
                </div>
                <div className="text-[11.5px] text-[#AAA] mb-1">{m.grade} · {m.topic} · {m.dur} · By: {m.by}</div>
                <div className="text-[12.5px] text-[#555] leading-relaxed">{m.desc}</div>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <div className="text-[13px] text-amber-400 tracking-wider">{'★'.repeat(Math.round(m.rating))}{'☆'.repeat(5-Math.round(m.rating))}</div>
                {m.url
                  ? <a href={m.url} target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-[#C8202E] text-white text-[11.5px] font-semibold rounded-[6px] no-underline hover:bg-[#9A1822]">Open →</a>
                  : <button className="px-3 py-1.5 bg-white border border-[#E4E4E4] text-[#555] text-[11.5px] font-semibold rounded-[6px] cursor-pointer hover:bg-[#F8F8F8]">Preview</button>}
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
}
