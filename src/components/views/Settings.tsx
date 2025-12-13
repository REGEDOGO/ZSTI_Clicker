import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { 
    Music, Volume2, Palette, Star, GraduationCap, AlertOctagon, AlertTriangle, 
    Play, Pause, SkipBack, SkipForward, Repeat, Radio, Clock, Check
} from 'lucide-react';
import { MUSIC_TRACKS, THEMES } from '../../data/gameData';
import { motion, AnimatePresence } from 'framer-motion';

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
    hardReset,
    isPlaying,
    toggleMusic,
    playNextTrack,
    playPrevTrack
  } = useGame();

  // Lokalny stan dla wizualnego przycisku loop
  const [isLooping, setIsLooping] = useState(true);

  const currentTrack = MUSIC_TRACKS.find(t => t.id === activeMusicId) || MUSIC_TRACKS[0];

  // Generator stałego czasu trwania dla utworu (symulacja na podstawie ID)
  const getTrackDuration = (id: string) => {
      let hash = 0;
      for (let i = 0; i < id.length; i++) {
          hash = id.charCodeAt(i) + ((hash << 5) - hash);
      }
      const minutes = 2 + (Math.abs(hash) % 3); // 2-4 minuty
      const seconds = Math.abs(hash) % 60;
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 space-y-12">
        {/* CSS dla customowego scrollbara */}
        <style>{`
            .custom-scrollbar::-webkit-scrollbar {
                width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
                background: rgba(0,0,0,0.2);
                border-radius: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
                background: rgba(255,255,255,0.1);
                border-radius: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: var(--theme-primary);
            }
        `}</style>
        
        {/* === AUDIO DASHBOARD === */}
        <div className="bg-slate-950 rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden relative isolate">
            
            {/* Tło / Glow Effect */}
            <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-[var(--theme-primary)] opacity-10 blur-[150px] rounded-full -z-10 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.03),transparent_70%)] -z-10 pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12">
                
                {/* LEWA STRONA: ODTWARZACZ I WIZUALIZACJA */}
                <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-between relative border-b lg:border-b-0 lg:border-r border-white/5 min-h-[500px]">
                    
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 text-[var(--theme-primary)] mb-2">
                                <Radio size={16} className={isPlaying ? "animate-pulse" : ""} />
                                <span className="text-xs font-bold tracking-[0.2em] uppercase">System Audio</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight max-w-md mt-1">
                                {currentTrack.name}
                            </h2>
                        </div>
                        <div className="hidden sm:flex items-center gap-2 bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs font-mono text-slate-400">
                             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                             ONLINE
                        </div>
                    </div>

                    {/* CENTRALNY VINYL & WIZUALIZER */}
                    <div className="flex-1 flex flex-col items-center justify-center py-10 gap-10">
                        {/* Vinyl */}
                        <div className="relative">
                            {/* Poświata za płytą */}
                            <div className="absolute inset-0 bg-[var(--theme-primary)] blur-3xl opacity-20 rounded-full scale-110" />
                            
                            <motion.div 
                                animate={{ rotate: isPlaying ? 360 : 0 }}
                                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                                className="w-64 h-64 rounded-full border-8 border-slate-900 shadow-[0_0_50px_rgba(0,0,0,0.6)] bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] bg-slate-800 relative flex items-center justify-center"
                            >
                                {/* Grooves */}
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="absolute rounded-full border border-white/5 opacity-40" style={{ inset: i * 15 }} />
                                ))}
                                
                                {/* Label */}
                                <div className="w-24 h-24 rounded-full bg-[var(--theme-primary)] flex items-center justify-center shadow-inner relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent" />
                                    <div className="absolute inset-0 border-4 border-black/10 rounded-full" />
                                    <Music className="text-black/60 relative z-10" size={40} />
                                </div>
                            </motion.div>
                        </div>

                        {/* Professional Waveform Visualizer */}
                        <div className="w-full max-w-md h-12 flex items-end justify-center gap-1">
                            {Array.from({ length: 40 }).map((_, i) => (
                                <AudioBar key={i} isPlaying={isPlaying} index={i} />
                            ))}
                        </div>
                    </div>

                    {/* CONTROLS BAR */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white/5 p-5 rounded-2xl border border-white/5 backdrop-blur-md shadow-lg">
                        
                        <div className="flex items-center gap-4 order-2 sm:order-1">
                            <button 
                                onClick={() => setIsLooping(!isLooping)}
                                className={`p-2 rounded-lg transition-colors ${isLooping ? 'text-[var(--theme-primary)] bg-[var(--theme-primary)]/10' : 'text-slate-500 hover:text-white'}`}
                                title="Zapętlij"
                            >
                                <Repeat size={20} />
                            </button>

                            <div className="flex items-center gap-2">
                                <button onClick={playPrevTrack} className="p-3 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all active:scale-95">
                                    <SkipBack size={24} />
                                </button>
                                <button 
                                    onClick={toggleMusic} 
                                    className="w-16 h-16 bg-[var(--theme-primary)] text-black rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(var(--theme-primary-rgb),0.4)] hover:scale-105 active:scale-95 transition-all"
                                >
                                    {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
                                </button>
                                <button onClick={playNextTrack} className="p-3 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all active:scale-95">
                                    <SkipForward size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Volume */}
                        <div className="flex items-center gap-3 w-full sm:w-auto sm:flex-1 max-w-[180px] order-1 sm:order-2">
                            <button onClick={() => setVolume(volume === 0 ? 50 : 0)}>
                                {volume === 0 ? <Volume2 size={20} className="text-slate-600" /> : <Volume2 size={20} className="text-[var(--theme-primary)]" />}
                            </button>
                            <div className="h-2 flex-1 bg-slate-800 rounded-full overflow-hidden relative group cursor-pointer border border-white/5">
                                <input 
                                    type="range" 
                                    min="0" max="100" 
                                    value={volume} 
                                    onChange={(e) => setVolume(Number(e.target.value))}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div 
                                    className="h-full bg-[var(--theme-primary)] rounded-full transition-all group-hover:bg-white shadow-[0_0_10px_var(--theme-primary)]"
                                    style={{ width: `${volume}%` }}
                                />
                            </div>
                        </div>

                    </div>
                </div>

                {/* PRAWA STRONA: PLAYLISTA (NAPRAWIONY SCROLL) */}
                <div className="lg:col-span-5 bg-black/20 p-8 flex flex-col border-l border-white/5 h-full lg:h-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-white font-bold flex items-center gap-3 text-lg">
                            <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                                <Radio size={18} className="text-[var(--theme-primary)]" />
                            </div>
                            Biblioteka Utworów
                        </h3>
                        <span className="text-xs font-mono text-slate-500 bg-white/5 px-2 py-1 rounded border border-white/5">
                            {ownedMusic.length - 1} tracks
                        </span>
                    </div>

                    {/* Scrollable List Container with Fixed Height */}
                    <div className="custom-scrollbar overflow-y-auto pr-2 space-y-2 h-[500px]">
                        {ownedMusic.map((id, index) => {
                            const track = MUSIC_TRACKS.find(t => t.id === id);
                            if (!track) return null;
                            const isActive = activeMusicId === id;
                            const duration = getTrackDuration(id);

                            return (
                                <button
                                    key={id}
                                    onClick={() => { setActiveMusicId(id); }}
                                    className={`w-full group flex items-center gap-4 p-4 rounded-xl transition-all border text-left relative overflow-hidden shrink-0
                                        ${isActive 
                                            ? 'bg-white/5 border-[var(--theme-primary)]/50 shadow-[inset_0_0_20px_rgba(var(--theme-primary-rgb),0.1)]' 
                                            : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/5'
                                        }
                                    `}
                                >
                                    {/* Active Indicator Strip */}
                                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--theme-primary)]" />}

                                    {/* Number / Equalizer Icon */}
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono shrink-0 transition-colors
                                        ${isActive ? 'bg-[var(--theme-primary)] text-black' : 'bg-white/5 text-slate-500 group-hover:bg-white/10 group-hover:text-white'}
                                    `}>
                                        {isActive && isPlaying ? (
                                            <div className="flex gap-0.5 items-end h-3">
                                                <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-0.5 bg-black" />
                                                <motion.div animate={{ height: [6, 10, 6] }} transition={{ repeat: Infinity, duration: 0.4 }} className="w-0.5 bg-black" />
                                                <motion.div animate={{ height: [4, 8, 4] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-0.5 bg-black" />
                                            </div>
                                        ) : (
                                            <span>{index}</span>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className={`font-bold text-sm truncate ${isActive ? 'text-[var(--theme-primary)]' : 'text-slate-200 group-hover:text-white'}`}>
                                            {track.name}
                                        </div>
                                        <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">ZSTI Records</div>
                                    </div>

                                    {/* Duration */}
                                    <div className="flex items-center gap-2 text-xs font-mono text-slate-600 group-hover:text-slate-400">
                                        <Clock size={12} />
                                        {duration}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>


        {/* === WYBÓR MOTYWU (GRID) === */}
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 pl-2 border-l-4 border-[var(--theme-primary)]">
                <Palette className="text-[var(--theme-primary)]" /> Personalizacja Interfejsu
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {ownedThemes.map((id: string) => {
                    const theme = THEMES[id];
                    const isActive = activeThemeId === id;
                    
                    return (
                        <motion.button
                            key={id}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveThemeId(id)}
                            className={`
                                relative p-4 rounded-2xl border flex flex-col items-center gap-3 transition-all overflow-hidden group
                                ${isActive 
                                    ? 'bg-slate-800 border-[var(--theme-primary)] shadow-[0_0_20px_rgba(var(--theme-primary-rgb),0.2)]' 
                                    : 'bg-slate-900/50 border-white/5 hover:border-white/20 hover:bg-slate-800'
                                }
                            `}
                        >
                            {/* Color Preview */}
                            <div className="w-14 h-14 rounded-2xl shadow-lg relative overflow-hidden transform group-hover:rotate-12 transition-transform duration-500">
                                <div className="absolute inset-0" style={{ backgroundColor: theme.colors.bg }} />
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/40" />
                                <div className="absolute top-2 left-2 right-2 h-2 rounded-full opacity-50" style={{ backgroundColor: theme.colors.card }} />
                                <div className="absolute bottom-[-5px] right-[-5px] w-10 h-10 rounded-full border-4 border-slate-900/20" style={{ backgroundColor: theme.colors.primary }} />
                            </div>
                            
                            <span className={`text-xs font-bold text-center ${isActive ? 'text-white' : 'text-slate-500'}`}>
                                {theme.name}
                            </span>

                            {isActive && (
                                <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[var(--theme-primary)] shadow-[0_0_8px_currentColor]" />
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>


        {/* === RESET ZONES === */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-white/5">
            {/* Prestige */}
            {points > 100000000 && (
                <div className="bg-gradient-to-br from-yellow-950/30 to-black border border-yellow-900/50 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity rotate-12">
                        <Star size={120} className="text-yellow-500" />
                    </div>
                    
                    <h4 className="text-yellow-500 font-bold flex items-center gap-2 mb-2 text-lg">
                        <GraduationCap /> Ścieżka Kariery
                    </h4>
                    <p className="text-yellow-200/50 text-sm mb-6 max-w-xs">Awansuj na Ministra Edukacji. Reset postępów za stały bonus.</p>
                    
                    <button
                        onClick={prestigeReset}
                        disabled={points < 1000000000}
                        className={`w-full py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all
                            ${points >= 1000000000 
                                ? 'bg-yellow-500 hover:bg-yellow-400 text-black shadow-lg shadow-yellow-900/20' 
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }
                        `}
                    >
                        {points >= 1000000000 ? "Awansuj (Reset)" : "Wymagane 1 MLD pkt"}
                    </button>
                </div>
            )}

            {/* Hard Reset */}
            <div className="bg-red-950/10 border border-red-900/30 rounded-2xl p-6 flex flex-col justify-between hover:bg-red-950/20 transition-colors group">
                 <div>
                    <h4 className="text-red-500 font-bold flex items-center gap-2 mb-2 text-lg">
                        <AlertOctagon /> Strefa Niebezpieczna
                    </h4>
                    <p className="text-red-200/30 text-sm mb-6">Trwałe usunięcie wszystkich danych. Brak powrotu.</p>
                 </div>
                 
                 <button
                    onClick={() => { if(confirm("Na pewno? To nieodwracalne!")) hardReset(); }}
                    className="w-full py-3 bg-transparent border border-red-900/50 hover:bg-red-600 hover:border-red-600 text-red-500 hover:text-white rounded-xl font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                    <AlertTriangle size={16} /> Pełny Reset
                </button>
            </div>
        </div>

    </div>
  );
};

// --- SUB-COMPONENT: Audio Bar ---
const AudioBar = ({ isPlaying, index }: { isPlaying: boolean; index: number }) => {
    // Generujemy losowe wartości dla "różnorodności" słupków
    const randomHeight = 20 + Math.random() * 80;
    const randomDuration = 0.3 + Math.random() * 0.5;
    const randomDelay = Math.random() * 0.2;

    return (
        <motion.div
            animate={{
                height: isPlaying ? [`10%`, `${randomHeight}%`, `10%`] : `5%`,
                backgroundColor: isPlaying ? ['#334155', 'var(--theme-primary)', '#334155'] : '#1e293b'
            }}
            transition={{
                repeat: Infinity,
                duration: randomDuration,
                delay: randomDelay,
                ease: "easeInOut"
            }}
            className="w-1.5 rounded-full opacity-80"
            style={{ opacity: isPlaying ? 0.6 + (Math.random() * 0.4) : 0.3 }}
        />
    );
};