import React from 'react';
import { useGame } from '../../context/GameContext';
import { HARDWARE_ITEMS } from '../../data/gameData';
import {
  Zap,
  MousePointer2,
  Monitor,
  Keyboard,
  Cpu,
  CircuitBoard,
  StickyNote,
  Fan,
  Plug,
  Lock,
  Box
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
    <div className="max-w-6xl mx-auto">
        {/* Rack Visualization */}
        <div className="mb-8 p-6 bg-black/40 border border-white/10 rounded-3xl flex flex-col md:flex-row gap-8 items-center justify-center shadow-inner relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

            <div className="flex flex-col items-center z-10">
                <div className="w-32 h-24 bg-slate-800 rounded-lg border-4 border-slate-600 flex items-center justify-center mb-2 relative overflow-hidden">
                {hardware.monitor === 0 && <span className="text-xs text-slate-500">Brak Monitora</span>}
                {hardware.monitor === 1 && <div className="w-20 h-16 bg-gray-400 rounded-full opacity-50 animate-pulse">CRT 14 cali</div>}
                {hardware.monitor === 2 && <div className="w-28 h-20 bg-blue-900/50 flex items-center justify-center text-xs">LCD <div className="w-1 h-1 bg-red-500 absolute top-4 left-8" /></div>}
                {hardware.monitor === 3 && <div className="absolute inset-0 bg-[url('https://placehold.co/128x96/000/fff?text=WALL')] opacity-50" />}
                </div>
                <span className="text-xs text-slate-400 uppercase tracking-wider">Monitor (Tier {hardware.monitor})</span>
            </div>

            <div className="flex flex-col items-center z-10">
                <div className="w-32 h-10 bg-slate-800 rounded-md border-b-4 border-slate-900 flex items-center justify-center mb-2">
                {hardware.keyboard === 0 && <span className="text-xs text-slate-500">Brak Klawiatury</span>}
                {hardware.keyboard === 1 && <div className="flex gap-1"><div className="w-2 h-2 bg-white/20"/> ...</div>}
                {hardware.keyboard === 2 && <div className="text-[10px] font-mono">CLICK-CLACK</div>}
                {hardware.keyboard === 3 && <div className="text-[10px] text-purple-400 animate-pulse">NEURAL LINK</div>}
                </div>
                <span className="text-xs text-slate-400 uppercase tracking-wider">Klawiatura (Tier {hardware.keyboard})</span>
            </div>

            <div className="flex flex-col items-center z-10">
                <div className="w-16 h-24 bg-slate-800 rounded-t-full border-b-0 border-4 border-slate-700 flex items-center justify-center mb-2">
                {hardware.mouse === 0 && <span className="text-[10px] text-slate-500">Brak</span>}
                {hardware.mouse === 1 && <div className="w-2 h-2 rounded-full bg-gray-500" />}
                {hardware.mouse === 2 && <div className="text-[10px]">Wireless</div>}
                {hardware.mouse === 3 && <div className="w-full h-full bg-gradient-to-t from-red-500 via-green-500 to-blue-500 opacity-20 animate-pulse" />}
                </div>
                <span className="text-xs text-slate-400 uppercase tracking-wider">Mysz (Tier {hardware.mouse})</span>
            </div>

             {/* Case (Obudowa) */}
             <div className="flex flex-col items-center z-10">
                <div className="w-24 h-32 bg-slate-800 rounded-lg border-4 border-slate-600 flex items-center justify-center mb-2 relative overflow-hidden">
                    {hardware.case === 0 && <span className="text-[10px] text-slate-500 text-center">Brak<br/>Obudowy</span>}
                    {hardware.case === 1 && <div className="w-16 h-24 bg-amber-200/20 border-2 border-amber-200/40 rotate-1 flex items-center justify-center text-[8px] text-amber-200">MLEKO</div>}
                    {hardware.case === 2 && <div className="w-20 h-28 bg-[#d4d4d0] border-2 border-gray-400 flex flex-col items-end p-1"><div className="w-2 h-2 bg-black/50 mb-1"/><div className="w-full h-px bg-black/20"/></div>}
                    {hardware.case === 3 && <div className="w-20 h-28 bg-black/80 border-2 border-purple-500 animate-pulse shadow-[0_0_15px_rgba(168,85,247,0.5)] flex items-center justify-center"><div className="w-16 h-20 border border-white/10 flex flex-wrap gap-1 p-1"><div className="w-full h-2 bg-red-500/50"/><div className="w-full h-2 bg-green-500/50"/><div className="w-full h-2 bg-blue-500/50"/></div></div>}
                </div>
                <span className="text-xs text-slate-400 uppercase tracking-wider">Obudowa (Tier {hardware.case})</span>
            </div>

            {/* GPU/CPU Vis */}
            <div className="flex flex-col items-center z-10 p-2 border border-white/5 rounded-lg bg-white/5">
                <div className="flex gap-2">
                <div className="flex flex-col items-center">
                    <Cpu className={`mb-1 ${hardware.cpu > 0 ? 'text-[var(--theme-primary)]' : 'text-slate-600'}`} />
                    <span className="text-[10px] text-slate-400">CPU T{hardware.cpu}</span>
                </div>
                <div className="flex flex-col items-center">
                    <CircuitBoard className={`mb-1 ${hardware.gpu > 0 ? 'text-green-400' : 'text-slate-600'}`} />
                    <span className="text-[10px] text-slate-400">GPU T{hardware.gpu}</span>
                </div>
                </div>
            </div>

            {/* Overclock Button */}
            {unlockedResearch.includes('overclock_license') && (
                <div className="ml-auto pl-8 border-l border-white/10 z-10">
                    <button
                        onClick={activateOverclock}
                        disabled={overclockTime > 0}
                        className={`w-40 h-40 rounded-full border-8 font-bold flex flex-col items-center justify-center transition-all
                            ${overclockTime > 0
                            ? 'border-yellow-500 bg-yellow-500/20 text-yellow-500 animate-pulse cursor-not-allowed'
                            : 'border-red-600 bg-red-900/20 text-red-500 hover:bg-red-900/40 hover:scale-105 shadow-[0_0_30px_rgba(220,38,38,0.4)]'}
                        `}
                    >
                        <Zap size={32} className="mb-2" />
                        {overclockTime > 0 ? (
                        <>
                            <span className="text-2xl">{overclockTime}s</span>
                            <span className="text-xs">PODKRĘCONO</span>
                        </>
                        ) : (
                        <>
                            <span className="text-lg text-center leading-tight">PODKRĘĆ<br/>SPRZĘT</span>
                            <span className="text-[10px] mt-1 opacity-70">Ryzyko awarii 30%</span>
                        </>
                        )}
                    </button>
                </div>
            )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {/* MICE */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase flex items-center gap-2"><MousePointer2 size={14}/> Myszki</h3>
                {HARDWARE_ITEMS.mouse.map((item, idx) => {
                    const isLocked = idx >= 1 && !unlockedResearch.includes('it_certificate');
                    if (isLocked) return (
                        <div key={item.id} className="w-full p-3 rounded-lg border border-white/5 bg-black/20 opacity-50 flex items-center justify-center">
                            <Lock size={12} className="mr-2 text-slate-500"/> <span className="text-[10px] text-slate-500">Zablokowane (Certyfikat)</span>
                        </div>
                    );
                    return (
                    <button
                    key={item.id}
                    onClick={() => buyHardware('mouse', idx + 1)}
                    disabled={hardware.mouse >= idx + 1 || points < item.cost}
                    className={`w-full p-3 rounded-lg border text-left transition-all relative overflow-hidden
                        ${hardware.mouse >= idx + 1
                        ? 'bg-[var(--theme-primary)]/10 border-[var(--theme-primary)] opacity-50'
                        : (points >= item.cost ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-black/20 border-white/5 opacity-50')}
                    `}
                    >
                    <h4 className="font-bold text-white text-xs mb-1">{item.name}</h4>
                    <div className="text-[10px] font-mono text-[var(--theme-primary)] mb-1">+{item.effect} click</div>
                    {hardware.mouse < idx + 1 && <span className="font-mono text-xs text-slate-400">{item.cost.toLocaleString()}</span>}
                    </button>
                )})}
            </div>

            {/* MONITORS */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase flex items-center gap-2"><Monitor size={14}/> Monitory</h3>
                {HARDWARE_ITEMS.monitor.map((item, idx) => {
                    const isLocked = idx >= 1 && !unlockedResearch.includes('it_certificate');
                    if (isLocked) return (
                        <div key={item.id} className="w-full p-3 rounded-lg border border-white/5 bg-black/20 opacity-50 flex items-center justify-center">
                            <Lock size={12} className="mr-2 text-slate-500"/> <span className="text-[10px] text-slate-500">Zablokowane (Certyfikat)</span>
                        </div>
                    );
                    return (
                    <button
                    key={item.id}
                    onClick={() => buyHardware('monitor', idx + 1)}
                    disabled={hardware.monitor >= idx + 1 || points < item.cost}
                    className={`w-full p-3 rounded-lg border text-left transition-all relative overflow-hidden
                        ${hardware.monitor >= idx + 1
                        ? 'bg-[var(--theme-primary)]/10 border-[var(--theme-primary)] opacity-50'
                        : (points >= item.cost ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-black/20 border-white/5 opacity-50')}
                    `}
                    >
                    <h4 className="font-bold text-white text-xs mb-1">{item.name}</h4>
                    <div className="text-[10px] font-mono text-[var(--theme-primary)] mb-1">Mnożnik x{item.multiplier}</div>
                    {hardware.monitor < idx + 1 && <span className="font-mono text-xs text-slate-400">{item.cost.toLocaleString()}</span>}
                    </button>
                )})}
            </div>

            {/* KEYBOARDS */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase flex items-center gap-2"><Keyboard size={14}/> Klawiatury</h3>
                {HARDWARE_ITEMS.keyboard.map((item, idx) => {
                    const isLocked = idx >= 1 && !unlockedResearch.includes('it_certificate');
                    if (isLocked) return (
                        <div key={item.id} className="w-full p-3 rounded-lg border border-white/5 bg-black/20 opacity-50 flex items-center justify-center">
                            <Lock size={12} className="mr-2 text-slate-500"/> <span className="text-[10px] text-slate-500">Zablokowane (Certyfikat)</span>
                        </div>
                    );
                    return (
                    <button
                    key={item.id}
                    onClick={() => buyHardware('keyboard', idx + 1)}
                    disabled={hardware.keyboard >= idx + 1 || points < item.cost}
                    className={`w-full p-3 rounded-lg border text-left transition-all relative overflow-hidden
                        ${hardware.keyboard >= idx + 1
                        ? 'bg-[var(--theme-primary)]/10 border-[var(--theme-primary)] opacity-50'
                        : (points >= item.cost ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-black/20 border-white/5 opacity-50')}
                    `}
                    >
                    <h4 className="font-bold text-white text-xs mb-1">{item.name}</h4>
                    <div className="text-[10px] font-mono text-yellow-500 mb-1">Odblokowuje Tier {item.unlockTier}</div>
                    {hardware.keyboard < idx + 1 && <span className="font-mono text-xs text-slate-400">{item.cost.toLocaleString()}</span>}
                    </button>
                )})}
            </div>

            {/* CASES (Obudowy) */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase flex items-center gap-2"><Box size={14}/> Obudowy</h3>
                {HARDWARE_ITEMS.case.map((item, idx) => {
                    const isLocked = idx >= 1 && !unlockedResearch.includes('it_certificate');
                     if (isLocked) return (
                        <div key={item.id} className="w-full p-3 rounded-lg border border-white/5 bg-black/20 opacity-50 flex items-center justify-center">
                            <Lock size={12} className="mr-2 text-slate-500"/> <span className="text-[10px] text-slate-500">Zablokowane (Certyfikat)</span>
                        </div>
                    );
                    return (
                    <button
                        key={item.id}
                        onClick={() => buyHardware('case', idx + 1)}
                        disabled={hardware.case >= idx + 1 || points < item.cost}
                        className={`w-full p-3 rounded-lg border text-left transition-all relative overflow-hidden
                            ${hardware.case >= idx + 1
                            ? 'bg-amber-500/10 border-amber-500 opacity-50'
                            : (points >= item.cost ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-black/20 border-white/5 opacity-50')}
                        `}
                    >
                        <h4 className="font-bold text-white text-xs mb-1">{item.name}</h4>
                        <div className="text-[10px] font-mono text-amber-400 mb-1">{item.desc}</div>
                        {hardware.case < idx + 1 && <span className="font-mono text-xs text-slate-400">{item.cost.toLocaleString()}</span>}
                    </button>
                    );
                })}
            </div>

            {/* RAM */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase flex items-center gap-2"><StickyNote size={14}/> RAM</h3>
                {HARDWARE_ITEMS.ram.map((item, idx) => {
                    const isLocked = idx >= 1 && !unlockedResearch.includes('it_certificate');
                    if (isLocked) return (
                        <div key={item.id} className="w-full p-3 rounded-lg border border-white/5 bg-black/20 opacity-50 flex items-center justify-center">
                            <Lock size={12} className="mr-2 text-slate-500"/> <span className="text-[10px] text-slate-500">Zablokowane (Certyfikat)</span>
                        </div>
                    );
                    return (
                    <button
                        key={item.id}
                        onClick={() => buyHardware('ram', idx + 1)}
                        disabled={hardware.ram >= idx + 1 || points < item.cost}
                        className={`w-full p-3 rounded-lg border text-left transition-all relative overflow-hidden
                            ${hardware.ram >= idx + 1
                            ? 'bg-purple-500/10 border-purple-500 opacity-50'
                            : (points >= item.cost ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-black/20 border-white/5 opacity-50')}
                        `}
                    >
                        <h4 className="font-bold text-white text-xs mb-1">{item.name}</h4>
                        <div className="text-[10px] font-mono text-purple-400 mb-1">{item.desc}</div>
                        {hardware.ram < idx + 1 && <span className="font-mono text-xs text-slate-400">{item.cost.toLocaleString()}</span>}
                    </button>
                    );
                })}
            </div>

            {/* COOLING */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase flex items-center gap-2"><Fan size={14}/> Chłodzenie</h3>
                {HARDWARE_ITEMS.cooling.map((item, idx) => {
                    const isLocked = idx >= 1 && !unlockedResearch.includes('it_certificate');
                    if (isLocked) return (
                        <div key={item.id} className="w-full p-3 rounded-lg border border-white/5 bg-black/20 opacity-50 flex items-center justify-center">
                            <Lock size={12} className="mr-2 text-slate-500"/> <span className="text-[10px] text-slate-500">Zablokowane (Certyfikat)</span>
                        </div>
                    );
                    return (
                    <button
                        key={item.id}
                        onClick={() => buyHardware('cooling', idx + 1)}
                        disabled={hardware.cooling >= idx + 1 || points < item.cost}
                        className={`w-full p-3 rounded-lg border text-left transition-all relative overflow-hidden
                            ${hardware.cooling >= idx + 1
                            ? 'bg-cyan-500/10 border-cyan-500 opacity-50'
                            : (points >= item.cost ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-black/20 border-white/5 opacity-50')}
                        `}
                    >
                        <h4 className="font-bold text-white text-xs mb-1">{item.name}</h4>
                        <div className="text-[10px] font-mono text-cyan-400 mb-1">{item.desc}</div>
                        {hardware.cooling < idx + 1 && <span className="font-mono text-xs text-slate-400">{item.cost.toLocaleString()}</span>}
                    </button>
                    );
                })}
            </div>

            {/* POWER */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase flex items-center gap-2"><Plug size={14}/> Zasilanie</h3>
                {HARDWARE_ITEMS.power.map((item, idx) => {
                    const isLocked = idx >= 1 && !unlockedResearch.includes('it_certificate');
                    if (isLocked) return (
                        <div key={item.id} className="w-full p-3 rounded-lg border border-white/5 bg-black/20 opacity-50 flex items-center justify-center">
                            <Lock size={12} className="mr-2 text-slate-500"/> <span className="text-[10px] text-slate-500">Zablokowane (Certyfikat)</span>
                        </div>
                    );
                    return (
                    <button
                        key={item.id}
                        onClick={() => buyHardware('power', idx + 1)}
                        disabled={hardware.power >= idx + 1 || points < item.cost}
                        className={`w-full p-3 rounded-lg border text-left transition-all relative overflow-hidden
                            ${hardware.power >= idx + 1
                            ? 'bg-yellow-500/10 border-yellow-500 opacity-50'
                            : (points >= item.cost ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-black/20 border-white/5 opacity-50')}
                        `}
                    >
                        <h4 className="font-bold text-white text-xs mb-1">{item.name}</h4>
                        <div className="text-[10px] font-mono text-yellow-400 mb-1">{item.desc}</div>
                        {hardware.power < idx + 1 && <span className="font-mono text-xs text-slate-400">{item.cost.toLocaleString()}</span>}
                    </button>
                    );
                })}
            </div>

            {/* GPU */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase flex items-center gap-2"><CircuitBoard size={14}/> Karty Graficzne</h3>
                {HARDWARE_ITEMS.gpu.map((item, idx) => {
                    const isLocked = idx >= 1 && !unlockedResearch.includes('it_certificate');
                    if (isLocked) return (
                        <div key={item.id} className="w-full p-3 rounded-lg border border-white/5 bg-black/20 opacity-50 flex items-center justify-center">
                            <Lock size={12} className="mr-2 text-slate-500"/> <span className="text-[10px] text-slate-500">Zablokowane (Certyfikat)</span>
                        </div>
                    );
                    return (
                    <button
                    key={item.id}
                    onClick={() => buyHardware('gpu', idx + 1)}
                    disabled={hardware.gpu >= idx + 1 || points < item.cost}
                    className={`w-full p-3 rounded-lg border text-left transition-all relative overflow-hidden
                        ${hardware.gpu >= idx + 1
                        ? 'bg-green-500/10 border-green-500 opacity-50'
                        : (points >= item.cost ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-black/20 border-white/5 opacity-50')}
                    `}
                    >
                    <h4 className="font-bold text-white text-xs mb-1">{item.name}</h4>
                    <div className="text-[10px] font-mono text-green-400 mb-1">Szansa Kryt: {Math.round(item.chance! * 100)}%</div>
                    {hardware.gpu < idx + 1 && <span className="font-mono text-xs text-slate-400">{item.cost.toLocaleString()}</span>}
                    </button>
                )})}
            </div>

            {/* CPU */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase flex items-center gap-2"><Cpu size={14}/> Procesory</h3>
                {HARDWARE_ITEMS.cpu.map((item, idx) => {
                    const isLocked = idx >= 1 && !unlockedResearch.includes('it_certificate');
                    if (isLocked) return (
                        <div key={item.id} className="w-full p-3 rounded-lg border border-white/5 bg-black/20 opacity-50 flex items-center justify-center">
                            <Lock size={12} className="mr-2 text-slate-500"/> <span className="text-[10px] text-slate-500">Zablokowane (Certyfikat)</span>
                        </div>
                    );
                    return (
                    <button
                    key={item.id}
                    onClick={() => buyHardware('cpu', idx + 1)}
                    disabled={hardware.cpu >= idx + 1 || points < item.cost}
                    className={`w-full p-3 rounded-lg border text-left transition-all relative overflow-hidden
                        ${hardware.cpu >= idx + 1
                        ? 'bg-blue-500/10 border-blue-500 opacity-50'
                        : (points >= item.cost ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-black/20 border-white/5 opacity-50')}
                    `}
                    >
                    <h4 className="font-bold text-white text-xs mb-1">{item.name}</h4>
                    <div className="text-[10px] font-mono text-blue-400 mb-1">Moc Kryt: +{item.multiplier}x</div>
                    {hardware.cpu < idx + 1 && <span className="font-mono text-xs text-slate-400">{item.cost.toLocaleString()}</span>}
                    </button>
                )})}
            </div>

        </div>
    </div>
  );
};
