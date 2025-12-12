import React, { useState, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../api/client';
import {
  CreditCard, Activity, MousePointer2, Star, Music, Palette, Trophy, Zap, ShoppingCart,
  Save, LogOut, Edit2, Check, X, Shield, Lock, Image as ImageIcon, Camera, Unlock, User as UserIcon
} from 'lucide-react';
import { MUSIC_TRACKS, THEMES, ACHIEVEMENTS } from '../../data/gameData';
import { motion } from 'framer-motion';

const BASE_URL = 'http://localhost:3000';

export const Profile: React.FC = () => {
  const {
    totalEarnings,
    totalPlayTime,
    totalClicks,
    prestigeLevel,
    getCurrentRank,
    formatTime,
    ownedMusic,
    ownedThemes,
    unlockedAchievements,
    maxCps,
    totalOverclocks,
    upgrades,
    hardware,
    isGuest,
    setShowAuthModal
  } = useGame() as any;

  const { user, logout, refreshUser } = useAuth();
  const [isEditingName, setIsEditingName] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || '');
  const [nameError, setNameError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // File Inputs
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Stats Calculations
  const totalMusic = MUSIC_TRACKS.length;
  const totalThemes = Object.keys(THEMES).length;
  const totalAchievements = ACHIEVEMENTS.length;
  const totalItemsBought = upgrades.reduce((acc: number, u: any) => acc + u.level, 0) +
                           Object.values(hardware).reduce((acc: number, val: any) => acc + val, 0);

  const handleUpdateName = async () => {
      if (!user?.id || !newUsername.trim()) return;

      try {
          await apiClient.updateUsername(user.id, newUsername);
          await refreshUser();
          setIsEditingName(false);
          setNameError(null);
      } catch (err: any) {
          setNameError(err.message || "Błąd aktualizacji");
      }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files?.[0] || !user?.id) return;
      try {
          await apiClient.uploadAvatar(user.id, e.target.files[0]);
          await refreshUser();
      } catch (err) {
          alert("Błąd wysyłania awatara");
      }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files?.[0] || !user?.id) return;

      if (unlockedAchievements.length < 10) {
          alert("Odblokuj 10 osiągnięć, aby zmienić baner!");
          e.target.value = '';
          return;
      }

      try {
          await apiClient.uploadBanner(user.id, e.target.files[0]);
          await refreshUser();
      } catch (err) {
          alert("Błąd wysyłania banera");
      }
  };

  const handleManualSave = async () => {
      setSaveStatus('saving');
      setTimeout(() => {
          setSaveStatus('saved');
          setTimeout(() => setSaveStatus('idle'), 2000);
      }, 1000);
  };

  const handleLogout = () => {
      if (confirm("Czy na pewno chcesz się wylogować?")) {
          logout();
      }
  };

  return (
    <div className="max-w-7xl mx-auto pb-12 space-y-8">

        {/* --- HEADER: IDENTITY CARD --- */}
        <div className="relative bg-slate-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl group/banner isolate">
            
            {/* Banner Image */}
            <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover/banner:scale-105"
                style={{
                    backgroundImage: user?.banner_url ? `url(${BASE_URL}${user.banner_url})` : undefined,
                    background: !user?.banner_url ? 'linear-gradient(to right, #0f172a, #1e293b)' : undefined
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />
            </div>

            {/* Edit Banner Button */}
            {!isGuest && (
                <div className="absolute top-6 right-6 opacity-0 group-hover/banner:opacity-100 transition-opacity z-20">
                    <button
                        onClick={() => {
                             if (unlockedAchievements.length < 10) {
                                alert("Odblokuj 10 osiągnięć, aby zmienić baner!");
                             } else {
                                bannerInputRef.current?.click();
                             }
                        }}
                        className={`p-3 rounded-full backdrop-blur-md transition-all border border-white/10 shadow-lg ${
                            unlockedAchievements.length < 10
                            ? 'bg-red-500/20 text-red-200 hover:bg-red-500/40 cursor-not-allowed'
                            : 'bg-black/40 text-white hover:bg-black/60'
                        }`}
                        title={unlockedAchievements.length < 10 ? "Wymaga 10 osiągnięć" : "Zmień Baner"}
                    >
                        {unlockedAchievements.length < 10 ? <Lock size={20} /> : <ImageIcon size={20} />}
                    </button>
                    <input type="file" ref={bannerInputRef} onChange={handleBannerUpload} className="hidden" accept="image/*" />
                </div>
            )}

            {/* Profile Info */}
            <div className="relative z-10 px-8 pb-8 pt-32 md:pt-48 flex flex-col md:flex-row items-end md:items-center gap-8">
                
                {/* Avatar */}
                <div className="relative group shrink-0">
                    <div className="w-36 h-36 md:w-48 md:h-48 rounded-full border-4 border-slate-900 bg-slate-800 shadow-2xl relative overflow-hidden">
                        <img
                            src={user?.avatar_url ? `${BASE_URL}${user.avatar_url}` : `https://placehold.co/400x400/1e293b/10b981?text=${(user?.username || 'G').charAt(0).toUpperCase()}`}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                        />
                        
                        {!isGuest && (
                            <div 
                                onClick={() => avatarInputRef.current?.click()}
                                className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm"
                            >
                                <Camera className="text-white" size={40} />
                            </div>
                        )}
                    </div>
                    
                    {!isGuest && <input type="file" ref={avatarInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />}

                    {/* Level Badge */}
                    <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 bg-slate-900 text-[var(--theme-primary)] text-xs md:text-sm font-bold px-3 py-1.5 rounded-full border border-white/10 shadow-lg z-20 flex items-center gap-1">
                        <Star size={12} fill="currentColor" />
                        LVL {Math.floor(totalClicks / 1000)}
                    </div>
                </div>

                {/* Text Info */}
                <div className="flex-1 w-full text-center md:text-left pb-2">
                    <div className="flex flex-col md:flex-row items-center gap-4 mb-2 justify-center md:justify-start">
                        {isEditingName ? (
                            <div className="flex items-center gap-2 bg-black/40 p-1 rounded-xl border border-white/10">
                                <input
                                    type="text"
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                    className="bg-transparent border-none text-xl md:text-3xl font-bold text-white focus:outline-none px-2 w-full md:w-64"
                                    autoFocus
                                />
                                <button onClick={handleUpdateName} className="p-2 bg-green-500/20 hover:bg-green-500/40 text-green-400 rounded-lg"><Check size={20} /></button>
                                <button onClick={() => setIsEditingName(false)} className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg"><X size={20} /></button>
                            </div>
                        ) : (
                            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter flex items-center gap-4 drop-shadow-lg">
                                {user?.username || "Gość"}
                                {!isGuest && (
                                    <button 
                                        onClick={() => { setNewUsername(user?.username || ''); setIsEditingName(true); }}
                                        className="text-slate-500 hover:text-white transition-colors opacity-0 group-hover/banner:opacity-100"
                                    >
                                        <Edit2 size={24} />
                                    </button>
                                )}
                            </h1>
                        )}
                    </div>
                    {nameError && <p className="text-red-400 text-sm mb-2 font-bold bg-red-900/20 inline-block px-2 rounded">{nameError}</p>}

                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-slate-300 font-medium mt-2">
                        <span className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/5">
                            <Shield size={16} className="text-[var(--theme-primary)]" />
                            {getCurrentRank()}
                        </span>
                        <span className="font-mono text-slate-500 text-sm">ID: #{user?.id || 'GUEST'}</span>
                    </div>
                </div>

                {/* Prestige Badge */}
                {prestigeLevel > 0 && (
                    <div className="absolute top-6 left-6 md:static md:mb-8 shrink-0">
                        <div className="flex flex-col items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/10 border border-yellow-500/30 text-yellow-400 shadow-[0_0_30px_rgba(234,179,8,0.15)]">
                            <span className="text-2xl font-black">{prestigeLevel}</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider">Prestiż</span>
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN: COLLECTION */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-400 uppercase tracking-widest px-2">Kolekcja</h3>
                <StatCard icon={Music} label="Muzyka" value={`${ownedMusic.length} / ${totalMusic}`} color="text-pink-400" bg="bg-pink-500/5" border="border-pink-500/20" />
                <StatCard icon={Palette} label="Motywy" value={`${ownedThemes.length} / ${totalThemes}`} color="text-purple-400" bg="bg-purple-500/5" border="border-purple-500/20" />
                <StatCard icon={Trophy} label="Osiągnięcia" value={`${unlockedAchievements.length} / ${totalAchievements}`} color="text-yellow-400" bg="bg-yellow-500/5" border="border-yellow-500/20" />
            </div>

            {/* MIDDLE COLUMN: PERFORMANCE */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-400 uppercase tracking-widest px-2">Wyniki</h3>
                <StatCard icon={MousePointer2} label="Kliknięcia" value={totalClicks.toLocaleString()} color="text-blue-400" bg="bg-blue-500/5" border="border-blue-500/20" />
                <StatCard icon={Zap} label="Max CPS" value={maxCps?.toLocaleString() || '0'} color="text-orange-400" bg="bg-orange-500/5" border="border-orange-500/20" />
                <StatCard icon={CreditCard} label="Suma Zarobków" value={totalEarnings.toLocaleString()} color="text-green-400" bg="bg-green-500/5" border="border-green-500/20" />
            </div>

            {/* RIGHT COLUMN: MISC */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-400 uppercase tracking-widest px-2">Inne</h3>
                <StatCard icon={Activity} label="Czas Gry" value={formatTime(totalPlayTime)} color="text-emerald-400" bg="bg-emerald-500/5" border="border-emerald-500/20" />
                <StatCard icon={ShoppingCart} label="Zakupy" value={totalItemsBought.toString()} color="text-cyan-400" bg="bg-cyan-500/5" border="border-cyan-500/20" />
                <StatCard icon={Activity} label="Podkręcenia" value={totalOverclocks?.toString() || '0'} color="text-red-400" bg="bg-red-500/5" border="border-red-500/20" />
            </div>
        </div>

        {/* --- ACTION BAR --- */}
        <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-white/5">
            <button
                onClick={handleManualSave}
                disabled={isGuest || saveStatus === 'saving'}
                className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-2xl font-bold transition-all shadow-lg hover:shadow-blue-500/25"
            >
                {saveStatus === 'saving' ? <Activity className="animate-spin" /> : (saveStatus === 'saved' ? <Check /> : <Save />)}
                <span>{saveStatus === 'saved' ? 'Zapisano Pomyślnie!' : 'Zapisz Stan Gry'}</span>
            </button>

            {isGuest ? (
                 <button
                    onClick={() => setShowAuthModal(true)}
                    className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold transition-all shadow-lg hover:shadow-emerald-500/25"
                 >
                    <Unlock />
                    <span>Zaloguj się</span>
                 </button>
            ) : (
                <button
                    onClick={handleLogout}
                    className="px-8 py-4 bg-slate-800 hover:bg-red-900/30 text-slate-300 hover:text-red-400 border border-white/5 hover:border-red-500/30 rounded-2xl font-bold transition-all flex items-center gap-2"
                >
                    <LogOut size={20} />
                    <span>Wyloguj</span>
                </button>
            )}
        </div>

    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color, bg, border }: any) => (
    <motion.div
        whileHover={{ y: -2, scale: 1.01 }}
        className={`relative p-5 rounded-2xl border ${border} ${bg} overflow-hidden flex items-center gap-5 transition-all`}
    >
        <div className={`p-3 rounded-xl bg-slate-900/50 ${color}`}>
            <Icon size={24} />
        </div>
        <div>
            <div className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-0.5">{label}</div>
            <div className={`text-xl font-mono font-bold ${color}`}>{value}</div>
        </div>
        
        {/* Background Icon Watermark */}
        <div className={`absolute -right-4 -bottom-4 opacity-5 pointer-events-none ${color}`}>
            <Icon size={80} />
        </div>
    </motion.div>
);