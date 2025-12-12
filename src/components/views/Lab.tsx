import React from 'react';
import { useGame } from '../../context/GameContext';
import { RESEARCH_DATA, ITEM_EVOLUTIONS } from '../../data/gameData';
import { FlaskConical, FileText, Check, CircuitBoard, Lock, Atom, Dna } from 'lucide-react';
import { motion } from 'framer-motion';

export const Lab: React.FC = () => {
  const {
    points,
    upgrades,
    unlockedResearch,
    buyResearch,
    evolveItem,
    itemEvolutions
  } = useGame();

  return (
    <div className="max-w-7xl mx-auto pb-12">
        
        {/* HEADER */}
        <div className="relative mb-12 p-8 bg-gradient-to-r from-purple-900/40 to-slate-900/40 border border-purple-500/20 rounded-[2rem] flex flex-col md:flex-row items-center gap-8 shadow-2xl overflow-hidden">
            {/* Animated Background Mesh */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(147,51,234,0.1),transparent_50%)]" />
            
            <div className="relative p-6 bg-purple-500/10 rounded-2xl border border-purple-500/30 backdrop-blur-md">
                <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full" />
                <FlaskConical className="text-purple-300 w-16 h-16 relative z-10" />
            </div>
            
            <div className="relative z-10 text-center md:text-left">
                <h2 className="text-4xl font-black text-white mb-2 tracking-tight flex items-center justify-center md:justify-start gap-3">
                    <Atom className="text-purple-400 animate-spin-slow" /> 
                    LABORATORIUM METODYCZNE
                </h2>
                <p className="text-purple-200/60 max-w-2xl text-lg leading-relaxed">
                    Centrum Badawczo-Rozwojowe Absurdu. Tutaj łamiemy prawa fizyki szkolnej, aby zwiększyć efektywność nauczania poprzez chaos.
                </p>
            </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            
            {/* LEFT: RESEARCH PROJECTS */}
            <div className="space-y-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <FileText size={24} className="text-purple-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-white tracking-wide">PROJEKTY BADAWCZE</h3>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {RESEARCH_DATA.map(res => {
                        // Check Requirements
                        if (res.req && !unlockedResearch.includes(res.req)) return null;

                        const isUnlocked = unlockedResearch.includes(res.id);
                        const canAfford = points >= res.cost;

                        return (
                        <motion.button
                            key={res.id}
                            whileHover={!isUnlocked && canAfford ? { scale: 1.02, x: 5 } : {}}
                            whileTap={!isUnlocked && canAfford ? { scale: 0.98 } : {}}
                            onClick={() => buyResearch(res.id)}
                            disabled={isUnlocked || !canAfford}
                            className={`group relative p-5 rounded-2xl border flex flex-col md:flex-row items-center md:items-start gap-6 text-left transition-all overflow-hidden w-full
                            ${isUnlocked
                                ? 'bg-emerald-900/10 border-emerald-500/30 opacity-60 cursor-default'
                                : (canAfford 
                                    ? 'bg-purple-900/10 border-purple-500/30 hover:bg-purple-900/20 hover:border-purple-400/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]' 
                                    : 'bg-slate-900/40 border-white/5 opacity-50 cursor-not-allowed')
                            }
                            `}
                        >
                            {/* Status Indicator Strip */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${isUnlocked ? 'bg-emerald-500' : (canAfford ? 'bg-purple-500' : 'bg-slate-700')}`} />

                            {/* Icon Box */}
                            <div className={`shrink-0 p-4 rounded-xl border flex items-center justify-center w-16 h-16 md:w-20 md:h-20
                                ${isUnlocked 
                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                                    : (canAfford ? 'bg-purple-500/10 border-purple-500/20 text-purple-400 group-hover:text-purple-200' : 'bg-slate-800 border-white/5 text-slate-500')
                                }
                            `}>
                                <res.icon size={32} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 w-full">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className={`font-bold text-lg md:text-xl flex items-center gap-2 ${isUnlocked ? 'text-emerald-100' : 'text-white'}`}>
                                        {res.name}
                                        {isUnlocked && <Check size={20} className="text-emerald-400" />}
                                    </h4>
                                    {!isUnlocked && (
                                        <span className={`font-mono text-sm px-2 py-1 rounded border ${canAfford ? 'bg-purple-500/20 border-purple-500/50 text-purple-200' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                                            {res.cost.toLocaleString()} pkt
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm md:text-base text-slate-400 leading-relaxed font-light">
                                    {res.desc}
                                </p>
                                
                                {/* Progress Bar (Fake for locked) */}
                                {!isUnlocked && !canAfford && (
                                    <div className="mt-4 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-red-500/50" 
                                            style={{ width: `${Math.min(100, (points / res.cost) * 100)}%` }} 
                                        />
                                    </div>
                                )}
                            </div>
                        </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* RIGHT: EQUIPMENT EVOLUTION */}
            <div className="space-y-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <Dna size={24} className="text-blue-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-white tracking-wide">EWOLUCJA SPRZĘTU</h3>
                </div>

                <div className="space-y-6 relative">
                    {/* Connecting Line (Decor) */}
                    <div className="absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-blue-500/0 via-blue-500/20 to-blue-500/0 hidden md:block" />

                    {Object.keys(ITEM_EVOLUTIONS).map(itemId => {
                        const currentTier = itemEvolutions[itemId as keyof typeof itemEvolutions] || 0;
                        const nextTier = ITEM_EVOLUTIONS[itemId][currentTier + 1];
                        const currentData = ITEM_EVOLUTIONS[itemId][currentTier];

                        // Visibility Check
                        const baseUpgrade = upgrades.find(u => u.id === itemId);
                        if (!baseUpgrade || baseUpgrade.level === 0) return null;

                        if (!nextTier) {
                            // MAX LEVEL CARD
                            return (
                                <div key={itemId} className="relative bg-slate-900/50 border border-white/5 p-6 rounded-2xl flex items-center gap-6 opacity-60 grayscale-[0.5]">
                                    <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center border border-white/10 shrink-0">
                                        <img src={`https://placehold.co/100x100/1e293b/${currentData.imgColor}?text=MAX`} className="w-10 h-10 object-contain" alt="Max" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-mono text-emerald-500 mb-1">STATUS: UKOŃCZONO</div>
                                        <h4 className="font-bold text-white text-lg">{currentData.name}</h4>
                                        <p className="text-sm text-slate-500">Osiągnięto szczyt ewolucji dla tego przedmiotu.</p>
                                    </div>
                                </div>
                            );
                        }

                        const canAfford = nextTier.cost && points >= nextTier.cost;

                        return (
                            <motion.div
                                key={itemId}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative bg-slate-900 border border-white/10 rounded-2xl overflow-hidden"
                            >
                                {/* Current Tier Header */}
                                <div className="bg-white/5 px-6 py-3 flex justify-between items-center border-b border-white/5">
                                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Obecna forma: {currentData.name}</span>
                                    <span className="text-xs font-mono bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">Tier {currentTier}</span>
                                </div>

                                <div className="p-6 flex flex-col md:flex-row items-center gap-6">
                                    
                                    {/* Evolution Visual */}
                                    <div className="flex items-center gap-4 shrink-0">
                                        <div className="w-16 h-16 bg-slate-800 rounded-xl border border-white/10 flex items-center justify-center opacity-50">
                                            <div className="text-[10px] text-slate-500">OBECNY</div>
                                        </div>
                                        <CircuitBoard className="text-slate-600" />
                                        <div className="w-20 h-20 bg-blue-900/20 rounded-xl border border-blue-500/30 flex items-center justify-center relative overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.15)]">
                                            <div className="absolute inset-0 bg-blue-500/10 animate-pulse" />
                                            <img src={`https://placehold.co/100x100/1e293b/${nextTier.imgColor}?text=EVO`} className="w-12 h-12 object-contain relative z-10" alt="Evo" />
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 text-center md:text-left">
                                        <h4 className="font-bold text-white text-xl mb-1">{nextTier.name}</h4>
                                        <p className="text-sm text-slate-400 mb-3">{nextTier.desc}</p>
                                        <div className="flex items-center justify-center md:justify-start gap-2">
                                            <span className="text-xs bg-white/5 px-2 py-1 rounded text-slate-300">Mnożnik: <span className="text-blue-400 font-bold">x{nextTier.multiplier}</span></span>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <button
                                        onClick={() => evolveItem(itemId)}
                                        disabled={!canAfford}
                                        className={`shrink-0 px-6 py-3 rounded-xl font-bold font-mono transition-all flex flex-col items-center min-w-[120px]
                                            ${canAfford 
                                                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:shadow-blue-500/25' 
                                                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                                            }
                                        `}
                                    >
                                        <span className="text-xs opacity-70">EWOLUUJ</span>
                                        <span>{nextTier.cost ? nextTier.cost.toLocaleString() : '0'}</span>
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}

                    {/* Empty State */}
                    {Object.keys(ITEM_EVOLUTIONS).every(itemId => {
                        const baseUpgrade = upgrades.find(u => u.id === itemId);
                        return !baseUpgrade || baseUpgrade.level === 0;
                    }) && (
                        <div className="p-12 text-center border-2 border-dashed border-white/10 rounded-2xl bg-white/5">
                            <Lock className="mx-auto text-slate-600 mb-4" size={48} />
                            <h4 className="text-slate-300 font-bold text-lg">Brak Sprzętu do Ewolucji</h4>
                            <p className="text-slate-500 mt-2">Kup podstawowe przedmioty (Kreda, Gąbka) w sklepie, aby rozpocząć proces ewolucji.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};