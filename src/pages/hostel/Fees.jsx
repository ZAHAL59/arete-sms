import { useState, useMemo } from 'react';
import useStore from '../../store/useStore';
import { PageHeader } from '../../components/Layout';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Collapsible from '../../components/ui/Collapsible';
import ReceiptModal from '../finance/modals/ReceiptModal';
import { Kpi, Field, inputCls, Th } from './ui';
import { MONTHLY_FEE, fmt, TODAY } from './constants';
import { loadHostel } from './constants';
import { getFeeStructure, PAY_MODES } from '../finance/constants';

const HOSTEL_CATS = ['Hostel Monthly', 'Hostel Fee'];
const monthName = ym => new Date(ym + '-01T00:00:00').toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
// Academic-year months, June → May
function ayMonths() {
  const y = +TODAY.slice(0, 4), m = +TODAY.slice(5, 7), sy = m >= 6 ? y : y - 1;
  return Array.from({ length: 12 }, (_, i) => { const mm = ((5 + i) % 12) + 1, yy = mm >= 6 ? sy : sy + 1; return `${yy}-${String(mm).padStart(2, '0')}`; });
}

export default function Fees() {
  const db = useStore(s => s.db); const updateDB = useStore(s => s.updateDB);
  const rooms = useMemo(() => loadHostel().rooms, []);
  const months = ayMonths();
  const [month, setMonth] = useState(months.includes(TODAY.slice(0, 7)) ? TODAY.slice(0, 7) : months[0]);
  const [collect, setCollect] = useState(null);     // student being paid for
  const [receipt, setReceipt] = useState(null);

  const boarders = db.students.filter(s => s.boarding);
  const feeOf = s => Math.round((getFeeStructure()[s.cls]?.hostel || MONTHLY_FEE * 12) / 12);
  const roomOf = s => rooms.find(r => r.inmates.includes(s.name))?.id;
  const hostelPays = db.payments.filter(p => HOSTEL_CATS.includes(p.category) && p.studentId);
  const paysFor = (sid, m) => hostelPays.filter(p => p.studentId === sid && (p.period ? p.period === m : (p.date || '').startsWith(m)));
  const paidFor = (sid, m) => paysFor(sid, m).reduce((a, p) => a + p.amount, 0);

  const due = boarders.reduce((a, s) => a + feeOf(s), 0);
  const collected = boarders.reduce((a, s) => a + Math.min(paidFor(s.id, month), feeOf(s)), 0);
  const history = hostelPays.slice().sort((a, b) => (b.date || '').localeCompare(a.date || '') || b.id.localeCompare(a.id));

  function record(student, f) {
    const pay = { id: 'RC-' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 90 + 10), studentId: student.id, category: 'Hostel Monthly', period: f.month, amount: f.amount, date: f.date, mode: f.mode, ref: f.ref };
    updateDB(d => { d.payments.unshift(pay); return d; });
    setCollect(null); setReceipt(pay);
  }

  return (
    <div className="p-6">
      <PageHeader title="Hostel Fees" subtitle="Collect hostel fees, issue receipts and track dues — payments are recorded in Finance automatically"
        actions={<><span className="text-[12px] text-[#777]">Fee month</span><select value={month} onChange={e => setMonth(e.target.value)} className="px-2.5 py-1.5 border border-[#E4E4E4] rounded-[6px] text-[12.5px] outline-none focus:border-[#C8202E]">{months.map(m => <option key={m} value={m}>{monthName(m)}</option>)}</select></>} />
      <div className="grid grid-cols-4 gap-3 mb-5">
        <Kpi label="Monthly Hostel Fee" value={fmt(boarders[0] ? feeOf(boarders[0]) : MONTHLY_FEE)} note="Per inmate incl. mess" />
        <Kpi label={`Due — ${monthName(month)}`} value={fmt(due)} note={`From ${boarders.length} inmates`} color="#1A5FB4" />
        <Kpi label="Collected" value={fmt(collected)} note="Recorded in Finance" color="#166534" />
        <Kpi label="Outstanding" value={fmt(Math.max(0, due - collected))} note="To be collected" color="#DC2626" />
      </div>

      <div className="bg-white border border-[#E4E4E4] rounded-[10px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,.07)] mb-4">
        <table className="w-full border-collapse text-[13px]">
          <thead><tr><Th>Student</Th><Th>Class</Th><Th>Room</Th><Th>Fee</Th><Th>Paid</Th><Th>Balance</Th><Th>Status</Th><Th /></tr></thead>
          <tbody>{!boarders.length ? <tr><td colSpan={8} className="text-center py-10 text-[#AAA]">No boarders enrolled</td></tr> : boarders.map(s => {
            const fee = feeOf(s), paid = paidFor(s.id, month), bal = Math.max(0, fee - paid), last = paysFor(s.id, month).slice().sort((a, b) => b.id.localeCompare(a.id))[0];
            return (
              <tr key={s.id} className="border-b border-[#E4E4E4] last:border-b-0 hover:bg-[#F8F8F8]">
                <td className="px-4 py-2.5 font-semibold text-[#111]">{s.name}</td><td className="px-4 py-2.5 text-[#555]">{s.cls} {s.section}</td>
                <td className="px-4 py-2.5">{roomOf(s) ? <Badge variant="blue">{roomOf(s)}</Badge> : <span className="text-[#AAA]">—</span>}</td>
                <td className="px-4 py-2.5 font-mono text-[12px]">{fmt(fee)}</td>
                <td className="px-4 py-2.5 font-mono text-[12px] font-bold text-[#166534]">{paid ? fmt(paid) : '–'}</td>
                <td className="px-4 py-2.5 font-mono text-[12px] font-bold" style={{ color: bal ? '#DC2626' : '#166534' }}>{bal ? fmt(bal) : '✓ Clear'}</td>
                <td className="px-4 py-2.5"><Badge variant={bal === 0 ? 'green' : paid ? 'amber' : 'red'}>{bal === 0 ? 'Paid' : paid ? 'Partial' : 'Outstanding'}</Badge></td>
                <td className="px-4 py-2.5 whitespace-nowrap">{bal > 0 && <Button size="sm" onClick={() => setCollect(s)}>Collect</Button>}{last && <button onClick={() => setReceipt(last)} className="text-[11px] font-semibold text-[#C8202E] underline cursor-pointer bg-none border-none ml-3">Receipt</button>}</td>
              </tr>); })}</tbody>
        </table>
      </div>

      <Collapsible defaultOpen header={<div className="flex items-center gap-2"><span className="text-[13.5px] font-bold text-[#111]">🧾 Receipts</span><Badge variant="grey">{history.length}</Badge></div>}>
        <table className="w-full border-collapse text-[13px] border-t border-[#E4E4E4]">
          <thead><tr><Th>Date</Th><Th>Receipt</Th><Th>Student</Th><Th>For</Th><Th>Mode</Th><Th>Amount</Th></tr></thead>
          <tbody>{!history.length ? <tr><td colSpan={6} className="text-center py-8 text-[#AAA]">No hostel payments yet</td></tr> : history.map(p => (
            <tr key={p.id} className="border-b border-[#E4E4E4] last:border-b-0 hover:bg-[#F8F8F8]">
              <td className="px-4 py-2.5 text-[#555]">{p.date}</td>
              <td className="px-4 py-2.5"><button onClick={() => setReceipt(p)} className="font-mono text-[11.5px] text-[#C8202E] underline cursor-pointer bg-none border-none">{p.id}</button></td>
              <td className="px-4 py-2.5 font-semibold text-[#111]">{db.students.find(s => s.id === p.studentId)?.name || '—'}</td>
              <td className="px-4 py-2.5 text-[#555]">{p.period ? monthName(p.period) : (p.date ? monthName(p.date.slice(0, 7)) : '—')}</td>
              <td className="px-4 py-2.5"><Badge variant={p.mode?.includes('Online') ? 'blue' : p.mode === 'Cash' ? 'green' : 'amber'}>{p.mode}</Badge></td>
              <td className="px-4 py-2.5 font-mono font-bold text-[#166534]">{fmt(p.amount)}</td></tr>))}</tbody>
        </table>
      </Collapsible>

      {collect && <CollectModal student={collect} month={month} months={months} feeOf={feeOf} paidFor={paidFor} room={roomOf(collect)} onClose={() => setCollect(null)} onSave={f => record(collect, f)} />}
      {receipt && <ReceiptModal payment={receipt} onClose={() => setReceipt(null)} />}
    </div>
  );
}

function CollectModal({ student, month: startMonth, months, feeOf, paidFor, room, onClose, onSave }) {
  const fee = feeOf(student);
  const [month, setMonth] = useState(startMonth);
  const balance = Math.max(0, fee - paidFor(student.id, month));
  const [amount, setAmount] = useState(String(balance)); const [mode, setMode] = useState(PAY_MODES[0]); const [date, setDate] = useState(TODAY); const [ref, setRef] = useState(''); const [err, setErr] = useState('');
  const changeMonth = m => { setMonth(m); setAmount(String(Math.max(0, fee - paidFor(student.id, m)))); setErr(''); };
  function save() {
    const n = Math.round(+amount);
    if (!n || n <= 0) return setErr('Enter the amount received.');
    if (n > balance) return setErr(balance ? `Amount is more than the balance of ${fmt(balance)} for ${monthName(month)}.` : `${monthName(month)} is already fully paid.`);
    onSave({ month, amount: n, mode, date, ref: ref.trim() });
  }
  return (
    <Modal open onClose={onClose} title="Collect Hostel Fee" subtitle={`${student.name} · ${student.cls} ${student.section}${room ? ' · Room ' + room : ''}`}
      footer={<><span className="mr-auto text-[12px] text-[#DC2626] font-semibold">{err}</span><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={save} disabled={!balance}>Record payment & issue receipt</Button></>}>
      <div className="space-y-3">
        <Field label="Fee month"><select value={month} onChange={e => changeMonth(e.target.value)} className={inputCls}>{months.map(m => <option key={m} value={m}>{monthName(m)}</option>)}</select></Field>
        <div className="grid grid-cols-3 gap-2 text-center">{[['Monthly fee', fmt(fee), '#111'], ['Already paid', fmt(Math.min(fee, paidFor(student.id, month))), '#166534'], ['Balance', fmt(balance), balance ? '#DC2626' : '#166534']].map(([l, v, c]) => (
          <div key={l} className="bg-[#F8F8F8] rounded-[8px] py-2.5"><div className="text-[10px] font-bold text-[#AAA] uppercase tracking-wider">{l}</div><div className="font-mono font-extrabold text-[15px]" style={{ color: c }}>{v}</div></div>))}</div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Amount received (₹) *"><input type="number" min={1} max={balance} value={amount} onChange={e => setAmount(e.target.value)} className={inputCls} /></Field>
          <Field label="Payment mode"><select value={mode} onChange={e => setMode(e.target.value)} className={inputCls}>{PAY_MODES.map(m => <option key={m}>{m}</option>)}</select></Field>
          <Field label="Date"><input type="date" value={date} onChange={e => setDate(e.target.value)} className={inputCls} /></Field>
          <Field label="Reference / transaction ID"><input value={ref} onChange={e => setRef(e.target.value)} placeholder="UPI ref, cheque no…" className={inputCls} /></Field>
        </div>
        <div className="text-[11.5px] text-[#AAA]">Partial payments are allowed — collect the rest later. A receipt opens straight after saving, and the payment also appears in Finance.</div>
      </div>
    </Modal>
  );
}
