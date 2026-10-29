import { useState } from 'react';
import Logo from '../../components/Logo';
import useHostel from './useHostel';
import Rooms from './Rooms';
import Inmates from './Inmates';
import Fees from './Fees';
import Mess from './Mess';
import Menu from './Menu';
import Outing from './Outing';
import Incidents from './Incidents';

const VIEWS = [
  {id:'rooms',    label:'Room Allocation', icon:'🏠', section:'Hostel'},
  {id:'inmates',  label:'Inmate Records',  icon:'👥', section:'Hostel'},
  {id:'fees',     label:'Hostel Fees',     icon:'₹',  section:'Hostel'},
  {id:'mess',     label:'Mess Management', icon:'🍽', section:'Mess'},
  {id:'menu',     label:'Weekly Menu',     icon:'📅', section:'Mess'},
  {id:'outing',   label:'Outing Requests', icon:'🚪', section:'Welfare'},
  {id:'incidents',label:'Incident Log',    icon:'⚠️', section:'Welfare'},
];
const SECTIONS = [...new Set(VIEWS.map(v => v.section))];

export default function HostelPortal() {
  const [view, setView] = useState('rooms');
  const H = useHostel();
  const { h } = H;
  const pending = h.outings.filter(o => o.status === 'Pending Approval').length;
  const openInc = h.incidents.filter(i => i.status === 'Open').length;
  const badge = { outing: pending, incidents: openInc };

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-[240px] flex-shrink-0 bg-white border-r border-[#E4E4E4] flex flex-col overflow-y-auto">
        <div className="px-4 py-3.5 border-b border-[#E4E4E4] flex items-center gap-2.5">
          <Logo />
          <div><div className="text-[14px] font-bold text-[#111] leading-tight">Arete</div><div className="text-[10px] text-[#AAA]">Hostel</div></div>
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
          <div><div className="text-[12.5px] font-bold text-[#111]">Muhd Zahal</div><div className="text-[10.5px] text-[#AAA]">Hostel Warden</div></div>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto bg-[#F8F8F8]">
        {view === 'rooms'     && <Rooms h={h} assignRoom={H.assignRoom} removeInmate={H.removeInmate} />}
        {view === 'inmates'   && <Inmates h={h} />}
        {view === 'fees'      && <Fees />}
        {view === 'mess'      && <Mess h={h} logCost={H.logCost} saveStock={H.saveStock} addStock={H.addStock} addOrder={H.addOrder} receiveOrder={H.receiveOrder} />}
        {view === 'menu'      && <Menu h={h} saveMenu={H.saveMenu} />}
        {view === 'outing'    && <Outing h={h} addOuting={H.addOuting} setOutingStatus={H.setOutingStatus} />}
        {view === 'incidents' && <Incidents h={h} addIncident={H.addIncident} resolveIncident={H.resolveIncident} />}
      </main>
    </div>
  );
}
