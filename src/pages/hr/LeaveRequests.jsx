import { HR_SEED } from '../../data/db';
import { PageHeader } from '../../components/Layout';
import Badge from '../../components/ui/Badge';

export default function LeaveRequests() {
  return (
    <div className="p-6">
      <PageHeader title="Leave Requests" subtitle="Staff leave applications" />
      <div className="bg-white border border-[#E4E4E4] rounded-[10px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,.07)]">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>{['Staff','Type','From','To','Days','Reason','Status'].map(h =>
              <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold text-[#AAA] uppercase tracking-wider border-b border-[#E4E4E4] bg-[#F8F8F8]">{h}</th>
            )}</tr>
          </thead>
          <tbody>
            {HR_SEED.leaveRequests.map(l => (
              <tr key={l.id} className="border-b border-[#E4E4E4] last:border-b-0 hover:bg-[#F8F8F8]">
                <td className="px-4 py-2.5 font-semibold text-[#111]">{l.staffName}</td>
                <td className="px-4 py-2.5"><Badge variant="grey">{l.type}</Badge></td>
                <td className="px-4 py-2.5 text-[#555]">{l.from}</td>
                <td className="px-4 py-2.5 text-[#555]">{l.to}</td>
                <td className="px-4 py-2.5 font-bold text-[#111]">{l.days}</td>
                <td className="px-4 py-2.5 text-[#555]">{l.reason}</td>
                <td className="px-4 py-2.5"><Badge variant={l.status==='Approved'?'green':'amber'}>{l.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
