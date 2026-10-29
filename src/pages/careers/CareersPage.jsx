import { useState } from 'react';
import { HR_SEED } from '../../data/db';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

export default function CareersPage() {
  const [sel, setSel] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({name:'',phone:'',email:'',exp:'',note:''});

  function submit() {
    if(!form.name||!form.phone||!form.email) return;
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#C8202E] to-[#9A1822] px-8 py-12 text-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-[12px] font-bold uppercase tracking-widest text-white/60 mb-3">Arete Model School</div>
          <h1 className="text-[36px] font-extrabold tracking-tight mb-3">Join Our Team</h1>
          <p className="text-[15px] text-white/70 leading-relaxed max-w-xl">
            We are looking for passionate educators to be part of Arete's next-generation learning environment.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-10">
        <h2 className="text-[18px] font-bold text-[#111] mb-4">Open Positions</h2>
        <div className="space-y-3">
          {HR_SEED.vacancies.map(v => (
            <div key={v.id} className="bg-white border border-[#E4E4E4] rounded-[12px] p-5 shadow-[0_1px_4px_rgba(0,0,0,.07)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[16px] font-bold text-[#111] mb-1">{v.subj} Teacher</div>
                  <div className="text-[13px] text-[#777] mb-2">{v.qual} · {v.exp} experience</div>
                  <div className="flex gap-2">
                    <Badge variant="red2">Full Time</Badge>
                    <Badge variant="green">{v.status}</Badge>
                  </div>
                </div>
                <Button onClick={() => { setSel(v); setSubmitted(false); setForm({name:'',phone:'',email:'',exp:'',note:''}); }}>
                  Apply Now
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-white border border-[#E4E4E4] rounded-[12px] p-6 text-center">
          <div className="text-[20px] mb-2">📧</div>
          <div className="text-[14px] font-bold text-[#111] mb-1">Don't see your role?</div>
          <div className="text-[13px] text-[#777]">Send your CV to <a href="mailto:careers@aretemodel.edu" className="text-[#C8202E] font-semibold">careers@aretemodel.edu</a></div>
        </div>
      </div>

      {/* Apply modal */}
      <Modal open={!!sel} onClose={() => setSel(null)}
        title={`Apply — ${sel?.subj} Teacher`}
        subtitle="Your application goes directly to our HR team"
        footer={!submitted && <><Button variant="outline" onClick={() => setSel(null)}>Cancel</Button><Button onClick={submit}>Submit Application</Button></>}
      >
        {submitted
          ? <div className="text-center py-6">
              <div className="text-[40px] mb-3">🎉</div>
              <div className="text-[16px] font-bold text-[#111] mb-2">Application Submitted!</div>
              <div className="text-[13px] text-[#777]">Thank you {form.name}. Our HR team will contact you within 3–5 working days.</div>
            </div>
          : <div className="space-y-3">
              {[['Full Name *','name','text'],['Phone *','phone','tel'],['Email *','email','email'],['Years of Experience','exp','text']].map(([label,key,type]) => (
                <div key={key}>
                  <label className="block text-[11.5px] font-semibold text-[#333] mb-1.5">{label}</label>
                  <input type={type} value={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))}
                    className="w-full px-2.5 py-2 border-[1.5px] border-[#E4E4E4] rounded-[6px] text-[13px] outline-none focus:border-[#C8202E] focus:shadow-[0_0_0_3px_#FEF4F4]"/>
                </div>
              ))}
              <div>
                <label className="block text-[11.5px] font-semibold text-[#333] mb-1.5">Cover Note</label>
                <textarea value={form.note} onChange={e=>setForm(f=>({...f,note:e.target.value}))} rows={3}
                  className="w-full px-2.5 py-2 border-[1.5px] border-[#E4E4E4] rounded-[6px] text-[13px] outline-none focus:border-[#C8202E] focus:shadow-[0_0_0_3px_#FEF4F4] resize-y"
                  placeholder="Tell us about yourself..."/>
              </div>
            </div>
        }
      </Modal>
    </div>
  );
}
