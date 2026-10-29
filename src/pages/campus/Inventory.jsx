import { CAMPUS_SEED } from '../../data/db';
import { PageHeader } from '../../components/Layout';
import Badge from '../../components/ui/Badge';

export default function Inventory() {
  return (
    <div className="p-6">
      <PageHeader title="Inventory" subtitle="School assets and equipment" />
      <div className="bg-white border border-[#E4E4E4] rounded-[10px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,.07)]">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>{['Item','Category','Total','Working','Under Repair','Status'].map(h =>
              <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold text-[#AAA] uppercase tracking-wider border-b border-[#E4E4E4] bg-[#F8F8F8]">{h}</th>
            )}</tr>
          </thead>
          <tbody>
            {CAMPUS_SEED.inventory.map(item => (
              <tr key={item.id} className="border-b border-[#E4E4E4] last:border-b-0 hover:bg-[#F8F8F8]">
                <td className="px-4 py-2.5 font-semibold text-[#111]">{item.name}</td>
                <td className="px-4 py-2.5"><Badge variant="grey">{item.cat}</Badge></td>
                <td className="px-4 py-2.5 font-bold text-[#111]">{item.total}</td>
                <td className="px-4 py-2.5 text-[#166534] font-semibold">{item.working}</td>
                <td className="px-4 py-2.5 text-[#DC2626] font-semibold">{item.repair}</td>
                <td className="px-4 py-2.5"><Badge variant={item.repair>0?'amber':'green'}>{item.repair>0?'Needs Attention':'Good'}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
