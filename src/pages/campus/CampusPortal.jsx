import { useState } from 'react';
import Logo from '../../components/Logo';
import useStore from '../../store/useStore';
import useCampus from './useCampus';
import { loanStatus, TODAY } from './constants';
import Complaints from './Complaints';
import Visitors from './Visitors';
import Events from './Events';
import Inventory from './Inventory';
import Library from './Library';
import FinanceSummary from './FinanceSummary';

const VIEWS = [
  {id:'complaints', label:'Complaints',          icon:'📩', section:'Operations'},
  {id:'visitors',   label:'Visitor Log',         icon:'👤', section:'Operations'},
  {id:'events',     label:'Meetings & Events',   icon:'📅', section:'Operations'},
  {id:'inventory',  label:'Inventory',           icon:'📦', section:'Assets'},
  {id:'library',    label:'Library',             icon:'📚', section:'Assets'},
  {id:'finance',    label:'Finance Summary',     icon:'₹',  section:'Reports'},
];
const SECTIONS = [...new Set(VIEWS.map(v => v.section))];

export default function CampusPortal() {
  const [view, setView] = useState('complaints');
  const C = useCampus(); const { c } = C;
  const complaints = useStore(s => s.db.complaints) || [];
  const badge = {
    complaints: complaints.filter(x => x.status === 'Open').length,
    visitors: c.visitors.filter(v => v.status === 'In' && v.date === TODAY).length,
    library: c.books.filter(b => loanStatus(b) === 'Overdue').length,
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-[240px] flex-shrink-0 bg-white border-r border-[#E4E4E4] flex flex-col overflow-y-auto">
        <div className="px-4 py-3.5 border-b border-[#E4E4E4] flex items-center gap-2.5">
          <Logo />
          <div><div className="text-[14px] font-bold text-[#111] leading-tight">Arete</div><div className="text-[10px] text-[#AAA]">Campus</div></div>
        </div>
        <nav className="flex-1 py-2">
          {SECTIONS.map(sec => (
            <div key={sec}>
              <div className="px-4 pt-3 pb-1 text-[9px] font-bold tracking-[1.8px] uppercase text-[#AAA]">{sec}</div>
              {VIEWS.filter(v => v.section === sec).map(v => (
                <div key={v.id} onClick={() => setView(v.id)}
                  className={`flex items-center gap-2.5 py-2 mx-2 rounded-[7px] text-[12.5px] cursor-pointer transition-all select-none
                    ${view === v.id ? 'bg-[#FEF4F4] text-[#C8202E] font-semibold border-l-[3px] border-[#C8202E] rounded-l-none ml-0 pl-[11px] pr-3'
                                    : 'text-[#555] hover:bg-[#FEF4F4] hover:text-[#C8202E] px-3'}`}>
                  <span className="text-[14px] w-5 text-center flex-shrink-0">{v.icon}</span>
                  <span className="flex-1">{v.label}</span>
                  {badge[v.id] > 0 && <span className="text-[9px] font-bold bg-[#C8202E] text-white px-1.5 py-0.5 rounded-full">{badge[v.id]}</span>}
                </div>
              ))}
            </div>
          ))}
        </nav>
        <div className="flex items-center gap-2.5 px-3 py-3 border-t border-[#E4E4E4]">
          <div className="w-8 h-8 rounded-full bg-[#C8202E] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">MZ</div>
          <div><div className="text-[12.5px] font-bold text-[#111]">Muhd Zahal</div><div className="text-[10.5px] text-[#AAA]">Campus Admin</div></div>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto bg-[#F8F8F8]">
        {view === 'complaints' && <Complaints addComplaint={C.addComplaint} resolveComplaint={C.resolveComplaint} addComplaintNote={C.addComplaintNote} />}
        {view === 'visitors'   && <Visitors c={c} addVisitor={C.addVisitor} checkOut={C.checkOut} />}
        {view === 'events'     && <Events c={c} addEvent={C.addEvent} allocateSeats={C.allocateSeats} />}
        {view === 'inventory'  && <Inventory c={c} addAsset={C.addAsset} editAsset={C.editAsset} />}
        {view === 'library'    && <Library c={c} addBook={C.addBook} issueBook={C.issueBook} returnBook={C.returnBook} />}
        {view === 'finance'    && <FinanceSummary />}
      </main>
    </div>
  );
}
