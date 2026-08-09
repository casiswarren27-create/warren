import React, { useState } from 'react';
import { UIStrings, StudentRecord } from '../types';
import {
  Users,
  Download,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  TrendingUp,
  GraduationCap,
  Share2,
  Calendar,
  Send,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface Props {
  t: UIStrings;
}

const INITIAL_STUDENTS: StudentRecord[] = [
  {
    id: 's-101',
    name: 'Alex Rivera',
    email: 'arivera@school.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
    equationsSolved: 28,
    accuracyRate: 94,
    avgTimePerEquationSec: 42,
    xpPoints: 1250,
    currentStreak: 6,
    badgeLevel: 'Master Alchemist',
    lastActive: '10 mins ago',
    classGroup: 'AP Chemistry Period 2',
  },
  {
    id: 's-102',
    name: 'Chloe Zhang',
    email: 'czhang@school.edu',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=120',
    equationsSolved: 24,
    accuracyRate: 91,
    avgTimePerEquationSec: 48,
    xpPoints: 1100,
    currentStreak: 4,
    badgeLevel: 'Gold Stoichiometrist',
    lastActive: '1 hour ago',
    classGroup: 'AP Chemistry Period 2',
  },
  {
    id: 's-103',
    name: 'Marcus Johnson',
    email: 'mjohnson@school.edu',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    equationsSolved: 19,
    accuracyRate: 85,
    avgTimePerEquationSec: 55,
    xpPoints: 850,
    currentStreak: 3,
    badgeLevel: 'Silver Balancer',
    lastActive: '3 hours ago',
    classGroup: 'Honors Chem Period 4',
  },
  {
    id: 's-104',
    name: 'Sophia Patel',
    email: 'spatel@school.edu',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    equationsSolved: 15,
    accuracyRate: 78,
    avgTimePerEquationSec: 64,
    xpPoints: 620,
    currentStreak: 2,
    badgeLevel: 'Bronze Chemist',
    lastActive: 'Yesterday',
    classGroup: 'Honors Chem Period 4',
  },
];

export const TeacherDashboard: React.FC<Props> = ({ t }) => {
  const [students, setStudents] = useState<StudentRecord[]>(INITIAL_STUDENTS);
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [lmsSyncStatus, setLmsSyncStatus] = useState<string | null>(null);

  const filteredStudents = students.filter((s) => {
    if (selectedClass === 'All') return true;
    return s.classGroup === selectedClass;
  });

  // Calculate classroom analytics metrics
  const avgAccuracy = Math.round(
    filteredStudents.reduce((acc, s) => acc + s.accuracyRate, 0) / (filteredStudents.length || 1)
  );
  const totalSolved = filteredStudents.reduce((acc, s) => acc + s.equationsSolved, 0);
  const avgTime = Math.round(
    filteredStudents.reduce((acc, s) => acc + s.avgTimePerEquationSec, 0) / (filteredStudents.length || 1)
  );

  // Export CSV functionality
  const handleExportCsv = () => {
    const headers = ['Student ID', 'Name', 'Email', 'Class', 'Equations Solved', 'Accuracy %', 'Avg Time (s)', 'XP', 'Streak', 'Badge'];
    const rows = filteredStudents.map((s) => [
      s.id,
      `"${s.name}"`,
      s.email,
      `"${s.classGroup}"`,
      s.equationsSolved,
      `${s.accuracyRate}%`,
      s.avgTimePerEquationSec,
      s.xpPoints,
      s.currentStreak,
      s.badgeLevel,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ChemBalance_Gradebook_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // LMS Sync simulation
  const handleLmsSync = (lmsName: string) => {
    setLmsSyncStatus(`Syncing with ${lmsName}...`);
    setTimeout(() => {
      setLmsSyncStatus(`Successfully synced gradebook with ${lmsName}! (4 records exported)`);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Teacher Header */}
      <div className="bg-[#08090C] rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="w-5 h-5 text-sky-400" />
            <h2 className="text-xl font-bold text-slate-100 tracking-wide">{t.teacherDashboard}</h2>
          </div>
          <p className="text-xs text-slate-400">
            Real-time classroom performance analytics, student mastery breakdown, and automated LMS gradebook synchronization.
          </p>
        </div>

        {/* Export and LMS Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="export-csv-btn"
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl text-xs font-bold shadow-md transition active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            id="sync-canvas-lms-btn"
            onClick={() => handleLmsSync('Canvas LMS')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-500 hover:bg-sky-400 text-black rounded-xl text-xs font-bold shadow-md transition active:scale-95"
          >
            <Share2 className="w-4 h-4" />
            <span>Sync Canvas LMS</span>
          </button>
        </div>
      </div>

      {lmsSyncStatus && (
        <div className="p-3 bg-sky-950/60 border border-sky-800/80 text-sky-200 text-xs font-mono font-semibold rounded-xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{lmsSyncStatus}</span>
        </div>
      )}

      {/* Classroom High-Level Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#08090C] p-4 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-sky-950/80 border border-sky-800/80 flex items-center justify-center text-sky-400 font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-mono uppercase font-semibold">Active Students</div>
            <div className="text-2xl font-mono font-black text-slate-100">{filteredStudents.length}</div>
          </div>
        </div>

        <div className="bg-[#08090C] p-4 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-950/80 border border-emerald-800/80 flex items-center justify-center text-emerald-400 font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-mono uppercase font-semibold">Class Mastery Rate</div>
            <div className="text-2xl font-mono font-black text-emerald-400">{avgAccuracy}%</div>
          </div>
        </div>

        <div className="bg-[#08090C] p-4 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-950/80 border border-amber-800/80 flex items-center justify-center text-amber-400 font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-mono uppercase font-semibold">Equations Solved</div>
            <div className="text-2xl font-mono font-black text-amber-400">{totalSolved}</div>
          </div>
        </div>

        <div className="bg-[#08090C] p-4 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-purple-950/80 border border-purple-800/80 flex items-center justify-center text-purple-400 font-bold">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-mono uppercase font-semibold">Avg Time / Eq</div>
            <div className="text-2xl font-mono font-black text-purple-300">{avgTime}s</div>
          </div>
        </div>
      </div>

      {/* Class Group Filter & Roster Table */}
      <div className="bg-[#08090C] rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <h3 className="font-bold text-slate-100 text-base">Individual Student Roster & Performance Log</h3>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Class Period:</span>
            <select
              id="select-class-group"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-[#050608] text-slate-200 text-xs font-mono font-bold border border-slate-700 rounded-xl px-3 py-1.5 focus:outline-none"
            >
              <option value="All">All Classes</option>
              <option value="AP Chemistry Period 2">AP Chemistry Period 2</option>
              <option value="Honors Chem Period 4">Honors Chem Period 4</option>
            </select>
          </div>
        </div>

        {/* Student Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-[10px] font-mono uppercase bg-[#050608] text-slate-400 border-b border-slate-800 font-bold">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Class Group</th>
                <th className="py-3 px-4">Solved</th>
                <th className="py-3 px-4">Accuracy Rate</th>
                <th className="py-3 px-4">Avg Speed</th>
                <th className="py-3 px-4">XP Points</th>
                <th className="py-3 px-4">Mastery Badge</th>
                <th className="py-3 px-4">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-medium">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img src={s.avatar} alt={s.name} className="w-8 h-8 rounded-full object-cover border border-slate-700" />
                    <div>
                      <div className="font-bold text-slate-100 text-xs">{s.name}</div>
                      <div className="text-[10px] font-mono text-slate-500">{s.email}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{s.classGroup}</td>
                  <td className="py-3 px-4 font-mono font-bold text-sky-400">{s.equationsSolved}</td>
                  <td className="py-3 px-4 font-mono">
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                        s.accuracyRate >= 90
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : s.accuracyRate >= 80
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-red-950 text-red-400 border border-red-800'
                      }`}
                    >
                      {s.accuracyRate}%
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">{s.avgTimePerEquationSec}s</td>
                  <td className="py-3 px-4 font-mono text-sky-400 font-bold">{s.xpPoints} XP</td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#050608] text-amber-300 border border-slate-800 text-[10px] font-mono font-bold">
                      {s.badgeLevel}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-[11px] font-mono">{s.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
