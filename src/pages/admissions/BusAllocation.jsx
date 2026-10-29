import useStore from '../../store/useStore';
import { PageHeader } from '../../components/Layout';
import Collapsible from '../../components/ui/Collapsible';
import Badge from '../../components/ui/Badge';

export default function BusAllocation() {
  const db = useStore(s => s.db);
  return (
    <div className="p-6">
      <PageHeader title="Bus Allocation" subtitle="Students assigned per route" />
      {db.routes.map(r => {
        const students = db.students.filter(s => s.busRoute === r.id && s.status === 'Active');
        const classes = [...new Set(students.map(s => s.cls))].sort().join(', ') || 'No students';
        return (
          <Collapsible key={r.id} className="mb-2"
            header={
              <div className="flex items-center gap-3 flex-1">
                <div className="w-9 h-9 rounded-[8px] bg-gradient-to-br from-[#C8202E] to-[#9A1822] text-white text-[16px] flex items-center justify-center flex-shrink-0">🚌</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-bold text-[#111]">{r.name}</div>
                  <div className="text-[11.5px] text-[#777] mt-0.5">{r.driver} · {r.dept} departure · {classes}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="grey">{students.length} student{students.length!==1?'s':''}</Badge>
                  <Badge variant="green">{r.status}</Badge>
                </div>
              </div>
            }
          >
            {!students.length
              ? <div className="p-4 text-center text-[#AAA] text-[13px] border-t border-[#E4E4E4]">No students on this route</div>
              : <table className="w-full border-collapse text-[13px] border-t border-[#E4E4E4]">
                  <thead>
                    <tr>{['Student','Class','Parent','Phone'].map(h =>
                      <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold text-[#AAA] uppercase tracking-wider border-b border-[#E4E4E4] bg-[#F8F8F8]">{h}</th>
                    )}</tr>
                  </thead>
                  <tbody>
                    {students.map(s => (
                      <tr key={s.id} className="border-b border-[#E4E4E4] last:border-b-0 hover:bg-[#F8F8F8]">
                        <td className="px-4 py-2.5 font-semibold text-[#111]">{s.name}</td>
                        <td className="px-4 py-2.5 text-[#555]">{s.cls} {s.section}</td>
                        <td className="px-4 py-2.5 text-[#555]">{s.parentName}</td>
                        <td className="px-4 py-2.5 font-mono text-[11.5px] text-[#555]">{s.parentPhone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            }
          </Collapsible>
        );
      })}
    </div>
  );
}
