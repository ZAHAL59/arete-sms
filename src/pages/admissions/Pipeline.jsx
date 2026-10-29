import { ADMISSIONS_SEED, ADM_STAGES } from '../../data/db';
import { PageHeader } from '../../components/Layout';
import Badge from '../../components/ui/Badge';

const STAGE_COLOR = {
  Enquiry:'grey', Application:'blue', Assessment:'amber', Interview:'purple',
  Offer:'green', Enrolled:'green', Rejected:'red'
};
const STAGE_ICON = {
  Enquiry:'💬', Application:'📝', Assessment:'📐', Interview:'🎤',
  Offer:'✅', Enrolled:'🎓', Rejected:'❌'
};

export default function Pipeline({ onNavigate }) {
  const adm = ADMISSIONS_SEED;
  const active = adm.filter(a => !['Enrolled','Rejected'].includes(a.stage));
  const enrolled = adm.filter(a => a.stage === 'Enrolled').length;
  const rejected = adm.filter(a => a.stage === 'Rejected').length;

  return (
    <div className="p-6">
      <PageHeader title="Admissions Pipeline"
        subtitle={`AY 2026–27 · ${adm.length} total applications`}
        actions={<button onClick={() => onNavigate('applications')} className="px-4 py-2 bg-[#C8202E] text-white text-[12.5px] font-semibold rounded-[6px] cursor-pointer hover:bg-[#9A1822] transition-colors">+ New Application</button>}
      />

      {/* Summary KPIs */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label:'Total Applications', value:adm.length, color:'#C8202E' },
          { label:'Active Pipeline',    value:active.length, color:'#1A5FB4' },
          { label:'Enrolled',           value:enrolled, color:'#166534' },
          { label:'Rejected',           value:rejected, color:'#DC2626' },
        ].map(k => (
          <div key={k.label} className="bg-white border border-[#E4E4E4] rounded-[10px] p-4 shadow-[0_1px_4px_rgba(0,0,0,.07)]" style={{borderLeft:`3px solid ${k.color}`}}>
            <div className="text-[10.5px] font-semibold text-[#AAA] uppercase tracking-wider mb-1">{k.label}</div>
            <div className="text-[26px] font-extrabold leading-none" style={{color:k.color}}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Stage pipeline cards */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {['Enquiry','Application','Assessment','Interview','Offer'].map(stage => {
          const items = adm.filter(a => a.stage === stage);
          return (
            <div key={stage} onClick={() => onNavigate('applications')}
              className="bg-white border border-[#E4E4E4] rounded-[10px] p-4 shadow-[0_1px_4px_rgba(0,0,0,.07)] cursor-pointer hover:shadow-[0_4px_18px_rgba(0,0,0,.11)] hover:-translate-y-0.5 transition-all">
              <div className="text-[20px] mb-2">{STAGE_ICON[stage]}</div>
              <div className="text-[11px] font-bold text-[#AAA] uppercase tracking-wider mb-1">{stage}</div>
              <div className="text-[28px] font-extrabold text-[#111] leading-none mb-2">{items.length}</div>
              <div className="space-y-1">
                {items.slice(0,2).map(a => (
                  <div key={a.id} className="text-[11px] text-[#555] truncate">· {a.name}</div>
                ))}
                {items.length > 2 && <div className="text-[11px] text-[#C8202E] font-semibold">+{items.length-2} more</div>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent activity */}
      <div className="bg-white border border-[#E4E4E4] rounded-[10px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,.07)]">
        <div className="px-4 py-3 border-b border-[#E4E4E4] bg-[#F8F8F8]">
          <div className="text-[13.5px] font-bold text-[#111]">Recent Applications</div>
        </div>
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>{['Applicant','Grade','Stage','Date','Assigned','Docs'].map(h =>
              <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold text-[#AAA] uppercase tracking-wider border-b border-[#E4E4E4] bg-[#F8F8F8]">{h}</th>
            )}</tr>
          </thead>
          <tbody>
            {adm.slice().sort((a,b) => b.date.localeCompare(a.date)).slice(0,6).map(a => {
              const docsComplete = Object.values(a.docs).filter(Boolean).length;
              const docsTotal = Object.keys(a.docs).length;
              return (
                <tr key={a.id} className="border-b border-[#E4E4E4] last:border-b-0 hover:bg-[#F8F8F8]">
                  <td className="px-4 py-2.5 font-semibold text-[#111]">{a.name}</td>
                  <td className="px-4 py-2.5 text-[#555]">{a.grade}</td>
                  <td className="px-4 py-2.5"><Badge variant={STAGE_COLOR[a.stage]}>{a.stage}</Badge></td>
                  <td className="px-4 py-2.5 text-[#555]">{a.date}</td>
                  <td className="px-4 py-2.5 text-[#555]">{a.assignedTo || <span className="text-[#AAA]">Unassigned</span>}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 bg-[#E4E4E4] rounded-full w-16 overflow-hidden">
                        <div className="h-full bg-[#C8202E] rounded-full transition-all" style={{width:`${docsComplete/docsTotal*100}%`}}/>
                      </div>
                      <span className="text-[11px] text-[#AAA]">{docsComplete}/{docsTotal}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
