import React from 'react';
import {
  Coins,
  ShoppingBag,
  Settings,
  Trophy,
  PieChart,
  FlaskConical,
  Server
} from 'lucide-react';
import { useGame } from '../../context/GameContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { hasNewLabItem, setHasNewLabItem } = useGame();

  return (
    <nav className="fixed md:left-0 md:top-0 md:h-screen md:w-24 bottom-8 md:bottom-0 w-full z-40 bg-black/80 backdrop-blur-lg border-t md:border-t-0 md:border-r border-white/10 flex md:flex-col justify-around md:justify-center items-center py-4 md:gap-8">
      <button
        onClick={() => setActiveTab('home')}
        className={`p-3 rounded-xl transition-all ${activeTab === 'home' ? 'bg-white/10' : 'text-slate-500 hover:text-slate-300'}`}
        style={activeTab === 'home' ? { color: 'var(--theme-primary)' } : {}}
      >
        <Coins size={28} />
        <span className="sr-only">Główny</span>
      </button>
      <button
        onClick={() => setActiveTab('shop')}
        className={`p-3 rounded-xl transition-all ${activeTab === 'shop' ? 'bg-white/10' : 'text-slate-500 hover:text-slate-300'}`}
        style={activeTab === 'shop' ? { color: 'var(--theme-primary)' } : {}}
      >
        <ShoppingBag size={28} />
        <span className="sr-only">Sklep</span>
      </button>
      <button
        onClick={() => { setActiveTab('lab'); setHasNewLabItem(false); }}
        className={`p-3 rounded-xl transition-all relative ${activeTab === 'lab' ? 'bg-white/10' : 'text-slate-500 hover:text-slate-300'}`}
        style={activeTab === 'lab' ? { color: 'var(--theme-primary)' } : {}}
      >
        <FlaskConical size={28} />
        {hasNewLabItem && <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-black" />}
        <span className="sr-only">Laboratorium</span>
      </button>
      <button
        onClick={() => setActiveTab('hardware')}
        className={`p-3 rounded-xl transition-all ${activeTab === 'hardware' ? 'bg-white/10' : 'text-slate-500 hover:text-slate-300'}`}
        style={activeTab === 'hardware' ? { color: 'var(--theme-primary)' } : {}}
      >
        <Server size={28} />
        <span className="sr-only">Serwerownia</span>
      </button>
      <button
        onClick={() => setActiveTab('profile')}
        className={`p-3 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-white/10' : 'text-slate-500 hover:text-slate-300'}`}
        style={activeTab === 'profile' ? { color: 'var(--theme-primary)' } : {}}
      >
        <PieChart size={28} />
        <span className="sr-only">Profil</span>
      </button>
      <button
        onClick={() => setActiveTab('achievements')}
        className={`p-3 rounded-xl transition-all ${activeTab === 'achievements' ? 'bg-white/10' : 'text-slate-500 hover:text-slate-300'}`}
        style={activeTab === 'achievements' ? { color: 'var(--theme-primary)' } : {}}
      >
        <Trophy size={28} />
        <span className="sr-only">Osiągnięcia</span>
      </button>
      <button
        onClick={() => setActiveTab('settings')}
        className={`p-3 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-white/10' : 'text-slate-500 hover:text-slate-300'}`}
        style={activeTab === 'settings' ? { color: 'var(--theme-primary)' } : {}}
      >
        <Settings size={28} />
        <span className="sr-only">Ustawienia</span>
      </button>
    </nav>
  );
};
