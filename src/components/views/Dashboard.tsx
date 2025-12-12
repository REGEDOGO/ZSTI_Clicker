import React, { useState } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Monitor, User, X, Zap, Eraser, Coffee, ArrowUpCircle, MousePointer2 } from 'lucide-react';
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

  const [selectedUpgrade, setSelectedUpgrade] = useState<any>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const controls = useAnimation();

  // --- ZAAWANSOWANY SYSTEM CZĄSTECZEK ---
  const spawnParticles = (e: React.MouseEvent) => {
    // Generowanie losowych ikon i kolorów
    const particleTypes = [
        { icon: <Eraser size={14} />, color: '#fff' },
        { icon: <Zap size={14} />, color: 'var(--theme-primary)' },
        { icon: <span className="text-xs font-bold font-mono">+{clickPower}</span>, color: 'var(--theme-primary)' }
    ];

    const newParticles: Particle[] = [];
    const count = 4 + Math.floor(Math.random() * 4); // 4-8 cząsteczek

    for (let i = 0; i < count; i++) {
        const type = particleTypes[Math.floor(Math.random() * particleTypes.length)];
        newParticles.push({
            id: Date.now() + i + Math.random(),
            x: e.clientX,
            y: e.clientY,
            icon: <div style={{ color: type.color }}>{type.icon}</div>,
            rotation: Math.random() * 360,
            velocity: {
                x: (Math.random() - 0.5) * 200, // Rozrzut na boki
                y: -150 - Math.random() * 150   // Zawsze w górę
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

      // Symulacja wstrząsu ekranu przy silnym sprzęcie
      let shakeIntensity = 2;
      if (hardware.gpu > 0) shakeIntensity = 4;
      if (hardware.gpu > 2) shakeIntensity = 8; // Mocniejszy wstrząs przy lepszym GPU

      await controls.start({
          scale: [1, 0.95, 1.02, 1],
          rotate: [0, -1, 1, 0],
          transition: { duration: 0.15 }
      });
  };

  const getEvolutionName = (itemId: string) => {
    if (itemEvolutions[itemId as keyof typeof itemEvolutions] && ITEM_EVOLUTIONS[itemId][itemEvolutions[itemId as keyof typeof itemEvolutions]]) {
      return ITEM_EVOLUTIONS[itemId][itemEvolutions[itemId as keyof typeof itemEvolutions]].name;
    }
    return null;
  };

  const getEvolutionImage = (itemId: string) => {
     if (itemEvolutions[itemId as keyof typeof itemEvolutions] && ITEM_EVOLUTIONS[itemId][itemEvolutions[itemId as keyof typeof itemEvolutions]]) {
        const evo = ITEM_EVOLUTIONS[itemId][itemEvolutions[itemId as keyof typeof itemEvolutions]];
        // Używamy placeholdera, ale w produkcji tutaj byłyby prawdziwe zdjęcia
        return `https://placehold.co/100x100/0f172a/${evo.imgColor ? evo.imgColor.replace('#','') : 'ffffff'}?text=${encodeURIComponent(evo.name.substring(0, 2).toUpperCase())}`;
     }
     return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full relative z-10"
    >
        {/* TŁO SIATKI (GRID BACKGROUND) */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none -z-10" />

        {/* --- LEWA KOLUMNA: REAKTOR (CLICKER) --- */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center min-h-[60vh] lg:min-h-auto relative">
            
            {/* Cytat Holograficzny */}
            <div className="absolute top-0 w-full flex justify-center px-4 z-20">
                <AnimatePresence mode='wait'>
                {activeQuote && (
                    <motion.div
                        key={activeQuote}
                        initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
                        className="bg-black/40 backdrop-blur-md border border-[var(--theme-primary)]/30 px-6 py-3 rounded-full text-center shadow-[0_0_20px_rgba(var(--theme-primary-rgb),0.2)]"
                    >
                        <p className="text-sm md:text-base italic text-[var(--theme-primary)] font-medium">
                            "{activeQuote}"
                        </p>
                    </motion.div>
                )}
                </AnimatePresence>
            </div>

            {/* GŁÓWNY PRZYCISK: "REAKTOR ABSURDU" */}
            <div className="relative group">
                {/* Rotating Rings (Decorative) */}
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                    className="absolute inset-[-40px] border border-dashed border-white/10 rounded-full z-0 pointer-events-none"
                />
                <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                    className="absolute inset-[-20px] border border-dotted border-[var(--theme-primary)]/20 rounded-full z-0 pointer-events-none"
                />

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    animate={controls}
                    onClick={handleVisualClick}
                    className="relative w-64 h-64 md:w-80 md:h-80 rounded-full flex items-center justify-center z-10 outline-none"
                >
                    {/* Outer Glow & Border */}
                    <div className="absolute inset-0 rounded-full bg-slate-900 border-4 border-[var(--theme-primary)]/30 shadow-[0_0_50px_rgba(var(--theme-primary-rgb),0.2)] group-hover:shadow-[0_0_80px_rgba(var(--theme-primary-rgb),0.4)] transition-all duration-300" />
                    
                    {/* Inner Dark Core */}
                    <div className="absolute inset-2 rounded-full bg-black flex items-center justify-center overflow-hidden">
                        {/* Radial Pulse Effect */}
                        <motion.div 
                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                            className="absolute inset-0 bg-[radial-gradient(circle,var(--theme-primary)_0%,transparent_70%)] opacity-40"
                        />
                        
                        {/* Icon & Text */}
                        <div className="relative z-20 text-center flex flex-col items-center gap-2">
                            <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            >
                                <User size={90} className="text-slate-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                            </motion.div>
                            
                            <div>
                                <h1 className="text-3xl font-black text-white tracking-widest drop-shadow-lg">NIERODKA</h1>
                                <div className="flex items-center justify-center gap-1 text-[var(--theme-primary)] font-mono text-xs mt-1 bg-black/60 px-2 py-1 rounded">
                                    <MousePointer2 size={10} />
                                    <span>MOC: {clickPower.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.button>
            </div>

            {/* Particles Layer */}
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
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="fixed pointer-events-none z-[100]"
                    >
                        {p.icon}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>

        {/* --- PRAWA KOLUMNA: BIURKO (INVENTORY) --- */}
        <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Header Biurka */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[var(--theme-primary)]" />
                
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Monitor className="text-[var(--theme-primary)]" /> 
                    <span className="tracking-wide">BIURKO NAUCZYCIELA</span>
                </h2>

                {/* COFFEE WIDGET (Advanced) */}
                {unlockedResearch.includes('caffeine_research') && (
                    <motion.button
                        onClick={drinkCoffee}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative group flex items-center gap-3 bg-black/40 pr-4 rounded-xl border border-white/5 hover:border-[var(--theme-primary)]/50 transition-colors"
                    >
                        {/* Cup Visual */}
                        <div className="w-10 h-14 relative bg-slate-800 rounded-b-xl rounded-t-sm border border-slate-600 m-2 overflow-hidden">
                            <motion.div 
                                className="absolute bottom-0 w-full bg-[#5C4033]"
                                initial={false}
                                animate={{ height: `${coffeeLevel}%` }}
                            />
                            {/* Bąbelki (Steam) */}
                            {coffeeLevel > 0 && (
                                <motion.div 
                                    animate={{ y: [-10, -20], opacity: [0.6, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                    className="absolute -top-3 left-1/2 w-1 h-2 bg-white/30 rounded-full blur-[1px]"
                                />
                            )}
                        </div>
                        
                        <div className="text-right">
                            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Poziom Kofeiny</div>
                            <div className={`text-lg font-mono font-bold ${coffeeLevel < 20 ? 'text-red-500 animate-pulse' : 'text-[var(--theme-primary)]'}`}>
                                {Math.floor(coffeeLevel)}%
                            </div>
                        </div>
                    </motion.button>
                )}
            </div>

            {/* GRID PRZEDMIOTÓW */}
            <div className="flex-1 bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-4 overflow-y-auto custom-scrollbar min-h-[400px]">
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {upgrades.filter(u => u.level > 0).map(u => {
                        const evolvedName = getEvolutionName(u.id);
                        const evolvedImg = getEvolutionImage(u.id);
                        const finalName = evolvedName || u.name;
                        const finalImg = evolvedImg || u.deskImage;

                        return (
                            <motion.button
                                key={u.id}
                                layoutId={`item-${u.id}`}
                                onClick={() => setSelectedUpgrade(u)}
                                whileHover={{ y: -4, boxShadow: "0 10px 20px -5px rgba(0,0,0,0.3)" }}
                                className="group relative aspect-[4/5] bg-slate-800/80 rounded-xl border border-white/5 hover:border-[var(--theme-primary)]/50 transition-all overflow-hidden flex flex-col"
                            >
                                {/* Background Gradient on Hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-primary)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                {/* Level Badge */}
                                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-mono text-white border border-white/10 z-10">
                                    LVL {u.level}
                                </div>

                                {/* Image Area */}
                                <div className="flex-1 flex items-center justify-center p-4 relative z-0">
                                    <img 
                                        src={finalImg} 
                                        alt={finalName} 
                                        className={`w-full h-full object-contain drop-shadow-xl transition-transform group-hover:scale-110 ${u.level > 50 ? 'filter contrast-125' : ''}`} 
                                    />
                                </div>

                                {/* Label Area */}
                                <div className="p-3 bg-black/40 backdrop-blur-sm border-t border-white/5 relative z-10">
                                    <div className="text-xs font-bold text-slate-200 truncate group-hover:text-[var(--theme-primary)] transition-colors">
                                        {finalName}
                                    </div>
                                    <div className="text-[10px] text-slate-500 flex items-center gap-1">
                                        {u.type === 'click' ? <MousePointer2 size={10}/> : <Zap size={10}/>}
                                        {u.type === 'click' ? 'Aktywny' : 'Pasywny'}
                                    </div>
                                </div>
                            </motion.button>
                        );
                    })}

                    {/* Placeholder jeśli pusto */}
                    {upgrades.every(u => u.level === 0) && (
                        <div className="col-span-full h-64 flex flex-col items-center justify-center text-slate-600 gap-4 border-2 border-dashed border-slate-800 rounded-2xl">
                            <Monitor size={48} className="opacity-20" />
                            <p className="text-sm uppercase tracking-widest opacity-50">Biurko jest puste</p>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* --- MODAL (SZCZEGÓŁY ULEPSZENIA) --- */}
        <AnimatePresence>
            {selectedUpgrade && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={() => setSelectedUpgrade(null)}>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 10 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-slate-900 border border-[var(--theme-primary)]/30 p-0 rounded-2xl max-w-lg w-full shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative"
                >
                    {/* Header Modala */}
                    <div className="bg-black/30 p-6 border-b border-white/5 flex justify-between items-start">
                        <div>
                            <h3 className="text-2xl font-black text-white">{selectedUpgrade.name}</h3>
                            <span className="text-xs font-mono text-[var(--theme-primary)] uppercase tracking-wider">
                                {selectedUpgrade.type === 'auto' ? 'Automatyzacja' : 'Interakcja'}
                            </span>
                        </div>
                        <button 
                            onClick={() => setSelectedUpgrade(null)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        <p className="text-slate-300 leading-relaxed border-l-2 border-[var(--theme-primary)] pl-4 italic">
                            {selectedUpgrade.description}
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                                <div className="text-xs text-slate-500 uppercase font-bold mb-1">Poziom</div>
                                <div className="text-2xl font-mono text-white">{selectedUpgrade.level}</div>
                            </div>
                            <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                                <div className="text-xs text-slate-500 uppercase font-bold mb-1">Efekt</div>
                                <div className="text-2xl font-mono text-[var(--theme-primary)] flex items-center gap-1">
                                    <ArrowUpCircle size={20} />
                                    +{selectedUpgrade.level * selectedUpgrade.baseEffect}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                buyUpgrade(selectedUpgrade.id);
                                // Optional: Keep modal open or close it
                                // setSelectedUpgrade(null); 
                            }}
                            disabled={points < selectedUpgrade.currentCost}
                            className={`w-full py-4 rounded-xl font-bold flex justify-center items-center gap-2 text-lg transition-all
                                ${points >= selectedUpgrade.currentCost 
                                    ? 'bg-[var(--theme-primary)] text-black hover:bg-white hover:shadow-[0_0_20px_rgba(var(--theme-primary-rgb),0.5)]' 
                                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                                }
                            `}
                        >
                            {points >= selectedUpgrade.currentCost ? (
                                <>Ulepsz za <span className="font-mono">{selectedUpgrade.currentCost.toLocaleString()}</span> pkt</>
                            ) : (
                                <>Brakuje {(selectedUpgrade.currentCost - points).toLocaleString()} pkt</>
                            )}
                        </button>
                    </div>
                </motion.div>
            </div>
            )}
        </AnimatePresence>
    </motion.div>
  );
};