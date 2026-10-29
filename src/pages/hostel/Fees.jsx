import { useState } from 'react';
import useStore from '../../store/useStore';
import { PageHeader } from '../../components/Layout';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Kpi } from './ui';
import { MONTHLY_FEE, fmt, TODAY } from './constants';
import { getFeeStructure } from '../finance/constants';

export default function Fees() {
  const db = useStore(s => s.db);
  const updateDB = useStore(s => s.updateDB);
  const boarders = db.students.filter(s => s.boarding);
  const month = TODAY.slice(0, 7);
  const feeOf = s => Math.round((getFeeStructure()[s.cls]?.hostel || MONTHLY_FEE * 12) / 12);

  const paidFor = id => db.payments
    .filter(p => p.studentId === id && p.category === 'Hostel Monthly' && (p.date || '').startsWith(month))
    .reduce((a, p) => a + p.amount, 0);

  const totalDue = boarders.reduce((a, s) => a + feeOf(s), 0);
  const paid = boarders.reduce((a, s) => a + paidFor(s.id), 0);

  function record(s) {
    updateDB(d => {
      d.payments.unshift({ id:'RC-'+Date.now().toString().slice(-8), studentId:s.id, category:'Hostel Monthly',
        amount:feeOf(s), date:TODAY, mode:'Cash', ref:'' });
      return d;
    });
  }

  return (
    <div className="p-6">
      <PageHeader title="Hostel Fees" subtitle={`${new Date().toLocaleDateString('en-IN', { month:'long', year:'numeric' })} · recorded in Finance`} />
      <div className="grid grid-cols-4 gap-3 mb-5">
        <Kpi label="Monthly Fee" value={fmt(boarders[0] ? feeOf(boarders[0]) : MONTHLY_FEE)} note="Per inmate incl. mess" />
        <Kpi label="Total Due" value={fmt(totalDue)} note={`From ${boarders.length} inmates`} color="#1A5FB4" />
        <Kpi label="Collected" value={fmt(paid)} note="Synced with Finance" color="#166534" />
        <Kpi label="Outstanding" value={fmt(Math.max(0, totalDue - paid))} note="To be collected" color="#DC2626" />
      </div>
      <div className="bg-white border border-[#E4E4E4] rounded-[10px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,.07)]">
        <table className="w-full border-collapse text-[13px]">
          <thead><tr>{['Student','Class','Due','Paid','Status',''].map(t =>
            <th key={t} className="px-4 py-2.5 text-left text-[10px] font-bold text-[#AAA] uppercase tracking-wider border-b border-[#E4E4E4] bg-[#F8F8F8]">{t}</th>)}</tr></thead>
          <tbody>
            {boarders.map(s => {
              const p = paidFor(s.id); const ok = p >= feeOf(s);
              return (
                <tr key={s.id} className="border-b border-[#E4E4E4] last:border-b-0 hover:bg-[#F8F8F8]">
                  <td className="px-4 py-2.5 font-semibold text-[#111]">{s.name}</td>
                  <td className="px-4 py-2.5 text-[#555]">{s.cls} {s.section}</td>
                  <td className="px-4 py-2.5 font-mono text-[12px]">{fmt(feeOf(s))}</td>
                  <td className="px-4 py-2.5 font-mono text-[12px] font-bold text-[#166534]">{fmt(p)}</td>
                  <td className="px-4 py-2.5"><Badge variant={ok ? 'green' : p > 0 ? 'amber' : 'red'}>{ok ? 'Paid' : p > 0 ? 'Partial' : 'Pending'}</Badge></td>
                  <td className="px-4 py-2.5">{!ok && <Button size="sm" variant="outline" onClick={() => record(s)}>Record Payment</Button>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
