export const SEED = {
  students: [
    {id:'S001',name:'Ananya Krishnan',dob:'2012-03-14',cls:'Grade 8',section:'A',roll:1,adm:'2024-06-01',learningStyle:'Visual',diet:'Vegetarian',health:'Mild asthma — inhaler with teacher',needs:'None',hobbies:'Drawing, Chess',langs:'Malayalam, English, Hindi',travel:'Bus',busRoute:'R001',boarding:false,parentName:'Krishnan P.',parentPhone:'+91 94470 11111',behav:'Social, confident, leadership qualities',expPref:'Outdoor projects, visual demonstrations',status:'Active'},
    {id:'S002',name:'Mohammed Ashiq',dob:'2013-07-22',cls:'Grade 7',section:'B',roll:2,adm:'2024-06-01',learningStyle:'Auditory',diet:'Non-Vegetarian',health:'None',needs:'None',hobbies:'Cricket, Reading',langs:'Malayalam, English',travel:'Bus',busRoute:'R002',boarding:false,parentName:'Ashiq K.',parentPhone:'+91 94471 22222',behav:'Reserved, focused',expPref:'Group discussions',status:'Active'},
    {id:'S003',name:'Devika Nair',dob:'2010-11-05',cls:'Grade 10',section:'A',roll:3,adm:'2022-06-01',learningStyle:'Kinaesthetic',diet:'Vegetarian',health:'None',needs:'None',hobbies:'Dance, Art, Swimming',langs:'Malayalam, English, Tamil',travel:'Bus',busRoute:'R001',boarding:true,parentName:'Nair R.',parentPhone:'+91 94472 33333',behav:'Creative, independent',expPref:'Hands-on lab',status:'Active'},
    {id:'S004',name:'Rahul P.',dob:'2011-05-18',cls:'Grade 9',section:'C',roll:4,adm:'2023-06-01',learningStyle:'Reading/Writing',diet:'Non-Vegetarian',health:'Under specialist support for dyslexia',needs:'Mild dyslexia — support plan active',hobbies:'Football, Music, Coding',langs:'Malayalam, English',travel:'Bus',busRoute:'R003',boarding:false,parentName:'Pradeep K.',parentPhone:'+91 94473 44444',behav:'Determined',expPref:'Audio content, visual aids',status:'Active'},
    {id:'S005',name:'Sreelakshmi K.',dob:'2014-02-28',cls:'Grade 6',section:'B',roll:5,adm:'2025-06-01',learningStyle:'Visual',diet:'Vegetarian',health:'None',needs:'None',hobbies:'Drawing, Gardening',langs:'Malayalam, English',travel:'Bus',busRoute:'R002',boarding:false,parentName:'Krishnan V.',parentPhone:'+91 94474 55555',behav:'Shy at first',expPref:'Nature-based activities',status:'Active'},
    {id:'S006',name:'Arjun Menon',dob:'2011-09-12',cls:'Grade 9',section:'A',roll:6,adm:'2023-06-01',learningStyle:'Kinaesthetic',diet:'Non-Vegetarian',health:'None',needs:'None',hobbies:'Football, Gaming',langs:'Malayalam, English',travel:'Bus',busRoute:'R001',boarding:true,parentName:'Menon A.',parentPhone:'+91 94475 66666',behav:'High energy',expPref:'Active projects',status:'Active'},
  ],
  staff: [
    {id:'T001',name:'Ms. Latha R.',  subj:'Mathematics',  joined:'2019-06-01',phone:'+91 94470 91001',salary:55000,status:'Active',classes:['Grade 6 B','Grade 7 B','Grade 8 A','Grade 9 A','Grade 10 A']},
    {id:'T002',name:'Ms. Divya K.',  subj:'Science',      joined:'2020-08-01',phone:'+91 94470 91002',salary:50000,status:'Active',classes:['Grade 6 A','Grade 7 A','Grade 8 B']},
    {id:'T003',name:'Mr. Paul T.',   subj:'English',      joined:'2018-06-01',phone:'+91 94470 91003',salary:58000,status:'Active',classes:['Grade 8 A','Grade 9 A','Grade 10 A']},
    {id:'T004',name:'Mr. Arun P.',   subj:'Social Studies',joined:'2021-06-01',phone:'+91 94470 91004',salary:48000,status:'Active',classes:['Grade 6 B','Grade 7 B']},
    {id:'T005',name:'Ms. Rani S.',   subj:'Malayalam',    joined:'2022-06-01',phone:'+91 94470 91005',salary:46000,status:'Active',classes:['Grade 6 A','Grade 7 A','Grade 8 A']},
  ],
  routes: [
    {id:'R001',name:'Route 1 — Koyilandy',  vehicle:'KL 11 AB 1234',driver:'Rajan P.',    phone:'+91 94470 12345',dept:'07:05',arr:'07:45',status:'Active'},
    {id:'R002',name:'Route 2 — Vatakara',   vehicle:'KL 11 CD 5678',driver:'Suresh Kumar',phone:'+91 94471 56789',dept:'07:15',arr:'07:55',status:'Active'},
    {id:'R003',name:'Route 3 — Peringathur',vehicle:'KL 11 EF 9012',driver:'Krishnan K.', phone:'+91 94472 98765',dept:'07:20',arr:'08:00',status:'Active'},
  ],
  payments: [
    {id:'RC-001',studentId:'S001',category:'Term Fee',  amount:24500,date:'2026-10-14',mode:'Online'},
    {id:'RC-002',studentId:'S002',category:'Term Fee',  amount:24500,date:'2026-10-13',mode:'Cash'},
    {id:'RC-003',studentId:'S003',category:'Hostel Fee',amount:3500, date:'2026-10-12',mode:'Online'},
    {id:'RC-004',studentId:'S004',category:'Term Fee',  amount:24500,date:'2026-10-11',mode:'Online'},
    {id:'RC-005',studentId:'S005',category:'Term Fee',  amount:22000,date:'2026-10-10',mode:'Cheque'},
  ],
  attendance: {},
  sessionLogs: [],
  notes: [],
};

const KEY = 'ARETE_DB_v1';
export const loadDB  = () => { try { const r=localStorage.getItem(KEY); if(r) return {...SEED,...JSON.parse(r)}; } catch{} return JSON.parse(JSON.stringify(SEED)); };
export const saveDB  = db => { try { localStorage.setItem(KEY,JSON.stringify(db)); } catch{} };
export const resetDB = () => { localStorage.removeItem(KEY); window.location.reload(); };
