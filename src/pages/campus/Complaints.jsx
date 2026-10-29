import { CAMPUS_SEED } from '../../data/db';
import { PageHeader } from '../../components/Layout';
import Badge from '../../components/ui/Badge';

export default function Complaints() {
  return (
    <div className="p-6">
      <PageHeader title="Complaints" subtitle={`${CAMPUS_SEED.complaints.filter(c=>c.status==='Open').length} open`} />
      <div className="bg-white border border-[#E4E4E4] rounded-[10px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,.07)]">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>{['Date','From','Type','Subject','Action','Status'].map(h =>
              <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold text-[#AAA] uppercase tracking-wider border-b border-[#E4E4E4] bg-[#F8F8F8]">{h}</th>
            )}</tr>
          </thead>
          <tbody>
            {CAMPUS_SEED.complaints.map(c => (
              <tr key={c.id} className="border-b border-[#E4E4E4] last:border-b-0 hover:bg-[#F8F8F8]">
                <td className="px-4 py-2.5 text-[#555]">{c.date}</td>
                <td className="px-4 py-2.5 font-semibold text-[#111]">{c.who}</td>
                <td className="px-4 py-2.5"><Badge variant="grey">{c.type}</Badge></td>
                <td className="px-4 py-2.5 text-[#555]">{c.subj}</td>
                <td className="px-4 py-2.5 text-[#555]">{c.action}</td>
                <td className="px-4 py-2.5"><Badge variant={c.status==='Resolved'?'green':'amber'}>{c.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
