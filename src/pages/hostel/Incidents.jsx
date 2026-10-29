import { HOSTEL_SEED } from '../../data/db';
import { PageHeader } from '../../components/Layout';
import Badge from '../../components/ui/Badge';

export default function Incidents() {
  return (
    <div className="p-6">
      <PageHeader title="Incident Log" subtitle="Hostel incidents and actions taken" />
      <div className="bg-white border border-[#E4E4E4] rounded-[10px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,.07)]">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>{['Date','Student','Type','Description','Action','Status'].map(h =>
              <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold text-[#AAA] uppercase tracking-wider border-b border-[#E4E4E4] bg-[#F8F8F8]">{h}</th>
            )}</tr>
          </thead>
          <tbody>
            {HOSTEL_SEED.incidents.length
              ? HOSTEL_SEED.incidents.map(i => (
                <tr key={i.id} className="border-b border-[#E4E4E4] last:border-b-0 hover:bg-[#F8F8F8]">
                  <td className="px-4 py-2.5 text-[#555]">{i.date}</td>
                  <td className="px-4 py-2.5 font-semibold text-[#111]">{i.student}</td>
                  <td className="px-4 py-2.5"><Badge variant="amber">{i.type}</Badge></td>
                  <td className="px-4 py-2.5 text-[#555]">{i.desc}</td>
                  <td className="px-4 py-2.5 text-[#555]">{i.action}</td>
                  <td className="px-4 py-2.5"><Badge variant="green">{i.status}</Badge></td>
                </tr>
              ))
              : <tr><td colSpan={6} className="text-center py-12 text-[#AAA]">No incidents recorded</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
