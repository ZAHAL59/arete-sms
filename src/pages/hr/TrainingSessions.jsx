import { HR_SEED } from '../../data/db';
import { PageHeader } from '../../components/Layout';
import Badge from '../../components/ui/Badge';
import Collapsible from '../../components/ui/Collapsible';

const TODAY = new Date().toISOString().slice(0,10);

export default function TrainingSessions() {
  return (
    <div className="p-6">
      <PageHeader title="Training Sessions" subtitle="Staff development programmes" />
      <div className="space-y-2">
        {HR_SEED.training.map((t,i) => {
          const isPast = t.date < TODAY;
          return (
            <Collapsible key={t.id}
              header={
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-9 h-9 rounded-[8px] flex items-center justify-content:center text-[16px] flex-shrink-0 flex items-center justify-center ${isPast?'bg-[#F0FDF4]':'bg-[#FEF4F4]'}`}>
                    {isPast?'✅':'📅'}
                  </div>
                  <div className="flex-1">
                    <div className="text-[13.5px] font-bold text-[#111]">{t.title}</div>
                    <div className="text-[11.5px] text-[#AAA] mt-0.5">{t.date} · {t.duration} · {t.trainer} · {t.attendees.length} attendees</div>
                  </div>
                  <Badge variant={isPast?'green':'blue'}>{isPast?'Completed':'Upcoming'}</Badge>
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
