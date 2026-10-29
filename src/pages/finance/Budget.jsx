import { FINANCE_SEED } from '../../data/db';
import { PageHeader } from '../../components/Layout';
const fmt = n => '₹' + ((n||0)/100000).toFixed(1) + 'L';

export default function Budget() {
  return (
    <div className="p-6">
      <PageHeader title="Budget Overview" subtitle="Annual budget vs actual spend" />
      <div className="bg-white border border-[#E4E4E4] rounded-[10px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,.07)]">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>{['Category','Budgeted','Actual','Variance','Utilisation'].map(h =>
              <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold text-[#AAA] uppercase tracking-wider border-b border-[#E4E4E4] bg-[#F8F8F8]">{h}</th>
            )}</tr>
          </thead>
          <tbody>
            {FINANCE_SEED.budget.map(b => {
              const variance = b.actual - b.budgeted;
              const pct = Math.round(b.actual/b.budgeted*100);
              return (
                <tr key={b.cat} className="border-b border-[#E4E4E4] last:border-b-0 hover:bg-[#F8F8F8]">
                  <td className="px-4 py-2.5 font-semibold text-[#111]">{b.cat}</td>
                  <td className="px-4 py-2.5 text-[#555]">{fmt(b.budgeted)}</td>
                  <td className="px-4 py-2.5 font-bold text-[#111]">{fmt(b.actual)}</td>
                  <td className={`px-4 py-2.5 font-bold ${variance>0?'text-[#DC2626]':'text-[#166534]'}`}>
                    {variance>0?'+':''}{fmt(variance)}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 bg-[#E4E4E4] rounded-full w-20 overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{width:`${Math.min(pct,100)}%`, background:pct>100?'#DC2626':'#C8202E'}}/>
                      </div>
                      <span className="text-[11px] font-semibold" style={{color:pct>100?'#DC2626':'#166534'}}>{pct}%</span>
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
