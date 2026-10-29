import { useState, useMemo } from 'react';
import useStore from '../../store/useStore';
import { PageHeader } from '../../components/Layout';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Collapsible from '../../components/ui/Collapsible';
import AttendancePanel from '../teacher/AttendancePanel';
import { snapshot, staffAttToday, setStaffAttToday, onLeaveToday } from './bridge';
import { classLabel, downloadCsv, TODAY, prettyDate } from './constants';

const DOT = { P: ['#166534', '#F0FDF4'], A: ['#DC2626', '#FEF2F2'], L: ['#B45309', '#FFFBEB'] };

export default function Attendance({ settings }) {
  const db = useStore(s => s.db); const attLog = useStore(s => s.attLog);
  const classes = useMemo(() => [...new Set(db.students.map(classLabel))].sort(), [db.students]);
  const [cls, setCls] = useState(classes[0] || '');
  const [open, setOpen] = useState(true); const [savedAt, setSavedAt] = useState(null);
  const [stuId, setStuId] = useState(db.students[0]?.id || '');
  const [tick, setTick] = useState(0); const [alertOpen, setAlertOpen] = useState(false);
  const hr = useMemo(() => snapshot().hr, [tick]);

  const key = cls.replace(/\s+/g, '') + '-' + TODAY;
  const roster = db.students.filter(s => classLabel(s) === cls);
  const today = attLog[key] || {};
  const counts = { P: 0, A: 0, L: 0 }; Object.values(today).forEach(v => counts[v] != null && counts[v]++);

  // History for the chosen student, oldest → newest, last 18 recorded days
  const stu = db.students.find(s => s.id === stuId);
  const history = Object.entries(attLog).filter(([, l]) => l[stuId]).map(([k, l]) => ({ date: k.slice(-10), st: l[stuId] })).sort((a, b) => a.date.localeCompare(b.date)).slice(-18);
  const month = history.filter(h => h.date.startsWith(TODAY.slice(0, 7)));
  const monthPct = month.length ? Math.round(month.filter(h => h.st === 'P').length / month.length * 100) : null;

  const issues = Object.entries(attLog).filter(([k]) => k.endsWith(TODAY)).flatMap(([, l]) => Object.entries(l).filter(([, v]) => v === 'A' || v === 'L').map(([id, v]) => ({ s: db.students.find(x => x.id === id), v }))).filter(x => x.s);
  const msg = ({ s, v }) => `Dear ${s.parentName}, ${s.name} (${classLabel(s)}) was marked ${v === 'A' ? 'ABSENT' : 'LATE'} today (${prettyDate(TODAY)}) at ${settings.school}. Please contact the school if this is unexpected.`;

  function exportRoll() { downloadCsv(`roll-${cls.replace(/\s+/g, '')}-${TODAY}.csv`, ['Roll', 'Student', 'Status'], roster.map(s => [s.roll, s.name, { P: 'Present', A: 'Absent', L: 'Late' }[today[s.id]] || 'Not marked'])); }

  return (
    <div className="p-6">
      <PageHeader title="Attendance" subtitle={new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        actions={<>
          <select value={cls} onChange={e => { setCls(e.target.value); setOpen(true); setSavedAt(null); }} className="px-2.5 py-1.5 border border-[#E4E4E4] rounded-[6px] text-[12.5px] outline-none focus:border-[#C8202E]">{classes.map(c => <option key={c}>{c}</option>)}</select>
          <Button variant="outline" onClick={exportRoll}>⬇ Export Roll</Button>
          <Button variant="outline" onClick={() => setAlertOpen(true)}>📱 Parent Alerts ({issues.length})</Button>
        </>} />

      <div className="grid grid-cols-4 gap-3 mb-4">
        {[['Present', counts.P, '#166534'], ['Absent', counts.A, '#DC2626'], ['Late', counts.L, '#B45309'], ['Not marked', Math.max(0, roster.length - counts.P - counts.A - counts.L), '#AAA']].map(([l, v, c]) => (
          <div key={l} className="bg-white border border-[#E4E4E4] rounded-[10px] p-3.5" style={{ borderLeft: `3px solid ${c}` }}><div className="text-[10.5px] font-semibold text-[#AAA] uppercase tracking-wider">{l}</div><div className="text-[22px] font-extrabold" style={{ color: c }}>{v}</div></div>))}
      </div>

      {open && cls ? <AttendancePanel key={cls + (savedAt || '')} cls={cls} date={TODAY} onClose={() => setOpen(false)} onSaved={() => setSavedAt(new Date().toTimeString().slice(0, 5))} />
        : <div className="bg-white border border-[#E4E4E4] rounded-[10px] p-5 flex items-center gap-3">{savedAt && <Badge variant="green">✓ Saved at {savedAt}</Badge>}<span className="text-[13px] text-[#555] flex-1">Roll call for {cls} is closed.</span><Button onClick={() => setOpen(true)}>Open roll call</Button></div>}

      <Collapsible defaultOpen className="mt-4" header={<div className="flex items-center gap-3 flex-1"><span className="text-[13.5px] font-bold text-[#111]">Attendance History</span>
        <select value={stuId} onClick={e => e.stopPropagation()} onChange={e => setStuId(e.target.value)} className="ml-auto px-2 py-1 border border-[#E4E4E4] rounded-[6px] text-[12px] outline-none">{db.students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>}>
        <div className="p-4 border-t border-[#E4E4E4]">
          {!history.length ? <div className="text-[13px] text-[#AAA]">No attendance recorded for {stu?.name} yet.</div> : <>
            <div className="flex gap-1.5 flex-wrap mb-3">{history.map((h, i) => <span key={i} title={`${prettyDate(h.date)} — ${h.st}`} className="w-7 h-7 rounded-[6px] text-[11px] font-bold flex items-center justify-center" style={{ background: DOT[h.st][1], color: DOT[h.st][0], border: `1px solid ${DOT[h.st][0]}33` }}>{h.st}</span>)}</div>
            <div className="text-[12.5px] text-[#555]">{monthPct != null ? <>This month: <b style={{ color: monthPct < settings.lowAtt ? '#DC2626' : '#166534' }}>{monthPct}%</b> present · </> : ''}{history.length} day(s) recorded</div></>}
        </div>
      </Collapsible>

      <Collapsible defaultOpen className="mt-3" header={<span className="text-[13.5px] font-bold text-[#111]">Staff Attendance Today</span>}>
        <div className="divide-y divide-[#E4E4E4] border-t border-[#E4E4E4]">{db.staff.map(s => {
          const st = staffAttToday(hr, s.id), leave = onLeaveToday(hr, s.id);
          return <div key={s.id} className="flex items-center gap-3 px-4 py-2.5"><div className="flex-1"><div className="text-[13px] font-semibold text-[#111]">{s.name}</div><div className="text-[11.5px] text-[#777]">{s.subj}</div></div>
            {leave && <Badge variant="amber">On approved leave</Badge>}
            <div className="flex gap-1">{['P', 'L', 'A'].map(v => <button key={v} onClick={() => { setStaffAttToday(s.id, v); setTick(t => t + 1); }} className="w-8 h-7 rounded-[5px] text-[11px] font-bold border-[1.5px] cursor-pointer" style={{ background: st === v ? DOT[v][0] : DOT[v][1], color: st === v ? '#fff' : DOT[v][0], borderColor: st === v ? DOT[v][0] : DOT[v][0] + '44' }}>{v}</button>)}</div></div>;
        })}</div>
      </Collapsible>

      <Modal open={alertOpen} onClose={() => setAlertOpen(false)} size="lg" title="Parent Alerts" subtitle="Absent and late students today — SMS sending is not connected yet, so copy the message"
        footer={<Button variant="outline" onClick={() => setAlertOpen(false)}>Close</Button>}>
        {!issues.length ? <div className="text-center py-6 text-[#166534] font-semibold">No absent or late students recorded today</div> : <div className="space-y-2">{issues.map((x, i) => (
          <div key={i} className="border border-[#E4E4E4] rounded-[8px] p-3"><div className="flex items-center gap-2 mb-1"><b className="text-[13px]">{x.s.name}</b><Badge variant={x.v === 'A' ? 'red' : 'amber'}>{x.v === 'A' ? 'Absent' : 'Late'}</Badge><span className="font-mono text-[11px] text-[#AAA] ml-auto">{x.s.parentPhone}</span></div>
            <div className="text-[12.5px] text-[#555] leading-relaxed mb-2">{msg(x)}</div><Button size="sm" variant="outline" onClick={() => navigator.clipboard?.writeText(msg(x))}>Copy message</Button></div>))}</div>}
      </Modal>
    </div>
  );
}
