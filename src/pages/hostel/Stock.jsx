import { HOSTEL_SEED } from '../../data/db';
import { PageHeader } from '../../components/Layout';
import Badge from '../../components/ui/Badge';

export default function Stock() {
  return (
    <div className="p-6">
      <PageHeader title="Mess Stock" subtitle="Current inventory levels" />
      <div className="bg-white border border-[#E4E4E4] rounded-[10px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,.07)]">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>{['Item','Unit','Current Stock','Max','Level','Status'].map(h =>
              <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold text-[#AAA] uppercase tracking-wider border-b border-[#E4E4E4] bg-[#F8F8F8]">{h}</th>
            )}</tr>
          </thead>
          <tbody>
            {HOSTEL_SEED.stock.map(s => {
              const pct = Math.round(s.qty/s.max*100);
              const isLow = s.qty <= s.low;
              return (
                <tr key={s.item} className="border-b border-[#E4E4E4] last:border-b-0 hover:bg-[#F8F8F8]">
                  <td className="px-4 py-2.5 font-semibold text-[#111]">{s.item}</td>
                  <td className="px-4 py-2.5 text-[#555]">{s.unit}</td>
                  <td className="px-4 py-2.5 font-bold text-[#111]">{s.qty}</td>
                  <td className="px-4 py-2.5 text-[#555]">{s.max}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 bg-[#E4E4E4] rounded-full w-20 overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{width:`${pct}%`,background:isLow?'#DC2626':'#C8202E'}}/>
                      </div>
                      <span className="text-[11px] text-[#AAA]">{pct}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5"><Badge variant={isLow?'red':'green'}>{isLow?'Low Stock':'OK'}</Badge></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
