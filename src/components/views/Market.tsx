import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  DollarSign,
  AlertTriangle,
  PieChart,
  Activity,
  Maximize2
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

const PRESET_AMOUNTS = [1, 10, 25, 50, 100, 1000];
const PERCENTAGE_AMOUNTS = [0.1, 0.25, 0.5, 1.0];

const getRiskLevel = (volatility: number) => {
  if (volatility <= 0.05) return { label: 'NISKIE', color: 'text-emerald-400', bg: 'bg-emerald-500/20' };
  if (volatility <= 0.15) return { label: 'ŚREDNIE', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
  if (volatility <= 0.3) return { label: 'WYSOKIE', color: 'text-orange-500', bg: 'bg-orange-500/20' };
  return { label: 'EKSTREMALNE', color: 'text-red-500', bg: 'bg-red-500/20' };
};

// --- COMPONENTS ---

// 1. Grid Card Component
const StockCard: React.FC<{
  stock: MarketStock;
  price: number;
  owned: number;
  onClick: () => void;
}> = ({ stock, price, owned, onClick }) => {
  const priceDiff = price - stock.basePrice;
  const percentChange = ((priceDiff / stock.basePrice) * 100).toFixed(2);
  const isUp = priceDiff >= 0;

  return (
    <motion.div
      layoutId={`card-${stock.id}`}
      onClick={onClick}
      className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 hover:border-emerald-500/50 hover:bg-slate-800/80 transition-all cursor-pointer group relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 p-2 rounded-lg">
             <span className="font-mono font-bold text-lg text-white">{stock.symbol}</span>
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
             <span>{Math.abs(Number(percentChange))}%</span>
           </div>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-end">
         <div className="text-xs text-slate-400">
           Posiadasz: <span className="text-white font-mono">{owned}</span>
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
  onClose: () => void;
  onBuy: (amount: number) => void;
  onSell: (amount: number) => void;
}> = ({ stock, price, owned, history, points, onClose, onBuy, onSell }) => {
  const [tradeAmount, setTradeAmount] = useState<number | ''>('');

  const priceDiff = price - stock.basePrice;
  const isUp = priceDiff >= 0;
  const risk = getRiskLevel(stock.volatility);

  const chartData = useMemo(() => {
    return history.map((val, idx) => ({ idx, price: val }));
  }, [history]);

  const handleBuy = () => {
      const amt = Number(tradeAmount);
      if (amt > 0) {
          onBuy(amt);
          setTradeAmount('');
      }
  };

  const handleSell = () => {
      const amt = Number(tradeAmount);
      if (amt > 0) {
          onSell(amt);
          setTradeAmount('');
      }
  };

  const maxBuy = Math.floor(points / price);

  return (
    <motion.div
      layoutId={`card-${stock.id}`}
      className="bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden flex flex-col md:flex-row h-full md:h-[600px] shadow-2xl relative"
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
                <div className={`inline-flex items-center gap-1 text-sm px-2 py-1 rounded mt-1 ${risk.bg} ${risk.color}`}>
                   <AlertTriangle size={14} />
                   <span className="font-bold tracking-wider">{risk.label} RYZYKO</span>
                </div>
             </div>
          </div>

          <div className="flex-1 min-h-[300px] w-full bg-black/20 rounded-xl p-4 border border-white/5 relative">
              <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                      <defs>
                          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={isUp ? "#10b981" : "#ef4444"} stopOpacity={0.3}/>
                              <stop offset="95%" stopColor={isUp ? "#10b981" : "#ef4444"} stopOpacity={0}/>
                          </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                      <XAxis dataKey="idx" hide />
                      <YAxis domain={['auto', 'auto']} hide />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                        itemStyle={{ color: '#f8fafc' }}
                        formatter={(val: number) => [`${Math.floor(val).toLocaleString()} pkt`, 'Cena']}
                        labelFormatter={() => ''}
                      />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke={isUp ? "#10b981" : "#ef4444"}
                        fillOpacity={1}
                        fill="url(#colorPrice)"
                        strokeWidth={2}
                      />
                  </AreaChart>
              </ResponsiveContainer>
              <div className="absolute top-2 left-2 text-xs text-slate-500">History (Last 50 ticks)</div>
          </div>
       </div>

       {/* RIGHT: TRADING PANEL */}
       <div className="w-full md:w-[400px] bg-slate-800/30 p-6 flex flex-col gap-6">

          <div className="grid grid-cols-2 gap-4">
             <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700">
                <div className="text-xs text-slate-400 mb-1 flex items-center gap-1"><DollarSign size={12}/> Twoje Środki</div>
                <div className="text-xl font-mono font-bold text-emerald-400 truncate" title={Math.floor(points).toLocaleString()}>
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

          <div className="flex-1 flex flex-col gap-4">
             {/* Input Area */}
             <div>
                <label className="text-xs text-slate-400 mb-2 block uppercase tracking-wider">Ilość do handlu</label>
                <div className="relative">
                   <input
                      type="number"
                      value={tradeAmount}
                      onChange={(e) => setTradeAmount(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value)))}
                      className="w-full bg-black/40 border border-slate-600 rounded-xl py-3 px-4 text-white text-lg font-mono focus:outline-none focus:border-emerald-500 transition-colors"
                      placeholder="0"
                   />
                   <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">{stock.symbol}</span>
                </div>
             </div>

             {/* Percentage Presets */}
             <div className="grid grid-cols-4 gap-2">
                {PERCENTAGE_AMOUNTS.map(pct => (
                   <button
                     key={pct}
                     onClick={() => setTradeAmount(Math.floor(maxBuy * pct))}
                     className="bg-slate-700/50 hover:bg-slate-600/50 text-xs py-1.5 rounded text-slate-300 transition-colors"
                   >
                     {pct * 100}%
                   </button>
                ))}
             </div>

             {/* Amount Presets */}
             <div className="grid grid-cols-3 gap-2">
                {PRESET_AMOUNTS.map(amt => (
                   <button
                     key={amt}
                     onClick={() => setTradeAmount(amt)}
                     className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs py-2 rounded text-white transition-colors font-mono"
                   >
                     +{amt}
                   </button>
                ))}
             </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-auto">
             <button
                disabled={!tradeAmount || Number(tradeAmount) <= 0 || (Number(tradeAmount) * price) > points}
                onClick={handleBuy}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-emerald-900/20 transition-all active:scale-95 flex flex-col items-center justify-center leading-tight"
             >
                <span>KUP</span>
                <span className="text-[10px] opacity-80 font-normal">
                   Koszt: {tradeAmount ? (Number(tradeAmount) * price).toLocaleString() : 0}
                </span>
             </button>

             <button
                disabled={!tradeAmount || Number(tradeAmount) <= 0 || Number(tradeAmount) > owned}
                onClick={handleSell}
                className="bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-red-900/20 transition-all active:scale-95 flex flex-col items-center justify-center leading-tight"
             >
                <span>SPRZEDAJ</span>
                <span className="text-[10px] opacity-80 font-normal">
                   Zysk: {tradeAmount ? (Number(tradeAmount) * price).toLocaleString() : 0}
                </span>
             </button>
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

  const selectedStock = useMemo(() =>
    MARKET_STOCKS.find(s => s.id === selectedStockId),
  [selectedStockId]);

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
               onClose={() => setSelectedStockId(null)}
               onBuy={(amt) => buyStock(selectedStock.id, amt)}
               onSell={(amt) => sellStock(selectedStock.id, amt)}
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
             {MARKET_STOCKS.map(stock => (
               <StockCard
                  key={stock.id}
                  stock={stock}
                  price={marketPrices[stock.id] || stock.basePrice}
                  owned={marketInventory[stock.id] || 0}
                  onClick={() => setSelectedStockId(stock.id)}
               />
             ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
