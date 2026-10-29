import PortalShell from '../../components/PortalShell';
import StaffList from './StaffList';
import Recruitment from './Recruitment';
import LeaveRequests from './LeaveRequests';
import TrainingSessions from './TrainingSessions';

const VIEWS = [
  {id:'staff',      label:'Staff Directory',  icon:'👥', section:'Staff'},
  {id:'recruitment',label:'Recruitment',      icon:'📋', section:'Hiring'},
  {id:'leave',      label:'Leave Requests',   icon:'📅', section:'Admin', badge:1},
  {id:'training',   label:'Training',         icon:'🎓', section:'Admin'},
];

export default function HRPortal() {
  return (
    <PortalShell title="HR & Staff" views={VIEWS} user={{initials:'HR',name:'HR Manager',role:'Human Resources'}}>
      {(view) => (
        <>
          {view === 'staff'       && <StaffList />}
          {view === 'recruitment' && <Recruitment />}
          {view === 'leave'       && <LeaveRequests />}
          {view === 'training'    && <TrainingSessions />}
        </>
      )}
    </PortalShell>
  );
}
