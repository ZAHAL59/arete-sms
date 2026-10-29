import { CAMPUS_SEED } from '../../data/db';
import { PageHeader } from '../../components/Layout';
import Badge from '../../components/ui/Badge';

const TODAY = new Date().toISOString().slice(0,10);

export default function Events() {
  return (
    <div className="p-6">
      <PageHeader title="Events" subtitle="Upcoming school events" />
      <div className="space-y-3">
        {CAMPUS_SEED.events.map(e => {
          const isPast = e.date < TODAY;
          const pct = Math.round(e.alloc/e.seats*100);
          return (
            <div key={e.id} className="bg-white border border-[#E4E4E4] rounded-[10px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,.07)]">
              <div className={`px-4 py-3 border-b border-[#E4E4E4] flex items-center justify-between ${isPast?'bg-[#F8F8F8]':'bg-[#FEF4F4]'}`}>
                <div>
                  <div className="text-[14px] font-bold text-[#111]">{e.title}</div>
                  <div className="text-[12px] text-[#777] mt-0.5">{e.date} · {e.time} · {e.venue}</div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="grey">{e.type}</Badge>
                  <Badge variant={isPast?'grey':'red2'}>{isPast?'Past':'Upcoming'}</Badge>
                </div>
              </div>
              <div className="px-4 py-3 flex items-center gap-4">
                <div className="text-[12px] text-[#555]">Seats: <strong>{e.alloc}/{e.seats}</strong></div>
                <div className="flex-1 h-1.5 bg-[#E4E4E4] rounded-full overflow-hidden">
                  <div className="h-full bg-[#C8202E] rounded-full" style={{width:`${pct}%`}}/>
                </div>
                <div className="text-[12px] font-bold text-[#C8202E]">{pct}% filled</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
