import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TeacherPortal from './pages/teacher/TeacherPortal';
import './index.css';

function ComingSoon({ name, icon }) {
  return (
    <div className="flex items-center justify-center h-screen bg-[#F8F8F8] flex-col gap-3">
      <div className="text-[48px]">{icon}</div>
      <div className="text-[18px] font-bold text-[#111]">{name}</div>
      <div className="text-[13px] text-[#AAA]">Portal coming soon</div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/teacher" element={<TeacherPortal />} />
        <Route path="/"        element={<ComingSoon name="Principal Dashboard" icon="🏛" />} />
        <Route path="/admissions" element={<ComingSoon name="Admissions" icon="🎓" />} />
        <Route path="/hr"      element={<ComingSoon name="HR & Staff" icon="👥" />} />
        <Route path="/finance" element={<ComingSoon name="Finance & Payroll" icon="₹" />} />
        <Route path="/hostel"  element={<ComingSoon name="Hostel" icon="🏠" />} />
        <Route path="/transport" element={<ComingSoon name="Transport" icon="🚌" />} />
        <Route path="/campus"  element={<ComingSoon name="Campus" icon="🏫" />} />
        <Route path="/careers" element={<ComingSoon name="Careers" icon="📋" />} />
      </Routes>
    </BrowserRouter>
  );
}
