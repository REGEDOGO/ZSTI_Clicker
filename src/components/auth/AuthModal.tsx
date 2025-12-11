import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { X, Mail, User, Lock, Key } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGuest: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onGuest }) => {
  const { login, register } = useAuth();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
        if (isLoginMode) {
            await login(username, password);
            onClose();
        } else {
            await register(username, email, password);
            setMessage({ text: "Konto utworzone! Możesz się teraz zalogować.", type: 'success' });
            setIsLoginMode(true);
        }
    } catch (err: any) {
        setMessage({ text: err.message, type: 'error' });
    } finally {
        setLoading(false);
    }
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

            <h2 className="text-2xl font-bold text-white mb-2 text-center">
                {isLoginMode ? 'Witaj ponownie' : 'Dołącz do nas'}
            </h2>
            <p className="text-slate-400 text-center mb-8 text-sm">
                {isLoginMode ? 'Zaloguj się do swojego konta' : 'Zarejestruj się, aby zapisywać postępy'}
            </p>

            {message && (
              <div className={`p-4 rounded-xl text-center mb-6 border text-sm ${message.type === 'error' ? 'bg-red-500/20 text-red-300 border-red-500/50' : 'bg-green-500/20 text-green-300 border-green-500/50'}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase text-slate-500 mb-1">Nazwa Użytkownika</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username"
                      required
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[var(--theme-primary)] transition-colors"
                    />
                  </div>
                </div>

                {!isLoginMode && (
                    <div>
                    <label className="block text-xs uppercase text-slate-500 mb-1">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@example.com"
                        required
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[var(--theme-primary)] transition-colors"
                        />
                    </div>
                    </div>
                )}

                <div>
                  <label className="block text-xs uppercase text-slate-500 mb-1">Hasło</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
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
                  {loading ? 'Przetwarzanie...' : (isLoginMode ? 'Zaloguj się' : 'Zarejestruj się')}
                </button>
            </form>

            <div className="text-center mt-6">
                <button
                    onClick={() => { setIsLoginMode(!isLoginMode); setMessage(null); }}
                    className="text-slate-400 text-sm hover:text-white underline decoration-dotted"
                >
                    {isLoginMode ? 'Nie masz konta? Zarejestruj się' : 'Masz już konto? Zaloguj się'}
                </button>
            </div>

            <div className="relative my-6">
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
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
