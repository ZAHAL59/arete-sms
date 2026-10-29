import { useState, useEffect } from 'react';
import useStore from '../../store/useStore';
import Button from '../../components/ui/Button';

const COLORS = ['#A31060','#2B3BA6','#0B6B4A','#896B00','#0B5A6B','#6B2BA3','#0B6B6B','#6B3B0B'];

export default function AttendancePanel({ cls, date, onClose }) {
  const db = useStore(s => s.db);
  const saveAttendanceLog = useStore(s => s.saveAttendanceLog);

  const students = db.students.filter(s => `${s.cls} ${s.section}`.trim() === cls);
  const key = cls.replace(/\s+/g,'') + '-' + date;
  const [log, setLog] = useState(() => ({ ...(db.attendance[key] || {}) }));

  const counts = { P:0, A:0, L:0 };
  Object.values(log).forEach(v => counts[v] && counts[v]++);

  function mark(id, status) {
    setLog(l => ({ ...l, [id]: status }));
  }

  function markAll(status) {
    const next = {};
    students.forEach(s => next[s.id] = status);
    setLog(next);
  }

  function save() {
    saveAttendanceLog(cls, date, log);
    onClose();
  }

  return (
    <div className="mt-5 bg-white border border-[#E4E4E4] rounded-[10px] overflow-hidden shadow-[0_4px_18px_rgba(0,0,0,.11)]">
      {/* Header */}
      <div className="bg-[#C8202E] px-5 py-3 flex items-center justify-between flex-wrap gap-2">
        <div>
          <div className="text-[14px] font-bold text-white">Attendance — {cls}</div>
          <div className="text-[12px] text-white/70">{new Date(date+'T00:00:00').toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})} · {students.length} students</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-3 text-[12.5px] text-white/85">
            <span className="text-[#A7F3D0]">{counts.P} P</span>
            <span className="text-[#FECACA]">{counts.A} A</span>
            <span className="text-[#FDE68A]">{counts.L} L</span>
          </div>
          <Button size="sm" onClick={save} className="!bg-white/20 !text-white hover:!bg-white/30 border border-white/30">💾 Save</Button>
          <button onClick={onClose} className="text-white/60 hover:text-white text-xl bg-none border-none cursor-pointer">×</button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex gap-2 px-5 py-2 border-b border-[#E4E4E4] bg-[#F8F8F8]">
        <Button size="sm" variant="outline" onClick={() => markAll('P')}>✓ All Present</Button>
        <Button size="sm" variant="outline" onClick={() => markAll('A')}>✗ All Absent</Button>
        <span className="text-[11.5px] text-[#AAA] ml-2 self-center">P = Present · A = Absent · L = Late</span>
      </div>

      {/* Student list */}
      {students.map((s, i) => {
        const status = log[s.id] || '';
        const init = s.name.split(' ').map(w => w[0]).join('').slice(0,2);
        const rowBg = status === 'P' ? 'bg-[#F6FEF9]' : status === 'A' ? 'bg-[#FFF5F5]' : status === 'L' ? 'bg-[#FFFDF0]' : 'bg-white';
        return (
          <div key={s.id} className={`flex items-center gap-3 px-5 py-2.5 border-b border-[#E4E4E4] last:border-b-0 ${rowBg}`}>
            <div style={{background:COLORS[i%COLORS.length]}} className="w-9 h-9 rounded-full text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">{init}</div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-[#111] truncate">{s.name}</div>
              <div className="text-[11px] text-[#AAA] truncate">Roll {s.roll} · {s.parentPhone}</div>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              {['P','L','A'].map(st => (
                <button key={st} onClick={() => mark(s.id, st)}
                  className={`w-9 h-8 rounded-[6px] text-[12px] font-bold border-[1.5px] cursor-pointer transition-all
                    ${status === st
                      ? st==='P' ? 'bg-[#166534] text-white border-[#166534] shadow-[0_2px_6px_rgba(22,101,52,.3)]'
                        : st==='A' ? 'bg-[#DC2626] text-white border-[#DC2626] shadow-[0_2px_6px_rgba(220,38,38,.3)]'
                        : 'bg-[#B45309] text-white border-[#B45309] shadow-[0_2px_6px_rgba(180,83,9,.3)]'
                      : st==='P' ? 'bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]'
                        : st==='A' ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]'
                        : 'bg-[#FFFBEB] text-[#B45309] border-[#FEF08A]'}`}
                >{st}</button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
