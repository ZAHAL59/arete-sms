import { PageHeader } from '../../components/Layout';
import Collapsible from '../../components/ui/Collapsible';
import Badge from '../../components/ui/Badge';

const TODAY = new Date().toISOString().slice(0,10);

const SESSIONS = [
  { id:'TR001', title:'NEP 2020 — Competency Based Education', date:'2026-08-15', trainer:'Dr. Anitha Raj', duration:'Full day', topics:['CBE Framework','Portfolio Learning','Outcome Mapping'] },
  { id:'TR002', title:'SHAPE DLSS — Digital Classroom Tools', date:'2026-09-02', trainer:'Muhd Zahal', duration:'Half day', topics:['DLSS Overview','Resource Library','Lesson Planning'] },
  { id:'TR003', title:'Classroom Differentiation Strategies', date:'2026-11-10', trainer:'Dr. Anitha Raj', duration:'Full day', topics:['Mixed-ability classes','Task scaffolding','Assessment variety'] },
  { id:'TR004', title:'Google Classroom & Digital Tools', date:'2026-12-05', trainer:'Muhd Zahal', duration:'Half day', topics:['Google Classroom setup','Forms for assessment','Drive organisation'] },
];

export default function Training() {
  return (
    <div className="p-6">
      <PageHeader title="Training Sessions" subtitle="Sessions scheduled by HR — attendance is recorded in your HR profile" />
      <div className="space-y-2">
        {SESSIONS.map((t, i) => {
          const isPast = t.date < TODAY;
          return (
            <Collapsible key={t.id}
              header={
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-9 h-9 rounded-[8px] flex items-center justify-center text-[16px] flex-shrink-0 ${isPast ? 'bg-[#F0FDF4]' : 'bg-[#FEF4F4]'}`}>
                    {isPast ? '✅' : '📅'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-bold text-[#111]">{t.title}</div>
                    <div className="text-[11.5px] text-[#AAA] mt-0.5">{t.date} · {t.duration} · {t.trainer}</div>
                  </div>
                  <Badge variant={isPast ? 'green' : 'blue'}>{isPast ? 'Attended' : 'Upcoming'}</Badge>
                </div>
              }
            >
              <div className="px-4 py-3 border-t border-[#E4E4E4]">
                <div className="text-[10.5px] font-bold text-[#AAA] uppercase tracking-wider mb-2">Topics</div>
                <div className="flex gap-2 flex-wrap">
                  {t.topics.map(tp => <Badge key={tp} variant="purple">{tp}</Badge>)}
                </div>
              </div>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
}
