import { useState } from 'react';
import useStore from '../../store/useStore';
import { PageHeader } from '../../components/Layout';
import Button from '../../components/ui/Button';
import { fmt, getStudentDue, FEE_GRADES } from './constants';
import { downloadCsv } from '../principal/constants';

const CARDS = [
  { id: 'collection', label: 'Fee Collection Summary', icon: '💳', desc: 'Total collected by category' },
  { id: 'outstanding', label: 'Outstanding Fees Report', icon: '⚠️', desc: 'Students with pending balances' },
  { id: 'grade', label: 'Grade-wise Collection', icon: '📚', desc: 'Collection progress per grade' },
  { id: 'mode', label: 'Payment Mode Analysis', icon: '📊', desc: 'Online vs Cash vs Cheque' },
  { id: 'ledger', label: 'Full Fee Ledger', icon: '📒', desc: 'Every student: due, paid, balance' },
];

export function buildFeeReport(id, db, allPayments) {
  const pays = allPayments.filter(p => p.studentId);
  const paidBy = sid => pays.filter(p => p.studentId === sid).reduce((a, p) => a + p.amount, 0);
  const group = (key, label) => { const m = {}; pays.forEach(p => { const k = p[key] || 'Unknown'; (m[k] ||= { n: 0, t: 0 }); m[k].n++; m[k].t += p.amount; }); const rows = Object.entries(m).sort((a, b) => b[1].t - a[1].t).map(([k, v]) => [k, v.n, v.t]); rows.push(['TOTAL', pays.length, pays.reduce((a, p) => a + p.amount, 0)]); return { columns: [label, 'Payments', 'Amount (₹)'], rows }; };
  if (id === 'collection') return { title: 'Fee Collection Summary', ...group('category', 'Category') };
  if (id === 'mode') return { title: 'Payment Mode Analysis', ...group('mode', 'Mode') };
  if (id === 'outstanding') {
    const rows = db.students.map(s => { const due = getStudentDue(s), paid = paidBy(s.id); return [s.name, `${s.cls} ${s.section}`, due, paid, due - paid]; }).filter(r => r[4] > 0).sort((a, b) => b[4] - a[4]);
    return { title: 'Outstanding Fees Report', columns: ['Student', 'Class', 'Annual due (₹)', 'Paid (₹)', 'Balance (₹)'], rows };
  }
  if (id === 'grade') {
    const rows = FEE_GRADES.map(g => { const sts = db.students.filter(s => s.cls === g); if (!sts.length) return null; const due = sts.reduce((a, s) => a + getStudentDue(s), 0), paid = sts.reduce((a, s) => a + paidBy(s.id), 0); return [g, sts.length, due, paid, due ? Math.round(paid / due * 100) + '%' : '—']; }).filter(Boolean);
    return { title: 'Grade-wise Collection', columns: ['Grade', 'Students', 'Billed (₹)', 'Collected (₹)', 'Collected %'], rows };
  }
  const rows = db.students.map(s => { const due = getStudentDue(s), paid = paidBy(s.id); return [s.id, s.name, `${s.cls} ${s.section}`, due, paid, Math.max(0, due - paid), due - paid <= 0 ? 'Clear' : paid ? 'Partial' : 'Pending']; });
  return { title: 'Full Fee Ledger', columns: ['ID', 'Student', 'Class', 'Due (₹)', 'Paid (₹)', 'Balance (₹)', 'Status'], rows };
}

export default function Reports({ allPayments }) {
  const db = useStore(s => s.db);
  const [res, setRes] = useState(null);
  const slug = t => t.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return (
    <div className="p-6">
      <PageHeader title="Generate Reports" subtitle="Generated live from your data — download as CSV (opens in Excel) or print / save as PDF" />
      <div className="grid grid-cols-2 gap-3 mb-5">{CARDS.map(r => (
        <div key={r.id} onClick={() => setRes({ id: r.id, ...buildFeeReport(r.id, db, allPayments) })} className={`bg-white border rounded-[10px] p-4 cursor-pointer transition-all hover:shadow-[0_4px_18px_rgba(0,0,0,.1)] ${res?.id === r.id ? 'border-[#C8202E] shadow-[0_4px_18px_rgba(200,32,46,.12)]' : 'border-[#E4E4E4]'}`}>
          <div className="text-[22px] mb-2">{r.icon}</div><div className="text-[13.5px] font-bold text-[#111]">{r.label}</div><div className="text-[12px] text-[#AAA] mt-1">{r.desc}</div></div>))}</div>
      {res && <div className="bg-white border border-[#E4E4E4] rounded-[10px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,.07)]">
        <div className="px-4 py-3 border-b border-[#E4E4E4] bg-[#F8F8F8] flex items-center gap-2"><div className="flex-1"><div className="text-[13.5px] font-bold text-[#111]">{res.title}</div><div className="text-[11.5px] text-[#777]">{res.rows.length} row(s)</div></div>
          <Button size="sm" variant="outline" onClick={() => window.print()}>🖨 Print / PDF</Button><Button size="sm" onClick={() => downloadCsv(`${slug(res.title)}-${new Date().toISOString().slice(0, 10)}.csv`, res.columns, res.rows)}>⬇ Export CSV</Button></div>
        <div className="overflow-x-auto"><table className="w-full border-collapse text-[13px]"><thead><tr>{res.columns.map(c => <th key={c} className="px-4 py-2.5 text-left text-[10px] font-bold text-[#AAA] uppercase tracking-wider border-b border-[#E4E4E4] bg-[#F8F8F8]">{c}</th>)}</tr></thead>
          <tbody>{!res.rows.length ? <tr><td colSpan={res.columns.length} className="text-center py-8 text-[#AAA]">Nothing to show</td></tr> : res.rows.map((r, i) => <tr key={i} className={`border-b border-[#E4E4E4] last:border-b-0 ${r[0] === 'TOTAL' ? 'bg-[#F8F8F8] font-bold' : 'hover:bg-[#F8F8F8]'}`}>{r.map((c, j) => <td key={j} className="px-4 py-2.5 text-[#333]">{typeof c === 'number' ? c.toLocaleString('en-IN') : c}</td>)}</tr>)}</tbody></table></div></div>}
    </div>
  );
}
