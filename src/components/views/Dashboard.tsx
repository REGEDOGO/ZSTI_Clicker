import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, User, X } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { ITEM_EVOLUTIONS } from '../../data/gameData';

export const Dashboard: React.FC = () => {
  const {
    activeQuote,
    handleClick,
    upgrades,
    itemEvolutions,
    coffeeLevel,
    drinkCoffee,
    buyUpgrade,
    points,
    unlockedResearch
  } = useGame();

  const [selectedUpgrade, setSelectedUpgrade] = useState<any>(null);

  const getEvolutionName = (itemId: string) => {
    if (itemEvolutions[itemId as keyof typeof itemEvolutions] && ITEM_EVOLUTIONS[itemId][itemEvolutions[itemId as keyof typeof itemEvolutions]]) {
      return ITEM_EVOLUTIONS[itemId][itemEvolutions[itemId as keyof typeof itemEvolutions]].name;
    }
    return null;
  };

  const getEvolutionImage = (itemId: string) => {
     if (itemEvolutions[itemId as keyof typeof itemEvolutions] && ITEM_EVOLUTIONS[itemId][itemEvolutions[itemId as keyof typeof itemEvolutions]]) {
        const evo = ITEM_EVOLUTIONS[itemId][itemEvolutions[itemId as keyof typeof itemEvolutions]];
        return `https://placehold.co/100x100/1e293b/${evo.imgColor}?text=${encodeURIComponent(evo.name.split(' ')[0])}`;
     }
     return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full"
    >
        {/* Left: Avatar / Clicker */}
        <div className="flex flex-col items-center justify-center gap-8 min-h-[50vh]">
        <div className="h-12 flex items-center justify-center text-center px-4 w-full">
            <AnimatePresence>
            {activeQuote && (
                <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl text-sm italic text-slate-200 shadow-xl"
                >
                "{activeQuote}"
                </motion.div>
            )}
            </AnimatePresence>
        </div>

        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
            className="group relative w-64 h-64 md:w-80 md:h-80 rounded-full border-8 shadow-[0_0_50px_-10px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden transition-all"
            style={{
            borderColor: 'rgba(255,255,255,0.1)',
            backgroundColor: 'var(--theme-card)'
            }}
        >
            <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity"
                style={{ background: `radial-gradient(circle, var(--theme-primary) 0%, transparent 70%)` }} />
            <div className="relative z-10 text-center">
                <User size={80} className="mx-auto text-slate-400 mb-4 transition-colors"
                    style={{ color: 'var(--theme-primary)' }} />
                <span className="text-2xl font-bold text-slate-300 tracking-wider">NIERODKA</span>
                <div className="text-xs text-slate-500 mt-2 font-mono">KLIKNIJ ABY ZDAĆ</div>
            </div>
        </motion.button>
        </div>

        {/* Right: The Desk (Biurko Nauczyciela) */}
        <div className="bg-black/20 rounded-3xl border border-white/10 p-6 flex flex-col overflow-hidden relative">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Monitor size={20} /> Biurko Nauczyciela
        </h2>

        {/* Coffee Mug Widget */}
        {unlockedResearch.includes('caffeine_research') && (
            <div className="absolute top-6 right-6 z-20">
            <motion.button
                onClick={drinkCoffee}
                whileTap={{ scale: 0.9 }}
                className="relative group"
            >
                <div className="w-12 h-14 bg-slate-800 rounded-lg border-2 border-slate-600 flex items-end justify-center overflow-hidden relative">
                    {/* Coffee Liquid */}
                    <motion.div
                    initial={false}
                    animate={{ height: `${coffeeLevel}%` }}
                    className="w-full bg-[#3c2f2f] absolute bottom-0 left-0"
                    />
                    {/* Steam */}
                    {coffeeLevel > 80 && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/20 blur-md rounded-full animate-ping" />
                    )}
                    <span className="relative z-10 text-[8px] font-bold text-white/50 mb-2">MUG</span>
                </div>
                <div className="absolute top-2 -right-3 w-4 h-8 border-2 border-l-0 border-slate-600 rounded-r-lg" />

                {/* Status Tooltip */}
                <div className="absolute right-full mr-2 top-0 bg-black/80 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
                {coffeeLevel === 0 ? "PUSTY! (-50% CPS)" : `Poziom Kawy: ${Math.floor(coffeeLevel)}%`}
                </div>
            </motion.button>
            </div>
        )}

        <div className="flex-1 overflow-y-auto custom-scrollbar">
            {/* Render Upgrades as Visual Objects */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {upgrades.filter(u => u.level > 0).map(u => {
                    const evolvedName = getEvolutionName(u.id);
                    const evolvedImg = getEvolutionImage(u.id);
                    const finalName = evolvedName || u.name;
                    const finalImg = evolvedImg || u.deskImage;

                    return (
                    <motion.button
                        key={u.id}
                        layoutId={u.id}
                        onClick={() => setSelectedUpgrade(u)}
                        className="aspect-square bg-white/5 rounded-xl border border-white/10 flex flex-col items-center justify-center p-2 relative hover:bg-white/10 transition-colors group"
                    >
                        <img src={finalImg} alt={finalName} className={`w-2/3 h-2/3 object-contain mb-2 transition-all ${u.level > 50 ? 'drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'grayscale group-hover:grayscale-0'}`} />
                        <span className="text-xs text-center text-slate-300 leading-tight">{finalName}</span>
                        <span className="absolute top-2 right-2 text-[10px] bg-black/50 px-1 rounded text-[var(--theme-primary)]">Lvl {u.level}</span>
                    </motion.button>
                    );
                })}
                {upgrades.every(u => u.level === 0) && (
                <div className="col-span-full text-center text-slate-500 italic py-12">
                    Biurko jest puste. Kup coś w sklepie.
                </div>
                )}
            </div>
        </div>
        </div>

        {/* ITEM UPGRADE MODAL */}
        <AnimatePresence>
            {selectedUpgrade && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedUpgrade(null)}>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-slate-900 border border-white/20 p-6 rounded-2xl max-w-md w-full shadow-2xl"
                >
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-white">{selectedUpgrade.name}</h3>
                        <button onClick={() => setSelectedUpgrade(null)}><X size={20} /></button>
                    </div>
                    <p className="text-slate-400 text-sm mb-6">{selectedUpgrade.description}</p>
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <div className="text-xs text-slate-500 uppercase">Obecny Poziom</div>
                            <div className="text-xl font-mono text-white">{selectedUpgrade.level}</div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-500 uppercase">Efekt</div>
                            <div className="text-xl font-mono text-[var(--theme-primary)]">+{selectedUpgrade.level * selectedUpgrade.baseEffect}</div>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            buyUpgrade(selectedUpgrade.id);
                            setSelectedUpgrade(null);
                        }}
                        disabled={points < selectedUpgrade.currentCost}
                        className={`w-full py-3 rounded-xl font-bold flex justify-center items-center gap-2 ${points >= selectedUpgrade.currentCost ? 'bg-[var(--theme-primary)] text-black hover:opacity-90' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                    >
                        Ulepsz za {selectedUpgrade.currentCost.toLocaleString()}
                    </button>
                </motion.div>
            </div>
            )}
        </AnimatePresence>
    </motion.div>
  );
};
