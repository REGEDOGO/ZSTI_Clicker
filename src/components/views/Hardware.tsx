import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { HARDWARE_ITEMS } from '../../data/gameData';
import {
  Zap, MousePointer2, Monitor, Keyboard, Cpu, CircuitBoard, 
  StickyNote, Fan, Plug, Lock, Box, Server, AlertTriangle
} from 'lucide-react';

export const Hardware: React.FC = () => {
  const {
    points,
    hardware,
    buyHardware,
    activateOverclock,
    overclockTime,
    unlockedResearch
  } = useGame();

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-12">
        
        {/* --- TOP SECTION: VISUAL RACK --- */}
        <div className="relative bg-slate-950 rounded-[2rem] border border-white/10 p-8 md:p-12 overflow-hidden shadow-2xl">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_70%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />
            
            {/* Header */}
            <div className="relative z-10 flex justify-between items-start mb-12">
                <div>
                    <h2 className="text-3xl font-black text-white flex items-center gap-3 tracking-tight">
                        <Server className="text-[var(--theme-primary)]" /> CENTRUM OBLICZENIOWE
                    </h2>
                    <p className="text-slate-400 text-sm mt-1 font-mono">Status systemu: {overclockTime > 0 ? 'NIESTABILNY (OVERCLOCK)' : 'NOMINALNY'}</p>
                </div>
                
                {/* Overclock Button (Reactor Core) */}
                {unlockedResearch.includes('overclock_license') && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={activateOverclock}
                        disabled={overclockTime > 0}
                        className={`relative group px-8 py-4 rounded-xl font-bold flex items-center gap-4 transition-all overflow-hidden
                            ${overclockTime > 0 
                                ? 'bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 cursor-not-allowed' 
                                : 'bg-red-500/10 border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white hover:shadow-[0_0_40px_rgba(239,68,68,0.4)]'
                            }
                        `}
                    >
                        {/* Animated Background for Active State */}
                        {overclockTime > 0 && (
                            <motion.div 
                                className="absolute inset-0 bg-yellow-500/20"
                                animate={{ opacity: [0.2, 0.5, 0.2] }}
                                transition={{ repeat: Infinity, duration: 0.5 }}
                            />
                        )}

                        <div className={`p-2 rounded-lg ${overclockTime > 0 ? 'bg-yellow-500 text-black' : 'bg-red-500 text-white group-hover:bg-white group-hover:text-red-500'} transition-colors`}>
                            <Zap size={24} className={overclockTime > 0 ? 'animate-pulse' : ''} />
                        </div>
                        
                        <div className="text-left relative z-10">
                            <div className="text-xs font-mono opacity-80 uppercase tracking-wider">
                                {overclockTime > 0 ? 'CZAS DO AWARII' : 'SYSTEM BOOST'}
                            </div>
                            <div className="text-xl font-black leading-none">
                                {overclockTime > 0 ? `${overclockTime}s` : 'PODKRĘĆ'}
                            </div>
                        </div>
                    </motion.button>
                )}
            </div>

            {/* Visual Hardware Grid */}
            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                <HardwareSlot 
                    icon={Monitor} 
                    label="Monitor" 
                    tier={hardware.monitor} 
                    color="text-blue-400" 
                    glow="shadow-blue-500/20"
                    items={HARDWARE_ITEMS.monitor}
                />
                <HardwareSlot 
                    icon={Keyboard} 
                    label="Klawiatura" 
                    tier={hardware.keyboard} 
                    color="text-purple-400" 
                    glow="shadow-purple-500/20"
                    items={HARDWARE_ITEMS.keyboard}
                />
                <HardwareSlot 
                    icon={MousePointer2} 
                    label="Mysz" 
                    tier={hardware.mouse} 
                    color="text-emerald-400" 
                    glow="shadow-emerald-500/20"
                    items={HARDWARE_ITEMS.mouse}
                />
                <HardwareSlot 
                    icon={Box} 
                    label="Obudowa" 
                    tier={hardware.case} 
                    color="text-amber-400" 
                    glow="shadow-amber-500/20"
                    items={HARDWARE_ITEMS.case}
                />
                
                {/* Combo Slot for Internals */}
                <div className="col-span-2 md:col-span-4 lg:col-span-1 bg-white/5 rounded-2xl border border-white/5 p-4 flex flex-col justify-between relative group hover:bg-white/10 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                    <div className="flex justify-between items-start mb-2">
                        <Cpu className={hardware.cpu > 0 ? 'text-indigo-400' : 'text-slate-600'} />
                        <span className="text-[10px] font-mono text-slate-500">INTERNALS</span>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400">CPU</span>
                            <span className={`font-mono ${hardware.cpu > 0 ? 'text-indigo-400' : 'text-slate-600'}`}>T{hardware.cpu}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400">GPU</span>
                            <span className={`font-mono ${hardware.gpu > 0 ? 'text-green-400' : 'text-slate-600'}`}>T{hardware.gpu}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400">RAM</span>
                            <span className={`font-mono ${hardware.ram > 0 ? 'text-pink-400' : 'text-slate-600'}`}>T{hardware.ram}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        {/* --- UPGRADE SHOP --- */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
            
            {/* LEFT COLUMN: PERIPHERALS & CASE */}
            <div className="space-y-12">
                <CategorySection title="Peryferia & Obudowa" icon={Box}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <UpgradeGroup 
                            title="Myszki" 
                            icon={MousePointer2} 
                            items={HARDWARE_ITEMS.mouse} 
                            currentTier={hardware.mouse}
                            onBuy={(tier) => buyHardware('mouse', tier)}
                            points={points}
                            locked={false}
                            color="text-emerald-400"
                        />
                        <UpgradeGroup 
                            title="Monitory" 
                            icon={Monitor} 
                            items={HARDWARE_ITEMS.monitor} 
                            currentTier={hardware.monitor}
                            onBuy={(tier) => buyHardware('monitor', tier)}
                            points={points}
                            locked={!unlockedResearch.includes('it_certificate')}
                            color="text-blue-400"
                        />
                        <UpgradeGroup 
                            title="Klawiatury" 
                            icon={Keyboard} 
                            items={HARDWARE_ITEMS.keyboard} 
                            currentTier={hardware.keyboard}
                            onBuy={(tier) => buyHardware('keyboard', tier)}
                            points={points}
                            locked={!unlockedResearch.includes('it_certificate')}
                            color="text-purple-400"
                        />
                        <UpgradeGroup 
                            title="Obudowy" 
                            icon={Box} 
                            items={HARDWARE_ITEMS.case} 
                            currentTier={hardware.case}
                            onBuy={(tier) => buyHardware('case', tier)}
                            points={points}
                            locked={!unlockedResearch.includes('it_certificate')}
                            color="text-amber-400"
                        />
                    </div>
                </CategorySection>
            </div>

            {/* RIGHT COLUMN: INTERNALS (CPU/GPU/RAM) */}
            <div className="space-y-12">
                <CategorySection title="Podzespoły Bazowe" icon={Cpu}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <UpgradeGroup 
                            title="Procesory" 
                            icon={Cpu} 
                            items={HARDWARE_ITEMS.cpu} 
                            currentTier={hardware.cpu}
                            onBuy={(tier) => buyHardware('cpu', tier)}
                            points={points}
                            locked={!unlockedResearch.includes('it_certificate')}
                            color="text-indigo-400"
                        />
                        <UpgradeGroup 
                            title="Grafika" 
                            icon={CircuitBoard} 
                            items={HARDWARE_ITEMS.gpu} 
                            currentTier={hardware.gpu}
                            onBuy={(tier) => buyHardware('gpu', tier)}
                            points={points}
                            locked={!unlockedResearch.includes('it_certificate')}
                            color="text-green-400"
                        />
                        <UpgradeGroup 
                            title="Pamięć RAM" 
                            icon={StickyNote} 
                            items={HARDWARE_ITEMS.ram} 
                            currentTier={hardware.ram}
                            onBuy={(tier) => buyHardware('ram', tier)}
                            points={points}
                            locked={!unlockedResearch.includes('it_certificate')}
                            color="text-pink-400"
                        />
                        <div className="space-y-4">
                            <UpgradeGroup 
                                title="Chłodzenie" 
                                icon={Fan} 
                                items={HARDWARE_ITEMS.cooling} 
                                currentTier={hardware.cooling}
                                onBuy={(tier) => buyHardware('cooling', tier)}
                                points={points}
                                locked={!unlockedResearch.includes('it_certificate')}
                                color="text-cyan-400"
                            />
                            <UpgradeGroup 
                                title="Zasilanie" 
                                icon={Plug} 
                                items={HARDWARE_ITEMS.power} 
                                currentTier={hardware.power}
                                onBuy={(tier) => buyHardware('power', tier)}
                                points={points}
                                locked={!unlockedResearch.includes('it_certificate')}
                                color="text-yellow-400"
                            />
                        </div>
                    </div>
                </CategorySection>
            </div>

        </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const HardwareSlot = ({ icon: Icon, label, tier, color, glow, items }: any) => {
    const itemName = tier > 0 ? items[tier-1].name : 'Brak';
    
    return (
        <div className={`bg-slate-900/50 rounded-2xl border border-white/5 p-4 flex flex-col justify-between relative group hover:border-white/10 transition-all ${tier > 0 ? glow : ''}`}>
            {tier > 0 && <div className={`absolute inset-0 bg-gradient-to-br ${color.replace('text-', 'from-')}/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl`} />}
            
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-2 rounded-lg bg-black/40 ${tier > 0 ? color : 'text-slate-600'}`}>
                    <Icon size={20} />
                </div>
                <span className="text-[10px] font-mono text-slate-500 uppercase">TIER {tier}</span>
            </div>
            
            <div className="relative z-10">
                <div className="text-xs text-slate-400 mb-1">{label}</div>
                <div className={`font-bold text-sm leading-tight ${tier > 0 ? 'text-white' : 'text-slate-600'}`}>
                    {itemName}
                </div>
            </div>
        </div>
    );
};

const CategorySection = ({ title, icon: Icon, children }: any) => (
    <div>
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3 pl-2 border-l-4 border-[var(--theme-primary)]">
            <Icon size={24} className="text-[var(--theme-primary)]" />
            {title}
        </h3>
        {children}
    </div>
);

const UpgradeGroup = ({ title, icon: Icon, items, currentTier, onBuy, points, locked, color }: any) => {
    return (
        <div className="bg-black/20 rounded-2xl border border-white/5 p-4 space-y-4">
            <div className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wider ${color}`}>
                <Icon size={14} /> {title}
            </div>
            
            <div className="space-y-2">
                {items.map((item: any, idx: number) => {
                    const tier = idx + 1;
                    const isOwned = currentTier >= tier;
                    const isNext = currentTier === tier - 1;
                    const isLockedByResearch = locked && tier > 1; // Tier 1 always unlocked

                    if (isLockedByResearch) {
                        return (
                            <div key={item.id} className="w-full p-3 rounded-lg border border-white/5 bg-black/40 flex items-center justify-center gap-2 text-slate-600 text-xs">
                                <Lock size={12} /> Wymagany Certyfikat IT
                            </div>
                        );
                    }

                    return (
                        <button
                            key={item.id}
                            onClick={() => onBuy(tier)}
                            disabled={isOwned || !isNext || points < item.cost}
                            className={`w-full p-3 rounded-lg border text-left transition-all relative group
                                ${isOwned 
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 cursor-default' 
                                    : (isNext && points >= item.cost 
                                        ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white' 
                                        : 'bg-black/20 border-white/5 text-slate-500 opacity-50 cursor-not-allowed')
                                }
                            `}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-bold text-xs">{item.name}</span>
                                {isOwned ? (
                                    <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-400">POSIADANE</span>
                                ) : (
                                    <span className="font-mono text-xs opacity-70">{item.cost.toLocaleString()}</span>
                                )}
                            </div>
                            
                            <div className={`text-[10px] line-clamp-1 ${isOwned ? 'text-emerald-500/70' : 'text-slate-400'}`}>
                                {item.effect ? `+${item.effect} Click` : 
                                 item.multiplier ? `x${item.multiplier} Mnożnik` : 
                                 item.chance ? `${Math.round(item.chance * 100)}% Szansa` :
                                 item.desc || 'Ulepszenie sprzętowe'}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};