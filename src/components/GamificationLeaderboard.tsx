import React, { useState } from 'react';
import { UIStrings } from '../types';
import { Trophy, Medal, Award, Flame, Zap, ShieldCheck, Sparkles } from 'lucide-react';

interface Props {
  t: UIStrings;
  userXp: number;
  userStreak: number;
}

interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  streak: number;
  badge: string;
  isCurrentUser?: boolean;
}

export const GamificationLeaderboard: React.FC<Props> = ({ t, userXp, userStreak }) => {
  const [activeTab, setActiveTab] = useState<'class' | 'global'>('class');

  const leaderboardUsers: LeaderboardUser[] = [
    {
      rank: 1,
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
      xp: 2850,
      streak: 14,
      badge: 'Master Alchemist',
    },
    {
      rank: 2,
      name: 'You (Student)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
      xp: userXp,
      streak: userStreak,
      badge: 'Gold Stoichiometrist',
      isCurrentUser: true,
    },
    {
      rank: 3,
      name: 'Chloe Zhang',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=120',
      xp: 1950,
      streak: 8,
      badge: 'Gold Stoichiometrist',
    },
    {
      rank: 4,
      name: 'Marcus Johnson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
      xp: 1420,
      streak: 5,
      badge: 'Silver Balancer',
    },
    {
      rank: 5,
      name: 'Sophia Patel',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
      xp: 1100,
      streak: 3,
      badge: 'Bronze Chemist',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#08090C] rounded-2xl p-6 border border-slate-800 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-slate-100 tracking-wide">Classroom & Global Chemistry Leaderboard</h2>
          </div>
          <p className="text-xs text-slate-400">
            Compete with classmates, maintain daily streaks, and earn prestigious stoichiometry badges!
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center bg-[#050608] p-1 rounded-xl border border-slate-800">
          <button
            id="tab-classroom-leaderboard"
            onClick={() => setActiveTab('class')}
            className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
              activeTab === 'class' ? 'bg-sky-500 text-black shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Classroom
          </button>
          <button
            id="tab-global-leaderboard"
            onClick={() => setActiveTab('global')}
            className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
              activeTab === 'global' ? 'bg-sky-500 text-black shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Global Top 100
          </button>
        </div>
      </div>

      {/* Top 3 Podiums */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {leaderboardUsers.slice(0, 3).map((u) => (
          <div
            key={u.name}
            className={`rounded-2xl p-5 border flex flex-col items-center justify-between text-center relative overflow-hidden transition ${
              u.isCurrentUser
                ? 'bg-amber-950/30 border-amber-500/80 shadow-[0_0_20px_rgba(245,158,11,0.2)] ring-1 ring-amber-500/40'
                : 'bg-[#08090C] border-slate-800'
            }`}
          >
            <div className="absolute top-2 left-3 font-mono font-black text-xs text-amber-400">
              #{u.rank}
            </div>

            <div className="relative my-2">
              <img src={u.avatar} alt={u.name} className="w-16 h-16 rounded-full object-cover border-2 border-amber-400/80 shadow" />
              {u.rank === 1 && <Medal className="w-6 h-6 text-amber-400 absolute -top-2 -right-2 drop-shadow" />}
            </div>

            <div className="space-y-1 my-2">
              <h4 className="font-bold text-slate-100 text-sm">{u.name}</h4>
              <span className="text-[10px] text-amber-300 font-mono font-semibold bg-amber-950/60 px-2.5 py-0.5 rounded-md border border-amber-800/60">
                {u.badge}
              </span>
            </div>

            <div className="flex items-center gap-3 mt-2 text-xs font-mono font-bold">
              <span className="text-sky-400">{u.xp} XP</span>
              <span className="text-amber-400 flex items-center gap-0.5">
                <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {u.streak}d
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-[#08090C] rounded-2xl p-6 border border-slate-800 shadow-xl">
        <h3 className="font-bold text-slate-100 text-sm mb-4">Complete Rank Standings</h3>
        <div className="space-y-2">
          {leaderboardUsers.map((u) => (
            <div
              key={u.name}
              className={`flex items-center justify-between p-3 rounded-xl border transition ${
                u.isCurrentUser
                  ? 'bg-amber-950/30 border-amber-500/60 shadow'
                  : 'bg-[#050608] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 font-mono font-black text-xs text-slate-500">#{u.rank}</span>
                <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover border border-slate-700" />
                <div>
                  <div className="font-bold text-slate-100 text-xs flex items-center gap-1.5">
                    <span>{u.name}</span>
                    {u.isCurrentUser && <span className="text-[10px] bg-sky-950 text-sky-400 px-1.5 py-0.2 rounded font-mono border border-sky-800/60">You</span>}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">{u.badge}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="font-bold text-amber-400 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-amber-400" />
                  {u.streak} Days
                </span>
                <span className="font-bold text-sky-400">{u.xp} XP</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
