import { useState } from 'react';
export default function Collapsible({ header, children, defaultOpen = false, className = '' }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`bg-white border border-[#E4E4E4] rounded-[10px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,.07)] mb-2 ${className}`}>
      <div
        className="flex items-center px-4 py-3 border-b border-[#E4E4E4] bg-[#F8F8F8] cursor-pointer select-none hover:bg-[#F2F2F2]"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex-1">{header}</div>
        <span className={`text-[11px] text-[#CCC] ml-2 transition-transform duration-200 ${open ? '' : '-rotate-90'}`}>▾</span>
      </div>
      {open && <div>{children}</div>}
    </div>
  );
}
