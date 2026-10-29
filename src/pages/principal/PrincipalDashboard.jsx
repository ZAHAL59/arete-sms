import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import { ADMISSIONS_SEED, CAMPUS_SEED } from '../../data/db';
import Badge from '../../components/ui/Badge';

const PORTALS = [
  {path:'/admissions',label:'Admissions',  icon:'🎓',color:'#C8202E'},
  {path:'/teacher',   label:'Teacher',     icon:'🍎',color:'#1A5FB4'},
  {path:'/hr',        label:'HR & Staff',  icon:'👥',color:'#6D28D9'},
  {path:'/finance',   label:'Finance',     icon:'₹', color:'#166534'},
  {path:'/hostel',    label:'Hostel',      icon:'🏠',color:'#B45309'},
  {path:'/transport', label:'Transport',   icon:'🚌',color:'#0B5A6B'},
  {path:'/campus',    label:'Campus',      icon:'🏫',color:'#374151'},
  {path:'/careers',   label:'Careers',    icon:'📋',color:'#3730A3'},
];

const fmt = n => '₹' + (n||0).toLocaleString('en-IN');

export default function PrincipalDashboard() {
  const navigate = useNavigate();
  const db = useStore(s => s.db);
  const totalFees = db.payments.reduce((a,p) => a+p.amount, 0);
  const boarders = db.students.filter(s => s.boarding).length;
  const openComplaints = (db.complaints || []).filter(c => c.status === 'Open').length;
  const pipeline = ADMISSIONS_SEED.filter(a => !['Enrolled','Rejected'].includes(a.stage)).length;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[240px] flex-shrink-0 bg-white border-r border-[#E4E4E4] flex flex-col">
        <div className="px-4 py-3.5 border-b border-[#E4E4E4] flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[7px] bg-[#C8202E] flex items-center justify-center text-white font-bold text-[13px]">A</div>
          <div>
            <div className="text-[14px] font-bold text-[#111]">Arete</div>
            <div className="text-[10px] text-[#AAA]">Principal Dashboard</div>
          </div>
        </div>
        <nav className="flex-1 py-3 px-2">
          {PORTALS.map(p => (
            <div key={p.path} onClick={() => navigate(p.path)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-[7px] text-[12.5px] text-[#555] cursor-pointer hover:bg-[#FEF4F4] hover:text-[#C8202E] mb-0.5 transition-all">
              <span className="text-[14px] w-5 text-center">{p.icon}</span>
              <span>{p.label}</span>
              <span className="ml-auto text-[10px]">→</span>
            </div>
          ))}
        </nav>
        <div className="flex items-center gap-2.5 px-3 py-3 border-t border-[#E4E4E4]">
          <div className="w-8 h-8 rounded-full bg-[#C8202E] text-white text-[11px] font-bold flex items-center justify-center">PR</div>
          <div>
            <div className="text-[12.5px] font-bold text-[#111]">Principal</div>
            <div className="text-[10.5px] text-[#AAA]">Arete Model School</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto bg-[#F8F8F8] p-6">
        <div className="mb-6">
          <h1 className="text-[22px] font-extrabold text-[#111] tracking-tight">Principal Dashboard</h1>
          <p className="text-[13px] text-[#AAA] mt-0.5">{new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</p>
        </div>

        {/* School-wide KPIs */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            {label:'Total Students', value:db.students.length,     color:'#C8202E'},
            {label:'Staff Members',  value:db.staff.length,        color:'#1A5FB4'},
            {label:'Fee Collected',  value:fmt(totalFees),         color:'#166534'},
            {label:'Active Pipeline',value:pipeline+' applicants', color:'#6D28D9'},
          ].map(k => (
            <div key={k.label} className="bg-white border border-[#E4E4E4] rounded-[10px] p-4 shadow-[0_1px_4px_rgba(0,0,0,.07)]" style={{borderLeft:`3px solid ${k.color}`}}>
              <div className="text-[10.5px] font-semibold text-[#AAA] uppercase tracking-wider mb-1">{k.label}</div>
              <div className="text-[22px] font-extrabold leading-none" style={{color:k.color}}>{k.value}</div>
            </div>
          ))}
        </div>

        {/* Secondary KPIs */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            {label:'Boarders',         value:boarders,         color:'#B45309'},
            {label:'Bus Routes',       value:db.routes.length, color:'#0B5A6B'},
            {label:'Open Complaints',  value:openComplaints,   color:'#DC2626'},
            {label:'Open Vacancies',   value:2,                color:'#374151'},
          ].map(k => (
            <div key={k.label} className="bg-white border border-[#E4E4E4] rounded-[10px] p-4 shadow-[0_1px_4px_rgba(0,0,0,.07)]">
              <div className="text-[10.5px] font-semibold text-[#AAA] uppercase tracking-wider mb-1">{k.label}</div>
              <div className="text-[22px] font-extrabold leading-none" style={{color:k.color}}>{k.value}</div>
            </div>
          ))}
        </div>

        {/* Portal quick access */}
        <h2 className="text-[14px] font-bold text-[#111] mb-3">Quick Access</h2>
        <div className="grid grid-cols-4 gap-3 mb-6">
          {PORTALS.map(p => (
            <div key={p.path} onClick={() => navigate(p.path)}
              className="bg-white border border-[#E4E4E4] rounded-[12px] p-4 cursor-pointer hover:shadow-[0_4px_18px_rgba(0,0,0,.1)] hover:-translate-y-0.5 transition-all text-center">
              <div className="text-[28px] mb-2">{p.icon}</div>
              <div className="text-[13px] font-bold text-[#111]">{p.label}</div>
              <div className="text-[10px] text-[#C8202E] font-semibold mt-1">Open →</div>
            </div>
          ))}
        </div>

        {/* Recent payments */}
        <h2 className="text-[14px] font-bold text-[#111] mb-3">Recent Payments</h2>
        <div className="bg-white border border-[#E4E4E4] rounded-[10px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,.07)]">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr>{['Student','Category','Amount','Date','Mode'].map(h =>
                <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold text-[#AAA] uppercase tracking-wider border-b border-[#E4E4E4] bg-[#F8F8F8]">{h}</th>
              )}</tr>
            </thead>
            <tbody>
              {db.payments.slice(0,5).map(p => {
                const stu = db.students.find(s => s.id === p.studentId);
                return (
                  <tr key={p.id} className="border-b border-[#E4E4E4] last:border-b-0 hover:bg-[#F8F8F8]">
                    <td className="px-4 py-2.5 font-semibold text-[#111]">{stu?.name||p.studentId}</td>
                    <td className="px-4 py-2.5 text-[#555]">{p.category}</td>
                    <td className="px-4 py-2.5 font-bold text-[#166534]">₹{p.amount.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-2.5 text-[#555]">{p.date}</td>
                    <td className="px-4 py-2.5"><Badge variant={p.mode==='Online'?'blue':'green'}>{p.mode}</Badge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
