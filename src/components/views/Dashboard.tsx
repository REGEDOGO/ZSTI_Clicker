import React, { act, useState } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Monitor, User, X, Zap, Eraser, MousePointer2, ArrowUpCircle, Sparkles, Crown, Flame, Star, Power, Moon, Activity, ArrowRight } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { ITEM_EVOLUTIONS } from '../../data/gameData';

interface Particle {
  id: number;
  x: number;
  y: number;
  icon: React.ReactNode;
  rotation: number;
  velocity: { x: number; y: number };
}

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
    unlockedResearch,
    hardware,
    clickPower
  } = useGame();

  const [selectedUpgradeId, setSelectedUpgradeId] = useState<string | null>(null);
  const activeUpgrade = selectedUpgradeId ? upgrades.find(u => u.id === selectedUpgradeId) : null;
  
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isAfkMode, setIsAfkMode] = useState(false);
  const controls = useAnimation();

  // --- LOGIKA MNOŻNIKÓW EWOLUCJI ---
  const getEvolutionMultiplier = (itemId: string) => {
      const currentTier = itemEvolutions[itemId as keyof typeof itemEvolutions];
      if (currentTier !== undefined && ITEM_EVOLUTIONS[itemId] && ITEM_EVOLUTIONS[itemId][currentTier]) {
          return ITEM_EVOLUTIONS[itemId][currentTier].multiplier;
      }
      return 1;
  };

  // --- NAZWY EWOLUCJI ---
  const getEvolutionName = (itemId: string) => {
    if (itemEvolutions[itemId as keyof typeof itemEvolutions] && ITEM_EVOLUTIONS[itemId][itemEvolutions[itemId as keyof typeof itemEvolutions]]) {
      return ITEM_EVOLUTIONS[itemId][itemEvolutions[itemId as keyof typeof itemEvolutions]].name;
    }
    return null;
  };

  const getEvolutionImage = (itemId: string) => {
     if (itemEvolutions[itemId as keyof typeof itemEvolutions] && ITEM_EVOLUTIONS[itemId][itemEvolutions[itemId as keyof typeof itemEvolutions]]) {
        const evo = ITEM_EVOLUTIONS[itemId][itemEvolutions[itemId as keyof typeof itemEvolutions]];
        const textColor = evo.imgColor === 'ffffff' ? '000000' : 'ffffff';
        return `https://placehold.co/100x100/0f172a/${evo.imgColor ? evo.imgColor.replace('#','') : 'ffffff'}?text=${encodeURIComponent(evo.name.substring(0, 2).toUpperCase())}&color=${textColor}`;
     }
     return null;
  };

  // --- STYLE POZIOMÓW ---
  const getLevelVisuals = (level: number) => {
      if (level >= 100) return {
          bg: "bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-red-500 via-purple-500 to-blue-500 animate-spin-slow",
          border: "border-white/50",
          text: "text-white",
          shadow: "shadow-[0_0_30px_rgba(255,255,255,0.8)]",
          icon: <Crown size={12} className="text-yellow-300 animate-bounce" />,
          label: "GODLIKE"
      };
      if (level >= 90) return {
          bg: "bg-red-900",
          border: "border-red-500",
          text: "text-red-200",
          shadow: "shadow-[0_0_20px_rgba(220,38,38,0.6)]",
          icon: <Flame size={12} className="text-red-500" />,
          label: "MYTHIC"
      };
      if (level >= 80) return {
          bg: "bg-orange-900",
          border: "border-orange-500",
          text: "text-orange-200",
          shadow: "shadow-[0_0_15px_rgba(234,88,12,0.5)]",
          icon: <Star size={12} className="text-orange-400" />,
          label: "LEGENDARY"
      };
      if (level >= 60) return {
          bg: "bg-purple-900",
          border: "border-purple-500",
          text: "text-purple-200",
          shadow: "shadow-[0_0_15px_rgba(147,51,234,0.5)]",
          icon: <Sparkles size={12} className="text-purple-400" />,
          label: "EPIC"
      };
      if (level >= 40) return {
          bg: "bg-cyan-900",
          border: "border-cyan-500",
          text: "text-cyan-200",
          shadow: "shadow-[0_0_10px_rgba(6,182,212,0.4)]",
          icon: <Zap size={12} className="text-cyan-400" />,
          label: "RARE"
      };
      if (level >= 20) return {
          bg: "bg-slate-700",
          border: "border-slate-400",
          text: "text-slate-200",
          shadow: "shadow-none",
          icon: null,
          label: "UNCOMMON"
      };
      if (level >= 10) return {
          bg: "bg-stone-800",
          border: "border-stone-600",
          text: "text-stone-400",
          shadow: "shadow-none",
          icon: null,
          label: "COMMON"
      };
      return {
          bg: "bg-black/60",
          border: "border-white/10",
          text: "text-slate-500",
          shadow: "shadow-none",
          icon: null,
          label: "BASIC"
      };
  };

  // --- SYSTEM CZĄSTECZEK ---
  const spawnParticles = (e: React.MouseEvent) => {
    if (isAfkMode) return; 

    const particleTypes = [
        { icon: <Eraser size={14} />, color: '#fff' },
        { icon: <Zap size={14} />, color: 'var(--theme-primary)' },
        { icon: <span className="text-xs font-bold font-mono">+{clickPower}</span>, color: 'var(--theme-primary)' }
    ];

    const newParticles: Particle[] = [];
    const count = 4 + Math.floor(Math.random() * 4);

    for (let i = 0; i < count; i++) {
        const type = particleTypes[Math.floor(Math.random() * particleTypes.length)];
        newParticles.push({
            id: Date.now() + i + Math.random(),
            x: e.clientX,
            y: e.clientY,
            icon: <div style={{ color: type.color }}>{type.icon}</div>,
            rotation: Math.random() * 360,
            velocity: {
                x: (Math.random() - 0.5) * 200,
                y: -150 - Math.random() * 150
            }
        });
    }

    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
        setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1000);
  };

  const handleVisualClick = async (e: React.MouseEvent) => {
      spawnParticles(e);
      handleClick(e);

      if (!isAfkMode) {
          let shakeIntensity = 2;
          if (hardware.gpu > 0) shakeIntensity = 4;
          if (hardware.gpu > 2) shakeIntensity = 8;

          await controls.start({
              scale: [1, 0.95, 1.02, 1],
              rotate: [0, -1, 1, 0],
              transition: { duration: 0.1 }
          });
      }
  };

  return (
    <>
    {/* --- AFK OVERLAY --- */}
    <AnimatePresence>
        {isAfkMode && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center p-8 text-center select-none"
            >
                <div className="space-y-12 flex flex-col items-center w-full max-w-md">
                    <div className="space-y-2">
                        <span className="text-sm font-mono text-slate-600 uppercase tracking-[0.5em] animate-pulse">System Oszczędzania Energii</span>
                        <div className="text-6xl md:text-8xl font-black text-[var(--theme-primary)] font-mono tabular-nums tracking-tighter opacity-80">
                            {points.toLocaleString()}
                        </div>
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.95, backgroundColor: "rgba(255,255,255,0.05)" }}
                        onClick={handleVisualClick}
                        className="w-48 h-48 rounded-full border-4 border-dashed border-slate-800 flex flex-col items-center justify-center text-slate-700 hover:text-slate-500 hover:border-slate-700 transition-colors group cursor-pointer outline-none"
                    >
                        <Activity size={48} className="group-hover:text-[var(--theme-primary)] transition-colors opacity-50" />
                        <span className="text-[10px] font-mono mt-4 uppercase tracking-widest opacity-50">Generowanie<br/>Ręczne</span>
                    </motion.button>

                    <button 
                        onClick={() => setIsAfkMode(false)}
                        className="group relative px-8 py-4 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all overflow-hidden w-full"
                    >
                        <div className="flex items-center justify-center gap-3 relative z-10 text-white font-bold tracking-widest text-sm">
                            <Power size={18} className="text-[var(--theme-primary)]" />
                            WZNOWIENIE SYSTEMU
                        </div>
                    </button>
                </div>
            </motion.div>
        )}
    </AnimatePresence>

    {/* --- NORMALNY DASHBOARD --- */}
    <div style={{ display: isAfkMode ? 'none' : 'block', height: '100%' }}>
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full relative"
        >
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none -z-10" />

            {/* --- LEWA KOLUMNA: REAKTOR --- */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center min-h-[60vh] lg:min-h-auto relative py-12">
                
                <div className="absolute top-4 w-full flex justify-center px-4 z-20">
                    <AnimatePresence mode='wait'>
                    {activeQuote && (
                        <motion.div
                            key={activeQuote}
                            initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
                            className="bg-black/60 backdrop-blur-md border border-[var(--theme-primary)]/30 px-6 py-3 rounded-full text-center shadow-[0_0_30px_rgba(var(--theme-primary-rgb),0.2)]"
                        >
                            <p className="text-sm md:text-base italic text-[var(--theme-primary)] font-medium">
                                "{activeQuote}"
                            </p>
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>

                <div className="mb-12 flex flex-col items-center z-20 relative">
                    <button 
                        onClick={() => setIsAfkMode(true)}
                        className="absolute -top-10 right-0 p-2 text-slate-500 hover:text-[var(--theme-primary)] transition-colors opacity-50 hover:opacity-100"
                        title="Tryb AFK (Oszczędzanie Zasobów)"
                    >
                        <Moon size={20} />
                    </button>

                    <span className="text-xs font-bold text-slate-500 uppercase tracking-[0.3em] mb-1">Dostępne Środki</span>
                    <div className="text-5xl md:text-6xl font-black text-white font-mono tabular-nums tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        {points.toLocaleString()}
                    </div>
                </div>

                <div className="relative group">
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                        className="absolute inset-[-50px] border border-dashed border-white/5 rounded-full z-0 pointer-events-none opacity-50"
                    />
                    <motion.div 
                        animate={{ rotate: -360 }}
                        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                        className="absolute inset-[-25px] border-2 border-dotted border-[var(--theme-primary)]/10 rounded-full z-0 pointer-events-none"
                    />

                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.95 }}
                        animate={controls}
                        onClick={handleVisualClick}
                        className="relative w-64 h-64 md:w-80 md:h-80 rounded-full flex items-center justify-center z-10 outline-none select-none"
                    >
                        <div className="absolute inset-4 rounded-full bg-black shadow-[0_0_60px_rgba(var(--theme-primary-rgb),0.3)] group-hover:shadow-[0_0_100px_rgba(var(--theme-primary-rgb),0.5)] transition-all duration-300" />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-800 to-black border-8 border-slate-900 shadow-2xl flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent_60%)]" />
                            <motion.div 
                                animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }}
                                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                className="absolute inset-0 bg-[var(--theme-primary)] rounded-full blur-xl"
                            />
                            <div className="relative z-20 flex flex-col items-center gap-3">
                                <motion.div
                                    animate={{ y: [0, -4, 0] }}
                                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                    className="p-4 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm"
                                >
                                    <User size={64} className="text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]" />
                                </motion.div>
                                <div className="text-center">
                                    <h1 className="text-2xl font-black text-white tracking-widest drop-shadow-md">NIERODKA</h1>
                                    <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-[var(--theme-primary)]/10 border border-[var(--theme-primary)]/20 text-[var(--theme-primary)] text-xs font-bold font-mono">
                                        <MousePointer2 size={12} />
                                        <span>MOC: {clickPower.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute inset-0 rounded-full bg-[linear-gradient(135deg,rgba(255,255,255,0.1)_0%,transparent_40%)] pointer-events-none" />
                    </motion.button>
                </div>

                <AnimatePresence>
                    {particles.map(p => (
                        <motion.div
                            key={p.id}
                            initial={{ x: p.x, y: p.y, opacity: 1, scale: 0.5, rotate: p.rotation }}
                            animate={{
                                x: p.x + p.velocity.x,
                                y: p.y + p.velocity.y,
                                opacity: 0,
                                scale: 1.5,
                                rotate: p.rotation + 90
                            }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="fixed pointer-events-none z-[100] text-shadow-sm"
                        >
                            {p.icon}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* --- PRAWA KOLUMNA: BIURKO --- */}
            <div className="lg:col-span-7 flex flex-col gap-6">
                
                {/* Header */}
                <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex justify-between items-center relative overflow-hidden shadow-lg">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[var(--theme-primary)]" />
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Monitor className="text-[var(--theme-primary)]" /> 
                        <span className="tracking-wide">BIURKO NAUCZYCIELA</span>
                    </h2>
                    {unlockedResearch.includes('caffeine_research') && (
                        <motion.button onClick={drinkCoffee} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative group flex items-center gap-3 bg-black/40 pr-4 rounded-xl border border-white/5 hover:border-[var(--theme-primary)]/50 transition-colors">
                            <div className="w-10 h-14 relative bg-slate-800 rounded-b-xl rounded-t-sm border border-slate-600 m-2 overflow-hidden">
                                <motion.div className="absolute bottom-0 w-full bg-[#5C4033]" initial={false} animate={{ height: `${coffeeLevel}%` }} />
                                {coffeeLevel > 0 && <motion.div animate={{ y: [-10, -20], opacity: [0.6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute -top-3 left-1/2 w-1 h-2 bg-white/30 rounded-full blur-[1px]" />}
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Kofeina</div>
                                <div className={`text-lg font-mono font-bold ${coffeeLevel < 20 ? 'text-red-500 animate-pulse' : 'text-[var(--theme-primary)]'}`}>{Math.floor(coffeeLevel)}%</div>
                            </div>
                        </motion.button>
                    )}
                </div>

                {/* GRID PRZEDMIOTÓW (KARTY) */}
                <div className="flex-1 bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-4 overflow-y-auto custom-scrollbar min-h-[400px]">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {upgrades.filter(u => u.level > 0).map(u => {
                            const evolvedName = getEvolutionName(u.id);
                            const evolvedImg = getEvolutionImage(u.id);
                            const finalName = evolvedName || u.name;
                            const finalImg = evolvedImg || u.deskImage;
                            const levelStyle = getLevelVisuals(u.level);
                            
                            // Obliczanie wartości po ewolucji (DLA GRID)
                            const multiplier = getEvolutionMultiplier(u.id);
                            const totalEffect = u.level * u.baseEffect * multiplier;

                            return (
                                <motion.button
                                    key={u.id}
                                    onClick={() => setSelectedUpgradeId(u.id)}
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    className={`group relative aspect-[4/5] bg-slate-900 border rounded-2xl overflow-hidden shadow-lg transition-all ${u.level >= 50 ? 'border-[var(--theme-primary)]/50' : 'border-white/10'}`}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--theme-primary)]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="absolute top-0 left-0 w-full p-2 flex justify-between items-start z-10">
                                        <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase border flex items-center gap-1 backdrop-blur-sm
                                            ${u.type === 'click' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'}
                                        `}>
                                            {u.type === 'click' ? <MousePointer2 size={10} /> : <Zap size={10} />}
                                            {u.type === 'click' ? 'AKT' : 'PAS'}
                                        </div>
                                        
                                        <div className={`text-[10px] font-mono px-1.5 py-0.5 rounded border backdrop-blur-sm flex items-center gap-1 ${levelStyle.bg} ${levelStyle.border} ${levelStyle.text} ${levelStyle.shadow}`}>
                                            {levelStyle.icon} LVL {u.level}
                                        </div>
                                    </div>

                                    <div className="absolute inset-0 flex items-center justify-center p-4">
                                        <div className={`absolute w-2/3 h-2/3 bg-white/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${u.level >= 100 ? 'bg-gradient-to-r from-red-500 to-blue-500 opacity-50' : ''}`} />
                                        <img 
                                            src={finalImg} 
                                            alt={finalName} 
                                            className={`w-3/4 h-3/4 object-contain drop-shadow-2xl transition-transform duration-300 group-hover:scale-110 z-10 ${u.level > 50 ? 'filter contrast-125' : ''}`} 
                                        />
                                    </div>

                                    <div className="absolute bottom-0 left-0 w-full bg-black/80 backdrop-blur-md border-t border-white/10 p-3 z-20">
                                        <div className="text-xs font-bold text-white truncate mb-0.5">{finalName}</div>
                                        <div className="text-[10px] text-[var(--theme-primary)] font-mono">
                                            +{totalEffect.toLocaleString()} {u.type === 'auto' ? '/s' : 'moc'}
                                        </div>
                                    </div>
                                </motion.button>
                            );
                        })}
                        {upgrades.every(u => u.level === 0) && (
                            <div className="col-span-full h-64 flex flex-col items-center justify-center text-slate-600 gap-4 border-2 border-dashed border-slate-800 rounded-2xl">
                                <Monitor size={48} className="opacity-20" />
                                <p className="text-sm uppercase tracking-widest opacity-50">Biurko jest puste</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- MODAL (SZCZEGÓŁY ULEPSZENIA - LIVE DATA) --- */}
            <AnimatePresence>
                {activeUpgrade && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={() => setSelectedUpgradeId(null)}>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 10 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-slate-900 border border-[var(--theme-primary)]/50 p-0 rounded-3xl max-w-md w-full shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden relative"
                    >
                        {/* Background Header Glow */}
                        <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-[var(--theme-primary)]/10 to-transparent pointer-events-none" />

                        <div className="p-6 relative z-10">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-2xl font-black text-white leading-none mb-1">
                                        {/* NAZWA EWOLUCJI W MODALU */}
                                        {getEvolutionName(activeUpgrade.id) || activeUpgrade.name}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs font-mono text-slate-400 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">
                                            {activeUpgrade.type === 'auto' ? 'Automatyzacja' : 'Interakcja'}
                                        </span>
                                        {(() => {
                                            const style = getLevelVisuals(activeUpgrade.level);
                                            return (
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${style.bg} ${style.border} ${style.text} ${style.shadow}`}>
                                                    {style.icon} {style.label}
                                                </span>
                                            );
                                        })()}
                                    </div>
                                </div>
                                <button onClick={() => setSelectedUpgradeId(null)} className="p-2 bg-black/40 hover:bg-white/10 rounded-full text-white transition-colors border border-white/10">
                                    <X size={20} />
                                </button>
                            </div>

                            <p className="text-slate-300 text-sm leading-relaxed mb-8 border-l-4 border-[var(--theme-primary)] pl-4 italic opacity-80 bg-white/5 py-2 rounded-r-lg">
                                "{activeUpgrade.description}"
                            </p>

                            {/* Stats Grid - Live Data */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 flex flex-col items-center text-center relative overflow-hidden">
                                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-1 z-10">Obecny Poziom</div>
                                    <div className="text-4xl font-black text-white z-10">{activeUpgrade.level}</div>
                                    <div className="absolute -bottom-4 -right-4 text-slate-700/20">
                                        <ArrowUpCircle size={64} />
                                    </div>
                                </div>
                                <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 flex flex-col items-center text-center relative overflow-hidden">
                                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-1 z-10">Moc / Zysk</div>
                                    <div className="text-3xl font-black text-[var(--theme-primary)] z-10 flex items-center gap-1">
                                        {/* EFEKT W MODALU (z uwzględnieniem ewolucji) */}
                                        +{activeUpgrade.baseEffect * getEvolutionMultiplier(activeUpgrade.id) * activeUpgrade.level}
                                        <ArrowRight size={16} className="text-slate-500 mx-1" />
                                        <span className="text-green-400">
                                             +{activeUpgrade.baseEffect * getEvolutionMultiplier(activeUpgrade.id) * (activeUpgrade.level + 1)}
                                        </span>
                                    </div>
                                    <div className="text-[10px] text-[var(--theme-primary)]/70 uppercase z-10">
                                        {activeUpgrade.type === 'auto' ? 'PKT / SEK' : 'NA KLIK'}
                                    </div>
                                </div>
                            </div>

                            {/* Upgrade Button (Dynamic) */}
                            <button
                                onClick={() => buyUpgrade(activeUpgrade.id)}
                                disabled={points < activeUpgrade.currentCost}
                                className={`w-full group relative py-5 rounded-2xl font-bold text-lg overflow-hidden transition-all shadow-xl
                                    ${points >= activeUpgrade.currentCost 
                                        ? 'text-black hover:scale-[1.02] active:scale-[0.98]' 
                                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                                    }
                                `}
                            >
                                {/* Background Gradient for Active State */}
                                {points >= activeUpgrade.currentCost && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--theme-primary)] via-emerald-300 to-[var(--theme-primary)] opacity-100 group-hover:opacity-90 transition-opacity animate-gradient-x" />
                                )}
                                
                                {/* Shine Effect Animation */}
                                {points >= activeUpgrade.currentCost && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                                )}

                                <div className="relative z-10 flex flex-col items-center justify-center leading-tight">
                                    {points >= activeUpgrade.currentCost ? (
                                        <>
                                            <div className="flex items-center gap-2">
                                                <Sparkles size={20} className="text-black fill-black" />
                                                <span>ULEPSZ DO POZIOMU {activeUpgrade.level + 1}</span>
                                            </div>
                                            <span className="text-xs font-mono opacity-80 mt-1">
                                                Koszt: {activeUpgrade.currentCost.toLocaleString()} pkt
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-2">
                                                <span>BRAKUJE ŚRODKÓW</span>
                                            </div>
                                            <span className="text-xs font-mono opacity-60 mt-1">
                                                Potrzeba jeszcze {(activeUpgrade.currentCost - points).toLocaleString()} pkt
                                            </span>
                                        </>
                                    )}
                                </div>
                            </button>
                        </div>
                    </motion.div>
                </div>
                )}
            </AnimatePresence>
        </motion.div>
    </div>
    </>
  );
};