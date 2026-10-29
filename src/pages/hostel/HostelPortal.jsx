import PortalShell from '../../components/PortalShell';
import Rooms from './Rooms';
import MessMenu from './MessMenu';
import Stock from './Stock';
import Incidents from './Incidents';

const VIEWS = [
  {id:'rooms',    label:'Room Allocation', icon:'🏠', section:'Hostel'},
  {id:'mess',     label:'Mess Menu',       icon:'🍽', section:'Hostel'},
  {id:'stock',    label:'Mess Stock',      icon:'📦', section:'Hostel'},
  {id:'incidents',label:'Incident Log',    icon:'⚠️', section:'Records'},
];

export default function HostelPortal() {
  return (
    <PortalShell title="Hostel" views={VIEWS} user={{initials:'HW',name:'Hostel Warden',role:'Hostel'}}>
      {(view) => (
        <>
          {view === 'rooms'     && <Rooms />}
          {view === 'mess'      && <MessMenu />}
          {view === 'stock'     && <Stock />}
          {view === 'incidents' && <Incidents />}
        </>
      )}
    </PortalShell>
  );
}
