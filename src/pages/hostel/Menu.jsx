import { useState } from 'react';
import { PageHeader } from '../../components/Layout';
import Button from '../../components/ui/Button';
import { DAYS } from './constants';
import { inputCls } from './ui';

const MEALS = [['B','🌅 Breakfast'],['L','☀️ Lunch'],['D','🌙 Dinner']];
const esc = t => String(t || '').replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
function printMenu(menu) {
  const th = 'border:1px solid #ccc;padding:8px;background:#eee;font-size:12px', td = 'border:1px solid #ccc;padding:8px;font-size:12px;vertical-align:top';
  const rows = MEALS.map(([k, l]) => `<tr><td style="${td};font-weight:700;background:#f5f5f5">${l.replace(/^\S+\s/, '')}</td>${DAYS.map(d => `<td style="${td}">${esc((menu[d] || {})[k])}</td>`).join('')}</tr>`).join('');
  const w = window.open('', '_blank', 'width=1000,height=700'); if (!w) return;
  w.document.write(`<!DOCTYPE html><html><head><title>Weekly Mess Menu</title></head><body style="font-family:Arial,sans-serif;padding:24px"><h2 style="margin-bottom:4px">Arete Model School — Hostel Mess Menu</h2><p style="color:#666;font-size:13px;margin-bottom:16px">Week of ${new Date().toDateString()}</p><table style="width:100%;border-collapse:collapse"><thead><tr><th style="${th}">Meal</th>${DAYS.map(d => `<th style="${th}">${d}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table><button onclick="window.print()" style="margin-top:20px;padding:8px 20px;background:#C8202E;color:#fff;border:none;border-radius:6px;cursor:pointer">Print</button></body></html>`);
  w.document.close();
}

export default function Menu({ h, saveMenu }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(h.menu);
  const today = new Date().toLocaleDateString('en-US', { weekday:'long' });

  function start() { setDraft(JSON.parse(JSON.stringify(h.menu))); setEditing(true); }
  function save() { saveMenu(draft); setEditing(false); }
  const set = (d, m, v) => setDraft(x => ({ ...x, [d]: { ...x[d], [m]: v } }));

  return (
    <div className="p-6">
      <PageHeader title="Weekly Menu" subtitle="Meal plan for boarders"
        actions={editing
          ? <><Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button><Button onClick={save}>Save Menu</Button></>
          : <><Button variant="outline" onClick={() => printMenu(h.menu)}>🖨 Print</Button><Button onClick={start}>✎ Edit Menu</Button></>} />
      <div className="space-y-2">
        {DAYS.map(d => {
          const isToday = d === today; const m = (editing ? draft : h.menu)[d] || {};
          return (
            <div key={d} className={`bg-white border rounded-[10px] overflow-hidden ${isToday ? 'border-[#C8202E] shadow-[0_4px_18px_rgba(200,32,46,.15)]' : 'border-[#E4E4E4]'}`}>
              <div className={`px-4 py-2.5 flex items-center gap-3 border-b border-[#E4E4E4] ${isToday ? 'bg-[#FEF4F4]' : 'bg-[#F8F8F8]'}`}>
                <span className={`text-[13px] font-bold ${isToday ? 'text-[#C8202E]' : 'text-[#111]'}`}>{d}</span>
                {isToday && <span className="text-[10px] font-bold bg-[#C8202E] text-white px-2 py-0.5 rounded-full">Today</span>}
              </div>
              <div className="grid grid-cols-3 divide-x divide-[#E4E4E4]">
                {MEALS.map(([k, label]) => (
                  <div key={k} className="px-4 py-3">
                    <div className="text-[10px] font-bold text-[#AAA] uppercase tracking-wider mb-1">{label}</div>
                    {editing
                      ? <textarea rows={3} value={m[k] || ''} onChange={e => set(d, k, e.target.value)} className={inputCls + ' resize-none text-[12px]'} />
                      : <div className="text-[13px] text-[#333] leading-relaxed">{m[k] || '—'}</div>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
