import { PageHeader } from '../../components/Layout';
import Collapsible from '../../components/ui/Collapsible';
import Badge from '../../components/ui/Badge';

const ANNOUNCEMENTS = [
  { title:'📋 Mid-term Progress Reports Due', msg:'All class teachers must submit mid-term progress remarks for their assigned classes by Friday 1 November 2026. Use the SMS Reports module.', sent:'28 Oct', to:'All Teaching Staff', urgent:true },
  { title:'📅 Parent-Teacher Meeting — 8 Nov', msg:'PT Meeting scheduled for Saturday 8 November 2026, 9 AM – 1 PM. All teachers must be present for their classes. Seating plan to be shared by 3 Nov.', sent:'25 Oct', to:'All Staff', urgent:false },
  { title:'🎓 NEP Training Follow-up Session', msg:'HR has scheduled a follow-up session on Competency Based Education (NEP 2020). Date: 10 November 2026, Full day. Attendance mandatory for all teaching staff.', sent:'22 Oct', to:'Teaching Staff', urgent:false },
  { title:'🏖 Diwali Holiday', msg:'School closed 31 Oct – 4 Nov 2026. Classes resume Monday 5 November. Teachers are requested to set holiday revision work before leaving.', sent:'20 Oct', to:'All families & Staff', urgent:false },
  { title:'📢 Science Fair Registration Open', msg:'Students from Grades 6–10 can register for the Annual Science Fair. Deadline: 15 November. Supervising teachers please encourage participation.', sent:'18 Oct', to:'Grades 6–10 Teachers', urgent:false },
];

export default function Alerts() {
  return (
    <div className="p-6">
      <PageHeader title="Alerts & Notices" subtitle="Announcements from Principal and HR" />
      <div className="space-y-2">
        {ANNOUNCEMENTS.map((a, i) => (
          <Collapsible key={i}
            header={
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex-1 min-w-0">
                  {a.urgent && <Badge variant="red" className="mb-1">Urgent</Badge>}
                  <div className="text-[13.5px] font-bold text-[#111] truncate">{a.title}</div>
                  <div className="text-[11px] text-[#AAA] mt-0.5">{a.sent} · To: {a.to}</div>
                </div>
              </div>
            }
            className={`${a.urgent ? 'border-l-[3px] border-l-[#DC2626]' : 'border-l-[3px] border-l-[#C8202E]'}`}
          >
            <div className="px-4 py-3 border-t border-[#E4E4E4] text-[13px] text-[#555] leading-relaxed">
              {a.msg}
            </div>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}
