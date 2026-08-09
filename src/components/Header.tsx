import React from 'react';
import { AppView, UIStrings, LanguageCode } from '../types';
import { TRANSLATIONS } from '../data/translations';
import {
  Atom,
  Flame,
  Award,
  BookOpen,
  Users,
  Trophy,
  Settings,
  Activity,
  Globe,
  Wifi,
  CloudCheck,
} from 'lucide-react';

interface Props {
  currentView: AppView;
  onSelectView: (view: AppView) => void;
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  xpPoints: number;
  streakDays: number;
}

export const Header: React.FC<Props> = ({
  currentView,
  onSelectView,
  language,
  onLanguageChange,
  xpPoints,
  streakDays,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const navItems: { id: AppView; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'balancer', label: t.balancerTab, icon: Atom },
    { id: 'kinetic', label: t.kineticTab, icon: Activity },
    { id: 'practice', label: t.practiceTab, icon: BookOpen },
    { id: 'teacher', label: t.teacherTab, icon: Users },
    { id: 'leaderboard', label: t.leaderboardTab, icon: Trophy },
    { id: 'profile', label: t.profileTab, icon: Settings },
  ];

  return (
    <header className="bg-[#08090C] border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo & Title */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectView('balancer')}>
          <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center font-bold text-black shadow-[0_0_15px_rgba(56,189,248,0.4)]">
            <Atom className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-100 flex items-center gap-1.5">
              <span>CHEM-SIM</span>
              <span className="text-sky-400">ULTRA</span>
            </h1>
            <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-mono bg-slate-900 border border-slate-700 text-slate-400 uppercase tracking-widest">
              Simulation Mode v4.2
            </span>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <nav className="flex items-center bg-[#050608] p-1 rounded-xl border border-slate-800 overflow-x-auto max-w-full custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentView === item.id;

            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => onSelectView(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  active
                    ? 'bg-sky-500 text-black shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Stats & Localizations */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="flex items-center bg-[#050608] px-2 py-1 rounded-lg border border-slate-800 text-xs">
            <Globe className="w-3.5 h-3.5 text-sky-400 mr-1" />
            <select
              id="header-lang-selector"
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
              className="bg-transparent text-slate-200 text-xs font-mono font-semibold focus:outline-none cursor-pointer"
            >
              <option value="en">EN</option>
              <option value="es">ES</option>
              <option value="fr">FR</option>
              <option value="de">DE</option>
              <option value="zh">ZH</option>
              <option value="ja">JA</option>
              <option value="pt">PT</option>
            </select>
          </div>

          {/* Gamification Badges */}
          <div className="flex items-center gap-1 bg-amber-950/60 border border-amber-800/50 px-2 py-1 rounded-lg text-amber-300 font-mono font-bold text-xs">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{streakDays}d</span>
          </div>

          <div className="flex items-center gap-1 bg-sky-950/60 border border-sky-800/50 px-2 py-1 rounded-lg text-sky-300 font-mono font-bold text-xs">
            <Award className="w-3.5 h-3.5 text-sky-400" />
            <span>{xpPoints} XP</span>
          </div>
        </div>
      </div>
    </header>
  );
};
