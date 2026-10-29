import { PageHeader } from '../../components/Layout';
import Badge from '../../components/ui/Badge';

const DEPARTURES = [
  {id:'DEP001',student:'Rahul P.',    cls:'Grade 9 C',reason:'Medical appointment',time:'13:30',date:'2026-10-14',smsSent:true},
  {id:'DEP002',student:'Mohammed Ashiq',cls:'Grade 7 B',reason:'Family function',   time:'14:00',date:'2026-10-12',smsSent:true},
];

export default function EarlyDeparture() {
  return (
    <div className="p-6">
      <PageHeader title="Early Departures" subtitle="Students leaving before school ends" />
      <div className="bg-white border border-[#E4E4E4] rounded-[10px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,.07)]">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>{['Student','Class','Reason','Time','Date','SMS'].map(h =>
              <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold text-[#AAA] uppercase tracking-wider border-b border-[#E4E4E4] bg-[#F8F8F8]">{h}</th>
            )}</tr>
          </thead>
          <tbody>
            {DEPARTURES.map(d => (
              <tr key={d.id} className="border-b border-[#E4E4E4] last:border-b-0 hover:bg-[#F8F8F8]">
                <td className="px-4 py-2.5 font-semibold text-[#111]">{d.student}</td>
                <td className="px-4 py-2.5 text-[#555]">{d.cls}</td>
                <td className="px-4 py-2.5 text-[#555]">{d.reason}</td>
                <td className="px-4 py-2.5 font-bold text-[#111]">{d.time}</td>
                <td className="px-4 py-2.5 text-[#555]">{d.date}</td>
                <td className="px-4 py-2.5"><Badge variant={d.smsSent?'green':'amber'}>{d.smsSent?'Sent':'Pending'}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
