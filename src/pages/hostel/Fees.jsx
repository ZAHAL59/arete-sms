import { useState } from 'react';
import useStore from '../../store/useStore';
import { PageHeader } from '../../components/Layout';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Collapsible from '../../components/ui/Collapsible';
import ReceiptModal from '../finance/modals/ReceiptModal';
import { Kpi, Field, inputCls, Th } from './ui';
import { MONTHLY_FEE, fmt, TODAY, DEFAULT_FEE_HEADS, HEAD_KINDS, HOSTEL_DUE_DAY } from './constants';
import { getFeeStructure, PAY_MODES } from '../finance/constants';
import { ayMonths, monthName, monthShort, paidForMonth, joinMonth, pendingMonths, allocate, headStatus, headCategory, isHostelPay, isOverdue, dueDate } from './hostelFees';

const DEFAULT_IDS = DEFAULT_FEE_HEADS.map(x => x.id);

export default function Fees({ h, setFeeHeads }) {
  const db = useStore(s => s.db); const updateDB = useStore(s => s.updateDB);
  const months = ayMonths();
  const [tab, setTab] = useState('monthly');
  const [month, setMonth] = useState(months.includes(TODAY.slice(0, 7)) ? TODAY.slice(0, 7) : months[0]);
  const [collect, setCollect] = useState(null); const [headPay, setHeadPay] = useState(null); const [structure, setStructure] = useState(false);
  const [issued, setIssued] = useState(null); const [receipt, setReceipt] = useState(null);

  const heads = h.feeHeads || DEFAULT_FEE_HEADS;
  const boarders = db.students.filter(s => s.boarding);
  const feeOf = s => Math.round((getFeeStructure()[s.cls]?.hostel || MONTHLY_FEE * 12) / 12);
  const roomOf = s => h.rooms.find(r => r.inmates.includes(s.name))?.id;
  const recOf = s => (h.admissions || []).find(a => a.studentId === s.id);
  const pays = db.payments;
  const hostelPays = pays.filter(isHostelPay);

  // ── monthly numbers for the selected month ──
  const idx = months.indexOf(month), prev = idx > 0 ? months[idx - 1] : null;
  const calc = s => {
    const fee = feeOf(s), rec = recOf(s), join = joinMonth(s.id, rec, pays), started = month >= join;
    const paid = paidForMonth(pays, s.id, month), bal = started ? Math.max(0, fee - paid) : 0;
    const arrears = started && prev ? pendingMonths({ sid: s.id, record: rec, payments: pays, fee, upTo: prev }) : [];
    const arrearsTotal = arrears.reduce((a, x) => a + x.balance, 0);
    return { fee, started, paid, bal, arrears, arrearsTotal, total: bal + arrearsTotal };
  };
  const rows = boarders.map(s => ({ s, ...calc(s) }));
  const dueThis = rows.filter(r => r.started).reduce((a, r) => a + r.fee, 0);
  const collectedThis = rows.filter(r => r.started).reduce((a, r) => a + Math.min(r.paid, r.fee), 0);
  const arrearsAll = rows.reduce((a, r) => a + r.arrearsTotal, 0);
  const outstanding = rows.reduce((a, r) => a + r.total, 0);

  const mkPay = (extra, i = 0) => ({ id: 'RC-' + Date.now().toString().slice(-8) + String(i) + Math.floor(Math.random() * 9), ...extra });
  function saveMonthly(student, f) {
    const list = f.allocation.map((a, i) => mkPay({ studentId: student.id, category: 'Hostel Monthly', period: a.month, amount: a.amount, date: f.date, mode: f.mode, ref: f.ref }, i));
    updateDB(d => { list.forEach(p => d.payments.unshift(p)); return d; });
    setCollect(null); list.length === 1 ? setReceipt(list[0]) : setIssued(list);
  }
  function saveHead(student, head, f) {
    const p = mkPay({ studentId: student.id, category: headCategory(head), head: head.id, amount: f.amount, date: f.date, mode: f.mode, ref: f.ref });
    updateDB(d => { d.payments.unshift(p); return d; }); setHeadPay(null); setReceipt(p);
  }

  const forLabel = p => p.period ? monthName(p.period) : (heads.find(x => x.id === p.head)?.name || p.category);
  const history = hostelPays.slice().sort((a, b) => (b.date || '').localeCompare(a.date || '') || b.id.localeCompare(a.id));
  const statusOf = r => !r.started ? ['grey', 'Joins later'] : r.total === 0 ? ['green', 'Paid'] : (r.arrearsTotal > 0 || isOverdue(month)) ? ['red', 'Overdue'] : r.paid > 0 ? ['amber', 'Partial'] : ['blue', `Due ${HOSTEL_DUE_DAY} ${monthShort(month).split(' ')[0]}`];
  const tabBtn = (id, l) => <button onClick={() => setTab(id)} className={`px-4 py-2 text-[13px] font-semibold border-b-2 -mb-px cursor-pointer bg-none ${tab === id ? 'border-[#C8202E] text-[#C8202E]' : 'border-transparent text-[#777] hover:text-[#111]'}`}>{l}</button>;

  return (
    <div className="p-6">
      <PageHeader title="Hostel Fees" subtitle={`Monthly fee is due by the ${HOSTEL_DUE_DAY}th of every month · admission fee, deposits and advances are collected once · all payments are recorded in Finance`}
        actions={<Button variant="outline" onClick={() => setStructure(true)}>⚙ Fee structure</Button>} />
      <div className="flex gap-1 border-b border-[#E4E4E4] mb-5">{tabBtn('monthly', 'Monthly fees')}{tabBtn('deposits', 'Admission fee & deposits')}</div>

      {tab === 'monthly' && <>
        <div className="flex items-center gap-2 mb-4"><span className="text-[12px] text-[#777]">Fee month</span>
          <select value={month} onChange={e => setMonth(e.target.value)} className="px-2.5 py-1.5 border border-[#E4E4E4] rounded-[6px] text-[12.5px] outline-none focus:border-[#C8202E]">{months.map(m => <option key={m} value={m}>{monthName(m)}</option>)}</select>
          <span className="text-[11.5px] text-[#AAA]">Due by {dueDate(month).split('-').reverse().join('/')}</span></div>
        <div className="grid grid-cols-4 gap-3 mb-5">
          <Kpi label={`Fee for ${monthShort(month)}`} value={fmt(dueThis)} note={`${rows.filter(r => r.started).length} inmates`} color="#1A5FB4" />
          <Kpi label="Collected this month" value={fmt(collectedThis)} note="Recorded in Finance" color="#166534" />
          <Kpi label="Previous dues" value={fmt(arrearsAll)} note="Earlier months unpaid" color={arrearsAll ? '#DC2626' : '#166534'} />
          <Kpi label="Total outstanding" value={fmt(outstanding)} note="This month + previous" color="#DC2626" />
        </div>
        <div className="bg-white border border-[#E4E4E4] rounded-[10px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,.07)] mb-4">
          <table className="w-full border-collapse text-[13px]">
            <thead><tr><Th>Student</Th><Th>Class</Th><Th>Room</Th><Th>Month fee</Th><Th>Paid</Th><Th>Balance</Th><Th>Previous dues</Th><Th>Status</Th><Th /></tr></thead>
            <tbody>{!rows.length ? <tr><td colSpan={9} className="text-center py-10 text-[#AAA]">No boarders yet — admit students from Hostel Admission</td></tr> : rows.map(r => { const [v, l] = statusOf(r), last = pays.filter(p => p.studentId === r.s.id && p.period === month).sort((a, b) => b.id.localeCompare(a.id))[0];
              return (
                <tr key={r.s.id} className="border-b border-[#E4E4E4] last:border-b-0 hover:bg-[#F8F8F8]">
                  <td className="px-4 py-2.5 font-semibold text-[#111]">{r.s.name}</td><td className="px-4 py-2.5 text-[#555]">{r.s.cls} {r.s.section}</td>
                  <td className="px-4 py-2.5">{roomOf(r.s) ? <Badge variant="blue">{roomOf(r.s)}</Badge> : <span className="text-[#AAA]">—</span>}</td>
                  <td className="px-4 py-2.5 font-mono text-[12px]">{r.started ? fmt(r.fee) : '—'}</td>
                  <td className="px-4 py-2.5 font-mono text-[12px] font-bold text-[#166534]">{r.paid ? fmt(r.paid) : '–'}</td>
                  <td className="px-4 py-2.5 font-mono text-[12px] font-bold" style={{ color: r.bal ? '#DC2626' : '#166534' }}>{!r.started ? '—' : r.bal ? fmt(r.bal) : '✓ Clear'}</td>
                  <td className="px-4 py-2.5 font-mono text-[12px]" style={{ color: r.arrearsTotal ? '#DC2626' : '#AAA' }}>{r.arrearsTotal ? <>{fmt(r.arrearsTotal)} <span className="text-[10.5px] text-[#AAA]">({r.arrears.length} mo)</span></> : '–'}</td>
                  <td className="px-4 py-2.5"><Badge variant={v}>{l}</Badge></td>
                  <td className="px-4 py-2.5 whitespace-nowrap">{r.total > 0 && <Button size="sm" onClick={() => setCollect(r.s)}>Collect</Button>}{last && <button onClick={() => setReceipt(last)} className="text-[11px] font-semibold text-[#C8202E] underline cursor-pointer bg-none border-none ml-3">Receipt</button>}</td>
                </tr>); })}</tbody>
          </table>
        </div>
      </>}

      {tab === 'deposits' && (() => {
        const sumHead = pred => boarders.reduce((a, s) => a + heads.filter(pred).reduce((x, hd) => x + headStatus(pays, s.id, hd).paid, 0), 0);
        const pendingAll = boarders.reduce((a, s) => a + heads.reduce((x, hd) => x + headStatus(pays, s.id, hd).balance, 0), 0);
        return <>
          <div className="grid grid-cols-3 gap-3 mb-5">
            <Kpi label="Admission fees collected" value={fmt(sumHead(x => x.kind === 'One-time fee'))} note="One-time, non-refundable" color="#166534" />
            <Kpi label="Deposits & advances held" value={fmt(sumHead(x => x.kind !== 'One-time fee'))} note="Refundable / adjustable — not income" color="#1A5FB4" />
            <Kpi label="Still to collect" value={fmt(pendingAll)} note="Across all boarders" color={pendingAll ? '#DC2626' : '#166534'} />
          </div>
          <div className="bg-white border border-[#E4E4E4] rounded-[10px] overflow-x-auto shadow-[0_1px_4px_rgba(0,0,0,.07)] mb-4">
            <table className="w-full border-collapse text-[13px]">
              <thead><tr><Th>Student</Th><Th>Room</Th>{heads.map(hd => <Th key={hd.id}>{hd.name}<div className="normal-case tracking-normal font-normal text-[10.5px] text-[#BBB]">{fmt(hd.amount)} · {hd.kind}</div></Th>)}</tr></thead>
              <tbody>{!boarders.length ? <tr><td colSpan={heads.length + 2} className="text-center py-10 text-[#AAA]">No boarders yet</td></tr> : boarders.map(s => (
                <tr key={s.id} className="border-b border-[#E4E4E4] last:border-b-0 hover:bg-[#F8F8F8]">
                  <td className="px-4 py-2.5"><div className="font-semibold text-[#111]">{s.name}</div><div className="text-[11px] text-[#AAA]">{s.cls} {s.section}</div></td>
                  <td className="px-4 py-2.5">{roomOf(s) ? <Badge variant="blue">{roomOf(s)}</Badge> : <span className="text-[#AAA]">—</span>}</td>
                  {heads.map(hd => { const st = headStatus(pays, s.id, hd); return (
                    <td key={hd.id} className="px-4 py-2.5">{st.balance === 0 ? <span className="font-mono text-[12px] font-bold text-[#166534]">✓ {fmt(st.paid)}</span> : <div className="flex items-center gap-2"><span className="font-mono text-[12px]" style={{ color: st.paid ? '#B45309' : '#DC2626' }}>{st.paid ? `${fmt(st.paid)} / ${fmt(hd.amount)}` : `Due ${fmt(hd.amount)}`}</span><Button size="sm" variant="outline" onClick={() => setHeadPay({ student: s, head: hd })}>Collect</Button></div>}</td>); })}
                </tr>))}</tbody>
            </table>
          </div>
        </>; })()}

      <Collapsible defaultOpen header={<div className="flex items-center gap-2"><span className="text-[13.5px] font-bold text-[#111]">🧾 Receipts</span><Badge variant="grey">{history.length}</Badge></div>}>
        <table className="w-full border-collapse text-[13px] border-t border-[#E4E4E4]">
          <thead><tr><Th>Date</Th><Th>Receipt</Th><Th>Student</Th><Th>For</Th><Th>Mode</Th><Th>Amount</Th></tr></thead>
          <tbody>{!history.length ? <tr><td colSpan={6} className="text-center py-8 text-[#AAA]">No hostel payments yet</td></tr> : history.map(p => (
            <tr key={p.id} className="border-b border-[#E4E4E4] last:border-b-0 hover:bg-[#F8F8F8]">
              <td className="px-4 py-2.5 text-[#555]">{p.date}</td>
              <td className="px-4 py-2.5"><button onClick={() => setReceipt(p)} className="font-mono text-[11.5px] text-[#C8202E] underline cursor-pointer bg-none border-none">{p.id}</button></td>
              <td className="px-4 py-2.5 font-semibold text-[#111]">{db.students.find(s => s.id === p.studentId)?.name || '—'}</td>
              <td className="px-4 py-2.5 text-[#555]">{forLabel(p)}</td>
              <td className="px-4 py-2.5"><Badge variant={p.mode?.includes('Online') ? 'blue' : p.mode === 'Cash' ? 'green' : 'amber'}>{p.mode}</Badge></td>
              <td className="px-4 py-2.5 font-mono font-bold text-[#166534]">{fmt(p.amount)}</td></tr>))}</tbody>
        </table>
      </Collapsible>

      {collect && <MonthlyCollect student={collect} month={month} pending={() => pendingMonths({ sid: collect.id, record: recOf(collect), payments: pays, fee: feeOf(collect), upTo: month })} onClose={() => setCollect(null)} onSave={f => saveMonthly(collect, f)} />}
      {headPay && <HeadCollect student={headPay.student} head={headPay.head} balance={headStatus(pays, headPay.student.id, headPay.head).balance} onClose={() => setHeadPay(null)} onSave={f => saveHead(headPay.student, headPay.head, f)} />}
      {structure && <StructureModal heads={heads} monthly={boarders[0] ? feeOf(boarders[0]) : MONTHLY_FEE} onClose={() => setStructure(false)} onSave={l => { setFeeHeads(l); setStructure(false); }} />}
      {issued && <Modal open onClose={() => setIssued(null)} title="Receipts issued" subtitle={`${issued.length} receipts — one for each month paid`} footer={<Button variant="outline" onClick={() => setIssued(null)}>Close</Button>}>
        <div className="border border-[#E4E4E4] rounded-[8px] divide-y divide-[#E4E4E4]">{issued.map(p => <div key={p.id} className="flex items-center gap-3 px-3 py-2.5 text-[12.5px]"><span className="font-mono text-[11.5px] text-[#C8202E] font-bold">{p.id}</span><span className="flex-1 text-[#555]">{monthName(p.period)}</span><b className="font-mono">{fmt(p.amount)}</b><Button size="sm" variant="outline" onClick={() => { setIssued(null); setReceipt(p); }}>View</Button></div>)}</div></Modal>}
      {receipt && <ReceiptModal payment={receipt} onClose={() => setReceipt(null)} />}
    </div>
  );
}

/* ── pay one or more pending months (oldest first) ── */
function MonthlyCollect({ student, month, pending, onClose, onSave }) {
  const list = pending();
  const [checked, setChecked] = useState(() => new Set(list.map(x => x.month)));
  const sel = list.filter(x => checked.has(x.month)), maxAmt = sel.reduce((a, x) => a + x.balance, 0);
  const [amount, setAmount] = useState(String(maxAmt)); const [mode, setMode] = useState(PAY_MODES[0]); const [date, setDate] = useState(TODAY); const [ref, setRef] = useState(''); const [err, setErr] = useState('');
  const toggle = m => { const n = new Set(checked); n.has(m) ? n.delete(m) : n.add(m); setChecked(n); setAmount(String(list.filter(x => n.has(x.month)).reduce((a, x) => a + x.balance, 0))); setErr(''); };
  const alloc = allocate(Math.round(+amount) || 0, sel);
  function save() {
    const n = Math.round(+amount);
    if (!sel.length) return setErr('Select at least one month.'); if (!n || n <= 0) return setErr('Enter the amount received.');
    if (n > maxAmt) return setErr(`Amount is more than the ${fmt(maxAmt)} due for the selected months.`);
    onSave({ allocation: allocate(n, sel), mode, date, ref: ref.trim() });
  }
  return (
    <Modal open onClose={onClose} title="Collect Hostel Fee" subtitle={`${student.name} · ${student.cls} ${student.section}`}
      footer={<><span className="mr-auto text-[12px] text-[#DC2626] font-semibold">{err}</span><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={save}>Record payment & issue receipt{alloc.length > 1 ? 's' : ''}</Button></>}>
      <div className="text-[10.5px] font-bold text-[#AAA] uppercase tracking-wider mb-1.5">Months to pay</div>
      <div className="border border-[#E4E4E4] rounded-[8px] divide-y divide-[#E4E4E4] mb-3">{list.map(x => (
        <label key={x.month} className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[#F8F8F8]"><input type="checkbox" checked={checked.has(x.month)} onChange={() => toggle(x.month)} className="accent-[#C8202E] w-4 h-4" />
          <span className="flex-1 text-[13px] font-semibold">{monthName(x.month)}{x.month < month && <Badge variant="red" className="ml-2">Previous due</Badge>}{x.month === month && isOverdue(x.month) && <Badge variant="red" className="ml-2">Overdue</Badge>}</span>
          <span className="text-[11.5px] text-[#AAA]">{x.paid ? `${fmt(x.paid)} paid of ${fmt(x.fee)}` : fmt(x.fee)}</span><b className="font-mono text-[#DC2626] w-20 text-right">{fmt(x.balance)}</b></label>))}</div>
      <div className="grid grid-cols-2 gap-3">
        <Field label={`Amount received (₹) — up to ${fmt(maxAmt)}`}><input type="number" min={1} max={maxAmt} value={amount} onChange={e => setAmount(e.target.value)} className={inputCls} /></Field>
        <Field label="Payment mode"><select value={mode} onChange={e => setMode(e.target.value)} className={inputCls}>{PAY_MODES.map(m => <option key={m}>{m}</option>)}</select></Field>
        <Field label="Date"><input type="date" value={date} onChange={e => setDate(e.target.value)} className={inputCls} /></Field>
        <Field label="Reference / transaction ID"><input value={ref} onChange={e => setRef(e.target.value)} placeholder="UPI ref, cheque no…" className={inputCls} /></Field>
      </div>
      {alloc.length > 0 && <div className="mt-3 text-[12px] text-[#555] bg-[#F8F8F8] rounded-[6px] px-3 py-2">Applied oldest first: {alloc.map(a => `${monthShort(a.month)} ${fmt(a.amount)}`).join(' · ')}</div>}
    </Modal>
  );
}

/* ── collect an admission fee / deposit / advance ── */
function HeadCollect({ student, head, balance, onClose, onSave }) {
  const [amount, setAmount] = useState(String(balance)); const [mode, setMode] = useState(PAY_MODES[0]); const [date, setDate] = useState(TODAY); const [ref, setRef] = useState(''); const [err, setErr] = useState('');
  function save() { const n = Math.round(+amount); if (!n || n <= 0) return setErr('Enter the amount received.'); if (n > balance) return setErr(`Amount is more than the balance of ${fmt(balance)}.`); onSave({ amount: n, mode, date, ref: ref.trim() }); }
  return (
    <Modal open onClose={onClose} title={`Collect ${head.name}`} subtitle={`${student.name} · ${student.cls} ${student.section} · ${head.kind}`}
      footer={<><span className="mr-auto text-[12px] text-[#DC2626] font-semibold">{err}</span><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={save}>Record payment & issue receipt</Button></>}>
      <div className="grid grid-cols-2 gap-3">
        <Field label={`Amount received (₹) — balance ${fmt(balance)}`}><input type="number" min={1} max={balance} value={amount} onChange={e => setAmount(e.target.value)} className={inputCls} /></Field>
        <Field label="Payment mode"><select value={mode} onChange={e => setMode(e.target.value)} className={inputCls}>{PAY_MODES.map(m => <option key={m}>{m}</option>)}</select></Field>
        <Field label="Date"><input type="date" value={date} onChange={e => setDate(e.target.value)} className={inputCls} /></Field>
        <Field label="Reference / transaction ID"><input value={ref} onChange={e => setRef(e.target.value)} className={inputCls} /></Field>
      </div>
      {head.kind !== 'One-time fee' && <div className="mt-3 text-[11.5px] text-[#777] bg-[#F8F8F8] rounded-[6px] px-3 py-2">{head.kind === 'Refundable deposit' ? 'A deposit is held for the student and returned when they leave the hostel. It is not counted as a fee received.' : 'An advance is held and adjusted against mess charges. It is not counted as a fee received.'}</div>}
    </Modal>
  );
}

/* ── edit the one-time charges ── */
function StructureModal({ heads, monthly, onClose, onSave }) {
  const [list, setList] = useState(() => heads.map(x => ({ ...x })));
  const set = (i, k, v) => setList(l => l.map((x, j) => j === i ? { ...x, [k]: v } : x));
  return (
    <Modal open onClose={onClose} size="lg" title="Hostel fee structure" subtitle="Charges collected from each student at hostel admission"
      footer={<><Button variant="outline" onClick={() => setList(DEFAULT_FEE_HEADS.map(x => ({ ...x })))}>Reset to defaults</Button><span className="flex-1" /><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={() => onSave(list.filter(x => x.name.trim()).map(x => ({ ...x, name: x.name.trim(), amount: Math.max(0, Math.round(+x.amount) || 0) })))}>Save</Button></>}>
      <div className="bg-[#FEF4F4] border border-[#FECACA] rounded-[8px] px-3 py-2.5 mb-4 text-[12.5px] text-[#555]"><b>Monthly hostel fee: {fmt(monthly)}</b> per student — set in Finance → Fee structure (hostel fee ÷ 12), billed every month.</div>
      <div className="grid grid-cols-[1fr_120px_170px_28px] gap-2 text-[10.5px] font-bold text-[#AAA] uppercase tracking-wider mb-1.5"><span>Item</span><span>Amount (₹)</span><span>Type</span><span /></div>
      <div className="space-y-2">{list.map((x, i) => (
        <div key={x.id} className="grid grid-cols-[1fr_120px_170px_28px] gap-2 items-center">
          <input value={x.name} onChange={e => set(i, 'name', e.target.value)} className={inputCls} /><input type="number" value={x.amount} onChange={e => set(i, 'amount', e.target.value)} className={inputCls} />
          <select value={x.kind} onChange={e => set(i, 'kind', e.target.value)} className={inputCls}>{HEAD_KINDS.map(k => <option key={k}>{k}</option>)}</select>
          {DEFAULT_IDS.includes(x.id) ? <span /> : <button onClick={() => setList(l => l.filter((_, j) => j !== i))} className="text-[#DC2626] cursor-pointer bg-none border-none" title="Remove">✕</button>}</div>))}</div>
      <Button size="sm" variant="outline" className="mt-3" onClick={() => setList(l => [...l, { id: 'h' + Date.now().toString().slice(-6), name: '', amount: 0, kind: HEAD_KINDS[0] }])}>+ Add item</Button>
      <p className="text-[11.5px] text-[#AAA] mt-3">The amounts shown are starting values — set them to your school's actual charges. Deposits and advances are recorded in Finance but are not counted as fees received against the annual fee.</p>
    </Modal>
  );
}
