import { HR_SEED } from '../../data/db';
import { PageHeader } from '../../components/Layout';
import Badge from '../../components/ui/Badge';
import Collapsible from '../../components/ui/Collapsible';

const STATUS_VARIANT = {Shortlisted:'amber',Recommended:'green',Rejected:'red'};

export default function Recruitment() {
  return (
    <div className="p-6">
      <PageHeader title="Recruitment" subtitle={`${HR_SEED.vacancies.length} open vacancies`} />
      {HR_SEED.vacancies.map(v => {
        const candidates = HR_SEED.candidates.filter(c => c.vacId === v.id);
        return (
          <Collapsible key={v.id} defaultOpen className="mb-3"
            header={
              <div className="flex items-center gap-3 flex-1">
                <div>
                  <div className="text-[13.5px] font-bold text-[#111]">{v.subj} Teacher</div>
                  <div className="text-[11.5px] text-[#777]">{v.qual} · {v.exp} · Posted {v.posted}</div>
                </div>
                <div className="ml-auto flex gap-2">
                  <Badge variant="blue">{candidates.length} candidates</Badge>
                  <Badge variant="green">{v.status}</Badge>
                </div>
              </div>
            }
          >
            <table className="w-full border-collapse text-[13px] border-t border-[#E4E4E4]">
              <thead>
                <tr>{['Candidate','Qualification','Experience','Score','Status','Interview'].map(h =>
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold text-[#AAA] uppercase tracking-wider border-b border-[#E4E4E4] bg-[#F8F8F8]">{h}</th>
                )}</tr>
              </thead>
              <tbody>
                {candidates.map(c => (
                  <tr key={c.id} className="border-b border-[#E4E4E4] last:border-b-0 hover:bg-[#F8F8F8]">
                    <td className="px-4 py-2.5 font-semibold text-[#111]">{c.name}</td>
                    <td className="px-4 py-2.5 text-[#555]">{c.qual}</td>
                    <td className="px-4 py-2.5 text-[#555]">{c.exp}</td>
                    <td className="px-4 py-2.5"><span className="font-bold text-[#111]">{c.score}</span><span className="text-[#AAA]">/100</span></td>
                    <td className="px-4 py-2.5"><Badge variant={STATUS_VARIANT[c.status]||'grey'}>{c.status}</Badge></td>
                    <td className="px-4 py-2.5 text-[#555]">{c.interview}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Collapsible>
        );
      })}
    </div>
  );
}
