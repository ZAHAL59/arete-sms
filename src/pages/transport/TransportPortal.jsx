import PortalShell from '../../components/PortalShell';
import Routes from './Routes';
import EarlyDeparture from './EarlyDeparture';

const VIEWS = [
  {id:'routes',    label:'Bus Routes',      icon:'🚌', section:'Transport'},
  {id:'departure', label:'Early Departures',icon:'⏰', section:'Transport'},
];

export default function TransportPortal() {
  return (
    <PortalShell title="Transport" views={VIEWS} user={{initials:'TC',name:'Transport In-charge',role:'Transport'}}>
      {(view) => (
        <>
          {view === 'routes'    && <Routes />}
          {view === 'departure' && <EarlyDeparture />}
        </>
      )}
    </PortalShell>
  );
}
