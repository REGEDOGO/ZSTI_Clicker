import React from 'react';
import { useGame } from '../../context/GameContext';
import { CreditCard, Activity, MousePointer2, Star } from 'lucide-react';

export const Profile: React.FC = () => {
  const {
    totalEarnings,
    totalPlayTime,
    totalClicks,
    prestigeLevel,
    currentIQ,
    getCurrentRank,
    formatTime
  } = useGame();

  return (
    <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8">Teczka Personalna</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Student ID Card */}
            <div className="md:col-span-1 bg-white/5 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm p-4 flex flex-col items-center text-center">
            <div className="w-full aspect-[3/4] bg-slate-800 rounded mb-4 overflow-hidden relative">
                <img src="https://placehold.co/300x400/1e293b/a3a3a3?text=STUDENT" alt="Avatar" className="w-full h-full object-cover opacity-50" />
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-xs font-mono text-white">
                ID: {Date.now().toString().slice(-8)}
                </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Anonimowy Uczeń</h3>
            <p className="text-sm font-mono text-[var(--theme-primary)]">{getCurrentRank()}</p>

            <div className="w-full mt-6 pt-6 border-t border-white/10">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-slate-400">POZIOM STRESU</span>
                    <span className="text-xs text-red-400 font-bold">99%</span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 w-[99%]" />
                </div>
            </div>

            <div className="w-full mt-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-slate-400">SZACOWANE IQ</span>
                    <span className="text-xs text-blue-400 font-bold">{currentIQ}</span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${(currentIQ / 200) * 100}%` }} />
                </div>
            </div>
            </div>

            {/* Stats Grid */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
                <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                <div className="text-slate-400 text-xs uppercase mb-2 flex items-center gap-2"><CreditCard size={14}/> Całkowity Dochód</div>
                <div className="text-2xl font-mono font-bold text-white">{totalEarnings.toLocaleString()}</div>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                <div className="text-slate-400 text-xs uppercase mb-2 flex items-center gap-2"><Activity size={14}/> Zmarnowany Czas</div>
                <div className="text-2xl font-mono font-bold text-white">{formatTime(totalPlayTime)}</div>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                <div className="text-slate-400 text-xs uppercase mb-2 flex items-center gap-2"><MousePointer2 size={14}/> Ilość Kliknięć</div>
                <div className="text-2xl font-mono font-bold text-white">{totalClicks.toLocaleString()}</div>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                <div className="text-slate-400 text-xs uppercase mb-2 flex items-center gap-2"><Star size={14}/> Poziom Prestiżu</div>
                <div className="text-2xl font-mono font-bold text-yellow-500">{prestigeLevel}</div>
                </div>
            </div>
        </div>
    </div>
  );
};
