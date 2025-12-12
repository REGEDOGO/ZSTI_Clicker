import React from 'react';
import { useGame } from '../../context/GameContext';
import { Lock, Trophy, Medal, Star, Crown, ShieldCheck } from 'lucide-react';
import { ACHIEVEMENTS } from '../../data/gameData';
import { motion } from 'framer-motion';

export const Achievements: React.FC = () => {
  const { unlockedAchievements } = useGame();

  const total = ACHIEVEMENTS.length;
  const unlockedCount = unlockedAchievements.length;
  const progress = (unlockedCount / total) * 100;

  return (
    <div className="max-w-7xl mx-auto pb-12">
        
        {/* --- HEADER: SUMMARY --- */}
        <div className="relative mb-12 bg-slate-900 rounded-[2.5rem] border border-white/10 p-8 md:p-10 overflow-hidden shadow-2xl">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-500/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[var(--theme-primary)]/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
                
                {/* Big Trophy Icon */}
                <div className="relative shrink-0">
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(234,179,8,0.3)] border-4 border-yellow-300/20">
                        <Trophy size={64} className="text-white drop-shadow-md" />
                    </div>
                    {/* Floating Stars */}
                    <motion.div 
                        animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }} 
                        transition={{ repeat: Infinity, duration: 3 }}
                        className="absolute -top-2 -right-2 text-yellow-300"
                    >
                        <Star size={32} fill="currentColor" />
                    </motion.div>
                </div>

                {/* Progress Info */}
                <div className="flex-1 w-full text-center md:text-left">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">SALA CHWAŁY</h2>
                    <p className="text-slate-400 text-lg mb-6">Kolekcja dowodów na to, że nie masz życia poza szkołą.</p>
                    
                    {/* Progress Bar */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm font-bold uppercase tracking-wider">
                            <span className="text-yellow-500">Postęp Kolekcji</span>
                            <span className="text-white">{unlockedCount} / {total}</span>
                        </div>
                        <div className="h-4 bg-black/50 rounded-full border border-white/5 overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-200 relative"
                            >
                                <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[size:20px_20px] opacity-30 animate-pulse" />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- GRID: TROPHIES --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {ACHIEVEMENTS.map((ach, index) => {
            const unlocked = unlockedAchievements.includes(ach.id);
            const Icon = ach.icon;
            
            return (
                <motion.div
                    key={ach.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`relative group overflow-hidden rounded-2xl border-2 transition-all duration-300 h-full
                        ${unlocked 
                            ? 'bg-gradient-to-br from-slate-900 to-slate-950 border-yellow-500/30 hover:border-yellow-500/60 hover:shadow-[0_0_30px_rgba(234,179,8,0.15)]' 
                            : 'bg-black/40 border-white/5 opacity-70 grayscale hover:opacity-100 hover:border-white/10'
                        }
                    `}
                >
                    {/* Background Shine for Unlocked */}
                    {unlocked && (
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(234,179,8,0.15),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}

                    <div className="p-6 flex flex-col items-center text-center h-full relative z-10">
                        
                        {/* Icon Container */}
                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-transform duration-500 group-hover:scale-110
                            ${unlocked 
                                ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/10 border border-yellow-500/40 text-yellow-400' 
                                : 'bg-slate-800 border border-white/5 text-slate-600'
                            }
                        `}>
                            {unlocked ? (
                                <Icon size={40} className="drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                            ) : (
                                <Lock size={32} />
                            )}
                        </div>

                        {/* Text Content */}
                        <div className="flex-1 flex flex-col justify-between w-full">
                            <div>
                                <h3 className={`font-bold text-lg mb-2 leading-tight ${unlocked ? 'text-white' : 'text-slate-500'}`}>
                                    {ach.name}
                                </h3>
                                <p className={`text-sm ${unlocked ? 'text-slate-400' : 'text-slate-600 blur-[2px] group-hover:blur-0 transition-all'}`}>
                                    {unlocked ? ach.desc : "??? (Zablokowane)"}
                                </p>
                            </div>

                            {/* Badge/Status */}
                            <div className="mt-6 pt-4 border-t border-white/5 w-full flex justify-center">
                                {unlocked ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-bold border border-yellow-500/20">
                                        <ShieldCheck size={12} /> ODBLOKOWANO
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-500 text-xs font-bold">
                                        <Lock size={12} /> TAJNE
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Corner Ribbon for Unlocked */}
                    {unlocked && (
                        <div className="absolute top-0 right-0">
                            <div className="w-16 h-16 overflow-hidden relative">
                                <div className="absolute top-0 right-0 bg-yellow-500 w-24 h-6 transform rotate-45 translate-x-8 translate-y-3 shadow-md" />
                            </div>
                        </div>
                    )}
                </motion.div>
            );
            })}
        </div>
    </div>
  );
};