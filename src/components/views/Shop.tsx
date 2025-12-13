import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { GraduationCap, Palette, Music, Dices, Lock, Check, ShoppingBag, ArrowUpRight, Zap, MousePointer2 } from 'lucide-react';
import { MUSIC_TRACKS, THEMES } from '../../data/gameData';
import { motion } from 'framer-motion';

export const Shop: React.FC = () => {
  const {
    points,
    upgrades,
    hardware,
    buyUpgrade,
    buyTheme,
    buyMusic,
    ownedThemes,
    ownedMusic
  } = useGame();

  const [activeShopTab, setActiveShopTab] = useState('education');

  const getImageUrl = (name: string, color: string) => {
    const text = encodeURIComponent(name.split(' ')[0]);
    return `https://placehold.co/600x400/0f172a/${color ? color.replace('#','') : 'ffffff'}?text=${text}`;
  };

  return (
    <div className="max-w-7xl mx-auto pb-12 relative z-0">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col lg:flex-row justify-between items-end mb-10 gap-6 border-b border-white/10 pb-8">
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-[var(--theme-primary)]/10 rounded-xl border border-[var(--theme-primary)]/20">
                        <ShoppingBag className="text-[var(--theme-primary)]" size={32} />
                    </div>
                    <h2 className="text-4xl font-black text-white tracking-tighter">SKLEP</h2>
                </div>
                <p className="text-slate-400 text-lg max-w-xl leading-relaxed">
                    Wydawaj mądrze. Albo głupio. To symulator, nikt nie sprawdzi Twojego PIT-u.
                </p>
            </div>

            {/* Navigation Pills */}
            <div className="flex gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md overflow-x-auto max-w-full">
                {[
                    { id: 'education', label: 'Edukacja', icon: <GraduationCap size={18} /> },
                    { id: 'style', label: 'Styl', icon: <Palette size={18} /> },
                    { id: 'audio', label: 'Fonoteka', icon: <Music size={18} /> }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveShopTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-bold text-sm relative overflow-hidden whitespace-nowrap
                            ${activeShopTab === tab.id
                                ? 'text-black shadow-lg bg-[var(--theme-primary)]'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }
                        `}
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            {tab.icon} {tab.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>

        {/* --- CONTENT AREA --- */}
        {/* Usunięto AnimatePresence i exit animations dla stabilności nawigacji */}
        <div className="min-h-[500px]">
            
            {/* 1. EDUKACJA */}
            {activeShopTab === 'education' && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="space-y-16"
                >
                    {[1, 2, 3].map(tier => {
                        const isLocked = (tier === 2 && hardware.keyboard < 2) || (tier === 3 && hardware.keyboard < 3);
                        const tierNames = ["Podstawy Przetrwania", "Zaawansowany Absurd", "Zakazana Wiedza"];
                        
                        if (isLocked) {
                            return (
                                <div key={tier} className="relative overflow-hidden rounded-3xl border border-white/5 bg-black/40 p-12 text-center opacity-60 grayscale">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="p-4 bg-slate-800 rounded-full border border-slate-600">
                                            <Lock className="text-slate-400" size={32} />
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-300 tracking-widest">TIER {tier} ZABLOKOWANY</h3>
                                        <p className="text-slate-500 font-mono">Wymagane ulepszenie klawiatury w Serwerowni</p>
                                    </div>
                                </div>
                            );
                        }

                        const tierUpgrades = upgrades.filter(u => u.tier === tier);

                        return (
                            <div key={tier} className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <span className="text-6xl font-black text-slate-800 select-none opacity-50">0{tier}</span>
                                    <h3 className="text-2xl font-bold text-white">{tierNames[tier-1]}</h3>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    {tierUpgrades.map(upgrade => {
                                        const canAfford = points >= upgrade.currentCost;
                                        
                                        return (
                                            <div 
                                                key={upgrade.id}
                                                className={`group relative flex flex-col md:flex-row bg-slate-900 border rounded-2xl overflow-hidden transition-all duration-300
                                                    ${canAfford ? 'border-white/10 hover:border-[var(--theme-primary)]/50 hover:shadow-2xl' : 'border-red-900/10 opacity-70'}
                                                `}
                                            >
                                                {/* Left: Image */}
                                                <div className="md:w-1/3 xl:w-1/4 relative h-48 md:h-auto overflow-hidden">
                                                    <img 
                                                        src={getImageUrl(upgrade.name, upgrade.imgColor)} 
                                                        alt={upgrade.name}
                                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent md:bg-gradient-to-r" />
                                                    
                                                    <div className="absolute top-3 left-3 flex gap-2">
                                                        <span className="bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-white border border-white/10 uppercase">
                                                            {upgrade.type === 'click' ? 'Aktywny' : 'Pasywny'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Right: Content */}
                                                <div className="flex-1 p-6 flex flex-col justify-between">
                                                    <div>
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h4 className="text-2xl font-bold text-white group-hover:text-[var(--theme-primary)] transition-colors">
                                                                {upgrade.name}
                                                            </h4>
                                                            <div className="text-right">
                                                                <div className="text-xs text-slate-500 uppercase font-bold">Poziom</div>
                                                                <div className="text-xl font-mono text-white">{upgrade.level}</div>
                                                            </div>
                                                        </div>
                                                        <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-2xl">
                                                            {upgrade.description}
                                                        </p>
                                                    </div>

                                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/5">
                                                        <div className="flex items-center gap-2 text-sm text-slate-400">
                                                            <span>Efekt:</span>
                                                            <span className="text-[var(--theme-primary)] font-bold font-mono">
                                                                +{upgrade.baseEffect} {upgrade.type === 'auto' ? 'pkt/s' : 'na klik'}
                                                            </span>
                                                        </div>

                                                        <button
                                                            onClick={() => buyUpgrade(upgrade.id)}
                                                            disabled={!canAfford}
                                                            className={`w-full sm:w-auto px-8 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2
                                                                ${canAfford 
                                                                    ? 'bg-white text-black hover:bg-[var(--theme-primary)] hover:scale-105 active:scale-95' 
                                                                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                                                }
                                                            `}
                                                        >
                                                            {canAfford ? (
                                                                <>
                                                                    <span>Kup</span>
                                                                    <span className="font-mono text-sm opacity-70 border-l border-black/20 pl-2 ml-1">
                                                                        {upgrade.currentCost.toLocaleString()}
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <span className="font-mono text-sm">Brakuje {(upgrade.currentCost - points).toLocaleString()}</span>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </motion.div>
            )}

            {/* 2. STYL */}
            {activeShopTab === 'style' && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    {Object.values(THEMES).filter(t => t.id !== 'default').map(theme => {
                        const isOwned = ownedThemes.includes(theme.id);
                        const canAfford = points >= theme.cost;

                        return (
                            <div key={theme.id} className={`group relative h-64 p-8 rounded-3xl border overflow-hidden flex flex-col justify-between transition-all
                                ${isOwned ? 'bg-slate-900 border-white/20' : 'bg-slate-950 border-white/5 opacity-80 hover:opacity-100'}
                            `}>
                                {/* Background Preview */}
                                <div className="absolute inset-0 transition-opacity opacity-20 group-hover:opacity-30" style={{ background: `linear-gradient(135deg, ${theme.colors.bg} 0%, ${theme.colors.card} 100%)` }} />
                                
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-2xl font-bold text-white">{theme.name}</h3>
                                        {isOwned && <Check className="text-green-400" />}
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="w-6 h-6 rounded-full border border-white/20" style={{ backgroundColor: theme.colors.primary }} />
                                        <div className="w-6 h-6 rounded-full border border-white/20" style={{ backgroundColor: theme.colors.secondary }} />
                                    </div>
                                </div>

                                <div className="relative z-10">
                                    {!isOwned ? (
                                        <button
                                            onClick={() => buyTheme(theme.id)}
                                            disabled={!canAfford}
                                            className={`w-full py-3 rounded-xl font-bold border transition-all
                                                ${canAfford ? 'bg-white/10 hover:bg-white/20 text-white border-white/20' : 'text-slate-500 border-white/5 cursor-not-allowed'}
                                            `}
                                        >
                                            {theme.cost.toLocaleString()} pkt
                                        </button>
                                    ) : (
                                        <div className="text-sm font-bold text-green-400 flex items-center gap-2">
                                            <Check size={16} /> ZAKUPIONO
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </motion.div>
            )}

            {/* 3. AUDIO */}
            {activeShopTab === 'audio' && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4"
                >
                    {MUSIC_TRACKS.filter(t => t.id !== 'silence').map(track => {
                        const isOwned = ownedMusic.includes(track.id);
                        const canAfford = points >= track.cost;

                        return (
                            <div key={track.id} className={`flex items-center gap-5 p-5 rounded-2xl border transition-all
                                ${isOwned ? 'bg-slate-900 border-green-500/30' : 'bg-slate-950 border-white/5'}
                            `}>
                                <div className={`p-4 rounded-xl ${isOwned ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-slate-400'}`}>
                                    <Music size={24} />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-bold text-white truncate">{track.name}</h3>
                                    <p className="text-xs text-slate-500">Audio Track</p>
                                </div>

                                {!isOwned ? (
                                    <button
                                        onClick={() => buyMusic(track.id)}
                                        disabled={!canAfford}
                                        className={`px-4 py-2 rounded-lg font-mono text-sm font-bold transition-all
                                            ${canAfford ? 'bg-white text-black hover:bg-slate-200' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}
                                        `}
                                    >
                                        {track.cost.toLocaleString()}
                                    </button>
                                ) : (
                                    <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded">POSIADANE</span>
                                )}
                            </div>
                        );
                    })}
                </motion.div>
            )}

        </div>
    </div>
  );
};