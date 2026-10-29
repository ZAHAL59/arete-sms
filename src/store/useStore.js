import { create } from 'zustand';
import { loadDB, saveDB } from '../data/db';

const useStore = create((set, get) => ({
  db: loadDB(),

  // Generic update + persist
  update: (fn) => {
    const db = fn(get().db);
    saveDB(db);
    set({ db });
  },

  // Attendance
  markAttendance: (cls, date, studentId, status) =>
    get().update(db => {
      const key = cls.replace(/\s+/g,'') + '-' + date;
      if (!db.attendance[key]) db.attendance[key] = {};
      db.attendance[key][studentId] = status;
      return { ...db };
    }),

  saveAttendanceLog: (cls, date, log) =>
    get().update(db => {
      const key = cls.replace(/\s+/g,'') + '-' + date;
      db.attendance[key] = log;
      return { ...db };
    }),

  // Session logs
  addSessionLog: (log) =>
    get().update(db => ({ ...db, sessionLogs: [log, ...db.sessionLogs] })),

  // Notes
  addNote: (note) =>
    get().update(db => ({ ...db, notes: [note, ...db.notes] })),

  deleteNote: (id) =>
    get().update(db => ({ ...db, notes: db.notes.filter(n => n.id !== id) })),
}));

export default useStore;
