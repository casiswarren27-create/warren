import React, { useState, useEffect } from 'react';
import { AppView, LanguageCode, UserProfile, ChemicalReaction } from './types';
import { TRANSLATIONS } from './data/translations';
import { Header } from './components/Header';
import { EquationBalancer } from './components/EquationBalancer';
import { KineticEnergySim } from './components/KineticEnergySim';
import { CurriculumPractice } from './components/CurriculumPractice';
import { TeacherDashboard } from './components/TeacherDashboard';
import { GamificationLeaderboard } from './components/GamificationLeaderboard';
import { ProfileSettings } from './components/ProfileSettings';
import { AITutorModal } from './components/AITutorModal';
import { Wifi, CloudCheck, Sparkles } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('balancer');
  const [language, setLanguage] = useState<LanguageCode>('en');

  // User Profile & Gamification Persistence
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('chembalance_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return {
      id: 'usr-901',
      name: 'Alex Rivera',
      email: 'arivera@school.edu',
      role: 'student',
      subscriptionTier: 'Student Pro',
      language: 'en',
      darkMode: true,
      offlineSyncEnabled: true,
      notificationsEnabled: true,
      lmsConnected: 'Canvas',
      xpPoints: 1250,
      streakDays: 6,
    };
  });

  // AI Tutor Modal state
  const [aiTutorOpen, setAiTutorOpen] = useState<boolean>(false);
  const [activeReaction, setActiveReaction] = useState<ChemicalReaction | null>(null);
  const [currentReactantsCoeffs, setCurrentReactantsCoeffs] = useState<number[]>([1, 1]);
  const [currentProductsCoeffs, setCurrentProductsCoeffs] = useState<number[]>([1]);

  // Sync profile changes to localStorage
  useEffect(() => {
    localStorage.setItem('chembalance_user_profile', JSON.stringify(profile));
    if (profile.language && profile.language !== language) {
      setLanguage(profile.language);
    }
  }, [profile]);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const handleOpenAiTutor = (
    reaction: ChemicalReaction,
    currentReactants: number[],
    currentProducts: number[]
  ) => {
    setActiveReaction(reaction);
    setCurrentReactantsCoeffs(currentReactants);
    setCurrentProductsCoeffs(currentProducts);
    setAiTutorOpen(true);
  };

  const handleAddXp = (amount: number) => {
    setProfile((prev) => ({
      ...prev,
      xpPoints: prev.xpPoints + amount,
    }));
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  return (
    <div className="min-h-screen bg-[#050608] bg-[radial-gradient(circle_at_center,_#111827_0%,_#050608_100%)] text-slate-200 flex flex-col font-sans selection:bg-sky-500 selection:text-black relative">
      {/* Subtle radial dot grid overlay */}
      <div className="absolute inset-0 bg-grid-dots opacity-15 pointer-events-none z-0"></div>

      {/* Top Header */}
      <Header
        currentView={currentView}
        onSelectView={setCurrentView}
        language={language}
        onLanguageChange={(lang) => {
          setLanguage(lang);
          handleUpdateProfile({ language: lang });
        }}
        xpPoints={profile.xpPoints}
        streakDays={profile.streakDays}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        {currentView === 'balancer' && (
          <EquationBalancer
            t={t}
            onOpenAiTutor={handleOpenAiTutor}
            onRecordSuccess={(reaction) => {
              handleAddXp(50);
            }}
          />
        )}

        {currentView === 'kinetic' && <KineticEnergySim t={t} />}

        {currentView === 'practice' && (
          <CurriculumPractice
            t={t}
            onOpenAiTutor={handleOpenAiTutor}
            xpPoints={profile.xpPoints}
            streakDays={profile.streakDays}
            onAddXp={handleAddXp}
          />
        )}

        {currentView === 'teacher' && <TeacherDashboard t={t} />}

        {currentView === 'leaderboard' && (
          <GamificationLeaderboard
            t={t}
            userXp={profile.xpPoints}
            userStreak={profile.streakDays}
          />
        )}

        {currentView === 'profile' && (
          <ProfileSettings
            t={t}
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
          />
        )}
      </main>

      {/* AI Tutor Drawer / Modal */}
      <AITutorModal
        isOpen={aiTutorOpen}
        onClose={() => setAiTutorOpen(false)}
        reaction={activeReaction}
        currentReactants={currentReactantsCoeffs}
        currentProducts={currentProductsCoeffs}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#08090C] py-3.5 px-6 text-xs text-slate-400 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981] animate-pulse"></div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              CHEM-SIM ULTRA v4.2 • Cloud Synced
            </span>
          </div>

          <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500">
            <span className="flex items-center gap-1 text-sky-400 hover:text-sky-300 transition cursor-pointer">
              <Wifi className="w-3 h-3" />
              OFFLINE MODE: ACTIVE
            </span>
            <span className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition cursor-pointer">
              <CloudCheck className="w-3 h-3" />
              LMS LINKED (CANVAS)
            </span>
            <span className="text-amber-400 font-bold uppercase tracking-wider">
              {profile.subscriptionTier}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
