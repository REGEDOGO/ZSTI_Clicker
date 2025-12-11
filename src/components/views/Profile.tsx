import React, { useState, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../api/client';
import {
    CreditCard, Activity, MousePointer2, Star, Music, Palette, Trophy, Zap, ShoppingCart,
    Save, LogOut, Edit2, Check, X, Shield, Lock, Image as ImageIcon, Camera, Unlock
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

      // Explicit Achievement Gating
      if (unlockedAchievements.length < 10) {
          alert("Odblokuj 10 osiągnięć, aby zmienić baner!");
          // Reset input so change event can fire again if they select same file later
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
      // Simulate save feedback since actual save is automated/ref-based in GameContext
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
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">

        {/* HEADER SECTION: IDENTITY */}
        <div className="relative bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl group/banner">

            {/* Banner Background */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-opacity opacity-50 group-hover/banner:opacity-70"
                style={{
                    backgroundImage: user?.banner_url ? `url(${BASE_URL}${user.banner_url})` : undefined,
                    background: !user?.banner_url ? 'linear-gradient(to right, #0f172a, #1e293b)' : undefined
                }}
            />

            {/* Banner Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

            {/* Banner Edit Button */}
            {!isGuest && (
                <div className="absolute top-4 right-4 opacity-0 group-hover/banner:opacity-100 transition-opacity z-20">
                    <button
                        onClick={() => {
                             if (unlockedAchievements.length < 10) {
                                alert("Odblokuj 10 osiągnięć, aby zmienić baner!");
                            } else {
                                bannerInputRef.current?.click();
                            }
                        }}
                        className={`p-2 rounded-full backdrop-blur-sm transition-colors text-white ${
                            unlockedAchievements.length < 10
                            ? 'bg-red-500/50 hover:bg-red-500/80 cursor-not-allowed'
                            : 'bg-black/50 hover:bg-black/80'
                        }`}
                        title={unlockedAchievements.length < 10 ? "Wymaga 10 osiągnięć" : "Zmień Baner"}
                    >
                        {unlockedAchievements.length < 10 ? <Lock size={20} /> : <ImageIcon size={20} />}
                    </button>
                    <input
                        type="file"
                        ref={bannerInputRef}
                        onChange={handleBannerUpload}
                        className="hidden"
                        accept="image/*"
                    />
                </div>
            )}

            <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 pt-32">

                {/* Avatar */}
                <div className="relative group">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[var(--theme-primary)] overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.3)] bg-slate-800 relative z-10">
                        <img
                            src={user?.avatar_url ? `${BASE_URL}${user.avatar_url}` : `https://placehold.co/400x400/1e293b/10b981?text=${(user?.username || 'G').charAt(0).toUpperCase()}`}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                        />

                        {!isGuest && (
                            <div
                                onClick={() => avatarInputRef.current?.click()}
                                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                                <Camera className="text-white" size={32} />
                            </div>
                        )}
                    </div>

                    {!isGuest && (
                        <input
                            type="file"
                            ref={avatarInputRef}
                            onChange={handleAvatarUpload}
                            className="hidden"
                            accept="image/*"
                        />
                    )}

                    <div className="absolute bottom-2 right-2 bg-slate-900 text-[var(--theme-primary)] text-xs font-bold px-2 py-1 rounded border border-slate-700 z-20">
                        LVL {Math.floor(totalClicks / 1000)}
                    </div>
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-left z-10">
                    <div className="flex flex-col md:flex-row items-center gap-4 mb-2 justify-center md:justify-start">
                    {isEditingName ? (
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                className="bg-black/50 border border-slate-600 rounded px-3 py-1 text-xl font-bold text-white focus:outline-none focus:border-[var(--theme-primary)]"
                            />
                            <button onClick={handleUpdateName} className="p-2 bg-green-600 hover:bg-green-500 rounded text-white"><Check size={16} /></button>
                            <button onClick={() => setIsEditingName(false)} className="p-2 bg-red-600 hover:bg-red-500 rounded text-white"><X size={16} /></button>
                        </div>
                    ) : (
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight flex items-center gap-3">
                            {user?.username || "Gość"}
                            {!isGuest && (
                                <button
                                    onClick={() => { setNewUsername(user?.username || ''); setIsEditingName(true); }}
                                    className="text-slate-600 hover:text-[var(--theme-primary)] transition-colors"
                                >
                                    <Edit2 size={20} />
                                </button>
                            )}
                        </h1>
                    )}

                    {prestigeLevel > 0 && (
                        <div className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full border border-yellow-500/50">
                            <Star size={14} fill="currentColor" />
                            <span className="font-bold">{prestigeLevel}</span>
                        </div>
                    )}
                </div>
                {nameError && <p className="text-red-400 text-sm mb-2">{nameError}</p>}

                <div className="text-slate-400 font-mono text-sm mb-4 flex flex-col md:flex-row gap-4 justify-center md:justify-start">
                    <span>{getCurrentRank()}</span>
                    <span className="text-slate-600">|</span>
                    <span>ID: #{user?.id || 'GUEST'}</span>
                </div>
            </div>
        </div>
        </div>

        {/* STATS FOLDER "TECZKA STATYSTYK" */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-slate-200 mb-6 flex items-center gap-2">
                <Shield className="text-[var(--theme-primary)]" /> Teczka Statystyk
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                <StatCard icon={Music} label="Kolekcja Muzyki" value={`${ownedMusic.length} / ${totalMusic}`} color="text-pink-400" />
                <StatCard icon={Palette} label="Motywy Graficzne" value={`${ownedThemes.length} / ${totalThemes}`} color="text-purple-400" />
                <StatCard icon={Trophy} label="Osiągnięcia" value={`${unlockedAchievements.length} / ${totalAchievements}`} color="text-yellow-400" />

                <StatCard icon={MousePointer2} label="Całkowite Kliknięcia" value={totalClicks.toLocaleString()} color="text-blue-400" />
                <StatCard icon={Activity} label="Czas w Grze" value={formatTime(totalPlayTime)} color="text-emerald-400" />
                <StatCard icon={CreditCard} label="Całkowity Dochód" value={totalEarnings.toLocaleString()} color="text-green-400" />

                <StatCard icon={Zap} label="Max CPS" value={maxCps?.toLocaleString() || '0'} color="text-orange-400" />
                <StatCard icon={Activity} label="Ilość Podkręceń" value={totalOverclocks?.toString() || '0'} color="text-red-400" />
                <StatCard icon={ShoppingCart} label="Licznik Zakupów" value={totalItemsBought.toString()} color="text-cyan-400" />
            </div>
        </div>

        {/* CONTROL PANEL */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
                onClick={handleManualSave}
                disabled={isGuest || saveStatus === 'saving'}
                className="col-span-1 md:col-span-1 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white p-4 rounded-xl font-bold flex flex-col items-center justify-center gap-2 transition-all shadow-lg hover:shadow-blue-900/50"
            >
                {saveStatus === 'saving' ? <Activity className="animate-spin" /> : (saveStatus === 'saved' ? <Check /> : <Save />)}
                <span>{saveStatus === 'saved' ? 'Zapisano!' : 'Zapisz Progres'}</span>
            </button>

            {isGuest ? (
                 <button
                    onClick={() => setShowAuthModal(true)}
                    className="col-span-1 bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-xl font-bold flex flex-col items-center justify-center gap-2 transition-all shadow-lg"
                 >
                    <Unlock />
                    <span>Zaloguj</span>
                 </button>
            ) : (
                <button
                    onClick={handleLogout}
                    className="col-span-1 bg-red-900/50 hover:bg-red-700 text-red-200 hover:text-white p-4 rounded-xl font-bold flex flex-col items-center justify-center gap-2 transition-all border border-red-900"
                >
                    <LogOut />
                    <span>Wyloguj</span>
                </button>
            )}
        </div>

    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl flex flex-col justify-between h-28 relative overflow-hidden group"
    >
        <div className={`absolute top-2 right-2 opacity-20 group-hover:opacity-100 transition-opacity ${color}`}>
            <Icon size={40} />
        </div>
        <div className={`text-xs uppercase font-bold tracking-wider text-slate-500`}>{label}</div>
        <div className={`text-xl md:text-2xl font-mono font-bold ${color} z-10`}>{value}</div>
    </motion.div>
);
