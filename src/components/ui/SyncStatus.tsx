import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { Cloud, CloudOff, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

export const SyncStatus: React.FC = () => {
  const { syncStatus, user, isGuest } = useGame() as any;

  if (isGuest && !user) {
      return (
          <div className="flex items-center gap-2 text-xs text-slate-500 opacity-50">
              <CloudOff size={14} />
              <span>Lokalnie</span>
          </div>
      );
  }

  if (!user) return null;

  return (
    <div className="flex items-center gap-2 text-xs font-mono">
        {syncStatus === 'saved' && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-green-400"
            >
                <CheckCircle size={14} />
                <span>Zapisano</span>
            </motion.div>
        )}
        {syncStatus === 'syncing' && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-yellow-400"
            >
                <RefreshCw size={14} className="animate-spin" />
                <span>Synchronizacja...</span>
            </motion.div>
        )}
        {syncStatus === 'error' && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-red-400"
            >
                <AlertCircle size={14} />
                <span>Błąd Zapisu</span>
            </motion.div>
        )}
        {syncStatus === 'offline' && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-slate-400"
            >
                <CloudOff size={14} />
                <span>Offline</span>
            </motion.div>
        )}
    </div>
  );
};
