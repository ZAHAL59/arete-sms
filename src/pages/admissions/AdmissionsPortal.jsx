import { useState } from 'react';
import useAdmissions from './useAdmissions';
import Pipeline from './Pipeline';
import ApplicationList from './ApplicationList';
import Students from './Students';
import DevProfiles from './DevProfiles';
import BusAllocation from './BusAllocation';
import BoardingStudents from './BoardingStudents';
import NewApplicationModal from './modals/NewApplicationModal';

const VIEWS = [
  {id:'pipeline',  label:'Pipeline',         icon:'📊', section:'Applications'},
  {id:'list',      label:'All Applications', icon:'📋', section:'Applications'},
  {id:'students',  label:'All Students',     icon:'👤', section:'Students'},
  {id:'profiles',  label:'Dev Profiles',     icon:'🧠', section:'Students'},
  {id:'boarding',  label:'Boarding Students',icon:'🏠', section:'Operations'},
  {id:'bus',       label:'Bus Allocation',   icon:'🚌', section:'Operations'},
];
const SECTIONS = [...new Set(VIEWS.map(v=>v.section))];

export default function AdmissionsPortal() {
  const [view, setView] = useState('pipeline');
  const [newOpen, setNewOpen] = useState(false);

  const A = useAdmissions();

  function handleNavigate(v) {
    if (v === 'new') { setNewOpen(true); return; }
    setView(v);
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[240px] flex-shrink-0 bg-white border-r border-[#E4E4E4] flex flex-col overflow-y-auto">
        <div className="px-4 py-3.5 border-b border-[#E4E4E4] flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[7px] bg-[#C8202E] flex items-center justify-center text-white font-bold text-[13px] flex-shrink-0">A</div>
          <div>
            <div className="text-[14px] font-bold text-[#111] leading-tight">Arete</div>
            <div className="text-[10px] text-[#AAA]">Admissions Portal</div>
          </div>
        </div>
        <nav className="flex-1 py-2">
          {SECTIONS.map(sec=>(
            <div key={sec}>
              <div className="px-4 pt-3 pb-1 text-[9px] font-bold tracking-[1.8px] uppercase text-[#AAA]">{sec}</div>
              {VIEWS.filter(v=>v.section===sec).map(v=>(
                <div key={v.id} onClick={()=>setView(v.id)}
                  className={`flex items-center gap-2.5 py-2 mx-2 rounded-[7px] text-[12.5px] cursor-pointer transition-all select-none
                    ${view===v.id
                      ?'bg-[#FEF4F4] text-[#C8202E] font-semibold border-l-[3px] border-[#C8202E] rounded-l-none ml-0 pl-[11px] pr-3'
                      :'text-[#555] hover:bg-[#FEF4F4] hover:text-[#C8202E] px-3'}`}
                >
                  <span className="text-[14px] w-5 text-center flex-shrink-0">{v.icon}</span>
                  <span className="flex-1">{v.label}</span>
                </div>
              ))}
            </div>
          ))}
        </nav>
        <div className="flex items-center gap-2.5 px-3 py-3 border-t border-[#E4E4E4]">
          <div className="w-8 h-8 rounded-full bg-[#C8202E] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">MZ</div>
          <div>
            <div className="text-[12.5px] font-bold text-[#111]">Mohammed Zahal</div>
            <div className="text-[10.5px] text-[#AAA]">Admissions Lead</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto bg-[#F8F8F8]">
        {view==='pipeline' && <Pipeline A={A} onNavigate={handleNavigate}/>}
        {view==='list'     && <ApplicationList A={A}/>}
        {view==='students' && <Students/>}
        {view==='profiles' && <DevProfiles/>}
        {view==='boarding' && <BoardingStudents/>}
        {view==='bus'      && <BusAllocation/>}
      </main>

      {newOpen && <NewApplicationModal onSave={A.addAdmission} onClose={()=>setNewOpen(false)}/>}
    </div>
  );
}
