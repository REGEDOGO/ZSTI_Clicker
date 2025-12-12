import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { Music, Repeat, Radio } from 'lucide-react';

export const MusicNotification: React.FC = () => {
  const { loopNotification } = useGame();

  return (
    <AnimatePresence>
      {loopNotification && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed bottom-8 right-8 z-[2000] pointer-events-none"
        >
          <div className="relative flex items-center gap-4 bg-slate-900/90 backdrop-blur-xl border border-[var(--theme-primary)]/30 px-6 py-4 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden group">
            
            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-[var(--theme-primary)]/5 group-hover:bg-[var(--theme-primary)]/10 transition-colors" />
            
            {/* Icon Box with Animation */}
            <div className="relative shrink-0">
                <div className="absolute inset-0 bg-[var(--theme-primary)] rounded-full blur opacity-20 animate-pulse" />
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center border border-white/10 relative z-10">
                    <Repeat size={20} className="text-[var(--theme-primary)] animate-[spin_3s_linear_infinite]" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-1 border border-slate-700">
                    <Music size={10} className="text-white" />
                </div>
            </div>

            {/* Text Content */}
            <div className="flex flex-col pr-4">
                <div className="flex items-center gap-2 mb-0.5">
                    <Radio size={12} className="text-slate-400" />
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                        AUTO-REPLAY
                    </span>
                </div>
                <span className="text-white font-bold text-sm tracking-wide line-clamp-1 max-w-[200px]">
                    {loopNotification.trackName}
                </span>
            </div>

            {/* Progress Line Animation */}
            <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 4, ease: "linear" }}
                className="absolute bottom-0 left-0 h-[2px] bg-[var(--theme-primary)] w-full origin-left opacity-70"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};