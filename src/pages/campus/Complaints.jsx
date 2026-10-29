import { useState } from 'react';
import useStore from '../../store/useStore';
import { PageHeader } from '../../components/Layout';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Collapsible from '../../components/ui/Collapsible';
import { Kpi, Field, inputCls } from '../../components/ui/Kit';
import { COMPLAINT_TYPES, TODAY, daysBetween, prettyDate } from './constants';

const TYPE_VARIANT = { Academic:'blue', Facility:'amber', Transport:'purple', Behavioural:'red', Administrative:'grey', General:'grey' };

export default function Complaints({ addComplaint, resolveComplaint, addComplaintNote }) {
  const complaints = useStore(s => s.db.complaints) || [];
  const [open, setOpen] = useState(false);
  const [noteFor, setNoteFor] = useState(null);
  const [note, setNote] = useState('');
  const [f, setF] = useState({ who:'', type:COMPLAINT_TYPES[0], date:TODAY, subj:'' });

  const openList = complaints.filter(c => c.status === 'Open');
  const resolved = complaints.filter(c => c.status === 'Resolved');
  const avgDays = resolved.length ? Math.round(resolved.reduce((a, c) => a + daysBetween(c.date, c.resolvedOn || c.date), 0) / resolved.length * 10) / 10 : 0;

  function save() {
    if (!f.subj.trim()) return;
    addComplaint({ ...f, who: f.who.trim() || 'Anonymous', subj: f.subj.trim() });
    setOpen(false); setF({ who:'', type:COMPLAINT_TYPES[0], date:TODAY, subj:'' });
  }
  function saveNote() {
    if (!note.trim()) return;
    addComplaintNote(noteFor, note.trim()); setNoteFor(null); setNote('');
  }

  return (
    <div className="p-6">
      <PageHeader title="Complaints" subtitle="Parent, staff and student complaints — synced with the Principal's dashboard"
        actions={<Button onClick={() => setOpen(true)}>+ Log Complaint</Button>} />
      <div className="grid grid-cols-3 gap-3 mb-5">
        <Kpi label="Open" value={openList.length} note="Awaiting resolution" color={openList.length ? '#DC2626' : '#166534'} />
        <Kpi label="Resolved" value={resolved.length} note="All time" color="#166534" />
        <Kpi label="Avg Resolution" value={`${avgDays} days`} note="From logged to resolved" color="#1A5FB4" />
      </div>

      <div className="text-[12px] font-bold text-[#AAA] uppercase tracking-wider mb-2">Open ({openList.length})</div>
      <div className="space-y-2 mb-5">
        {!openList.length && <div className="bg-white border border-[#E4E4E4] rounded-[10px] p-8 text-center text-[#166534] font-semibold">🎉 No open complaints</div>}
        {openList.map(c => {
          const age = daysBetween(c.date, TODAY);
          return (
            <div key={c.id} className="bg-white border border-[#E4E4E4] rounded-[10px] p-4 shadow-[0_1px_4px_rgba(0,0,0,.07)]" style={{ borderLeft:`3px solid ${age > 7 ? '#DC2626' : '#C8202E'}` }}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-[11px] text-[#AAA]">{c.id} · {prettyDate(c.date)}</span>
                <Badge variant={TYPE_VARIANT[c.type] || 'grey'}>{c.type}</Badge>
                <span className={`ml-auto text-[11px] font-semibold ${age > 7 ? 'text-[#DC2626]' : 'text-[#AAA]'}`}>Open {age} day{age === 1 ? '' : 's'}</span>
              </div>
              <div className="text-[13.5px] font-bold text-[#111] mb-1">{c.subj}</div>
              <div className="text-[12px] text-[#777] mb-2">From: {c.who}</div>
              <div className="text-[12px] text-[#9A1822] bg-[#FEF4F4] rounded-[6px] px-2.5 py-1.5 mb-3">⚡ {c.action}</div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => resolveComplaint(c.id)}>Mark Resolved</Button>
                <Button size="sm" variant="outline" onClick={() => { setNoteFor(c.id); setNote(''); }}>Update Action</Button>
              </div>
            </div>
          );
        })}
      </div>

      <Collapsible header={<span className="text-[13.5px] font-bold text-[#111]">✅ Resolved ({resolved.length})</span>}>
        <div className="divide-y divide-[#E4E4E4] border-t border-[#E4E4E4]">
          {resolved.map(c => (
            <div key={c.id} className="flex items-center gap-3 px-4 py-2.5">
              <span className="font-mono text-[11px] text-[#AAA] w-14">{c.id}</span>
              <span className="flex-1 text-[13px] text-[#333]">{c.subj}</span>
              <Badge variant="grey">{c.type}</Badge>
              <span className="text-[11.5px] text-[#166534] font-semibold w-16 text-right">{daysBetween(c.date, c.resolvedOn || c.date)} day(s)</span>
            </div>
          ))}
        </div>
      </Collapsible>

      <Modal open={open} onClose={() => setOpen(false)} title="Log Complaint"
        footer={<><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={save}>Log Complaint</Button></>}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="From (Name)" className="col-span-2"><input value={f.who} onChange={e => setF(x => ({ ...x, who:e.target.value }))} placeholder="e.g. Parent - Mrs. Suma R." className={inputCls} /></Field>
          <Field label="Type"><select value={f.type} onChange={e => setF(x => ({ ...x, type:e.target.value }))} className={inputCls}>{COMPLAINT_TYPES.map(t => <option key={t}>{t}</option>)}</select></Field>
          <Field label="Date"><input type="date" value={f.date} onChange={e => setF(x => ({ ...x, date:e.target.value }))} className={inputCls} /></Field>
          <Field label="Description *" className="col-span-2"><textarea rows={4} value={f.subj} onChange={e => setF(x => ({ ...x, subj:e.target.value }))} placeholder="Describe the complaint in detail..." className={inputCls + ' resize-y'} /></Field>
        </div>
      </Modal>

      <Modal open={!!noteFor} onClose={() => setNoteFor(null)} title="Update Action Taken" subtitle={noteFor}
        footer={<><Button variant="outline" onClick={() => setNoteFor(null)}>Cancel</Button><Button onClick={saveNote}>Save</Button></>}>
        <Field label="Action taken / follow-up"><textarea rows={4} value={note} onChange={e => setNote(e.target.value)} placeholder="Action taken, update, follow-up required..." className={inputCls + ' resize-y'} /></Field>
      </Modal>
    </div>
  );
}
