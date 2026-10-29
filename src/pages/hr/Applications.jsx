import { useState } from 'react';
import { PageHeader } from '../../components/Layout';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { Kpi, Th } from '../../components/ui/Kit';

const STATUS_VARIANT = { 'Pending Review':'amber', Shortlisted:'green', Rejected:'red' };
const scoreColor = n => n >= 75 ? '#166534' : n >= 50 ? '#B45309' : '#DC2626';

export default function Applications({ hr, shortlist, reject, restore }) {
  const [vac, setVac] = useState(''); const [st, setSt] = useState(''); const [selId, setSelId] = useState(null);
  const apps = (hr.applications || []).slice().sort((a, b) => (b.appliedAt || '').localeCompare(a.appliedAt || ''));
  const rows = apps.filter(a => (!vac || a.vacId === vac) && (!st || a.hrStatus === st));
  const sel = apps.find(a => a.id === selId);
  const vacName = id => { const v = hr.vacancies.find(x => x.id === id); return v ? `${v.subj} Teacher` : '—'; };
  const count = s => apps.filter(a => a.hrStatus === s).length;

  return (
    <div className="p-6">
      <PageHeader title="Applications Inbox" subtitle="Applications received from the public Careers page"
        actions={<>
          <select value={vac} onChange={e => setVac(e.target.value)} className="px-2.5 py-1.5 border border-[#E4E4E4] rounded-[6px] text-[12.5px] outline-none focus:border-[#C8202E]">
            <option value="">All vacancies</option>{hr.vacancies.map(v => <option key={v.id} value={v.id}>{v.subj}</option>)}</select>
          <select value={st} onChange={e => setSt(e.target.value)} className="px-2.5 py-1.5 border border-[#E4E4E4] rounded-[6px] text-[12.5px] outline-none focus:border-[#C8202E]">
            <option value="">All statuses</option>{Object.keys(STATUS_VARIANT).map(s => <option key={s}>{s}</option>)}</select>
        </>} />
      <div className="grid grid-cols-4 gap-3 mb-5">
        <Kpi label="Total Received" value={apps.length} note="All applications" />
        <Kpi label="Pending Review" value={count('Pending Review')} note="Need a decision" color="#B45309" />
        <Kpi label="Shortlisted" value={count('Shortlisted')} note="Moved to candidates" color="#166534" />
        <Kpi label="Rejected" value={count('Rejected')} note="Can be restored" color="#DC2626" />
      </div>

      <div className="bg-white border border-[#E4E4E4] rounded-[10px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,.07)]">
        <table className="w-full border-collapse text-[13px]">
          <thead><tr><Th>Applicant</Th><Th>Position</Th><Th>Qualification</Th><Th>Experience</Th><Th>Auto-score</Th><Th>Applied</Th><Th>Status</Th><Th /></tr></thead>
          <tbody>
            {!rows.length ? <tr><td colSpan={8} className="text-center py-12 text-[#AAA]">{apps.length ? 'No applications match' : 'No applications yet — they appear here when someone applies on the Careers page'}</td></tr>
              : rows.map(a => (
                <tr key={a.id} onClick={() => setSelId(a.id)} className="border-b border-[#E4E4E4] last:border-b-0 hover:bg-[#F8F8F8] cursor-pointer">
                  <td className="px-4 py-2.5"><div className="font-semibold text-[#111]">{a.name}</div><div className="font-mono text-[10.5px] text-[#AAA]">{a.id}</div></td>
                  <td className="px-4 py-2.5 text-[#555]">{vacName(a.vacId)}</td>
                  <td className="px-4 py-2.5 text-[#555]">{a.qual}</td>
                  <td className="px-4 py-2.5 text-[#555]">{a.exp}</td>
                  <td className="px-4 py-2.5"><div className="flex items-center gap-2"><div className="h-1.5 bg-[#E4E4E4] rounded-full w-12 overflow-hidden"><div className="h-full rounded-full" style={{ width:`${a.score}%`, background:scoreColor(a.score) }} /></div><span className="font-bold" style={{ color:scoreColor(a.score) }}>{a.score}</span></div></td>
                  <td className="px-4 py-2.5 text-[#777] text-[12px]">{a.appliedAt ? new Date(a.appliedAt).toLocaleDateString('en-IN', { day:'numeric', month:'short' }) : '—'}</td>
                  <td className="px-4 py-2.5"><Badge variant={STATUS_VARIANT[a.hrStatus] || 'grey'}>{a.hrStatus}</Badge></td>
                  <td className="px-4 py-2.5 text-[11px] font-semibold text-[#C8202E] underline">Open</td>
                </tr>))}
          </tbody>
        </table>
      </div>

      {sel && (
        <Modal open onClose={() => setSelId(null)} size="lg" title={sel.name} subtitle={`${vacName(sel.vacId)} · ${sel.id}`}
          footer={<>
            <Button variant="outline" onClick={() => setSelId(null)}>Close</Button>
            {sel.hrStatus === 'Rejected' && <Button variant="outline" onClick={() => restore(sel.id)}>↩ Restore</Button>}
            {sel.hrStatus !== 'Rejected' && <Button variant="danger" onClick={() => reject(sel.id)}>Reject</Button>}
            {sel.hrStatus === 'Pending Review' && <Button onClick={() => shortlist(sel.id)}>✓ Shortlist</Button>}
          </>}>
          <div className="flex items-center gap-3 mb-4">
            <Badge variant={STATUS_VARIANT[sel.hrStatus] || 'grey'}>{sel.hrStatus}</Badge>
            <span className="text-[12.5px] text-[#555]">Auto-score <b style={{ color:scoreColor(sel.score) }}>{sel.score}/100</b> <span className="text-[#AAA]">(a rough guide — qualification, experience and skills detail)</span></span>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {[['Phone', sel.phone || '—'], ['Email', sel.email || '—'], ['Date of Birth', sel.dob || '—'], ['Address', sel.address || '—'],
              ['Qualification', sel.qual], ['Specialisation', sel.spec || '—'], ['Experience', sel.exp], ['Current Employer', sel.employer || '—']].map(([l, v]) => (
              <div key={l} className="bg-[#F8F8F8] p-2.5 rounded-[6px]"><div className="text-[10px] font-bold text-[#AAA] uppercase tracking-wider mb-1">{l}</div><div className="text-[13px] text-[#333] break-words">{v}</div></div>))}
          </div>
          {[['Skills', sel.skills], ['Cover note', sel.cover]].map(([l, v]) => v ? <div key={l} className="mb-3"><div className="text-[10px] font-bold text-[#AAA] uppercase tracking-wider mb-1">{l}</div><div className="text-[13px] text-[#333] leading-relaxed bg-[#F8F8F8] p-3 rounded-[6px]">{v}</div></div> : null)}
          <div className="text-[12px] text-[#777]">📎 CV: {sel.cvFileName}{sel.cvFileName !== 'Not uploaded' && <span className="text-[#AAA]"> — file name only; storing the file itself needs a backend</span>}</div>
          {sel.hrStatus === 'Shortlisted' && <div className="mt-3 text-[12.5px] text-[#166534] bg-[#F0FDF4] rounded-[6px] p-2.5 flex items-center gap-3"><span className="flex-1">Added to the candidate list under Vacancies. Schedule the interview from the Interviews page.</span><Button size="sm" variant="outline" onClick={() => navigator.clipboard?.writeText(`Dear ${sel.name.split(' ')[0]}, thank you for applying for ${vacName(sel.vacId)} at Arete Model School. You have been shortlisted — we will contact you shortly with interview details. — HR, Arete Model School`)}>📋 Copy invite message</Button></div>}
        </Modal>)}
    </div>
  );
}
