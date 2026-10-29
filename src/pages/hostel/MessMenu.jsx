import { HOSTEL_SEED } from '../../data/db';
import { PageHeader } from '../../components/Layout';
const today = new Date().toLocaleDateString('en-IN',{weekday:'long'});

export default function MessMenu() {
  return (
    <div className="p-6">
      <PageHeader title="Mess Menu" subtitle="Weekly meal plan" />
      <div className="grid grid-cols-1 gap-2">
        {HOSTEL_SEED.messMenu.map(d => (
          <div key={d.day} className={`bg-white border rounded-[10px] overflow-hidden ${d.day===today?'border-[#C8202E] shadow-[0_4px_18px_rgba(200,32,46,.15)]':'border-[#E4E4E4]'}`}>
            <div className={`px-4 py-2.5 flex items-center gap-3 ${d.day===today?'bg-[#FEF4F4]':'bg-[#F8F8F8]'} border-b border-[#E4E4E4]`}>
              <span className={`text-[13px] font-bold ${d.day===today?'text-[#C8202E]':'text-[#111]'}`}>{d.day}</span>
              {d.day===today && <span className="text-[10px] font-bold bg-[#C8202E] text-white px-2 py-0.5 rounded-full">Today</span>}
            </div>
            <div className="grid grid-cols-3 divide-x divide-[#E4E4E4]">
              {[['🌅 Breakfast',d.breakfast],['☀️ Lunch',d.lunch],['🌙 Dinner',d.dinner]].map(([label,meal]) => (
                <div key={label} className="px-4 py-3">
                  <div className="text-[10px] font-bold text-[#AAA] uppercase tracking-wider mb-1">{label}</div>
                  <div className="text-[13px] text-[#333]">{meal}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
