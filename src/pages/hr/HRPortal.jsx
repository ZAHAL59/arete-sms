import { useState } from 'react';
import Logo from '../../components/Logo';
import useHR from './useHR';
import StaffDirectory from './StaffDirectory';
import Vacancies from './Vacancies';
import Applications from './Applications';
import Interviews from './Interviews';
import Training from './Training';
import StaffDocuments from './StaffDocuments';
import StaffAttendance from './StaffAttendance';
import GrowthTracker from './GrowthTracker';
import LeaveRequests from './LeaveRequests';

const VIEWS = [
  {id:'staff',    label:'Staff Directory',  icon:'👥', section:'Staff'},
  {id:'growth',   label:'Growth Tracker',   icon:'📈', section:'Staff'},
  {id:'documents',label:'Staff Documents',  icon:'🗂', section:'Staff'},
  {id:'vacancies',label:'Vacancies',        icon:'📋', section:'Recruitment'},
  {id:'applications',label:'Applications',    icon:'📥', section:'Recruitment'},
  {id:'interviews',label:'Interviews',      icon:'🎤', section:'Recruitment'},
  {id:'training', label:'Training',         icon:'🎓', section:'Development'},
  {id:'satt',     label:'Staff Attendance', icon:'📅', section:'Operations'},
  {id:'leave',    label:'Leave Requests',   icon:'🏖', section:'Operations', badge:2},
];
const SECTIONS = [...new Set(VIEWS.map(v=>v.section))];

export default function HRPortal() {
  const [view, setView] = useState('staff');
  const { hr, addVacancy, updateVacancy, addCandidate, updateCandidate,
          scheduleInterview, updateInterview, addTraining, markTrainingAtt,
          updateLeave, addLeave, markStaffAtt, shortlistApplication, rejectApplication, restoreApplication, setChecklist, saveInterviewResult, hireCandidate, addStaffDoc, deleteStaffDoc } = useHR();
  const pendingApps = (hr.applications || []).filter(a => a.hrStatus === 'Pending Review').length;

  const sharedHR = { hr };

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-[240px] flex-shrink-0 bg-white border-r border-[#E4E4E4] flex flex-col overflow-y-auto">
        <div className="px-4 py-3.5 border-b border-[#E4E4E4] flex items-center gap-2.5">
          <Logo />
          <div>
            <div className="text-[14px] font-bold text-[#111] leading-tight">Arete</div>
            <div className="text-[10px] text-[#AAA]">HR & Staff</div>
          </div>
        </div>
        <nav className="flex-1 py-2 overflow-y-auto">
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
                  {(v.id==='applications' ? pendingApps : v.badge) > 0 && <span className="text-[9px] font-bold bg-[#C8202E] text-white px-1.5 py-0.5 rounded-full">{v.id==='applications' ? pendingApps : v.badge}</span>}
                </div>
              ))}
            </div>
          ))}
        </nav>
        <div className="flex items-center gap-2.5 px-3 py-3 border-t border-[#E4E4E4]">
          <div className="w-8 h-8 rounded-full bg-[#C8202E] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">HR</div>
          <div>
            <div className="text-[12.5px] font-bold text-[#111]">HR Manager</div>
            <div className="text-[10.5px] text-[#AAA]">Human Resources</div>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto bg-[#F8F8F8]">
        {view==='staff'      && <StaffDirectory />}
        {view==='growth'     && <GrowthTracker hr={hr} />}
        {view==='vacancies'  && <Vacancies hr={hr} addVacancy={addVacancy} addCandidate={addCandidate} updateCandidate={updateCandidate}/>}
        {view==='applications' && <Applications hr={hr} shortlist={shortlistApplication} reject={rejectApplication} restore={restoreApplication}/>}
        {view==='interviews' && <Interviews hr={hr} scheduleInterview={scheduleInterview} updateInterview={updateInterview} setChecklist={setChecklist} saveInterviewResult={saveInterviewResult} hireCandidate={hireCandidate}/>}
        {view==='documents'  && <StaffDocuments hr={hr} addStaffDoc={addStaffDoc} deleteStaffDoc={deleteStaffDoc}/>}
        {view==='training'   && <Training hr={hr} addTraining={addTraining} markTrainingAtt={markTrainingAtt}/>}
        {view==='satt'       && <StaffAttendance hr={hr} markStaffAtt={markStaffAtt}/>}
        {view==='leave'      && <LeaveRequests hr={hr} updateLeave={updateLeave} addLeave={addLeave}/>}
      </main>
    </div>
  );
}
