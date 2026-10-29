import { useState } from 'react';
import { PageHeader } from '../../components/Layout';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Collapsible from '../../components/ui/Collapsible';
import { CAND_STATUS_VARIANT } from './constants';

export default function Vacancies({ hr, addVacancy, addCandidate, updateCandidate }) {
  const [newOpen, setNewOpen] = useState(false);
  const [selVac, setSelVac] = useState(null);
  const [newCandOpen, setNewCandOpen] = useState(null); // vacId
  const [form, setForm] = useState({subj:'',dept:'Secondary',qual:'',exp:'',skills:'',count:1,deadline:'',priority:'Normal'});
  const [candForm, setCandForm] = useState({name:'',qual:'',exp:'',contact:'',score:'',notes:''});

  const activeVacs = hr.vacancies.filter(v => v.status==='Active');
  const totalCands = hr.candidates.length;
  const shortlisted = hr.candidates.filter(c => c.status==='Shortlisted').length;
  const recommended = hr.candidates.filter(c => c.status==='Recommended').length;

  function saveVac() {
    if (!form.subj) return;
    addVacancy(form);
    setNewOpen(false);
    setForm({subj:'',dept:'Secondary',qual:'',exp:'',skills:'',count:1,deadline:'',priority:'Normal'});
  }

  function saveCand() {
    if (!candForm.name.trim() || !newCandOpen) return;
    addCandidate({ ...candForm, name: candForm.name.trim(), vacId: newCandOpen, score: Math.min(100, parseInt(candForm.score) || 0) });
    setCandForm({name:'',qual:'',exp:'',contact:'',score:'',notes:''});
    setNewCandOpen(null);
  }

  return (
    <div className="p-6">
      <PageHeader title="Vacancies & Recruitment" subtitle={`${activeVacs.length} open positions`}
        actions={<Button onClick={()=>setNewOpen(true)}>+ Post Vacancy</Button>}
      />

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          {label:'Open Vacancies', value:activeVacs.length, color:'#C8202E'},
          {label:'Total Applicants',value:totalCands,       color:'#1A5FB4'},
          {label:'Shortlisted',    value:shortlisted,       color:'#B45309'},
          {label:'Recommended',    value:recommended,       color:'#166534'},
        ].map(k=>(
          <div key={k.label} className="bg-white border border-[#E4E4E4] rounded-[10px] p-3.5 shadow-[0_1px_4px_rgba(0,0,0,.07)]"
            style={{borderLeft:`3px solid ${k.color}`}}>
            <div className="text-[10.5px] font-semibold text-[#AAA] uppercase tracking-wider mb-1">{k.label}</div>
            <div className="text-[24px] font-extrabold" style={{color:k.color}}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Vacancy cards */}
      {hr.vacancies.map(v => {
        const cands = hr.candidates.filter(c => c.vacId===v.id);
        return (
          <Collapsible key={v.id} defaultOpen className="mb-3"
            header={
              <div className="flex items-center gap-3 flex-1">
                <div>
                  <div className="text-[13.5px] font-bold text-[#111]">{v.subj} Teacher</div>
                  <div className="text-[11.5px] text-[#777] mt-0.5">{v.qual} · {v.exp} · Deadline: {v.deadline}</div>
                </div>
                <div className="ml-auto flex gap-2 items-center">
                  <Badge variant={v.priority==='Urgent'?'red':'grey'}>{v.priority}</Badge>
                  <Badge variant={v.status==='Active'?'green':'grey'}>{v.status}</Badge>
                  <Badge variant="blue">{cands.length} candidates</Badge>
                  <Button size="sm" variant="outline" onClick={e=>{e.stopPropagation();setNewCandOpen(v.id);}}>+ Add CV</Button>
                </div>
              </div>
            }
          >
            <table className="w-full border-collapse text-[13px] border-t border-[#E4E4E4]">
              <thead><tr>{['Candidate','Qualification','Experience','Score','Status','Notes',''].map(h=>
                <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold text-[#AAA] uppercase tracking-wider border-b border-[#E4E4E4] bg-[#F8F8F8]">{h}</th>
              )}</tr></thead>
              <tbody>
                {!cands.length
                  ? <tr><td colSpan={7} className="text-center py-8 text-[#AAA]">No candidates yet — add a CV above</td></tr>
                  : cands.map(c=>(
                    <tr key={c.id} className="border-b border-[#E4E4E4] last:border-b-0 hover:bg-[#F8F8F8]">
                      <td className="px-4 py-2.5 font-semibold text-[#111]">{c.name}</td>
                      <td className="px-4 py-2.5 text-[#555]">{c.qual}</td>
                      <td className="px-4 py-2.5 text-[#555]">{c.exp}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 bg-[#E4E4E4] rounded-full w-12 overflow-hidden">
                            <div className="h-full rounded-full" style={{width:`${c.score}%`,background:c.score>=80?'#166534':c.score>=60?'#B45309':'#DC2626'}}/>
                          </div>
                          <span className="font-bold text-[#111]">{c.score}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5"><Badge variant={CAND_STATUS_VARIANT[c.status]||'grey'}>{c.status}</Badge></td>
                      <td className="px-4 py-2.5 text-[#555] text-[12px] max-w-[160px] truncate">{c.notes}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex gap-1">
                          {c.status!=='Recommended'&&c.status!=='Rejected'&&
                            <button onClick={()=>updateCandidate(c.id,{status:'Recommended'})}
                              className="text-[10.5px] font-semibold text-[#166534] underline cursor-pointer bg-none border-none">Recommend</button>}
                          {c.status!=='Rejected'&&
                            <button onClick={()=>updateCandidate(c.id,{status:'Rejected'})}
                              className="text-[10.5px] font-semibold text-[#DC2626] underline cursor-pointer bg-none border-none ml-1">Reject</button>}
                        </div>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </Collapsible>
        );
      })}

      {/* New Vacancy Modal */}
      <Modal open={newOpen} onClose={()=>setNewOpen(false)} title="Post New Vacancy"
        footer={<><Button variant="outline" onClick={()=>setNewOpen(false)}>Cancel</Button><Button onClick={saveVac}>Post Vacancy</Button></>}
      >
        <div className="grid grid-cols-2 gap-3">
          {[['Subject *','subj'],['Department','dept'],['Qualification','qual'],['Experience','exp'],['Skills Required','skills']].map(([l,k])=>(
            <div key={k} className={k==='skills'?'col-span-2':''}>
              <label className="block text-[11.5px] font-semibold text-[#333] mb-1.5">{l}</label>
              <input value={form[k]||''} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))}
                className="w-full px-2.5 py-2 border-[1.5px] border-[#E4E4E4] rounded-[6px] text-[13px] outline-none focus:border-[#C8202E]"/>
            </div>
          ))}
          <div>
            <label className="block text-[11.5px] font-semibold text-[#333] mb-1.5">Deadline</label>
            <input type="date" value={form.deadline} onChange={e=>setForm(f=>({...f,deadline:e.target.value}))}
              className="w-full px-2.5 py-2 border-[1.5px] border-[#E4E4E4] rounded-[6px] text-[13px] outline-none focus:border-[#C8202E]"/>
          </div>
          <div>
            <label className="block text-[11.5px] font-semibold text-[#333] mb-1.5">Priority</label>
            <select value={form.priority} onChange={e=>setForm(f=>({...f,priority:e.target.value}))}
              className="w-full px-2.5 py-2 border-[1.5px] border-[#E4E4E4] rounded-[6px] text-[13px] outline-none focus:border-[#C8202E]">
              <option>Normal</option><option>Urgent</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Add CV Modal */}
      <Modal open={!!newCandOpen} onClose={()=>setNewCandOpen(null)} title="Add Candidate CV"
        subtitle={newCandOpen ? `For: ${hr.vacancies.find(v=>v.id===newCandOpen)?.subj} Teacher` : ''}
        footer={<><Button variant="outline" onClick={()=>setNewCandOpen(null)}>Cancel</Button>
          <Button onClick={saveCand}>Add Candidate</Button></>}
      >
        <div className="grid grid-cols-2 gap-3">
          {[['Name *','name'],['Qualification','qual'],['Experience','exp'],['Phone / Email','contact'],['Score (0-100)','score']].map(([l,k])=>(
            <div key={k}>
              <label className="block text-[11.5px] font-semibold text-[#333] mb-1.5">{l}</label>
              <input value={candForm[k]||''} onChange={e=>setCandForm(f=>({...f,[k]:e.target.value}))}
                className="w-full px-2.5 py-2 border-[1.5px] border-[#E4E4E4] rounded-[6px] text-[13px] outline-none focus:border-[#C8202E]"/>
            </div>
          ))}
          <div className="col-span-2">
            <label className="block text-[11.5px] font-semibold text-[#333] mb-1.5">Initial Notes</label>
            <textarea value={candForm.notes||''} onChange={e=>setCandForm(f=>({...f,notes:e.target.value}))} rows={2}
              className="w-full px-2.5 py-2 border-[1.5px] border-[#E4E4E4] rounded-[6px] text-[13px] outline-none focus:border-[#C8202E] resize-none font-[inherit]"/>
          </div>
        </div>
      </Modal>
    </div>
  );
}
