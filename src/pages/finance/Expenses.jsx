import { FINANCE_SEED } from '../../data/db';
import { PageHeader } from '../../components/Layout';
import Badge from '../../components/ui/Badge';
const fmt = n => '₹' + (n||0).toLocaleString('en-IN');

export default function Expenses() {
  const total = FINANCE_SEED.expenses.reduce((a,e) => a+e.amount, 0);
  return (
    <div className="p-6">
      <PageHeader title="Expenses" subtitle={`Total this month: ${fmt(total)}`} />
      <div className="bg-white border border-[#E4E4E4] rounded-[10px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,.07)]">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>{['ID','Category','Description','Amount','Date'].map(h =>
              <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold text-[#AAA] uppercase tracking-wider border-b border-[#E4E4E4] bg-[#F8F8F8]">{h}</th>
            )}</tr>
          </thead>
          <tbody>
            {FINANCE_SEED.expenses.map(e => (
              <tr key={e.id} className="border-b border-[#E4E4E4] last:border-b-0 hover:bg-[#F8F8F8]">
                <td className="px-4 py-2.5 font-mono text-[11.5px] text-[#AAA]">{e.id}</td>
                <td className="px-4 py-2.5"><Badge variant="grey">{e.cat}</Badge></td>
                <td className="px-4 py-2.5 text-[#555]">{e.desc}</td>
                <td className="px-4 py-2.5 font-bold text-[#C8202E]">{fmt(e.amount)}</td>
                <td className="px-4 py-2.5 text-[#555]">{e.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
