import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { apiClient } from '../../api/client';
import { Search, Globe, User as UserIcon, X, Shield, Star, MousePointer2, CreditCard, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BASE_URL = 'http://localhost:3000';

interface UserSummary {
  id: number;
  username: string;
  avatar_url: string | null;
  banner_url: string | null;
}

interface PublicProfile {
  id: number;
  username: string;
  avatar_url: string | null;
  banner_url: string | null;
  stats: {
    prestige: number;
    totalClicks: number;
    totalEarnings: number;
    rank: string;
    achievementsCount: number;
  }
}

export const Social: React.FC = () => {
  const { totalEarnings } = useGame();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<PublicProfile | null>(null);
  const [inspectLoading, setInspectLoading] = useState(false);

  // --- NAPRAWA LOGIKI WYSZUKIWANIA ---
  // Teraz wyszukuje zawsze, nawet jak query jest puste (pobiera wtedy domyślną listę użytkowników)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      performSearch(query);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const performSearch = async (q: string) => {
    setLoading(true);
    try {
      // Backend z SQL "LIKE %%" zwróci wszystkich użytkowników (limit 20), jeśli q jest puste
      const data = await apiClient.searchUsers(q);
      setResults(data);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setLoading(false);
    }
  };
  // ------------------------------------

  const handleInspect = async (userId: number) => {
    setInspectLoading(true);
    try {
      const data = await apiClient.getUserPublicProfile(userId);
      setSelectedUser(data);
    } catch (err) {
      alert("Nie udało się pobrać danych agenta.");
      console.error(err);
    } finally {
      setInspectLoading(false);
    }
  };

  const closeInspect = () => {
    setSelectedUser(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-700 p-6 rounded-3xl shadow-xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-10 opacity-5">
             <Globe size={200} />
         </div>
         <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3 relative z-10">
            <Globe className="text-[var(--theme-primary)]" />
            Wywiad Środowiskowy
         </h1>
         <p className="text-slate-400 max-w-2xl relative z-10">
            Wyszukaj innych agentów systemu edukacji. Sprawdź ich osiągnięcia, porównaj wyniki i upewnij się, że nikt nie ma lepszych ocen od Ciebie.
         </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Wpisz nazwę agenta..."
            className="w-full bg-slate-800 border-2 border-slate-700 text-white text-xl p-6 pl-16 rounded-2xl focus:outline-none focus:border-[var(--theme-primary)] transition-colors shadow-lg"
          />
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={28} />
          {loading && (
             <div className="absolute right-6 top-1/2 -translate-y-1/2">
                 <div className="w-6 h-6 border-2 border-[var(--theme-primary)] border-t-transparent rounded-full animate-spin" />
             </div>
          )}
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((user) => (
             <motion.div
               key={user.id}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex items-center gap-4 hover:bg-slate-750 transition-colors group"
             >
                 <div className="w-16 h-16 rounded-full bg-slate-700 overflow-hidden border-2 border-slate-600 group-hover:border-[var(--theme-primary)] transition-colors shrink-0">
                     <img
                       src={user.avatar_url ? `${BASE_URL}${user.avatar_url}` : `https://placehold.co/100x100/1e293b/10b981?text=${user.username.charAt(0).toUpperCase()}`}
                       alt={user.username}
                       className="w-full h-full object-cover"
                     />
                 </div>
                 <div className="flex-1 min-w-0">
                     <h3 className="font-bold text-lg text-white truncate">{user.username}</h3>
                     <div className="text-slate-500 text-xs font-mono">ID: #{user.id}</div>
                 </div>
                 <button
                   onClick={() => handleInspect(user.id)}
                   className="bg-white/10 hover:bg-[var(--theme-primary)] hover:text-black text-white px-4 py-2 rounded-lg text-sm font-bold transition-all"
                 >
                    Zbadaj
                 </button>
             </motion.div>
          ))}

          {!loading && results.length === 0 && (
              <div className="col-span-full text-center py-12 text-slate-500">
                  {query ? "Nie znaleziono agentów pasujących do wzorca." : "Brak użytkowników w bazie."}
              </div>
          )}
      </div>

      {/* INSPECTION MODAL */}
      <AnimatePresence>
        {selectedUser && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={closeInspect}>
               <motion.div
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.9 }}
                 onClick={(e) => e.stopPropagation()}
                 className="bg-slate-900 border border-slate-600 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative"
               >
                  <button
                    onClick={closeInspect}
                    className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                  >
                      <X size={24} />
                  </button>

                  {/* Banner & Header (Similar to Profile) */}
                  <div className="relative h-48 md:h-64">
                       <div
                           className="absolute inset-0 bg-cover bg-center"
                           style={{
                               backgroundImage: selectedUser.banner_url ? `url(${BASE_URL}${selectedUser.banner_url})` : undefined,
                               background: !selectedUser.banner_url ? 'linear-gradient(to right, #0f172a, #1e293b)' : undefined
                           }}
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />

                       <div className="absolute -bottom-16 left-8 flex items-end gap-6">
                           <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[var(--theme-primary)] overflow-hidden shadow-2xl bg-slate-800">
                               <img
                                   src={selectedUser.avatar_url ? `${BASE_URL}${selectedUser.avatar_url}` : `https://placehold.co/400x400/1e293b/10b981?text=${selectedUser.username.charAt(0).toUpperCase()}`}
                                   alt="Avatar"
                                   className="w-full h-full object-cover"
                               />
                           </div>
                           <div className="pb-16 md:pb-4">
                               <h2 className="text-3xl md:text-5xl font-black text-white drop-shadow-lg">{selectedUser.username}</h2>
                               <div className="text-slate-400 font-mono text-sm flex gap-4">
                                   <span>{selectedUser.stats.rank || "Uczeń"}</span>
                                   <span>|</span>
                                   <span>ID: #{selectedUser.id}</span>
                               </div>
                           </div>
                       </div>
                  </div>

                  <div className="pt-20 px-8 pb-8">
                      {/* STATS GRID */}
                      <h3 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2">
                         <Shield className="text-[var(--theme-primary)]" /> Kartoteka Osiągnięć
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <PublicStatCard
                             icon={CreditCard}
                             label="Całkowity Dochód"
                             displayValue={selectedUser.stats.totalEarnings.toLocaleString()}
                             rawValue={selectedUser.stats.totalEarnings}
                             color="text-green-400"
                             compareValue={totalEarnings}
                          />
                          <PublicStatCard
                             icon={MousePointer2}
                             label="Kliknięcia"
                             displayValue={selectedUser.stats.totalClicks.toLocaleString()}
                             rawValue={selectedUser.stats.totalClicks}
                             color="text-blue-400"
                          />
                          <PublicStatCard
                             icon={Star}
                             label="Prestiż (Minister)"
                             displayValue={selectedUser.stats.prestige.toString()}
                             rawValue={selectedUser.stats.prestige}
                             color="text-yellow-400"
                          />
                          <PublicStatCard
                             icon={Trophy}
                             label="Osiągnięcia"
                             displayValue={selectedUser.stats.achievementsCount.toString()}
                             rawValue={selectedUser.stats.achievementsCount}
                             color="text-orange-400"
                          />
                      </div>
                  </div>

               </motion.div>
           </div>
        )}
      </AnimatePresence>

      {/* Loading Overlay for Inspection */}
      {inspectLoading && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm pointer-events-none">
              <div className="animate-spin w-12 h-12 border-4 border-[var(--theme-primary)] border-t-transparent rounded-full" />
          </div>
      )}
    </div>
  );
};

interface PublicStatCardProps {
    icon: any;
    label: string;
    displayValue: string;
    rawValue?: number;
    color: string;
    compareValue?: number;
}

const PublicStatCard: React.FC<PublicStatCardProps> = ({ icon: Icon, label, displayValue, rawValue, color, compareValue }) => {
    let comparison = null;
    if (compareValue !== undefined && rawValue !== undefined) {
         if (rawValue > compareValue) {
             comparison = <span className="text-red-500 text-xs ml-2">▼ (Lepszy od Ciebie)</span>;
         } else if (rawValue < compareValue) {
             comparison = <span className="text-green-500 text-xs ml-2">▲ (Jesteś lepszy!)</span>;
         } else {
             comparison = <span className="text-slate-500 text-xs ml-2">= (Remis)</span>;
         }
    }

    return (
        <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl flex flex-col justify-between h-24 relative overflow-hidden group">
            <div className={`absolute top-2 right-2 opacity-20 group-hover:opacity-100 transition-opacity ${color}`}>
                <Icon size={32} />
            </div>
            <div className={`text-xs uppercase font-bold tracking-wider text-slate-500`}>{label}</div>
            <div className={`text-xl font-mono font-bold ${color} z-10 flex items-center`}>
                {displayValue}
                {comparison}
            </div>
        </div>
    );
};