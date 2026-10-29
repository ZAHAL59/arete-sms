import useStore from '../../store/useStore';
import { PageHeader } from '../../components/Layout';
import Badge from '../../components/ui/Badge';

const COLORS = ['#A31060','#2B3BA6','#0B6B4A','#896B00','#0B5A6B'];

export default function StaffList() {
  const db = useStore(s => s.db);
  const totalSalary = db.staff.reduce((a,s) => a+s.salary, 0);

  return (
    <div className="p-6">
      <PageHeader title="Staff Directory" subtitle={`${db.staff.length} active staff members`} />
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          {label:'Total Staff',    value:db.staff.length,        color:'#C8202E'},
          {label:'Teaching',       value:db.staff.filter(s=>s.subj).length, color:'#1A5FB4'},
          {label:'Monthly Payroll',value:'₹'+totalSalary.toLocaleString('en-IN'), color:'#166534'},
          {label:'On Leave',       value:1,                      color:'#B45309'},
        ].map(k => (
          <div key={k.label} className="bg-white border border-[#E4E4E4] rounded-[10px] p-3.5 shadow-[0_1px_4px_rgba(0,0,0,.07)]" style={{borderLeft:`3px solid ${k.color}`}}>
            <div className="text-[10.5px] font-semibold text-[#AAA] uppercase tracking-wider mb-1">{k.label}</div>
            <div className="text-[22px] font-extrabold leading-none" style={{color:k.color}}>{k.value}</div>
          </div>
        ))}
      </div>
      <div className="bg-white border border-[#E4E4E4] rounded-[10px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,.07)]">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>{['Staff Member','Subject','Phone','Joined','Salary','Status'].map(h =>
              <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold text-[#AAA] uppercase tracking-wider border-b border-[#E4E4E4] bg-[#F8F8F8]">{h}</th>
            )}</tr>
          </thead>
          <tbody>
            {db.staff.map((s,i) => (
              <tr key={s.id} className="border-b border-[#E4E4E4] last:border-b-0 hover:bg-[#F8F8F8]">
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <div style={{background:COLORS[i%COLORS.length]}} className="w-8 h-8 rounded-full text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                      {s.name.split(' ').filter(w=>w.match(/[A-Z]/)).map(w=>w[0]).join('').slice(0,2)||'??'}
                    </div>
                    <div>
                      <div className="font-semibold text-[#111]">{s.name}</div>
                      <div className="text-[11px] text-[#AAA]">{s.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-[#555]">{s.subj}</td>
                <td className="px-4 py-2.5 font-mono text-[11.5px] text-[#555]">{s.phone}</td>
                <td className="px-4 py-2.5 text-[#555]">{s.joined}</td>
                <td className="px-4 py-2.5 font-semibold text-[#111]">₹{s.salary.toLocaleString('en-IN')}</td>
                <td className="px-4 py-2.5"><Badge variant="green">{s.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
