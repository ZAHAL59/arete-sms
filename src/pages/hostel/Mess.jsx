import { useState } from 'react';
import useStore from '../../store/useStore';
import { PageHeader } from '../../components/Layout';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Collapsible from '../../components/ui/Collapsible';
import { Kpi, Field, inputCls, Th } from './ui';
import { MONTHLY_FEE, fmt, TODAY, STOCK_CATS, STOCK_UNITS } from './constants';
import { getFeeStructure } from '../finance/constants';

export default function Mess({ h, logCost, saveStock, addStock, addOrder, receiveOrder }) {
  const db = useStore(s => s.db);
  const [date, setDate] = useState(TODAY);
  const [amt, setAmt] = useState('');
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({});
  const [procure, setProcure] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [nw, setNw] = useState({ item:'', unit:'kg', qty:'', max:'', low:'', cost:'', cat:STOCK_CATS[0], supplier:'' });
  const [ord, setOrd] = useState({ supplier:'', delivery:'' }); const [placed, setPlaced] = useState(false);

  const boarders = db.students.filter(s => s.boarding).length || 1;
  const monthlyBudget = db.students.filter(s => s.boarding).reduce((a, s) => a + Math.round((getFeeStructure()[s.cls]?.hostel || MONTHLY_FEE * 12) / 12), 0) || MONTHLY_FEE;
  const now = new Date();
  const spent = h.costLog.filter(l => new Date(l.date).getMonth() === now.getMonth()).reduce((a, l) => a + l.amount, 0);
  const projected = Math.round(spent / Math.max(1, now.getDate()) * 30);
  const util = monthlyBudget ? Math.round(spent / monthlyBudget * 100) : 0;
  const low = h.stock.filter(s => s.qty <= s.low);
  const orderTotal = low.reduce((a, s) => a + (s.max - s.qty) * s.cost, 0);

  function submitCost() {
    const n = parseInt(amt); if (!n) return;
    logCost(date, n); setAmt('');
  }
  function openEdit(s) { setEdit(s); setForm({ qty:String(s.qty), max:String(s.max), low:String(s.low), cost:String(s.cost) }); }
  function saveEdit() {
    saveStock(edit.item, { qty:+form.qty||0, max:+form.max||0, low:+form.low||0, cost:+form.cost||0 });
    setEdit(null);
  }
  function saveNew() {
    if (!nw.item) return;
    addStock({ ...nw, qty:+nw.qty||0, max:+nw.max||0, low:+nw.low||0, cost:+nw.cost||0 });
    setAddOpen(false); setNw({ item:'', unit:'kg', qty:'', max:'', low:'', cost:'', cat:STOCK_CATS[0], supplier:'' });
  }

  return (
    <div className="p-6">
      <PageHeader title="Mess Management" subtitle="Stock, daily cost and procurement"
        actions={<>
          <Button variant="outline" onClick={() => setAddOpen(true)}>+ Add Item</Button>
          <Button onClick={() => setProcure(true)}>Generate Procurement Order</Button>
        </>} />

      <div className="grid grid-cols-4 gap-3 mb-5">
        <Kpi label="Monthly Budget" value={fmt(monthlyBudget)} note={`${boarders} boarders · from fee structure`} />
        <Kpi label="Spent So Far" value={fmt(spent)} note={`${util}% of budget`} color={util > 90 ? '#DC2626' : '#1A5FB4'} />
        <Kpi label="Projected" value={fmt(projected)} note="At current daily rate" color={projected > monthlyBudget ? '#DC2626' : '#166534'} />
        <Kpi label="Low Stock" value={low.length} note="Items to reorder" color={low.length ? '#DC2626' : '#166534'} />
      </div>

      <Collapsible defaultOpen className="mb-3" header={<span className="text-[13.5px] font-bold text-[#111]">📦 Stock Levels</span>}>
        <table className="w-full border-collapse text-[13px] border-t border-[#E4E4E4]">
          <thead><tr><Th>Item</Th><Th>Category</Th><Th>Stock</Th><Th>Level</Th><Th>Unit Cost</Th><Th>Status</Th><Th /></tr></thead>
          <tbody>
            {h.stock.map(s => {
              const pct = Math.round(s.qty / s.max * 100); const isLow = s.qty <= s.low;
              return (
                <tr key={s.item} className="border-b border-[#E4E4E4] last:border-b-0 hover:bg-[#F8F8F8]">
                  <td className="px-4 py-2.5 font-semibold text-[#111]">{s.item}</td>
                  <td className="px-4 py-2.5"><Badge variant="grey">{s.cat}</Badge></td>
                  <td className="px-4 py-2.5 font-bold">{s.qty} <span className="text-[#AAA] font-normal">/ {s.max} {s.unit}</span></td>
                  <td className="px-4 py-2.5">
                    <div className="h-1.5 bg-[#E4E4E4] rounded-full w-20 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width:`${Math.min(100,pct)}%`, background: isLow ? '#DC2626' : '#C8202E' }} />
                    </div>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-[12px]">{fmt(s.cost)}</td>
                  <td className="px-4 py-2.5"><Badge variant={isLow ? 'red' : 'green'}>{isLow ? 'Low Stock' : 'OK'}</Badge></td>
                  <td className="px-4 py-2.5"><button onClick={() => openEdit(s)} className="text-[11px] font-semibold text-[#C8202E] underline cursor-pointer bg-none border-none">Edit</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Collapsible>

      <Collapsible defaultOpen className="mb-3" header={<span className="text-[13.5px] font-bold text-[#111]">🧾 Daily Cost Log</span>}>
        <div className="p-4 border-t border-[#E4E4E4]">
          <div className="flex gap-2 mb-3 items-end">
            <Field label="Date"><input type="date" value={date} onChange={e => setDate(e.target.value)} className={inputCls} /></Field>
            <Field label="Amount (₹)"><input type="number" value={amt} onChange={e => setAmt(e.target.value)} className={inputCls} placeholder="Spent today" /></Field>
            <Button onClick={submitCost}>Log Cost</Button>
          </div>
          <div className="divide-y divide-[#E4E4E4] border border-[#E4E4E4] rounded-[8px]">
            {h.costLog.slice(0, 8).map((l, i) => (
              <div key={i} className="flex justify-between px-3 py-2 text-[12.5px]">
                <span className="text-[#555]">{l.date} · {l.by}</span>
                <span className="font-mono font-bold text-[#111]">{fmt(l.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </Collapsible>

      <Collapsible className="mb-3" header={<span className="text-[13.5px] font-bold text-[#111]">📦 Procurement Orders ({(h.orders || []).length})</span>}>
        <div className="border-t border-[#E4E4E4] divide-y divide-[#E4E4E4]">{!(h.orders || []).length && <div className="p-4 text-[13px] text-[#AAA]">No orders yet — generate one from low-stock items.</div>}{(h.orders || []).map(o => (
          <div key={o.id} className="flex items-center gap-3 px-4 py-2.5"><div className="flex-1"><div className="text-[13px] font-semibold text-[#111]">{o.supplier} · {fmt(o.total)}</div><div className="text-[11.5px] text-[#777]">{o.date}{o.delivery ? ` · expected ${o.delivery}` : ''} · {o.lines.map(l => `${l.item} ×${l.qty}`).join(', ')}</div></div>
            <Badge variant={o.status === 'Received' ? 'green' : 'amber'}>{o.status}</Badge>{o.status !== 'Received' && <Button size="sm" variant="outline" onClick={() => receiveOrder(o.id)}>Mark received</Button>}</div>))}</div>
      </Collapsible>

      {/* Edit stock */}
      {edit && (
        <Modal open onClose={() => setEdit(null)} title={`Edit — ${edit.item}`}
          footer={<><Button variant="outline" onClick={() => setEdit(null)}>Cancel</Button><Button onClick={saveEdit}>Save</Button></>}>
          <div className="grid grid-cols-2 gap-3">
            {[['Current Qty','qty'],['Max Qty','max'],['Low Alert At','low'],['Unit Cost (₹)','cost']].map(([l, k]) => (
              <Field key={k} label={l}><input type="number" value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} className={inputCls} /></Field>
            ))}
          </div>
        </Modal>
      )}

      {/* Add item */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Stock Item"
        footer={<><Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button><Button onClick={saveNew}>Add</Button></>}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Item *" className="col-span-2"><input value={nw.item} onChange={e => setNw(f => ({ ...f, item:e.target.value }))} className={inputCls} /></Field>
          <Field label="Unit"><select value={nw.unit} onChange={e => setNw(f => ({ ...f, unit:e.target.value }))} className={inputCls}>{STOCK_UNITS.map(u => <option key={u}>{u}</option>)}</select></Field>
          <Field label="Category">
            <select value={nw.cat} onChange={e => setNw(f => ({ ...f, cat:e.target.value }))} className={inputCls}>
              {STOCK_CATS.map(c => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Supplier" className="col-span-2"><input value={nw.supplier} onChange={e => setNw(f => ({ ...f, supplier:e.target.value }))} className={inputCls} /></Field>
          {[['Qty','qty'],['Max','max'],['Low alert (reorder trigger)','low'],['Unit cost','cost']].map(([l, k]) => (
            <Field key={k} label={l}><input type="number" value={nw[k]} onChange={e => setNw(f => ({ ...f, [k]:e.target.value }))} className={inputCls} /></Field>
          ))}
        </div>
      </Modal>

      {/* Procurement order */}
      <Modal open={procure} onClose={() => setProcure(false)} title="Procurement Order" subtitle={`Arete Model School Hostel · ${new Date().toDateString()}`}
        footer={<><Button variant="outline" onClick={() => { setProcure(false); setPlaced(false); }}>Close</Button>{low.length > 0 && !placed && <Button onClick={() => { addOrder({ supplier:ord.supplier || 'Supplier', delivery:ord.delivery, total:orderTotal, lines:low.map(x => ({ item:x.item, qty:x.max - x.qty, unit:x.unit, cost:x.cost })) }); setPlaced(true); }}>📦 Place order</Button>}</>}>
        {!low.length
          ? <div className="text-center py-6 text-[#166534] font-semibold">All items adequately stocked — no order needed</div>
          : <>
              <div className="border border-[#E4E4E4] rounded-[8px] divide-y divide-[#E4E4E4] mb-3">
                {low.map(s => (
                  <div key={s.item} className="flex justify-between px-3 py-2.5 text-[13px]">
                    <span className="font-semibold text-[#111]">{s.item}</span>
                    <span className="text-[#555]">{s.max - s.qty} {s.unit} × {fmt(s.cost)} = <strong className="text-[#111]">{fmt((s.max - s.qty) * s.cost)}</strong></span>
                  </div>
                ))}
              </div>
              {!placed && <div className="grid grid-cols-2 gap-3 mb-3"><Field label="Supplier name"><input value={ord.supplier} onChange={e => setOrd(o => ({ ...o, supplier:e.target.value }))} className={inputCls} /></Field><Field label="Expected delivery"><input type="date" value={ord.delivery} onChange={e => setOrd(o => ({ ...o, delivery:e.target.value }))} className={inputCls} /></Field></div>}
              {placed && <div className="mb-3 text-[13px] text-[#166534] bg-[#F0FDF4] rounded-[6px] p-2.5">✓ Order recorded under Procurement Orders. Contact the supplier directly — orders are not sent automatically.</div>}
              <div className="bg-[#FEF4F4] border border-[#FECACA] rounded-[8px] p-3 flex justify-between">
                <span className="font-bold text-[#111]">Estimated Total</span>
                <span className="font-extrabold text-[#C8202E] font-mono">{fmt(orderTotal)}</span>
              </div>
            </>}
      </Modal>
    </div>
  );
}
