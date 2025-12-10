import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { GraduationCap, Palette, Music, Dices, Lock, Check } from 'lucide-react';
import { MUSIC_TRACKS, THEMES } from '../../data/gameData';

export const Shop: React.FC = () => {
  const {
    points,
    upgrades,
    hardware,
    buyUpgrade,
    buyTheme,
    buyMusic,
    ownedThemes,
    ownedMusic,
    unlockedResearch,
    gamble
  } = useGame();

  const [activeShopTab, setActiveShopTab] = useState('education');

  const getImageUrl = (name: string, color: string) => {
    const text = encodeURIComponent(name);
    return `https://placehold.co/600x400/1e293b/${color}?text=${text}`;
  };

  return (
    <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {[
                { id: 'education', label: 'Edukacja', icon: <GraduationCap size={18} /> },
                { id: 'style', label: 'Styl', icon: <Palette size={18} /> },
                { id: 'audio', label: 'Fonoteka', icon: <Music size={18} /> }
            ].map(tab => (
                <button
                key={tab.id}
                onClick={() => setActiveShopTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all whitespace-nowrap ${
                    activeShopTab === tab.id
                    ? 'bg-white/10 border-white/20 text-white'
                    : 'bg-transparent border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/5'
                }`}
                style={activeShopTab === tab.id ? { borderColor: 'var(--theme-primary)', color: 'var(--theme-primary)' } : {}}
                >
                {tab.icon} {tab.label}
                </button>
            ))}
            </div>

            {/* Gambling Button */}
            <button
            onClick={gamble}
            className="flex items-center gap-2 px-4 py-2 bg-red-900/40 hover:bg-red-900/60 border border-red-500/50 rounded-xl text-red-200 transition-all"
            >
            <Dices size={20} /> <span className="hidden md:inline">Ryzykowna Inwestycja</span>
            </button>
        </div>

        {/* EDUCATION SHOP */}
        {activeShopTab === 'education' && (
            <div className="space-y-12">
            {[1, 2, 3].map(tier => {
                const isLocked = (tier === 2 && hardware.keyboard < 2) || (tier === 3 && hardware.keyboard < 3);

                if (isLocked) {
                    const missingCert = tier === 2 && !unlockedResearch.includes('it_certificate');

                    return (
                    <div key={tier} className="opacity-50 grayscale select-none filter blur-sm relative overflow-hidden rounded-2xl border border-white/5 bg-black/20 p-8 text-center">
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                            <div className="bg-black/80 p-4 rounded-xl border border-white/20 backdrop-blur-md">
                            <Lock className="mx-auto mb-2 text-red-500" />
                            <h3 className="text-xl font-bold text-white mb-1">TIER {tier} ZABLOKOWANY</h3>
                            <p className="text-sm text-slate-400">
                                {missingCert ? "Wymagany Certyfikat Informatyka z Laboratorium." : "Wymagana lepsza klawiatura w Serwerowni."}
                            </p>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-slate-600 mb-4 flex items-center gap-3 justify-center">
                        <span className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-xs">{tier}</span>
                        ???
                        </h3>
                    </div>
                    );
                }

                const tierUpgrades = upgrades.filter(u => u.tier === tier);
                const tierNames = ["Rzeczywistość Szkolna", "Absurd i Chaos", "Kosmiczna Dominacja"];

                return (
                <div key={tier}>
                    <h3 className="text-xl font-bold text-slate-400 mb-4 flex items-center gap-3">
                    <span className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-xs">{tier}</span>
                    {tierNames[tier-1]}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tierUpgrades.map(upgrade => (
                        <button
                        key={upgrade.id}
                        onClick={() => buyUpgrade(upgrade.id)}
                        disabled={points < upgrade.currentCost}
                        className={`group relative overflow-hidden rounded-2xl border transition-all text-left h-full flex flex-col
                            ${points >= upgrade.currentCost
                            ? 'bg-white/5 border-white/10 hover:bg-white/10'
                            : 'bg-black/20 border-white/5 opacity-60 cursor-not-allowed'}
                        `}
                        style={points >= upgrade.currentCost ? { borderColor: 'var(--theme-primary)' } : {}}
                        >
                        {/* Image Card */}
                        <div className="aspect-video w-full overflow-hidden relative">
                            <img
                            src={getImageUrl(upgrade.name, upgrade.imgColor)}
                            alt={upgrade.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                            <div className="absolute bottom-3 right-3 text-right">
                                <div className={`font-mono font-bold text-lg ${points >= upgrade.currentCost ? 'text-white' : 'text-red-400'}`}>
                                {upgrade.currentCost.toLocaleString()}
                            </div>
                            </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col">
                            <h3 className="text-lg font-bold text-white mb-2 leading-tight">{upgrade.name}</h3>
                            <p className="text-sm text-slate-400 mb-4 flex-1">{upgrade.description}</p>
                            <div className="flex items-center justify-between text-xs pt-4 border-t border-white/10">
                            <span className="text-slate-500 bg-white/5 px-2 py-1 rounded">LVL {upgrade.level}</span>
                            <span className="font-mono" style={{ color: 'var(--theme-primary)' }}>+{upgrade.baseEffect} {upgrade.type === 'auto' ? '/s' : 'moc'}</span>
                            </div>
                        </div>
                        </button>
                    ))}
                    </div>
                </div>
                );
            })}
            </div>
        )}

        {/* STYLE SHOP */}
        {activeShopTab === 'style' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.values(THEMES).filter(t => t.id !== 'default').map(theme => {
                const isOwned = ownedThemes.includes(theme.id);
                return (
                    <button
                    key={theme.id}
                    onClick={() => !isOwned && buyTheme(theme.id)}
                    disabled={!isOwned && points < theme.cost}
                    className={`relative overflow-hidden p-6 rounded-2xl border transition-all text-left
                        ${isOwned ? 'bg-white/5 border-white/20' : (points >= theme.cost ? 'bg-white/5 hover:bg-white/10' : 'bg-black/20 opacity-50')}
                    `}
                    style={{ borderColor: isOwned ? theme.colors.primary : 'rgba(255,255,255,0.1)' }}
                    >
                        <div className="flex justify-between items-center mb-4">
                        <div className="flex gap-2">
                            <div className="w-8 h-8 rounded-full shadow-lg" style={{ backgroundColor: theme.colors.primary }} />
                            <div className="w-8 h-8 rounded-full shadow-lg -ml-4" style={{ backgroundColor: theme.colors.secondary }} />
                        </div>
                        {isOwned ? (
                            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded flex items-center gap-1"><Check size={12}/> POSIADANE</span>
                        ) : (
                            <div className="font-mono font-bold text-white">{theme.cost.toLocaleString()}</div>
                        )}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">{theme.name}</h3>
                        <p className="text-sm text-slate-400">Ekskluzywny motyw interfejsu.</p>
                    </button>
                );
                })}
            </div>
        )}

        {/* AUDIO SHOP */}
        {activeShopTab === 'audio' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MUSIC_TRACKS.filter(t => t.id !== 'silence').map(track => {
                const isOwned = ownedMusic.includes(track.id);
                return (
                <button
                    key={track.id}
                    onClick={() => !isOwned && buyMusic(track.id)}
                    disabled={!isOwned && points < track.cost}
                    className={`relative overflow-hidden p-6 rounded-2xl border transition-all text-left
                        ${isOwned ? 'bg-white/5 border-white/20' : (points >= track.cost ? 'bg-white/5 hover:bg-white/10' : 'bg-black/20 opacity-50')}
                    `}
                >
                    <div className="flex justify-between items-center mb-4">
                        <div className="p-3 bg-white/10 rounded-full"><Music className="text-slate-200" size={20} /></div>
                        {isOwned ? (
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded flex items-center gap-1"><Check size={12}/> POSIADANE</span>
                        ) : (
                        <div className="font-mono font-bold text-white">{track.cost.toLocaleString()}</div>
                        )}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{track.name}</h3>
                    <p className="text-sm text-slate-400">Muzyka tła.</p>
                </button>
                );
            })}
            </div>
        )}
    </div>
  );
};
