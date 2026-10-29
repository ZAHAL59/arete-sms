import useStore from '../../store/useStore';
import { PageHeader } from '../../components/Layout';
import Badge from '../../components/ui/Badge';

const fmt = n => '₹' + (n||0).toLocaleString('en-IN');

export default function FeeCollection() {
  const db = useStore(s => s.db);
  const total = db.payments.reduce((a,p) => a+p.amount, 0);
  const modes = ['Online','Cash','Cheque'].map(m => ({
    mode:m, count:db.payments.filter(p=>p.mode===m).length,
    amount:db.payments.filter(p=>p.mode===m).reduce((a,p)=>a+p.amount,0)
  }));

  return (
    <div className="p-6">
      <PageHeader title="Fee Collection" subtitle="Payment records for current term" />
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          {label:'Total Collected', value:fmt(total),           color:'#166534'},
          {label:'Transactions',   value:db.payments.length,   color:'#C8202E'},
          {label:'Online',         value:fmt(modes[0].amount), color:'#1A5FB4'},
          {label:'Cash / Cheque',  value:fmt(modes[1].amount+modes[2].amount), color:'#B45309'},
        ].map(k => (
          <div key={k.label} className="bg-white border border-[#E4E4E4] rounded-[10px] p-3.5 shadow-[0_1px_4px_rgba(0,0,0,.07)]" style={{borderLeft:`3px solid ${k.color}`}}>
            <div className="text-[10.5px] font-semibold text-[#AAA] uppercase tracking-wider mb-1">{k.label}</div>
            <div className="text-[20px] font-extrabold leading-none" style={{color:k.color}}>{k.value}</div>
          </div>
        ))}
      </div>
      <div className="bg-white border border-[#E4E4E4] rounded-[10px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,.07)]">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>{['Receipt','Student','Category','Amount','Date','Mode'].map(h =>
              <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold text-[#AAA] uppercase tracking-wider border-b border-[#E4E4E4] bg-[#F8F8F8]">{h}</th>
            )}</tr>
          </thead>
          <tbody>
            {db.payments.map(p => {
              const stu = db.students.find(s => s.id === p.studentId);
              return (
                <tr key={p.id} className="border-b border-[#E4E4E4] last:border-b-0 hover:bg-[#F8F8F8]">
                  <td className="px-4 py-2.5 font-mono text-[11.5px] text-[#AAA]">{p.id}</td>
                  <td className="px-4 py-2.5 font-semibold text-[#111]">{stu?.name||p.studentId}</td>
                  <td className="px-4 py-2.5"><Badge variant="grey">{p.category}</Badge></td>
                  <td className="px-4 py-2.5 font-bold text-[#166534]">{fmt(p.amount)}</td>
                  <td className="px-4 py-2.5 text-[#555]">{p.date}</td>
                  <td className="px-4 py-2.5"><Badge variant={p.mode==='Online'?'blue':p.mode==='Cash'?'green':'amber'}>{p.mode}</Badge></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
