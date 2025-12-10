import React from 'react';
import { useGame } from '../../context/GameContext';
import { Music, Volume2, Palette, Star, GraduationCap, AlertOctagon, AlertTriangle } from 'lucide-react';
import { MUSIC_TRACKS, THEMES } from '../../data/gameData';

export const Settings: React.FC = () => {
  const {
    ownedMusic,
    activeMusicId,
    setActiveMusicId,
    volume,
    setVolume,
    ownedThemes,
    activeThemeId,
    setActiveThemeId,
    points,
    prestigeReset,
    hardReset
  } = useGame();

  return (
    <div className="max-w-2xl mx-auto pb-8">
        <h2 className="text-3xl font-bold text-white mb-8">Ustawienia Systemowe</h2>

        {/* Audio Player */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mb-8 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Music size={20} /> Odtwarzacz
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">Utwór</label>
                <select
                value={activeMusicId}
                onChange={(e) => setActiveMusicId(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[var(--theme-primary)]"
                style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                >
                {ownedMusic.map(id => {
                    const track = MUSIC_TRACKS.find(t => t.id === id);
                    return <option key={id} value={id}>{track ? track.name : id}</option>;
                })}
                </select>
            </div>
            <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block flex justify-between">
                <span>Głośność</span>
                <span>{volume}%</span>
                </label>
                <div className="flex items-center gap-3">
                <Volume2 size={16} className="text-slate-500" />
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[var(--theme-primary)]"
                />
                </div>
            </div>
            </div>
        </div>

        {/* Theme Selector */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mb-8 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Palette size={20} /> Motyw Graficzny
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ownedThemes.map(id => {
                const theme = THEMES[id];
                return (
                <button
                    key={id}
                    onClick={() => setActiveThemeId(id)}
                    className={`p-2 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${activeThemeId === id ? 'bg-white/10' : 'bg-transparent border-transparent hover:bg-white/5'}`}
                    style={{ borderColor: activeThemeId === id ? theme.colors.primary : 'transparent' }}
                >
                    <div className="w-10 h-10 rounded-full border-2 border-white/20 shadow-lg" style={{ backgroundColor: theme.colors.bg }}>
                        <div className="w-full h-full rounded-full opacity-50" style={{ backgroundColor: theme.colors.primary }} />
                    </div>
                    <span className="text-xs font-bold text-slate-300 text-center">{theme.name}</span>
                </button>
                );
            })}
            </div>
        </div>

        {/* Prestige / Minister Promotion */}
        {points > 100000000 && (
            <div className="bg-yellow-500/10 rounded-2xl border border-yellow-500/30 overflow-hidden mb-8">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-4 text-yellow-500">
                <Star size={24} />
                <h3 className="text-lg font-bold">Ścieżka Kariery</h3>
                </div>
                <p className="text-sm text-slate-400 mb-4">
                Masz szansę awansować na Ministra Edukacji. To zresetuje twoje postępy (oprócz kolekcji i osiągnięć),
                ale otrzymasz stały bonus do produkcji.
                </p>
                <button
                onClick={prestigeReset}
                disabled={points < 1000000000}
                className={`w-full py-3 px-4 font-bold rounded-xl transition-colors flex items-center justify-center gap-2
                    ${points >= 1000000000 ? 'bg-yellow-500 hover:bg-yellow-400 text-black' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}
                `}
                >
                    <GraduationCap size={18} />
                    {points >= 1000000000 ? "AWANS NA MINISTRA (RESET + BONUS)" : "WYMAGANE 1 MLD PUNKTÓW"}
                </button>
            </div>
            </div>
        )}

        {/* Danger Zone */}
        <div className="bg-red-950/20 rounded-2xl border border-red-900/50 overflow-hidden">
            <div className="p-6">
            <div className="flex items-center gap-3 mb-4 text-red-500">
                <AlertOctagon />
                <h3 className="text-lg font-bold">Strefa Niebezpieczna</h3>
            </div>
            <button
                onClick={hardReset}
                className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
                <AlertTriangle size={18} /> PEŁNY RESET DANYCH
            </button>
            </div>
        </div>

    </div>
  );
};
