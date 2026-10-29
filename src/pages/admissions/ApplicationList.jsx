import { useState } from 'react';
import { ADMISSIONS_SEED, ADM_STAGES } from '../../data/db';
import { PageHeader } from '../../components/Layout';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Collapsible from '../../components/ui/Collapsible';

const STAGE_COLOR = { Enquiry:'grey',Application:'blue',Assessment:'amber',Interview:'purple',Offer:'green',Enrolled:'green',Rejected:'red' };
const DOC_LABELS = { birth:'Birth Certificate', transfer:'Transfer Certificate', photo:'Photograph', medical:'Medical Records' };

function ApplicationDetail({ app, onClose }) {
  const docsComplete = Object.values(app.docs).filter(Boolean).length;
  return (
    <Modal open onClose={onClose} title={app.name} subtitle={`${app.grade} · Applied ${app.date}`} size="lg"
      footer={<><Button variant="outline" onClick={onClose}>Close</Button><Button>Advance Stage →</Button></>}
    >
      {/* Stage progress */}
      <div className="flex items-center gap-1 mb-5 overflow-x-auto pb-1">
        {ADM_STAGES.filter(s => s !== 'Rejected').map((s, i) => {
          const idx = ADM_STAGES.indexOf(app.stage);
          const sIdx = ADM_STAGES.indexOf(s);
          const done = sIdx < idx, active = s === app.stage;
          return (
            <div key={s} className="flex items-center gap-1 flex-shrink-0">
              <div className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold whitespace-nowrap
                ${active ? 'bg-[#C8202E] text-white' : done ? 'bg-[#F0FDF4] text-[#166534]' : 'bg-[#F2F2F2] text-[#AAA]'}`}>
                {done ? '✓ ' : ''}{s}
              </div>
              {i < ADM_STAGES.filter(s => s !== 'Rejected').length-1 && <div className={`w-4 h-px ${done ? 'bg-[#166534]' : 'bg-[#E4E4E4]'}`}/>}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {[['Parent', app.parentName],['Phone', app.parentPhone],['Email', app.email],['Address', app.address],
          ['Grade', app.grade],['Boarding', app.boarding?'Yes':'No'],['Diet', app.diet],['Bus Route', app.busRoute||'Own']
        ].map(([l,v]) => (
          <div key={l} className="bg-[#F8F8F8] p-2.5 rounded-[6px]">
            <div className="text-[10px] font-bold text-[#AAA] uppercase tracking-wider mb-1">{l}</div>
            <div className="text-[13px] text-[#333]">{v}</div>
          </div>
        ))}
      </div>

      {/* Documents checklist */}
      <Collapsible defaultOpen header={
        <div className="flex items-center gap-2">
          <span className="text-[13.5px] font-bold text-[#111]">Documents</span>
          <span className={`text-[11px] font-semibold ${docsComplete === 4 ? 'text-[#166534]' : 'text-[#B45309]'}`}>{docsComplete}/4 complete</span>
        </div>
      }>
        <div className="grid grid-cols-2 gap-2 p-3 border-t border-[#E4E4E4]">
          {Object.entries(app.docs).map(([key, val]) => (
            <div key={key} className={`flex items-center gap-2 p-2.5 rounded-[6px] ${val ? 'bg-[#F0FDF4]' : 'bg-[#FFF5F5]'}`}>
              <span className="text-[16px]">{val ? '✅' : '📄'}</span>
              <div>
                <div className="text-[12px] font-semibold text-[#111]">{DOC_LABELS[key]}</div>
                <div className={`text-[10.5px] font-medium ${val ? 'text-[#166534]' : 'text-[#C8202E]'}`}>{val ? 'Received' : 'Pending'}</div>
              </div>
            </div>
          ))}
        </div>
      </Collapsible>

      {app.notes && (
        <div className="mt-3 bg-[#FFFBEB] border border-[#FEF08A] rounded-[6px] p-3 text-[13px] text-[#B45309]">📝 {app.notes}</div>
      )}
    </Modal>
  );
}

export default function ApplicationList() {
  const [stage, setStage] = useState('');
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(null);

  const filtered = ADMISSIONS_SEED.filter(a =>
    (!stage || a.stage === stage) &&
    (!q || a.name.toLowerCase().includes(q.toLowerCase()) || a.grade.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="p-6">
      <PageHeader title="All Applications" subtitle={`${ADMISSIONS_SEED.length} total · ${filtered.length} showing`}
        actions={
          <div className="flex gap-2 flex-wrap">
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search name or grade..."
              className="px-2.5 py-1.5 border border-[#E4E4E4] rounded-[6px] text-[12.5px] outline-none focus:border-[#C8202E] w-44"/>
            <select value={stage} onChange={e=>setStage(e.target.value)}
              className="px-2.5 py-1.5 border border-[#E4E4E4] rounded-[6px] text-[12.5px] outline-none focus:border-[#C8202E]">
              <option value="">All Stages</option>
              {ADM_STAGES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        }
      />

      <div className="bg-white border border-[#E4E4E4] rounded-[10px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,.07)]">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>{['Applicant','Grade','Parent','Phone','Stage','Docs','Date',''].map(h =>
              <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold text-[#AAA] uppercase tracking-wider border-b border-[#E4E4E4] bg-[#F8F8F8]">{h}</th>
            )}</tr>
          </thead>
          <tbody>
            {!filtered.length
              ? <tr><td colSpan={8} className="text-center py-12 text-[#AAA]">No applications found</td></tr>
              : filtered.map(a => {
                  const dc = Object.values(a.docs).filter(Boolean).length;
                  const dt = Object.keys(a.docs).length;
                  return (
                    <tr key={a.id} className="border-b border-[#E4E4E4] last:border-b-0 hover:bg-[#F8F8F8] cursor-pointer" onClick={() => setSel(a)}>
                      <td className="px-4 py-2.5 font-semibold text-[#111]">{a.name}</td>
                      <td className="px-4 py-2.5 text-[#555]">{a.grade}</td>
                      <td className="px-4 py-2.5 text-[#555]">{a.parentName}</td>
                      <td className="px-4 py-2.5 font-mono text-[11.5px] text-[#555]">{a.parentPhone}</td>
                      <td className="px-4 py-2.5"><Badge variant={STAGE_COLOR[a.stage]}>{a.stage}</Badge></td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <div className="h-1.5 bg-[#E4E4E4] rounded-full w-14 overflow-hidden">
                            <div className="h-full bg-[#C8202E] rounded-full" style={{width:`${dc/dt*100}%`}}/>
                          </div>
                          <span className="text-[11px] text-[#AAA]">{dc}/{dt}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-[#AAA] text-[11.5px]">{a.date}</td>
                      <td className="px-4 py-2.5"><button className="text-[11px] font-semibold text-[#C8202E] underline">Open</button></td>
                    </tr>
                  );
                })
            }
          </tbody>
        </table>
      </div>

      {sel && <ApplicationDetail app={sel} onClose={() => setSel(null)} />}
    </div>
  );
}
