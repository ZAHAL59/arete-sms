import { Link } from 'react-router-dom';

const SECTIONS = [
  ['Administration', [
    ['/principal', '🏛', 'Principal Dashboard', 'All 12 school modules in one place — students, staff, fees, attendance, payroll, communication, reports and more.'],
    ['/admissions', '🎓', 'Admissions', 'Student register, development profiles, boarding and bus allocation.'],
    ['/finance', '₹', 'Finance & Payroll', 'Fee collection, salary management, budget tracking and payment receipts.'],
    ['/hr', '👥', 'HR & Staff', 'Recruitment pipeline, interviews, training, attendance, growth tracker and leave.'],
    ['/teacher', '🍎', 'Teacher Portal', 'Mark class attendance, view student profiles, write notes, and track attendance history.'],
  ]],
  ['Campus & Operations', [
    ['/hostel', '🏠', 'Hostel', 'Room allocation, inmate records, mess planning, outings and incident log.'],
    ['/transport', '🚌', 'Transport', 'Bus routes, early departure SMS, stop tracking, maintenance and fuel log.'],
    ['/campus', '🏫', 'Campus', 'Complaints, events, inventory, library, visitor log and finance summary.'],
  ]],
  ['Public', [
    ['/careers', '📋', 'Careers Page', 'Public job application portal. Candidates apply here — submissions go straight to HR.'],
  ]],
];

export default function IndexPage() {
  return (
    <div className="min-h-screen bg-white text-[#111]">
      <header className="px-6 h-14 border-b border-[#E4E4E4] flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-[7px] bg-[#C8202E] text-white font-bold text-[13px] flex items-center justify-center">A</div>
        <div><div className="text-[15px] font-extrabold tracking-tight leading-tight">Arete</div><div className="text-[10px] text-[#AAA] leading-tight">Model School · AY 2026–27</div></div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-[11px] font-bold uppercase tracking-[2px] text-[#C8202E] mb-2">School Management System</div>
        <h1 className="text-[34px] font-extrabold tracking-tight mb-2">Welcome to Arete</h1>
        <p className="text-[14.5px] text-[#666] max-w-xl leading-relaxed mb-10">Select a portal below. Each section manages a specific area of the school — all connected to one shared database.</p>
        {SECTIONS.map(([title, cards]) => (
          <section key={title} className="mb-9">
            <div className="text-[11px] font-bold uppercase tracking-[1.8px] text-[#AAA] mb-3">{title}</div>
            <div className="grid md:grid-cols-3 gap-4">{cards.map(([to, icon, name, desc]) => (
              <Link key={to} to={to} className="group block bg-white border border-[#E4E4E4] rounded-[14px] p-5 no-underline text-inherit transition-all hover:-translate-y-1 hover:border-[#C8202E] hover:shadow-[0_10px_30px_rgba(200,32,46,.12)]">
                <div className="w-11 h-11 rounded-[10px] bg-[#FEF4F4] flex items-center justify-center text-[22px] mb-3">{icon}</div>
                <div className="text-[15.5px] font-bold mb-1">{name}</div><div className="text-[12.5px] text-[#777] leading-relaxed mb-3">{desc}</div>
                <div className="text-[12px] font-bold text-[#C8202E]">Open →</div>
              </Link>))}</div>
          </section>))}
      </main>
      <footer className="border-t border-[#E4E4E4] px-6 py-6 text-center text-[12px] text-[#AAA]">Arete Model School · Built by Shaheen Digital Academy<br />Mohammed Zahal · R&D Team</footer>
    </div>
  );
}
