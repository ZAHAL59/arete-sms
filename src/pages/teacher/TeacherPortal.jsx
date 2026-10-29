import { useState } from 'react';
import Logo from '../../components/Logo';
import Today from './Today';
import Timetable from './Timetable';
import MyClasses from './MyClasses';
import StudentProfiles from './StudentProfiles';
import Materials from './Materials';
import Alerts from './Alerts';
import Training from './Training';
import AttendanceHistory from './AttendanceHistory';
import MyNotes from './MyNotes';
import SessionLogs from './SessionLogs';
import { getNotices, getMyTraining, TODAY } from './constants';

const VIEWS = [
  {id:'today',    label:"Today's Overview", icon:'🏠', section:'Today'},
  {id:'timetable',label:'Timetable',        icon:'📅', section:'Today'},
  {id:'myclass',  label:'My Classes',       icon:'👥', section:'Classroom'},
  {id:'profiles', label:'Student Profiles', icon:'📋', section:'Classroom'},
  {id:'sessions', label:'Session Logs',     icon:'🧾', section:'Classroom'},
  {id:'materials',label:'Study Materials',  icon:'📚', section:'Resources'},
  {id:'alerts',   label:'Alerts & Notices', icon:'🔔', section:'School', badge:5},
  {id:'training', label:'Training Sessions',icon:'🎓', section:'School', badge:2},
  {id:'history',  label:'Attendance History',icon:'📊', section:'School'},
  {id:'notes',    label:'My Notes',         icon:'📝', section:'Me'},
];
const SECTIONS = [...new Set(VIEWS.map(v => v.section))];

export default function TeacherPortal() {
  const [view, setView] = useState('today');
  const noticeCount = getNotices().length;
  const trainingCount = getMyTraining().filter(t => t.date >= TODAY).length;
  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-[240px] flex-shrink-0 bg-white border-r border-[#E4E4E4] flex flex-col overflow-y-auto">
        <div className="px-4 py-3.5 border-b border-[#E4E4E4] flex items-center gap-2.5">
          <Logo />
          <div>
            <div className="text-[14px] font-bold text-[#111] leading-tight">Arete</div>
            <div className="text-[10px] text-[#AAA]">Teacher Portal</div>
          </div>
        </div>
        <nav className="flex-1 py-2 overflow-y-auto">
          {SECTIONS.map(sec => (
            <div key={sec}>
              <div className="px-4 pt-3 pb-1 text-[9px] font-bold tracking-[1.8px] uppercase text-[#AAA]">{sec}</div>
              {VIEWS.filter(v => v.section===sec).map(v => (
                <div key={v.id} onClick={() => setView(v.id)}
                  className={`flex items-center gap-2.5 py-2 mx-2 rounded-[7px] text-[12.5px] cursor-pointer transition-all select-none
                    ${view===v.id
                      ? 'bg-[#FEF4F4] text-[#C8202E] font-semibold border-l-[3px] border-[#C8202E] rounded-l-none ml-0 pl-[11px] pr-3'
                      : 'text-[#555] hover:bg-[#FEF4F4] hover:text-[#C8202E] px-3'}`}
                >
                  <span className="text-[14px] w-5 text-center flex-shrink-0">{v.icon}</span>
                  <span className="flex-1">{v.label}</span>
                  {(v.id==='alerts' ? noticeCount : v.id==='training' ? trainingCount : v.badge) > 0 && <span className="text-[9px] font-bold bg-[#C8202E] text-white px-1.5 py-0.5 rounded-full">{v.id==='alerts' ? noticeCount : v.id==='training' ? trainingCount : v.badge}</span>}
                </div>
              ))}
            </div>
          ))}
        </nav>
        <div className="flex items-center gap-2.5 px-3 py-3 border-t border-[#E4E4E4]">
          <div className="w-8 h-8 rounded-full bg-[#C8202E] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">LR</div>
          <div><div className="text-[12.5px] font-bold text-[#111]">Ms. Latha R.</div><div className="text-[10.5px] text-[#AAA]">Mathematics</div></div>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto bg-[#F8F8F8]">
        {view==='today'     && <Today onNavigate={setView} />}
        {view==='timetable' && <Timetable />}
        {view==='myclass'   && <MyClasses />}
        {view==='profiles'  && <StudentProfiles />}
        {view==='sessions'  && <SessionLogs />}
        {view==='materials' && <Materials />}
        {view==='alerts'    && <Alerts />}
        {view==='training'  && <Training />}
        {view==='history'   && <AttendanceHistory />}
        {view==='notes'     && <MyNotes />}
      </main>
    </div>
  );
}
