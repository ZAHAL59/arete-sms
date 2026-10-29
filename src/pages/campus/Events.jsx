import { useState } from 'react';
import { PageHeader } from '../../components/Layout';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { Field, inputCls } from '../../components/ui/Kit';
import { EVENT_TYPES, VENUES, TODAY } from './constants';

export default function Events({ c, addEvent, allocateSeats }) {
  const [open, setOpen] = useState(false);
  const [seatEv, setSeatEv] = useState(null);
  const [count, setCount] = useState('');
  const [to, setTo] = useState('');
  const [f, setF] = useState({ title:'', type:EVENT_TYPES[0], venue:VENUES[0], date:'', time:'10:00', seats:'' });

  const upcoming = c.events.filter(e => e.date >= TODAY);
  const past = c.events.filter(e => e.date < TODAY).reverse();

  function save() {
    if (!f.title.trim() || !f.date) return;
    addEvent({ ...f, title:f.title.trim(), seats:+f.seats || 50 });
    setOpen(false); setF({ title:'', type:EVENT_TYPES[0], venue:VENUES[0], date:'', time:'10:00', seats:'' });
  }
  function openSeats(e) { setSeatEv(e); setCount(e.alloc ? String(e.alloc) : ''); setTo(e.allocTo || ''); }
  function saveSeats() { allocateSeats(seatEv.id, +count || 0, to); setSeatEv(null); }

  const card = (e, isPast) => {
    const d = new Date(e.date + 'T00:00:00');
    const pct = e.seats ? Math.round(e.alloc / e.seats * 100) : 0;
    return (
      <div key={e.id} className={`bg-white border border-[#E4E4E4] rounded-[10px] p-4 flex gap-4 shadow-[0_1px_4px_rgba(0,0,0,.07)] ${isPast ? 'opacity-70' : ''}`}>
        <div className="w-14 flex-shrink-0 text-center rounded-[8px] py-2" style={{ background: isPast ? '#F2F2F2' : '#FEF4F4' }}>
          <div className="text-[20px] font-extrabold leading-none" style={{ color: isPast ? '#777' : '#C8202E' }}>{d.getDate()}</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#AAA] mt-1">{d.toLocaleString('en-IN', { month:'short' })}</div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-bold text-[#111]">{e.title}</div>
          <div className="text-[12px] text-[#777] mt-0.5 flex items-center gap-2 flex-wrap">{e.time} · {e.venue} <Badge variant="grey">{e.type}</Badge></div>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-[12px] text-[#555]">{e.alloc === 0 ? <em className="text-[#AAA]">Seats not yet allocated</em> : <>Seats: <strong>{e.alloc}/{e.seats}</strong>{e.allocTo && <span className="text-[#AAA]"> · {e.allocTo}</span>}</>}</span>
            {e.alloc > 0 && <div className="flex-1 max-w-[140px] h-1.5 bg-[#E4E4E4] rounded-full overflow-hidden"><div className="h-full bg-[#C8202E] rounded-full" style={{ width:`${pct}%` }} /></div>}
          </div>
          {e.resources?.length > 0 && <div className="text-[11.5px] text-[#AAA] mt-1.5">Resources: {e.resources.join(', ')}</div>}
        </div>
        {!isPast && <Button size="sm" variant={e.alloc === 0 ? 'primary' : 'outline'} onClick={() => openSeats(e)}>{e.alloc === 0 ? 'Allocate Seats' : 'Edit Seats'}</Button>}
      </div>
    );
  };

  return (
    <div className="p-6">
      <PageHeader title="Meetings & Events" subtitle={`${upcoming.length} upcoming`} actions={<Button onClick={() => setOpen(true)}>+ Schedule Event</Button>} />
      <div className="text-[12px] font-bold text-[#AAA] uppercase tracking-wider mb-2">Upcoming</div>
      <div className="space-y-2 mb-5">{upcoming.length ? upcoming.map(e => card(e, false)) : <div className="bg-white border border-[#E4E4E4] rounded-[10px] p-8 text-center text-[#AAA]">Nothing scheduled</div>}</div>
      {past.length > 0 && <><div className="text-[12px] font-bold text-[#AAA] uppercase tracking-wider mb-2">Past</div><div className="space-y-2">{past.map(e => card(e, true))}</div></>}

      <Modal open={open} onClose={() => setOpen(false)} title="Schedule Event"
        footer={<><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={save}>Schedule</Button></>}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Event Title *" className="col-span-2"><input value={f.title} onChange={e => setF(x => ({ ...x, title:e.target.value }))} placeholder="e.g. Parent-Teacher Meeting Grade 8" className={inputCls} /></Field>
          <Field label="Type"><select value={f.type} onChange={e => setF(x => ({ ...x, type:e.target.value }))} className={inputCls}>{EVENT_TYPES.map(t => <option key={t}>{t}</option>)}</select></Field>
          <Field label="Venue"><select value={f.venue} onChange={e => setF(x => ({ ...x, venue:e.target.value }))} className={inputCls}>{VENUES.map(t => <option key={t}>{t}</option>)}</select></Field>
          <Field label="Date *"><input type="date" value={f.date} onChange={e => setF(x => ({ ...x, date:e.target.value }))} className={inputCls} /></Field>
          <Field label="Time"><input type="time" value={f.time} onChange={e => setF(x => ({ ...x, time:e.target.value }))} className={inputCls} /></Field>
          <Field label="Total Seats" className="col-span-2"><input type="number" min={1} value={f.seats} onChange={e => setF(x => ({ ...x, seats:e.target.value }))} placeholder="e.g. 120" className={inputCls} /></Field>
        </div>
      </Modal>

      <Modal open={!!seatEv} onClose={() => setSeatEv(null)} title="Allocate Seats" subtitle={seatEv ? `${seatEv.title} · capacity ${seatEv.seats}` : ''}
        footer={<><Button variant="outline" onClick={() => setSeatEv(null)}>Cancel</Button><Button onClick={saveSeats}>Confirm</Button></>}>
        <div className="space-y-3">
          <Field label="Seats to Allocate"><input type="number" min={0} max={seatEv?.seats} value={count} onChange={e => setCount(e.target.value)} placeholder="Number of confirmed attendees" className={inputCls} /></Field>
          <Field label="Allocated To"><input value={to} onChange={e => setTo(e.target.value)} placeholder="e.g. Grade 10 parents, Staff members..." className={inputCls} /></Field>
          {seatEv && +count > seatEv.seats && <div className="text-[12px] text-[#B45309] bg-[#FFFBEB] rounded-[6px] p-2.5">Over capacity — will be capped at {seatEv.seats}.</div>}
        </div>
      </Modal>
    </div>
  );
}
