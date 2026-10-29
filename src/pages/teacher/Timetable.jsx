import { useState } from 'react';
import useStore from '../../store/useStore';
import AttendancePanel from './AttendancePanel';

const TEACHER = { id:'T001', name:'Ms. Latha R.', subj:'Mathematics', classes:['Grade 6 B','Grade 7 B','Grade 8 A','Grade 9 A','Grade 10 A'] };
const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
const PERIODS = ['8:00–8:40','8:40–9:20','9:20–10:00','Break','10:20–11:00','11:00–11:40','11:40–12:20','Lunch','1:20–2:00','2:00–2:40'];

const TT = [
  [{cls:'Grade 8 A'},{cls:'Grade 6 B'},{free:true},{brk:true},{cls:'Grade 9 A'},{free:true},{cls:'Grade 10 A'},{brk:true},{cls:'Grade 7 B'},{free:true}],
  [{cls:'Grade 10 A'},{cls:'Grade 9 A'},{free:true},{brk:true},{cls:'Grade 7 B'},{cls:'Grade 8 A'},{cls:'Grade 6 B'},{brk:true},{free:true},{free:true}],
  [{cls:'Grade 6 B'},{cls:'Grade 8 A'},{free:true},{brk:true},{cls:'Grade 10 A'},{cls:'Grade 7 B'},{free:true},{brk:true},{cls:'Staff Meeting',staff:true},{cls:'Grade 9 A'}],
  [{cls:'Grade 7 B'},{cls:'Grade 10 A'},{cls:'Grade 8 A'},{brk:true},{free:true},{cls:'Grade 9 A'},{cls:'Grade 7 B'},{brk:true},{free:true},{cls:'Grade 10 A'}],
  [{cls:'Grade 9 A'},{cls:'Grade 6 B'},{free:true},{brk:true},{cls:'Grade 8 A'},{free:true},{cls:'Grade 9 A'},{brk:true},{cls:'Grade 8 A'},{free:true}],
];

function getWeekDates() {
  const now = new Date();
  const dow = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (dow === 0 ? 6 : dow - 1));
  return DAYS.map((_, i) => { const d = new Date(monday); d.setDate(monday.getDate() + i); return d; });
}

function getCurrentPeriod() {
  const d = new Date();
  const dow = d.getDay() - 1;
  if (dow < 0 || dow > 4) return { day: -1, period: -1 };
  const mins = d.getHours() * 60 + d.getMinutes();
  const starts = [480,520,560,600,620,660,700,740,800,840];
  const durations = [40,40,40,20,40,40,40,20,40,40];
  const period = starts.findIndex((s,i) => mins >= s && mins < s + durations[i]);
  return { day: dow, period };
}

export default function Timetable() {
  const db = useStore(s => s.db);
  const [attCls, setAttCls] = useState(null);
  const wkDates = getWeekDates();
  const cur = getCurrentPeriod();
  const today = new Date().toISOString().slice(0,10);

  const wkLabel = wkDates[0].toLocaleDateString('en-IN',{day:'numeric',month:'short'})
    + ' – ' + wkDates[4].toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});

  return (
    <div className="p-6">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-[3px] h-[18px] bg-[#C8202E] rounded-full inline-block"/>
          <h1 className="text-[20px] font-extrabold text-[#111]">Timetable</h1>
        </div>
        <p className="text-[12.5px] text-[#777] ml-3">Your classes are highlighted — tap any class to mark attendance</p>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto rounded-[14px] border border-[#E0E0E0] shadow-[0_4px_24px_rgba(0,0,0,.07)]">
        <div style={{ display:'grid', gridTemplateColumns:'72px repeat(5,1fr)' }}>

          {/* Corner */}
          <div className="bg-gradient-to-br from-[#C8202E] to-[#9A1822] p-3 text-[9px] font-bold text-white/60 uppercase tracking-wider flex items-end border-b border-white/10 border-r border-white/10">
            {wkLabel}
          </div>

          {/* Day headers */}
          {DAYS.map((_, di) => {
            const dt = wkDates[di];
            const isToday = di === cur.day, isPast = di < cur.day;
            return (
              <div key={di} className={`p-3 text-center border-b border-r border-white/10 ${isToday ? 'bg-[#9A1822]' : 'bg-gradient-to-br from-[#C8202E] to-[#9A1822]'} ${isPast ? 'opacity-55' : ''}`}>
                <div className="text-[9px] font-bold uppercase tracking-wider text-white/65">
                  {dt.toLocaleDateString('en-IN',{weekday:'short'})}
                </div>
                <div className="text-[13px] font-extrabold text-white mt-0.5 flex items-center justify-center gap-1">
                  {dt.toLocaleDateString('en-IN',{day:'numeric',month:'short'})}
                  {isToday && <span className="w-1.5 h-1.5 rounded-full bg-white/80 inline-block"/>}
                </div>
              </div>
            );
          })}

          {/* Period rows */}
          {PERIODS.map((per, pi) => {
            const isBreak = per === 'Break' || per === 'Lunch';
            return (
              <>
                {/* Time label */}
                <div key={`t${pi}`} className={`${isBreak ? 'bg-[#FEF4F4] text-[#C8202E] text-[9px]' : 'bg-[#FEF4F4] text-[#C8202E] text-[9.5px]'} font-bold flex items-center justify-center p-2 text-center leading-tight border-b border-r border-[#EBEBEB]`}>
                  {per}
                </div>

                {/* Day cells */}
                {DAYS.map((_, di) => {
                  const cell = TT[di][pi];

                  if (isBreak || cell?.brk) {
                    return <div key={`${pi}-${di}`} className="bg-[#FEF9F9] border-b border-r border-[#EBEBEB]"/>;
                  }

                  if (cell?.free) {
                    return (
                      <div key={`${pi}-${di}`} className="bg-[#FFF5F5] flex items-center justify-center min-h-[64px] border-b border-r border-[#EBEBEB]">
                        <span className="text-[11px] font-semibold text-[#C8202E] opacity-35">Free</span>
                      </div>
                    );
                  }

                  const isNow = di === cur.day && pi === cur.period;
                  const isToday = di === cur.day;
                  const isPast = di < cur.day;
                  const attKey = cell?.cls?.replace(/\s+/g,'') + '-' + today;
                  const marked = db.attendance[attKey] && Object.keys(db.attendance[attKey]).length > 0;

                  return (
                    <div key={`${pi}-${di}`}
                      className={`min-h-[64px] p-3 border-b border-r border-[#EBEBEB] transition-colors
                        ${cell?.staff ? 'bg-[#FFFBEB]' : isNow ? 'bg-[#EFF6FF]' : 'bg-[#FFF5F5] hover:bg-[#FEE8E8] cursor-pointer'}
                        ${isNow ? 'border-b-2 border-b-[#1A5FB4]' : ''}`}
                      onClick={() => !cell?.staff && isToday && setAttCls(cell?.cls)}
                    >
                      <div className={`text-[12.5px] font-bold ${cell?.staff ? 'text-[#92400E]' : isNow ? 'text-[#1A5FB4]' : 'text-[#111]'}`}>
                        {cell?.cls}
                      </div>
                      {isToday && !cell?.staff && (
                        marked
                          ? <div className="text-[10px] font-bold text-[#166534] mt-1">✓ Marked</div>
                          : <div className="text-[10px] font-bold text-[#C8202E] mt-1 underline">Mark now</div>
                      )}
                      {isPast && !cell?.staff && (
                        <div className="text-[10px] font-bold text-[#166534] mt-1">✓ Done</div>
                      )}
                      {!isToday && !isPast && !cell?.staff && (
                        <div className="text-[10px] text-[#CCC] mt-1">Upcoming</div>
                      )}
                    </div>
                  );
                })}
              </>
            );
          })}
        </div>
      </div>

      {/* Attendance panel */}
      {attCls && (
        <AttendancePanel
          cls={attCls}
          date={today}
          onClose={() => setAttCls(null)}
        />
      )}
    </div>
  );
}
