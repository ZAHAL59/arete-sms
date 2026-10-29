import useStore from '../../store/useStore';
import { HOSTEL_SEED } from '../../data/db';
import { PageHeader } from '../../components/Layout';
import Badge from '../../components/ui/Badge';
import Collapsible from '../../components/ui/Collapsible';

export default function Rooms() {
  const db = useStore(s => s.db);
  const boarders = db.students.filter(s => s.boarding);
  return (
    <div className="p-6">
      <PageHeader title="Room Allocation" subtitle={`${boarders.length} boarders · ${HOSTEL_SEED.rooms.length} rooms`} />
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          {label:'Total Boarders', value:boarders.length, color:'#C8202E'},
          {label:'Rooms',          value:HOSTEL_SEED.rooms.length, color:'#1A5FB4'},
          {label:'Avg Occupancy',  value:Math.round(boarders.length/HOSTEL_SEED.rooms.length*10)/10+'/room', color:'#166534'},
        ].map(k => (
          <div key={k.label} className="bg-white border border-[#E4E4E4] rounded-[10px] p-3.5 shadow-[0_1px_4px_rgba(0,0,0,.07)]" style={{borderLeft:`3px solid ${k.color}`}}>
            <div className="text-[10.5px] font-semibold text-[#AAA] uppercase tracking-wider mb-1">{k.label}</div>
            <div className="text-[22px] font-extrabold" style={{color:k.color}}>{k.value}</div>
          </div>
        ))}
      </div>
      {HOSTEL_SEED.rooms.map(r => {
        const inmates = boarders.filter(s => r.inmates.includes(s.id));
        const pct = Math.round(inmates.length/r.cap*100);
        return (
          <Collapsible key={r.id} className="mb-2"
            header={
              <div className="flex items-center gap-3 flex-1">
                <div className="w-9 h-9 rounded-[8px] bg-gradient-to-br from-[#C8202E] to-[#9A1822] text-white text-[12px] font-bold flex items-center justify-center flex-shrink-0">
                  {r.block}{r.num}
                </div>
                <div className="flex-1">
                  <div className="text-[13.5px] font-bold text-[#111]">Block {r.block} · Room {r.num}</div>
                  <div className="text-[11.5px] text-[#777]">{inmates.length}/{r.cap} occupied</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-1.5 bg-[#E4E4E4] rounded-full w-16 overflow-hidden">
                    <div className="h-full bg-[#C8202E] rounded-full" style={{width:`${pct}%`}}/>
                  </div>
                  <Badge variant={inmates.length===r.cap?'red':inmates.length===0?'grey':'green'}>
                    {inmates.length===r.cap?'Full':inmates.length===0?'Empty':'Available'}
                  </Badge>
                </div>
              </div>
            }
          >
            {!inmates.length
              ? <div className="p-4 text-center text-[#AAA] border-t border-[#E4E4E4]">No inmates assigned</div>
              : <div className="divide-y divide-[#E4E4E4] border-t border-[#E4E4E4]">
                  {inmates.map(s => (
                    <div key={s.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#F8F8F8]">
                      <span className="font-semibold text-[#111] flex-1">{s.name}</span>
                      <span className="text-[12px] text-[#555]">{s.cls} {s.section}</span>
                      <span className="text-[11.5px] font-mono text-[#AAA]">{s.parentPhone}</span>
                    </div>
                  ))}
                </div>
            }
          </Collapsible>
        );
      })}
    </div>
  );
}
