import PortalShell from '../../components/PortalShell';
import Events from './Events';
import Complaints from './Complaints';
import Inventory from './Inventory';

const VIEWS = [
  {id:'events',     label:'Events',     icon:'📅', section:'Campus'},
  {id:'complaints', label:'Complaints', icon:'📢', section:'Campus', badge:2},
  {id:'inventory',  label:'Inventory',  icon:'📦', section:'Campus'},
];

export default function CampusPortal() {
  return (
    <PortalShell title="Campus" views={VIEWS} user={{initials:'CM',name:'Campus Manager',role:'Campus'}}>
      {(view) => (
        <>
          {view === 'events'     && <Events />}
          {view === 'complaints' && <Complaints />}
          {view === 'inventory'  && <Inventory />}
        </>
      )}
    </PortalShell>
  );
}
