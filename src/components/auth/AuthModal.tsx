import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { X, Mail, User } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGuest: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onGuest }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      setMessage(`Błąd: ${error.message}`);
    } else {
      setMessage('Sprawdź swoją skrzynkę mailową, aby się zalogować!');
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-slate-900 border border-white/20 p-8 rounded-2xl max-w-md w-full shadow-2xl relative"
          >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
                <X size={20} />
            </button>

            <h2 className="text-2xl font-bold text-white mb-2 text-center">Witaj w Nierodka Clicker</h2>
            <p className="text-slate-400 text-center mb-8 text-sm">Zaloguj się, aby zapisać postępy w chmurze.</p>

            {message ? (
              <div className="bg-green-500/20 text-green-300 p-4 rounded-xl text-center mb-6 border border-green-500/50">
                {message}
              </div>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase text-slate-500 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="twoj@email.com"
                      required
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[var(--theme-primary)] transition-colors"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[var(--theme-primary)] text-black font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? 'Wysyłanie...' : 'Zaloguj Magic Link'}
                </button>
              </form>
            )}

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-900 px-2 text-slate-500">Lub</span>
              </div>
            </div>

            <button
              onClick={onGuest}
              className="w-full bg-white/5 text-white font-bold py-3 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2 border border-white/10"
            >
              <User size={18} />
              Graj jako Gość
            </button>
            <p className="text-[10px] text-slate-500 text-center mt-2">
                Postępy gościa są zapisywane tylko w przeglądarce.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
