import React from 'react';
import { useGame } from '../../context/GameContext';
import { RESEARCH_DATA, ITEM_EVOLUTIONS } from '../../data/gameData';
import { FlaskConical, FileText, Check, CircuitBoard } from 'lucide-react';

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
    <div className="max-w-6xl mx-auto">
        <div className="mb-8 p-6 bg-purple-900/20 border border-purple-500/30 rounded-3xl flex items-center gap-6 shadow-lg">
            <div className="p-4 bg-purple-500/20 rounded-2xl">
                <FlaskConical className="text-purple-400 w-12 h-12" />
            </div>
            <div>
            <h2 className="text-2xl font-bold text-white mb-2">Laboratorium Metodyczne</h2>
            <p className="text-purple-200/70 max-w-2xl">Ośrodek badawczo-rozwojowy absurdu. Tutaj odblokujesz nowe mechaniki i ulepszysz posiadane przedmioty.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT: RESEARCH */}
            <div className="space-y-6">
                <h3 className="text-xl font-bold text-purple-300 flex items-center gap-2"><FileText size={20}/> Projekty Badawcze</h3>
                <div className="grid grid-cols-1 gap-4">
                    {RESEARCH_DATA.map(res => {
                        // Check Requirements
                        if (res.req && !unlockedResearch.includes(res.req)) return null;

                        const isUnlocked = unlockedResearch.includes(res.id);

                        return (
                        <button
                            key={res.id}
                            onClick={() => buyResearch(res.id)}
                            disabled={isUnlocked || points < res.cost}
                            className={`p-4 rounded-xl border flex items-center gap-4 text-left transition-all relative overflow-hidden group
                            ${isUnlocked
                                ? 'bg-green-900/10 border-green-500/30 opacity-70'
                                : (points >= res.cost ? 'bg-purple-900/10 border-purple-500/30 hover:bg-purple-900/20' : 'bg-black/20 border-white/5 opacity-50')}
                            `}
                        >
                            <div className={`p-3 rounded-lg ${isUnlocked ? 'bg-green-500/20' : 'bg-purple-500/20'}`}>
                                <res.icon className={isUnlocked ? 'text-green-400' : 'text-purple-400'} size={24} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-white text-lg flex items-center gap-2">
                                {res.name}
                                {isUnlocked && <Check size={16} className="text-green-500" />}
                                </h4>
                                <p className="text-sm text-slate-400">{res.desc}</p>
                            </div>
                            {!isUnlocked && (
                                <div className="font-mono font-bold text-right">
                                <div className={points >= res.cost ? 'text-white' : 'text-red-400'}>{res.cost.toLocaleString()}</div>
                                <div className="text-[10px] text-slate-500 uppercase">Koszt</div>
                                </div>
                            )}
                        </button>
                        );
                    })}
                </div>
            </div>

            {/* RIGHT: EVOLUTIONS */}
            <div className="space-y-6">
                <h3 className="text-xl font-bold text-blue-300 flex items-center gap-2"><CircuitBoard size={20}/> Ewolucja Ekwipunku</h3>
                <div className="space-y-4">
                    {Object.keys(ITEM_EVOLUTIONS).map(itemId => {
                        const currentTier = itemEvolutions[itemId as keyof typeof itemEvolutions] || 0;
                        const nextTier = ITEM_EVOLUTIONS[itemId][currentTier + 1];
                        const currentData = ITEM_EVOLUTIONS[itemId][currentTier];

                        // Visibility Check: Player must own the base item (level > 0)
                        const baseUpgrade = upgrades.find(u => u.id === itemId);
                        if (!baseUpgrade || baseUpgrade.level === 0) return null;

                        if (!nextTier) {
                            return (
                                <div key={itemId} className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between opacity-50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded bg-slate-800 flex items-center justify-center">
                                            <img src={`https://placehold.co/100x100/1e293b/${currentData.imgColor}?text=MAX`} className="w-8 h-8 object-contain" alt="Max" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">{currentData.name}</h4>
                                            <span className="text-xs text-green-400">MAKSYMALNY POZIOM</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        const canAfford = nextTier.cost && points >= nextTier.cost;

                        return (
                            <button
                                key={itemId}
                                onClick={() => evolveItem(itemId)}
                                disabled={!canAfford}
                                className={`w-full p-4 border rounded-xl flex items-center gap-4 text-left transition-all
                                    ${canAfford ? 'bg-blue-900/10 border-blue-500/30 hover:bg-blue-900/20' : 'bg-black/20 border-white/5 opacity-50'}
                                `}
                            >
                                    <div className="relative">
                                    <div className="w-16 h-16 bg-slate-800 rounded-lg overflow-hidden border border-white/10">
                                        <img src={`https://placehold.co/100x100/1e293b/${nextTier.imgColor}?text=EVO`} className="w-full h-full object-cover" alt="Evo" />
                                    </div>
                                    <div className="absolute -top-2 -right-2 bg-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full text-white">TIER {nextTier.tier}</div>
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-slate-400 text-sm">{currentData.name}</span>
                                            <span className="text-slate-600">→</span>
                                            <span className="font-bold text-white">{nextTier.name}</span>
                                        </div>
                                        <p className="text-xs text-slate-400 mb-2">{nextTier.desc}</p>
                                        <div className="inline-block bg-blue-500/20 text-blue-300 text-[10px] font-mono px-2 py-1 rounded">
                                            Mnożnik: x{nextTier.multiplier}
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className={`font-mono font-bold ${canAfford ? 'text-white' : 'text-red-400'}`}>{nextTier.cost ? nextTier.cost.toLocaleString() : '0'}</div>
                                    </div>
                            </button>
                        );
                    })}

                    {/* Empty State Message if no items owned */}
                    {Object.keys(ITEM_EVOLUTIONS).every(itemId => {
                        const baseUpgrade = upgrades.find(u => u.id === itemId);
                        return !baseUpgrade || baseUpgrade.level === 0;
                    }) && (
                        <div className="p-8 text-center text-slate-500 italic border border-dashed border-white/10 rounded-xl">
                            Kup podstawowe przedmioty (Kreda, Gąbka, Kartkówka) w sklepie, aby odblokować ewolucje.
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};
