import React from 'react';
import { useGame } from '../../context/GameContext';
import { Lock, Check } from 'lucide-react';
import { ACHIEVEMENTS } from '../../data/gameData';

export const Achievements: React.FC = () => {
  const { unlockedAchievements } = useGame();

  return (
    <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">Sala Chwały</h2>
            <p className="text-slate-400">Twoje osiągnięcia w świecie absurdu.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ACHIEVEMENTS.map(ach => {
            const unlocked = unlockedAchievements.includes(ach.id);
            const Icon = ach.icon;
            return (
                <div
                key={ach.id}
                className={`relative p-6 rounded-2xl border flex items-center gap-4 overflow-hidden
                    ${unlocked ? 'bg-white/5 border-yellow-500/50' : 'bg-black/40 border-white/5 grayscale opacity-60'}
                `}
                >
                    <div className={`p-4 rounded-full shrink-0 ${unlocked ? 'bg-yellow-500/20 text-yellow-500' : 'bg-white/5 text-slate-600'}`}>
                    {unlocked ? <Icon /> : <Lock size={24} />}
                    </div>
                    <div>
                    <h3 className={`font-bold text-lg ${unlocked ? 'text-white' : 'text-slate-500'}`}>{ach.name}</h3>
                    <p className="text-sm text-slate-400">{ach.desc}</p>
                    </div>
                    {unlocked && (
                    <div className="absolute top-0 right-0 p-2 bg-yellow-500/20 rounded-bl-xl">
                        <Check size={14} className="text-yellow-500" />
                    </div>
                    )}
                </div>
            );
            })}
        </div>
    </div>
  );
};
