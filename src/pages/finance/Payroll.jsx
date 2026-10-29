import useStore from '../../store/useStore';
import { PageHeader } from '../../components/Layout';
import Badge from '../../components/ui/Badge';
const fmt = n => '₹' + (n||0).toLocaleString('en-IN');

export default function Payroll() {
  const db = useStore(s => s.db);
  const total = db.staff.reduce((a,s) => a+s.salary, 0);
  return (
    <div className="p-6">
      <PageHeader title="Payroll" subtitle={`Monthly payroll · ${fmt(total)} total`} />
      <div className="bg-white border border-[#E4E4E4] rounded-[10px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,.07)]">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>{['Staff','Subject','Joined','Gross Salary','Status'].map(h =>
              <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold text-[#AAA] uppercase tracking-wider border-b border-[#E4E4E4] bg-[#F8F8F8]">{h}</th>
            )}</tr>
          </thead>
          <tbody>
            {db.staff.map(s => (
              <tr key={s.id} className="border-b border-[#E4E4E4] last:border-b-0 hover:bg-[#F8F8F8]">
                <td className="px-4 py-2.5 font-semibold text-[#111]">{s.name}</td>
                <td className="px-4 py-2.5 text-[#555]">{s.subj}</td>
                <td className="px-4 py-2.5 text-[#555]">{s.joined}</td>
                <td className="px-4 py-2.5 font-bold text-[#111]">{fmt(s.salary)}</td>
                <td className="px-4 py-2.5"><Badge variant="green">Processed</Badge></td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-[#F8F8F8]">
              <td colSpan={3} className="px-4 py-3 font-bold text-[#111]">Total</td>
              <td className="px-4 py-3 font-extrabold text-[#C8202E] text-[14px]">{fmt(total)}</td>
              <td/>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
