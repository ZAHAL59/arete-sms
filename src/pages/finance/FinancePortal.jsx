import PortalShell from '../../components/PortalShell';
import FeeCollection from './FeeCollection';
import Payroll from './Payroll';
import Budget from './Budget';
import Expenses from './Expenses';

const VIEWS = [
  {id:'fees',    label:'Fee Collection', icon:'₹',  section:'Fees'},
  {id:'payroll', label:'Payroll',        icon:'💰', section:'Salaries'},
  {id:'budget',  label:'Budget',         icon:'📊', section:'Finance'},
  {id:'expenses',label:'Expenses',       icon:'📋', section:'Finance'},
];

export default function FinancePortal() {
  return (
    <PortalShell title="Finance & Payroll" views={VIEWS} user={{initials:'FH',name:'Finance Head',role:'Finance'}}>
      {(view) => (
        <>
          {view === 'fees'     && <FeeCollection />}
          {view === 'payroll'  && <Payroll />}
          {view === 'budget'   && <Budget />}
          {view === 'expenses' && <Expenses />}
        </>
      )}
    </PortalShell>
  );
}
