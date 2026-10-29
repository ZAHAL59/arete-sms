import { useState } from 'react';
import Logo from '../../components/Logo';
import useFinance from './useFinance';
import FeeOverview from './FeeOverview';
import StudentLedger from './StudentLedger';
import PaymentHistory from './PaymentHistory';
import Budget from './Budget';
import Payroll from './Payroll';
import Reports from './Reports';

const VIEWS = [
  {id:'overview',  label:'Fee Overview',       icon:'💳', section:'Fee Management'},
  {id:'students',  label:'Per-Student Ledger', icon:'👤', section:'Fee Management'},
  {id:'payments',  label:'Payment History',    icon:'📋', section:'Fee Management'},
  {id:'budget',    label:'Budget vs Actual',   icon:'📊', section:'Budget'},
  {id:'payroll',   label:'Staff Payroll',      icon:'💰', section:'Budget'},
  {id:'reports',   label:'Generate Reports',   icon:'📄', section:'Reports'},
];
const SECTIONS = [...new Set(VIEWS.map(v=>v.section))];

export default function FinancePortal() {
  const [view, setView] = useState('overview');
  const { fin, allPayments, recordPayment, addBudgetLine, updateBudgetLine, deleteBudgetLine, processPayroll, payStaff, setActualsFrom, updateSalary } = useFinance();

  const sharedProps = { fin, allPayments, recordPayment };

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-[240px] flex-shrink-0 bg-white border-r border-[#E4E4E4] flex flex-col overflow-y-auto">
        <div className="px-4 py-3.5 border-b border-[#E4E4E4] flex items-center gap-2.5">
          <Logo />
          <div>
            <div className="text-[14px] font-bold text-[#111] leading-tight">Arete</div>
            <div className="text-[10px] text-[#AAA]">Finance & Payroll</div>
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
            <div className="text-[12.5px] font-bold text-[#111]">Muhd Zahal</div>
            <div className="text-[10.5px] text-[#AAA]">Finance Admin</div>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto bg-[#F8F8F8]">
        {view==='overview'  && <FeeOverview   {...sharedProps}/>}
        {view==='students'  && <StudentLedger  {...sharedProps}/>}
        {view==='payments'  && <PaymentHistory {...sharedProps}/>}
        {view==='budget'    && <Budget fin={fin} allPayments={allPayments} addBudgetLine={addBudgetLine} updateBudgetLine={updateBudgetLine} deleteBudgetLine={deleteBudgetLine} setActualsFrom={setActualsFrom}/>}
        {view==='payroll'   && <Payroll allPayments={allPayments} processPayroll={processPayroll} payStaff={payStaff} updateSalary={updateSalary}/>}
        {view==='reports'   && <Reports allPayments={allPayments}/>}
      </main>
    </div>
  );
}
