import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  DollarSign,
  AlertTriangle,
  PieChart,
  Activity,
  Maximize2,
  ShieldAlert,
  Lock,
  Timer,
  Filter,
  ArrowUpDown,
  SlidersHorizontal,
  Check,
  ChevronDown,
  Clock
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { MARKET_STOCKS, MarketStock } from '../../data/gameData';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

// --- TYPES & HELPERS ---

const PRESET_AMOUNTS = [1, 10, 25, 50, 100, 1000, 5000, 10000, 25000, 50000, 100000, 1000000];
const PERCENTAGE_AMOUNTS = [0.1, 0.25, 0.5, 1.0];
const SELL_DEPOSIT_RATE = 0.20; // 20% kaucji
const COOLDOWN_MS = 10 * 60 * 1000; // 10 minut w milisekundach

const getRiskLevel = (volatility: number) => {
  if (volatility <= 0.05) return { label: 'NISKIE', color: 'text-emerald-400', bg: 'bg-emerald-500/20', value: 'LOW' };
  if (volatility <= 0.15) return { label: 'ŚREDNIE', color: 'text-yellow-400', bg: 'bg-yellow-500/20', value: 'MEDIUM' };
  if (volatility <= 0.3) return { label: 'WYSOKIE', color: 'text-orange-500', bg: 'bg-orange-500/20', value: 'HIGH' };
  return { label: 'EKSTREMALNE', color: 'text-red-500', bg: 'bg-red-500/20', value: 'EXTREME' };
};

const formatTimeLeft = (ms: number) => {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// --- COMPONENTS ---

// 1. Grid Card Component
const StockCard: React.FC<{
  stock: MarketStock;
  price: number;
  owned: number;
  // Dodano: prop z obliczonym procentem
  percentChange: number; 
  isUp: boolean;
  onClick: () => void;
  isCooldown: boolean;
}> = ({ stock, price, owned, percentChange, isUp, onClick, isCooldown }) => {
  
  return (
    <motion.div
      layoutId={`card-${stock.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      onClick={onClick}
      className={`relative bg-slate-800/50 p-4 rounded-xl border transition-all cursor-pointer group overflow-hidden
        ${isCooldown ? 'border-slate-700 opacity-70' : 'border-slate-700 hover:border-emerald-500/50 hover:bg-slate-800/80'}
      `}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 p-2 rounded-lg relative">
             <span className="font-mono font-bold text-lg text-white">{stock.symbol}</span>
             {isCooldown && (
                <div className="absolute -top-1 -right-1 bg-amber-500 text-black rounded-full p-0.5 shadow-lg z-10">
                    <Lock size={10} />
                </div>
             )}
          </div>
          <div>
            <h3 className="font-bold text-white group-hover:text-emerald-400 transition-colors">{stock.name}</h3>
            <p className="text-xs text-gray-500 truncate max-w-[150px]">{stock.desc}</p>
          </div>
        </div>
        <div className={`flex flex-col items-end ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
           <span className="font-mono font-bold text-lg">{Math.floor(price).toLocaleString()}</span>
           <div className="flex items-center gap-1 text-xs bg-slate-900/50 px-1.5 py-0.5 rounded">
             {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
             <span>{Math.abs(percentChange).toFixed(2)}%</span>
           </div>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-end">
         <div className="text-xs text-slate-400">
           Posiadasz: <span className="text-white font-mono">{owned.toLocaleString()}</span>
         </div>
         <div className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-500 text-xs flex items-center gap-1">
            Szczegóły <Maximize2 size={10} />
         </div>
      </div>

      {/* Background decoration */}
      <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-10 ${isUp ? 'bg-emerald-500' : 'bg-red-500'}`} />
    </motion.div>
  );
};

// 2. Detail View Component
const StockDetail: React.FC<{
  stock: MarketStock;
  price: number;
  owned: number;
  history: number[];
  points: number;
  lastTradeTime: number | undefined;
  onClose: () => void;
  onBuy: (amount: number) => void;
  onSell: (amount: number) => void;
}> = ({ stock, price, owned, history, points, lastTradeTime, onClose, onBuy, onSell }) => {
  const [tradeAmount, setTradeAmount] = useState<number | ''>('');
  const [now, setNow] = useState(Date.now());

  // Timer effect for cooldown update
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const cooldownRemaining = lastTradeTime ? Math.max(0, (lastTradeTime + COOLDOWN_MS) - now) : 0;
  const isCooldown = cooldownRemaining > 0;

  // --- Procenty względem historii ---
  const startPrice = history.length > 0 ? history[0] : stock.basePrice;
  const priceDiff = price - startPrice;
  const percentChange = (priceDiff / startPrice) * 100;
  const isUp = priceDiff >= 0;
  // ---------------------------------

  const risk = getRiskLevel(stock.volatility);

  const chartData = useMemo(() => {
    return history.map((val, idx) => ({ idx, price: val }));
  }, [history]);

  const handleBuy = () => {
      const amt = Number(tradeAmount);
      if (amt > 0 && !isCooldown) {
          onBuy(amt);
          setTradeAmount('');
      }
  };

  const handleSell = () => {
      const amt = Number(tradeAmount);
      if (amt > 0 && !isCooldown) {
          onSell(amt);
          setTradeAmount('');
      }
  };

  const maxBuy = Math.floor(points / price);
  const grossSellValue = tradeAmount ? Number(tradeAmount) * price : 0;
  const depositFee = grossSellValue * SELL_DEPOSIT_RATE;
  const netSellValue = grossSellValue - depositFee;

  return (
    <motion.div
      layoutId={`card-${stock.id}`}
      className="bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden flex flex-col md:flex-row h-full md:h-[650px] shadow-2xl relative"
    >
       <button
         onClick={onClose}
         className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-white/10 p-2 rounded-full text-white transition-colors"
       >
         <ArrowLeft size={20} />
       </button>

       {/* LEFT: CHART & INFO */}
       <div className="flex-1 p-6 flex flex-col border-b md:border-b-0 md:border-r border-slate-700 bg-slate-900/50">
          <div className="flex justify-between items-start mb-6">
             <div>
                <div className="flex items-center gap-3 mb-1">
                   <h2 className="text-3xl font-bold text-white">{stock.name}</h2>
                   <span className="font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded text-sm">{stock.symbol}</span>
                </div>
                <p className="text-slate-400">{stock.desc}</p>
             </div>
             <div className="text-right">
                <div className={`text-4xl font-mono font-bold ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                   {Math.floor(price).toLocaleString()}
                </div>
                <div className="flex justify-end items-center gap-2 mt-1">
                    <div className={`inline-flex items-center gap-1 text-xs bg-slate-800 px-2 py-1 rounded ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        <span className="font-mono">{Math.abs(percentChange).toFixed(2)}% (Wykres)</span>
                    </div>
                    <div className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded ${risk.bg} ${risk.color}`}>
                       <AlertTriangle size={12} />
                       <span className="font-bold tracking-wider">{risk.label}</span>
                    </div>
                </div>
             </div>
          </div>

          {/* CHART CONTAINER WITH IMPROVED VISUALS */}
          <div className="flex-1 min-h-[300px] w-full bg-slate-950 rounded-xl border border-slate-800 relative overflow-hidden group">
              {/* CSS Grid Pattern Background */}
              <div 
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-50 pointer-events-none" />

              <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                      <defs>
                          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={isUp ? "#10b981" : "#ef4444"} stopOpacity={0.4}/>
                              <stop offset="95%" stopColor={isUp ? "#10b981" : "#ef4444"} stopOpacity={0}/>
                          </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="5 5" stroke="#1e293b" vertical={true} />
                      <XAxis dataKey="idx" hide />
                      <YAxis domain={['auto', 'auto']} hide />
                      <Tooltip
                        contentStyle={{ 
                            backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                            borderColor: '#334155', 
                            color: '#f8fafc',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                            borderRadius: '8px'
                        }}
                        itemStyle={{ color: '#f8fafc', fontFamily: 'monospace' }}
                        formatter={(val: number) => [`${Math.floor(val).toLocaleString()} pkt`, 'Kurs']}
                        labelFormatter={() => ''}
                        cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke={isUp ? "#10b981" : "#ef4444"}
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorPrice)"
                        animationDuration={1000}
                      />
                  </AreaChart>
              </ResponsiveContainer>
              <div className="absolute top-3 left-3 text-[10px] uppercase tracking-widest text-slate-600 font-mono bg-slate-900/50 px-2 py-1 rounded backdrop-blur-sm">
                  Live Market Data • {isUp ? 'Bullish' : 'Bearish'} Trend
              </div>
          </div>
       </div>

       {/* RIGHT: TRADING PANEL */}
       <div className="w-full md:w-[400px] bg-slate-800/30 p-6 flex flex-col gap-6 overflow-y-auto">

          <div className="grid grid-cols-2 gap-4">
             <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700">
                <div className="text-xs text-slate-400 mb-1 flex items-center gap-1"><DollarSign size={12}/> Twoje Środki</div>
                <div className="text-xl font-mono font-bold text-emerald-400 truncate">
                   {Math.floor(points).toLocaleString()}
                </div>
             </div>
             <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700">
                <div className="text-xs text-slate-400 mb-1 flex items-center gap-1"><PieChart size={12}/> Posiadane Akcje</div>
                <div className="text-xl font-mono font-bold text-white truncate">
                   {owned.toLocaleString()} <span className="text-xs text-slate-500 font-normal">{stock.symbol}</span>
                </div>
             </div>
          </div>

          {/* Cooldown Alert */}
          {isCooldown && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex items-center gap-3 text-amber-400 animate-pulse">
                <Timer size={20} />
                <div className="text-sm">
                    <p className="font-bold">Ograniczenie handlu</p>
                    <p className="text-xs opacity-80">Kolejna transakcja możliwa za {formatTimeLeft(cooldownRemaining)}</p>
                </div>
            </div>
          )}

          <div className="flex-1 flex flex-col gap-4">
             <div>
                <label className="text-xs text-slate-400 mb-2 block uppercase tracking-wider">Ilość do handlu</label>
                <div className="relative">
                   <input
                      type="number"
                      value={tradeAmount}
                      disabled={isCooldown}
                      onChange={(e) => setTradeAmount(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value)))}
                      className="w-full bg-black/40 border border-slate-600 rounded-xl py-3 px-4 text-white text-lg font-mono focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder={isCooldown ? "Zablokowane" : "0"}
                   />
                   <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">{stock.symbol}</span>
                </div>
             </div>

             <div className="grid grid-cols-4 gap-2">
                {PERCENTAGE_AMOUNTS.map(pct => (
                   <button
                     key={pct}
                     disabled={isCooldown}
                     onClick={() => setTradeAmount(Math.floor(maxBuy * pct))}
                     className="bg-slate-700/50 hover:bg-slate-600/50 disabled:opacity-30 text-xs py-1.5 rounded text-slate-300 transition-colors"
                   >
                     {pct * 100}%
                   </button>
                ))}
             </div>

             <div className="grid grid-cols-3 gap-2">
                {PRESET_AMOUNTS.map(amt => (
                   <button
                     key={amt}
                     disabled={isCooldown}
                     onClick={() => setTradeAmount(amt)}
                     className="bg-slate-800 hover:bg-slate-700 border border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs py-2 rounded text-white transition-colors font-mono"
                   >
                     +{amt}
                   </button>
                ))}
             </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-auto">
             <button
                disabled={!tradeAmount || Number(tradeAmount) <= 0 || (Number(tradeAmount) * price) > points || isCooldown}
                onClick={handleBuy}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-emerald-900/20 transition-all active:scale-95 flex flex-col items-center justify-center leading-tight relative overflow-hidden"
             >
                {isCooldown ? (
                    <span className="flex items-center gap-2"><Lock size={16}/> {formatTimeLeft(cooldownRemaining)}</span>
                ) : (
                    <>
                        <span>KUP</span>
                        <span className="text-[10px] opacity-80 font-normal">
                           Koszt: {tradeAmount ? (Number(tradeAmount) * price).toLocaleString() : 0}
                        </span>
                    </>
                )}
             </button>

             <div className="flex flex-col gap-2 h-full">
                {tradeAmount && Number(tradeAmount) > 0 && !isCooldown && (
                     <div className="text-[10px] text-red-400 flex items-center justify-center gap-1 bg-red-900/20 py-1 px-2 rounded border border-red-900/30">
                        <ShieldAlert size={10} />
                        Kaucja -20%: {Math.floor(depositFee).toLocaleString()}
                     </div>
                )}
                <button
                    disabled={!tradeAmount || Number(tradeAmount) <= 0 || Number(tradeAmount) > owned || isCooldown}
                    onClick={handleSell}
                    className="h-full bg-red-600 hover:bg-red-500 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-red-900/20 transition-all active:scale-95 flex flex-col items-center justify-center leading-tight"
                >
                    {isCooldown ? (
                        <span className="flex items-center gap-2"><Lock size={16}/> {formatTimeLeft(cooldownRemaining)}</span>
                    ) : (
                        <>
                            <span>SPRZEDAJ</span>
                            <span className="text-[10px] opacity-80 font-normal font-mono mt-1">
                            Wypłata: {tradeAmount ? Math.floor(netSellValue).toLocaleString() : 0}
                            </span>
                        </>
                    )}
                </button>
             </div>
          </div>
       </div>
    </motion.div>
  );
};

// --- MAIN COMPONENT ---

export const Market: React.FC = () => {
  const {
    points,
    marketInventory,
    marketPrices,
    marketHistory,
    buyStock,
    sellStock
  } = useGame();

  const [selectedStockId, setSelectedStockId] = useState<string | null>(null);
  const [lastTradeTimes, setLastTradeTimes] = useState<Record<string, number>>({});

  // --- FILTER STATES ---
  const [filterRisk, setFilterRisk] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('DEFAULT'); 
  const [showOwnedOnly, setShowOwnedOnly] = useState<boolean>(false);
  const [showAvailableOnly, setShowAvailableOnly] = useState<boolean>(false); 

  const selectedStock = useMemo(() =>
    MARKET_STOCKS.find(s => s.id === selectedStockId),
  [selectedStockId]);

  // --- FILTERING LOGIC ---
  const filteredStocks = useMemo(() => {
    let result = MARKET_STOCKS.map(stock => {
        const price = marketPrices[stock.id] || stock.basePrice;
        const owned = marketInventory[stock.id] || 0;
        
        // --- ZMIANA: Procenty względem historii ---
        // Pobieramy historię dla danej akcji
        const history = marketHistory[stock.id] || [stock.basePrice];
        const startPrice = history.length > 0 ? history[0] : stock.basePrice;
        const priceDiff = price - startPrice;
        const percentChange = (priceDiff / startPrice) * 100;
        const isUp = priceDiff >= 0;
        // ------------------------------------------

        const volatility = stock.volatility;
        const risk = getRiskLevel(volatility);
        
        // Cooldown Calculation
        const lastTrade = lastTradeTimes[stock.id] || 0;
        const isCooldown = Date.now() < lastTrade + COOLDOWN_MS;

        return { ...stock, currentPrice: price, owned, percentChange, isUp, riskValue: risk.label, isCooldown };
    });

    // 1. Filter by Risk
    if (filterRisk !== 'ALL') {
        result = result.filter(s => s.riskValue === filterRisk);
    }

    // 2. Filter by Owned
    if (showOwnedOnly) {
        result = result.filter(s => s.owned > 0);
    }

    // 3. Filter by Available (Cooldown)
    if (showAvailableOnly) {
        result = result.filter(s => !s.isCooldown);
    }

    // 4. Sort
    result.sort((a, b) => {
        switch (sortBy) {
            case 'PRICE_ASC': return a.currentPrice - b.currentPrice;
            case 'PRICE_DESC': return b.currentPrice - a.currentPrice;
            case 'CHANGE_ASC': return a.percentChange - b.percentChange;
            case 'CHANGE_DESC': return b.percentChange - a.percentChange;
            case 'OWNED_DESC': return b.owned - a.owned;
            default: return 0; // Default order
        }
    });

    return result;
  }, [MARKET_STOCKS, marketPrices, marketInventory, marketHistory, filterRisk, sortBy, showOwnedOnly, showAvailableOnly, lastTradeTimes]);

  // Re-render when time passes to update cooldowns visually/logically
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
     const i = setInterval(() => setNow(Date.now()), 1000);
     return () => clearInterval(i);
  }, []);

  const handleBuyStock = (id: string, amount: number) => {
    buyStock(id, amount);
    setLastTradeTimes(prev => ({ ...prev, [id]: Date.now() }));
  };

  const handleSellStock = (id: string, amount: number) => {
    sellStock(id, amount);
    setLastTradeTimes(prev => ({ ...prev, [id]: Date.now() }));
  };

  return (
    <div className="space-y-6 pb-24 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-4xl font-black text-white flex items-center gap-3 tracking-tight">
            <Activity className="w-10 h-10 text-emerald-500" />
            GIEŁDA SZKOLNA <span className="text-emerald-500 text-sm font-mono border border-emerald-500/30 px-2 py-1 rounded bg-emerald-500/10 self-start mt-2">LIVE</span>
          </h2>
          <p className="text-slate-400 mt-2 text-lg">Inwestuj w ryzykowne aktywa edukacyjne. Pamiętaj: oceny nie są gwarantowane.</p>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-sm text-slate-500 uppercase tracking-widest mb-1">Dostępny Kapitał</p>
          <p className="text-3xl font-mono font-bold text-emerald-400 drop-shadow-lg">{Math.floor(points).toLocaleString()}</p>
        </div>
      </div>

      {/* --- FILTER TOOLBAR (STYLED) --- */}
      <div className="bg-slate-900/80 backdrop-blur-xl p-4 rounded-2xl border border-white/10 flex flex-col xl:flex-row gap-4 items-center justify-between shadow-xl">
         <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto">
            
            {/* Styled Risk Filter */}
            <div className="relative group w-full md:w-auto">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10">
                    <Filter size={16} />
                </div>
                <select 
                    value={filterRisk} 
                    onChange={(e) => setFilterRisk(e.target.value)}
                    className="appearance-none w-full md:w-56 bg-slate-800 border border-slate-700 text-white pl-10 pr-10 py-3 rounded-xl hover:border-emerald-500/50 focus:border-emerald-500 transition-colors cursor-pointer outline-none text-sm font-medium shadow-sm"
                >
                    <option value="ALL">Wszystkie ryzyka</option>
                    <option value="NISKIE">Niskie Ryzyko</option>
                    <option value="ŚREDNIE">Średnie Ryzyko</option>
                    <option value="WYSOKIE">Wysokie Ryzyko</option>
                    <option value="EKSTREMALNE">Ekstremalne</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                    <ChevronDown size={16} />
                </div>
            </div>

            {/* Styled Sort Filter */}
            <div className="relative group w-full md:w-auto">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10">
                    <ArrowUpDown size={16} />
                </div>
                <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none w-full md:w-64 bg-slate-800 border border-slate-700 text-white pl-10 pr-10 py-3 rounded-xl hover:border-emerald-500/50 focus:border-emerald-500 transition-colors cursor-pointer outline-none text-sm font-medium shadow-sm"
                >
                    <option value="DEFAULT">Domyślne sortowanie</option>
                    <option value="PRICE_DESC">Cena (Malejąco)</option>
                    <option value="PRICE_ASC">Cena (Rosnąco)</option>
                    <option value="CHANGE_DESC">Zmiana % (Największy zysk)</option>
                    <option value="CHANGE_ASC">Zmiana % (Największa strata)</option>
                    <option value="OWNED_DESC">Posiadane (Malejąco)</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                    <ChevronDown size={16} />
                </div>
            </div>
         </div>

         {/* Toggles */}
         <div className="flex gap-3 w-full xl:w-auto">
             {/* Available Toggle */}
             <button 
                onClick={() => setShowAvailableOnly(!showAvailableOnly)}
                className={`flex-1 xl:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl border transition-all text-sm font-bold shadow-sm
                    ${showAvailableOnly
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750 hover:border-slate-600'
                    }
                `}
             >
                {showAvailableOnly ? <Check size={16} /> : <Clock size={16} />}
                Dostępne
             </button>

             {/* Owned Toggle */}
             <button 
                onClick={() => setShowOwnedOnly(!showOwnedOnly)}
                className={`flex-1 xl:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl border transition-all text-sm font-bold shadow-sm
                    ${showOwnedOnly 
                        ? 'bg-blue-500/20 border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750 hover:border-slate-600'
                    }
                `}
             >
                {showOwnedOnly ? <Check size={16} /> : <SlidersHorizontal size={16} />}
                Posiadane
             </button>
         </div>
      </div>

      <AnimatePresence mode="wait">
        {selectedStockId && selectedStock ? (
          <motion.div
            key="detail"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
             <StockDetail
               stock={selectedStock}
               price={marketPrices[selectedStock.id] || selectedStock.basePrice}
               owned={marketInventory[selectedStock.id] || 0}
               history={marketHistory[selectedStock.id] || [selectedStock.basePrice]}
               points={points}
               lastTradeTime={lastTradeTimes[selectedStock.id]}
               onClose={() => setSelectedStockId(null)}
               onBuy={(amt) => handleBuyStock(selectedStock.id, amt)}
               onSell={(amt) => handleSellStock(selectedStock.id, amt)}
             />
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
             {filteredStocks.length > 0 ? (
                 filteredStocks.map(stock => {
                   return (
                     <StockCard
                        key={stock.id}
                        stock={stock}
                        price={stock.currentPrice}
                        owned={stock.owned}
                        percentChange={stock.percentChange}
                        isUp={stock.isUp}
                        onClick={() => setSelectedStockId(stock.id)}
                        isCooldown={stock.isCooldown}
                     />
                   );
                 })
             ) : (
                 <div className="col-span-full py-20 text-center text-slate-500 flex flex-col items-center justify-center bg-slate-900/30 rounded-3xl border border-dashed border-slate-800">
                    <div className="bg-slate-800 p-4 rounded-full mb-4">
                        <Filter size={32} className="opacity-50 text-slate-400" />
                    </div>
                    <p className="text-xl font-bold text-slate-300">Brak akcji spełniających kryteria</p>
                    <p className="text-sm text-slate-500 mt-2 max-w-md">Spróbuj zmienić filtry ryzyka lub wyłączyć filtrowanie dostępności.</p>
                    <button onClick={() => {setFilterRisk('ALL'); setShowOwnedOnly(false); setShowAvailableOnly(false); setSortBy('DEFAULT')}} className="mt-6 px-6 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg transition-colors font-medium text-sm">
                        Wyczyść wszystkie filtry
                    </button>
                 </div>
             )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};