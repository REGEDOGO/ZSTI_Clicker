import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { MARKET_STOCKS } from '../../data/gameData';

export const Market: React.FC = () => {
  const { points, marketOwned, marketPrices, buyStock, sellStock } = useGame();

  // Local state for tracking previous prices to show trends (up/down arrows)
  // Since marketPrices updates every 5s, we can compare current with previous render if we tracked it,
  // but simpler is to compare with basePrice or calculate change percentage live.
  // Ideally, context would provide 'previousPrices' or 'trend'.
  // For now, let's compare with basePrice or just rely on the volatility logic visually.

  // Actually, let's just show percentage change relative to Base Price for now.

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-8 h-8 text-emerald-400" />
            Giełda Szkolna
          </h2>
          <p className="text-gray-400">Inwestuj w ryzykowne aktywa edukacyjne.</p>
        </div>
        <div className="bg-emerald-900/30 px-4 py-2 rounded-lg border border-emerald-500/30">
          <p className="text-sm text-emerald-300">Twój Kapitał</p>
          <p className="text-2xl font-bold text-white">{Math.floor(points).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MARKET_STOCKS.map((stock) => {
          const currentPrice = marketPrices[stock.id] || stock.basePrice;
          const owned = marketOwned[stock.id] || 0;
          const priceDiff = currentPrice - stock.basePrice;
          const percentChange = ((priceDiff / stock.basePrice) * 100).toFixed(2);
          const isUp = priceDiff >= 0;

          return (
            <motion.div
              key={stock.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 hover:border-emerald-500/50 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-white">{stock.name}</h3>
                    <span className="text-xs font-mono bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded">
                      {stock.symbol}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 h-8">{stock.desc}</p>
                </div>
                <div className={`flex items-center gap-1 ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  <span className="font-mono font-bold">{Math.abs(Number(percentChange))}%</span>
                </div>
              </div>

              <div className="bg-slate-900/50 p-3 rounded-lg mb-4">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-gray-400 text-sm">Cena Aktualna</span>
                  <span className={`text-xl font-mono font-bold ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                    {Math.floor(currentPrice).toLocaleString()} pkt
                  </span>
                </div>
                <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                   {/* Simple visual indicator of price relative to base (center is base) */}
                   <div
                      className={`h-full ${isUp ? 'bg-emerald-500' : 'bg-red-500'}`}
                      style={{
                        width: `${Math.min(Math.abs(priceDiff / stock.basePrice) * 50, 50)}%`,
                        marginLeft: isUp ? '50%' : `calc(50% - ${Math.min(Math.abs(priceDiff / stock.basePrice) * 50, 50)}%)`
                      }}
                   />
                </div>
                <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                   <span>Min: {(stock.basePrice * 0.1).toFixed(0)}</span>
                   <span>Base: {stock.basePrice}</span>
                   <span>Max: {(stock.basePrice * 10).toFixed(0)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-4 px-2">
                <div className="text-sm text-gray-400">
                  Posiadasz: <span className="text-white font-bold">{owned}</span>
                </div>
                <div className="text-sm text-gray-400">
                  Wartość: <span className="text-emerald-300 font-bold">{(owned * currentPrice).toLocaleString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => buyStock(stock.id, 1)}
                  disabled={points < currentPrice}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-1"
                >
                  <DollarSign size={14} /> Kup (1)
                </button>
                <button
                  onClick={() => sellStock(stock.id, 1)}
                  disabled={owned < 1}
                  className="bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-1"
                >
                  <DollarSign size={14} /> Sprzedaj (1)
                </button>

                <button
                  onClick={() => buyStock(stock.id, 10)}
                  disabled={points < currentPrice * 10}
                  className="bg-emerald-600/70 hover:bg-emerald-500/70 disabled:opacity-50 disabled:cursor-not-allowed text-white py-1 rounded-lg font-bold text-xs transition-colors"
                >
                  Kup 10
                </button>
                 <button
                  onClick={() => sellStock(stock.id, 10)}
                  disabled={owned < 10}
                  className="bg-red-600/70 hover:bg-red-500/70 disabled:opacity-50 disabled:cursor-not-allowed text-white py-1 rounded-lg font-bold text-xs transition-colors"
                >
                  Sprzedaj 10
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
