import React from 'react';
import { UserProfile, UIStrings, LanguageCode } from '../types';
import {
  User,
  Moon,
  Sun,
  Globe,
  Cloud,
  CheckCircle2,
  Shield,
  CreditCard,
  Bell,
  Wifi,
  Database,
  Lock,
} from 'lucide-react';

interface Props {
  t: UIStrings;
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
}

export const ProfileSettings: React.FC<Props> = ({ t, profile, onUpdateProfile }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-[#08090C] rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-sky-500 flex items-center justify-center text-black font-mono font-black text-2xl shadow-[0_0_15px_rgba(56,189,248,0.3)]">
            {profile.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-100 tracking-wide">{profile.name}</h2>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-800/80">
                {profile.subscriptionTier}
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400">{profile.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-emerald-950/60 text-emerald-400 border border-emerald-800/80 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold">
            <Cloud className="w-4 h-4" />
            <span>Cloud Backed Up</span>
          </div>
        </div>
      </div>

      {/* Subscription Tier Cards */}
      <div className="bg-[#08090C] rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <CreditCard className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-slate-100 text-sm">Subscription Model & Tiered Access</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Free Tier */}
          <div
            onClick={() => onUpdateProfile({ subscriptionTier: 'Free' })}
            className={`p-4 rounded-xl border cursor-pointer transition ${
              profile.subscriptionTier === 'Free'
                ? 'bg-sky-950/40 border-sky-500 shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                : 'bg-[#050608] border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="font-bold text-slate-200 text-sm mb-1">Free Tier</div>
            <div className="text-xl font-mono font-black text-slate-100 mb-2">$0 <span className="text-xs text-slate-500 font-normal">/ mo</span></div>
            <ul className="text-[11px] font-mono text-slate-400 space-y-1">
              <li>✓ Basic Equation Balancer</li>
              <li>✓ 5 Practice Sets</li>
              <li>✓ Community Leaderboard</li>
            </ul>
          </div>

          {/* Student Pro */}
          <div
            onClick={() => onUpdateProfile({ subscriptionTier: 'Student Pro' })}
            className={`p-4 rounded-xl border cursor-pointer transition ${
              profile.subscriptionTier === 'Student Pro'
                ? 'bg-amber-950/40 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                : 'bg-[#050608] border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="font-bold text-amber-300 text-sm mb-1">Student Pro</div>
            <div className="text-xl font-mono font-black text-amber-400 mb-2">$4.99 <span className="text-xs text-slate-500 font-normal">/ mo</span></div>
            <ul className="text-[11px] font-mono text-slate-300 space-y-1">
              <li>✓ Unlimited AI Tutor Hints</li>
              <li>✓ Advanced Kinetic Physics Sim</li>
              <li>✓ Offline Mode & Cross-Device Sync</li>
            </ul>
          </div>

          {/* Classroom License */}
          <div
            onClick={() => onUpdateProfile({ subscriptionTier: 'Classroom License' })}
            className={`p-4 rounded-xl border cursor-pointer transition ${
              profile.subscriptionTier === 'Classroom License'
                ? 'bg-sky-950/40 border-sky-500 shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                : 'bg-[#050608] border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="font-bold text-sky-300 text-sm mb-1">Classroom License</div>
            <div className="text-xl font-mono font-black text-sky-400 mb-2">$29 <span className="text-xs text-slate-500 font-normal">/ mo</span></div>
            <ul className="text-[11px] font-mono text-slate-300 space-y-1">
              <li>✓ Full Teacher Dashboard & Roster</li>
              <li>✓ Canvas / Google Classroom LMS Sync</li>
              <li>✓ Export PDF/CSV Gradebook Analytics</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Preferences & Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Language & Theme */}
        <div className="bg-[#08090C] rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Globe className="w-5 h-5 text-sky-400" />
            <h3 className="font-bold text-slate-100 text-sm">Localization & Accessibility</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Preferred Language
              </label>
              <select
                id="select-app-language"
                value={profile.language}
                onChange={(e) => onUpdateProfile({ language: e.target.value as LanguageCode })}
                className="w-full bg-[#050608] text-slate-100 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-medium focus:outline-none"
              >
                <option value="en">English (US)</option>
                <option value="es">Español (Spanish)</option>
                <option value="fr">Français (French)</option>
                <option value="de">Deutsch (German)</option>
                <option value="zh">中文 (Mandarin Chinese)</option>
                <option value="ja">日本語 (Japanese)</option>
                <option value="pt">Português (Portuguese)</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <Moon className="w-4 h-4 text-sky-400" />
                Dark Mode Eye-Strain Reduced Theme
              </span>
              <button
                id="toggle-dark-mode-btn"
                onClick={() => onUpdateProfile({ darkMode: !profile.darkMode })}
                className={`w-12 h-6 rounded-full transition p-1 flex items-center ${
                  profile.darkMode ? 'bg-sky-500 justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-black shadow"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Sync & Offline Settings */}
        <div className="bg-[#08090C] rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Database className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-slate-100 text-sm">Cloud Backup & Offline Sync</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <Wifi className="w-4 h-4 text-emerald-400" />
                Offline Mode Access (PWA ServiceWorker)
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/80">
                Active
              </span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <Lock className="w-4 h-4 text-sky-400" />
                Automated Cloud Session Backups
              </span>
              <span className="text-xs font-mono font-bold text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded-md border border-sky-800/80">
                Encrypted
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
