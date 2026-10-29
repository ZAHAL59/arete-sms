import { useState } from 'react';
import useStore from '../../store/useStore';
import { Card, CardHeader, CardTitle, CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Collapsible from '../../components/ui/Collapsible';

const TEACHER_TT_TODAY = [
  { cls:'Grade 8 A', time:'8:00–8:40' },
  { cls:'Grade 6 B', time:'8:40–9:20' },
  { cls:'Grade 9 A', time:'10:20–11:00' },
  { cls:'Grade 10 A',time:'11:40–12:20' },
  { cls:'Grade 7 B', time:'1:20–2:00'  },
];

const ANNOUNCEMENTS = [
  { title:'📋 Mid-term Progress Reports Due', msg:'All class teachers must submit mid-term progress remarks by Friday 1 November 2026.', sent:'28 Oct', to:'All Teaching Staff', urgent:true },
  { title:'📅 Parent-Teacher Meeting — 8 Nov', msg:'PT Meeting on Saturday 8 November, 9 AM – 1 PM. All teachers must be present.', sent:'25 Oct', to:'All Staff', urgent:false },
  { title:'🎓 NEP Training Follow-up', msg:'HR scheduled a follow-up CBE session on 10 November, full day. Attendance mandatory.', sent:'22 Oct', to:'Teaching Staff', urgent:false },
];

export default function Today({ onNavigate }) {
  const db = useStore(s => s.db);
  const today = new Date().toISOString().slice(0,10);
  const dow = new Date().getDay();
  const isWeekday = dow >= 1 && dow <= 5;

  const marked = TEACHER_TT_TODAY.filter(p => {
    const key = p.cls.replace(/\s+/g,'') + '-' + today;
    return db.attendance[key] && Object.keys(db.attendance[key]).length > 0;
  }).length;

  const stuCount = db.students.filter(s =>
    ['Grade 6 B','Grade 7 B','Grade 8 A','Grade 9 A','Grade 10 A'].includes(`${s.cls} ${s.section}`.trim())
  ).length;

  const dateStr = new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'});

  return (
    <div className="p-6">
      <div className="mb-5">
        <h1 className="text-[22px] font-extrabold text-[#111] tracking-tight">Good morning, Ms. Latha 👋</h1>
        <p className="text-[13px] text-[#AAA] mt-0.5">{dateStr}</p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label:"Today's Periods", value: isWeekday ? TEACHER_TT_TODAY.length : '—', note:'Mathematics', color:'#C8202E' },
          { label:'Students', value: stuCount, note:'Across all classes', color:'#1A5FB4' },
          { label:'Pending Attendance', value: isWeekday ? TEACHER_TT_TODAY.length - marked : '—', note:'Not yet marked', color:'#B45309' },
          { label:'New Alerts', value: ANNOUNCEMENTS.length, note:'From Principal / HR', color:'#6D28D9' },
        ].map(k => (
          <div key={k.label} className="bg-white border border-[#E4E4E4] rounded-[10px] p-3.5 shadow-[0_1px_4px_rgba(0,0,0,.07)]" style={{borderLeft:`3px solid ${k.color}`}}>
            <div className="text-[10.5px] font-semibold text-[#AAA] uppercase tracking-wider mb-1">{k.label}</div>
            <div className="text-[24px] font-extrabold leading-none" style={{color:k.color}}>{k.value}</div>
            <div className="text-[11.5px] text-[#AAA] mt-1">{k.note}</div>
          </div>
        ))}
      </div>

      {/* Today's Schedule */}
      <Collapsible defaultOpen header={<CardTitle>📅 Today's Schedule</CardTitle>}
        className="mb-3">
        <div className="divide-y divide-[#E4E4E4]">
          {!isWeekday
            ? <div className="p-4 text-[13px] text-[#AAA]">It's the weekend — enjoy your break! 🎉</div>
            : TEACHER_TT_TODAY.map(p => {
                const key = p.cls.replace(/\s+/g,'') + '-' + today;
                const isMarked = db.attendance[key] && Object.keys(db.attendance[key]).length > 0;
                return (
                  <div key={p.cls} className="flex items-center gap-3 px-4 py-3">
                    <span className="bg-[#FEF4F4] text-[#C8202E] text-[10px] font-bold px-2 py-1 rounded-[4px] whitespace-nowrap">{p.time}</span>
                    <div className="flex-1">
                      <div className="text-[13px] font-semibold">{p.cls}</div>
                      <div className="text-[11px] text-[#AAA]">Mathematics</div>
                    </div>
                    {isMarked
                      ? <Badge variant="green">✓ Marked</Badge>
                      : <Button size="sm" onClick={() => onNavigate('timetable')}>Mark Now →</Button>}
                  </div>
                );
              })
          }
        </div>
      </Collapsible>

      {/* Latest Notice */}
      <Collapsible header={
        <div className="flex items-center gap-2 flex-1">
          <CardTitle>🔔 Latest Notice</CardTitle>
          <Badge variant="red2">{ANNOUNCEMENTS.length}</Badge>
        </div>
      } className="mb-3">
        <div className="p-4">
          {ANNOUNCEMENTS.slice(0,1).map((a,i) => (
            <div key={i} className="border-l-[3px] border-[#C8202E] bg-[#FEF4F4] rounded-r-[8px] p-3">
              <div className="text-[13.5px] font-bold text-[#111]">{a.title}</div>
              <div className="text-[12.5px] text-[#555] mt-1 leading-relaxed">{a.msg}</div>
              <div className="text-[11px] text-[#AAA] mt-2">{a.sent} · To: {a.to}</div>
            </div>
          ))}
          <Button size="sm" variant="outline" onClick={() => onNavigate('alerts')} className="mt-3">All Notices →</Button>
        </div>
      </Collapsible>

      {/* Upcoming Training */}
      <Collapsible header={<CardTitle>🎓 Upcoming Training</CardTitle>}>
        <div className="p-4">
          <div className="text-[13px] font-semibold">Classroom Differentiation Strategies</div>
          <div className="text-[12px] text-[#AAA] mt-1">10 Nov 2026 · Full day · Dr. Anitha Raj</div>
          <div className="flex gap-1.5 mt-2">
            {['Mixed-ability classes','Task scaffolding','Assessment variety'].map(t => (
              <Badge key={t} variant="purple">{t}</Badge>
            ))}
          </div>
          <Button size="sm" variant="outline" onClick={() => onNavigate('training')} className="mt-3">All Sessions →</Button>
        </div>
      </Collapsible>
    </div>
  );
}
