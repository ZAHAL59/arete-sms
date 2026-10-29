import { useState } from 'react';
import Logo from '../../components/Logo';
import useTransport from './useTransport';
import { docStatus } from './constants';
import Departures from './Departures';
import Routes from './Routes';
import Stops from './Stops';
import Manifest from './Manifest';
import Maintenance from './Maintenance';
import Docs from './Docs';
import Fuel from './Fuel';

const VIEWS = [
  {id:'departure',   label:'Early Departure',  icon:'🚪', section:'Daily'},
  {id:'stops',       label:'Stop Tracking',    icon:'📍', section:'Daily'},
  {id:'manifest',    label:'Daily Manifest',   icon:'📋', section:'Daily'},
  {id:'routes',      label:'Routes & Drivers', icon:'🗺', section:'Fleet'},
  {id:'maintenance', label:'Maintenance Log',  icon:'🔧', section:'Fleet'},
  {id:'docs',        label:'Vehicle Docs',     icon:'📄', section:'Fleet'},
  {id:'fuel',        label:'Fuel Log',         icon:'⛽', section:'Fleet'},
];
const SECTIONS = [...new Set(VIEWS.map(v => v.section))];

export default function TransportPortal() {
  const [view, setView] = useState('departure');
  const T = useTransport();
  const { t } = T;
  const todayDeps = t.departures.filter(d => d.date === new Date().toISOString().slice(0, 10)).length;
  const docIssues = t.docs.filter(d => docStatus(d.expiry).days <= 30).length;
  const badge = { departure: todayDeps, docs: docIssues };

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-[240px] flex-shrink-0 bg-white border-r border-[#E4E4E4] flex flex-col overflow-y-auto">
        <div className="px-4 py-3.5 border-b border-[#E4E4E4] flex items-center gap-2.5">
          <Logo />
          <div><div className="text-[14px] font-bold text-[#111] leading-tight">Arete</div><div className="text-[10px] text-[#AAA]">Transport</div></div>
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
          <div className="w-8 h-8 rounded-full bg-[#C8202E] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">TC</div>
          <div><div className="text-[12.5px] font-bold text-[#111]">Transport In-charge</div><div className="text-[10.5px] text-[#AAA]">Transport</div></div>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto bg-[#F8F8F8]">
        {view === 'departure'   && <Departures t={t} addDeparture={T.addDeparture} />}
        {view === 'stops'       && <Stops t={t} setBoarding={T.setBoarding} />}
        {view === 'manifest'    && <Manifest />}
        {view === 'routes'      && <Routes addRoute={T.addRoute} updateRoute={T.updateRoute} />}
        {view === 'maintenance' && <Maintenance t={t} addMaint={T.addMaint} />}
        {view === 'docs'        && <Docs t={t} addDoc={T.addDoc} />}
        {view === 'fuel'        && <Fuel t={t} addFuel={T.addFuel} />}
      </main>
    </div>
  );
}
