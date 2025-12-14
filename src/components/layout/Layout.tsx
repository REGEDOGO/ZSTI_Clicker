import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Sidebar } from './Sidebar';
import { GraduationCap, Briefcase, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dashboard } from '../views/Dashboard';
import { Shop } from '../views/Shop';
import { Hardware } from '../views/Hardware';
import { Lab } from '../views/Lab';
import { Profile } from '../views/Profile';
import { Social } from '../views/Social';
import { Settings } from '../views/Settings';
import { Achievements } from '../views/Achievements'; // Will create this too since it's in the tab list
import { Odometer } from '../ui/Odometer';
import { SyncStatus } from '../ui/SyncStatus';
import { NEWS_TICKER } from '../../data/gameData';
import { Casino } from '../views/Casino';
import { Market } from '../views/Market';

export const Layout: React.FC = () => {
  const {
    points,
    autoPoints,
    prestigeLevel,
    newsIndex,
    inspekcjaVisible,
    handleInspekcjaClick,
    panicMode,
    setPanicMode,
    overclockTime,
    isCrashed,
    crashTime,
    focusMode,
    clicks,
    setShowAuthModal,
    isGuest
  } = useGame() as any;

  const [activeTab, setActiveTab] = useState('home');

  // --- BSOD OVERLAY ---
  if (isCrashed) {
    return (
      <div className="fixed inset-0 bg-blue-700 text-white font-mono z-[9999] p-8 md:p-24 flex flex-col justify-center select-none">
        <h1 className="text-4xl md:text-6xl mb-8">:(</h1>
        <p className="text-xl md:text-2xl mb-8">
          Twoje urządzenie napotkało problem i musi zostać uruchomione ponownie.
          Trwa zbieranie informacji o błędzie.
        </p>
        <p className="text-lg">UKOŃCZONO: {100 - (crashTime * 10)}%</p>
        <div className="mt-8 text-sm opacity-80">
          <p>Kod zatrzymania: NIERODKA_CRITICAL_PROCESS_DIED</p>
          <p>Żródło: nadmierne_podkrecanie_absurdu.sys</p>
        </div>
      </div>
    );
  }

  // --- PANIC MODE OVERLAY ---
  if (panicMode) {
    return (
      <div
        className="fixed inset-0 bg-white text-black font-serif z-[9999] overflow-auto p-8"
        onClick={() => setPanicMode(false)}
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Roczne Sprawozdanie Zużycia Gąbki 2024/2025</h1>
        <table className="w-full border-collapse border border-black text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-black p-2">Miesiąc</th>
              <th className="border border-black p-2">Kreda (kg)</th>
              <th className="border border-black p-2">Gąbki (szt)</th>
              <th className="border border-black p-2">Uwagi</th>
            </tr>
          </thead>
          <tbody>
            {["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec"].map((m, i) => (
              <tr key={i}>
                <td className="border border-black p-2">{m}</td>
                <td className="border border-black p-2">{(Math.random() * 5).toFixed(2)}</td>
                <td className="border border-black p-2">{Math.floor(Math.random() * 3)}</td>
                <td className="border border-black p-2">Brak</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-4 text-xs text-gray-500">Kliknij gdziekolwiek, aby wrócić do pracy.</p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen text-slate-100 font-sans overflow-hidden relative selection:bg-[var(--theme-primary)] selection:text-white ${focusMode ? 'grayscale' : ''} ${overclockTime > 0 ? 'animate-pulse' : ''}`}
      style={{ backgroundColor: 'var(--theme-bg)' }}
    >
      {/* Glitch Effect CSS for Overclock */}
      {overclockTime > 0 && (
         <style>{`
           @keyframes shake {
             0% { transform: translate(1px, 1px) rotate(0deg); }
             10% { transform: translate(-1px, -2px) rotate(-1deg); }
             20% { transform: translate(-3px, 0px) rotate(1deg); }
             30% { transform: translate(3px, 2px) rotate(0deg); }
             40% { transform: translate(1px, -1px) rotate(1deg); }
             50% { transform: translate(-1px, 2px) rotate(-1deg); }
             60% { transform: translate(-3px, 1px) rotate(0deg); }
             70% { transform: translate(3px, 1px) rotate(-1deg); }
             80% { transform: translate(-1px, -1px) rotate(1deg); }
             90% { transform: translate(1px, 2px) rotate(0deg); }
             100% { transform: translate(1px, -2px) rotate(-1deg); }
           }
           main { animation: shake 0.5s infinite; filter: contrast(150%) hue-rotate(90deg); }
         `}</style>
      )}

      {/* Panic Button */}
      <button
        onClick={() => setPanicMode(true)}
        className="fixed top-2 right-2 md:top-6 md:right-6 z-[60] bg-red-600/80 hover:bg-red-600 text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded shadow-lg flex items-center gap-1 border border-red-400/50"
      >
        <EyeOff size={12} /> IDZIE DYREKTOR!
      </button>

      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
         <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
              style={{ backgroundColor: 'var(--theme-primary)' }} />
         <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"
              style={{ backgroundColor: 'var(--theme-secondary)' }} />
      </div>

      {/* Floating Click Texts */}
      <AnimatePresence>
        {clicks.map((click: any) => (
          <motion.div
            key={click.id}
            initial={{ opacity: 1, y: click.y - 20, x: click.x, scale: click.isCrit ? 1.5 : 1 }}
            animate={{ opacity: 0, y: click.y - 100 }}
            exit={{ opacity: 0 }}
            className={`fixed z-50 font-bold pointer-events-none ${click.isCrit ? 'text-red-500 text-4xl drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]' : 'text-2xl'}`}
            style={!click.isCrit ? { left: 0, top: 0, color: 'var(--theme-primary)' } : { left: 0, top: 0 }}
          >
             {click.isCrit && "CRIT! "}+{click.val}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Inspekcja Event */}
      <AnimatePresence>
        {inspekcjaVisible && (
          <motion.button
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 20 }}
            whileHover={{ scale: 1.1 }}
            onClick={handleInspekcjaClick}
            className="fixed top-24 right-4 md:right-32 z-50 p-4 bg-yellow-500 rounded-full shadow-[0_0_50px_rgba(234,179,8,0.6)] animate-bounce"
          >
            <Briefcase className="text-black w-8 h-8" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="relative z-10 h-screen flex flex-col pb-24 md:pb-12 md:pl-24">

        {/* Header */}
        <div className="p-4 md:p-6 flex justify-between items-end border-b border-white/10 bg-black/20 backdrop-blur-sm shrink-0">
          <div>
             <h1 className="text-xl md:text-3xl font-black bg-clip-text text-transparent mb-1"
                 style={{ backgroundImage: 'linear-gradient(to right, var(--theme-primary), var(--theme-secondary))' }}>
               NIERODKA CLICKER
             </h1>
             <p className="text-slate-400 text-[10px] md:text-xs flex items-center gap-2">
               <GraduationCap size={14} /> Symulator Edukacji Absurdalnej {prestigeLevel > 0 && <span className="text-yellow-400 font-bold ml-2">★ MINISTER LVL {prestigeLevel}</span>}
             </p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-right">
            <div>
               <div className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wider mb-1">Punkty Absurdu</div>
               <div className="text-xl md:text-3xl font-mono font-bold text-white">
                 <Odometer value={points} />
               </div>
            </div>
            <div>
               <div className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wider mb-1">Na sekundę</div>
               <div className="text-lg md:text-2xl font-mono font-bold" style={{ color: 'var(--theme-primary)' }}>+<Odometer value={autoPoints} /></div>
            </div>
          </div>
        </div>

        {/* Sync Status Bar / Login Prompt */}
        <div className="px-4 py-2 md:px-6 flex justify-end items-center gap-4 bg-black/10 backdrop-blur-sm border-b border-white/5">
            <SyncStatus />
            {isGuest && (
                <button
                    onClick={() => setShowAuthModal(true)}
                    className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full text-white/80 transition-colors"
                >
                    Zaloguj się (Cloud Save)
                </button>
            )}
        </div>

        {/* Views */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
             {activeTab === 'home' && <Dashboard key="home" />}
             {activeTab === 'shop' && <Shop key="shop" />}
             {activeTab === 'lab' && <Lab key="lab" />}
             {activeTab === 'hardware' && <Hardware key="hardware" />}
             {activeTab === 'market' && <Market key="market" />}
             {activeTab === 'casino' && <Casino key="casino" />}
             {activeTab === 'social' && <Social key="social" />}
             {activeTab === 'profile' && <Profile key="profile" />}
             {activeTab === 'settings' && <Settings key="settings" />}
             {activeTab === 'achievements' && <Achievements key="achievements" />}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer News Ticker */}
      <div className="fixed bottom-0 left-0 md:left-24 right-0 h-8 md:h-12 bg-black border-t border-white/10 flex items-center z-50 overflow-hidden">
        <div className="bg-[var(--theme-primary)] px-4 h-full flex items-center font-bold text-black text-xs md:text-sm whitespace-nowrap z-10">
          WIADOMOŚCI
        </div>
        <div className="flex-1 overflow-hidden relative h-full flex items-center">
           <AnimatePresence mode="wait">
             <motion.div
               key={newsIndex}
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               exit={{ y: -20, opacity: 0 }}
               className="absolute left-4 text-xs md:text-sm text-slate-300 font-mono"
             >
               {NEWS_TICKER[newsIndex]}
             </motion.div>
           </AnimatePresence>
        </div>
      </div>

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};
