import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Dices, Coins, Zap, Skull, Trophy, Coffee, Spade, Club, Heart, Diamond, RotateCw, Hand, AlertTriangle } from 'lucide-react';

// --- TYPES ---
type GameType = 'slots' | 'coin' | 'blackjack' | 'roulette';

const SLOT_SYMBOLS = [
  { id: 'grade_a', icon: <Trophy size={32} className="text-yellow-400" />, value: 5, color: 'bg-yellow-500/20' },
  { id: 'coffee', icon: <Coffee size={32} className="text-[#a97142]" />, value: 3, color: 'bg-orange-500/20' },
  { id: 'energy', icon: <Zap size={32} className="text-blue-400" />, value: 2, color: 'bg-blue-500/20' },
  { id: 'fail', icon: <Skull size={32} className="text-red-500" />, value: 0, color: 'bg-red-500/20' },
];

const CARDS = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
const SUITS = [
    { icon: <Heart size={16} fill="currentColor"/>, color: 'text-red-500' },
    { icon: <Diamond size={16} fill="currentColor"/>, color: 'text-red-500' },
    { icon: <Spade size={16} fill="currentColor"/>, color: 'text-slate-200' },
    { icon: <Club size={16} fill="currentColor"/>, color: 'text-slate-200' }
];

// --- ROULETTE NUMBERS CONFIG ---
// Europejska ruletka (jedno 0)
const ROULETTE_NUMBERS = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10,
    5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];
const RED_NUMBERS = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];

export const Casino: React.FC = () => {
  const { points, setPoints } = useGame() as any;

  const [activeGame, setActiveGame] = useState<GameType>('slots');
  const [betAmount, setBetAmount] = useState<number>(100);
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastResult, setLastResult] = useState<'win' | 'loss' | 'draw' | null>(null);
  const [winAmount, setWinAmount] = useState(0);

  // --- SLOTS ---
  const [slots, setSlots] = useState([SLOT_SYMBOLS[0], SLOT_SYMBOLS[1], SLOT_SYMBOLS[2]]);

  // --- BLACKJACK ---
  const [playerHand, setPlayerHand] = useState<any[]>([]);
  const [dealerHand, setDealerHand] = useState<any[]>([]);
  const [bjGameState, setBjGameState] = useState<'betting' | 'playing' | 'dealer_turn' | 'ended'>('betting');

  // --- ROULETTE ---
  const [rouletteChoice, setRouletteChoice] = useState<'red' | 'black' | 'green' | 'even' | 'odd' | 'low' | 'high'>('red');
  const [rouletteAngle, setRouletteAngle] = useState(0);
  const [rouletteResultNumber, setRouletteResultNumber] = useState<number | null>(null);

  // --- HELPERS ---
  const handleSetBet = (amount: number) => {
    if (amount > points) amount = points;
    if (amount < 0) amount = 0;
    setBetAmount(Math.floor(amount));
  };

  const resetGame = () => {
      setLastResult(null);
      setWinAmount(0);
      setIsSpinning(false);
      setRouletteResultNumber(null);
  };

  // ==================== SLOTS LOGIC ====================
  const playSlots = () => {
    if (betAmount <= 0 || isSpinning || betAmount > points) return;
    
    resetGame();
    setIsSpinning(true);
    setPoints((p: number) => p - betAmount);

    const interval = setInterval(() => {
        setSlots([
            SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
            SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
            SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)]
        ]);
    }, 100);

    setTimeout(() => {
        clearInterval(interval);
        const result = [
            SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
            SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
            SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)]
        ];

        // Anti-bad-luck
        if (result[0].id === 'fail' && result[1].id === 'fail' && result[2].id === 'fail') {
             result[2] = SLOT_SYMBOLS[0];
        }

        setSlots(result);
        setIsSpinning(false);

        if (result[0].id === result[1].id && result[1].id === result[2].id) {
            const multiplier = result[0].value * 3; 
            if (result[0].id === 'fail') {
                setLastResult('loss');
            } else {
                const win = betAmount * multiplier;
                setPoints((p: number) => p + win);
                setWinAmount(win);
                setLastResult('win');
            }
        } else if (result[0].id === result[1].id || result[1].id === result[2].id || result[0].id === result[2].id) {
            const pairSymbol = (result[0].id === result[1].id || result[0].id === result[2].id) ? result[0] : result[1];
            if (pairSymbol.id !== 'fail') {
                const win = Math.floor(betAmount * 1.5);
                setPoints((p: number) => p + win);
                setWinAmount(win);
                setLastResult('win');
            } else {
                setLastResult('loss');
            }
        } else {
            setLastResult('loss');
        }
    }, 2000);
  };

  // ==================== COIN LOGIC ====================
  const playCoinFlip = () => {
    if (betAmount <= 0 || isSpinning || betAmount > points) return;
    
    resetGame();
    setIsSpinning(true);
    setPoints((p: number) => p - betAmount);

    setTimeout(() => {
        setIsSpinning(false);
        const isWin = Math.random() > 0.5;
        if (isWin) {
            const win = betAmount * 2;
            setPoints((p: number) => p + win);
            setWinAmount(win);
            setLastResult('win');
        } else {
            setLastResult('loss');
        }
    }, 2000);
  };

  // ==================== BLACKJACK LOGIC ====================
  const getRandomCard = () => {
      const val = CARDS[Math.floor(Math.random() * CARDS.length)];
      const suit = SUITS[Math.floor(Math.random() * SUITS.length)];
      return { val, suit, id: Math.random() };
  };

  const getHandValue = (hand: any[]) => {
      let value = 0;
      let aces = 0;
      hand.forEach(c => {
          if (['J','Q','K'].includes(c.val)) value += 10;
          else if (c.val === 'A') { value += 11; aces += 1; }
          else value += parseInt(c.val);
      });
      while (value > 21 && aces > 0) {
          value -= 10;
          aces -= 1;
      }
      return value;
  };

  const startBlackjack = () => {
      if (betAmount <= 0 || betAmount > points) return;
      resetGame();
      setPoints((p: number) => p - betAmount);
      setPlayerHand([getRandomCard(), getRandomCard()]);
      setDealerHand([getRandomCard()]); 
      setBjGameState('playing');
  };

  const bjHit = () => {
      const newHand = [...playerHand, getRandomCard()];
      setPlayerHand(newHand);
      if (getHandValue(newHand) > 21) {
          setBjGameState('ended');
          setLastResult('loss');
      }
  };

  const bjStand = async () => {
      setBjGameState('dealer_turn');
      let currentDealerHand = [...dealerHand];
      
      const drawDealer = async () => {
          await new Promise(r => setTimeout(r, 800));
          if (getHandValue(currentDealerHand) < 17) {
              const newCard = getRandomCard();
              currentDealerHand = [...currentDealerHand, newCard];
              setDealerHand(currentDealerHand);
              await drawDealer();
          } else {
              setBjGameState('ended');
              const pScore = getHandValue(playerHand);
              const dScore = getHandValue(currentDealerHand);

              if (dScore > 21 || pScore > dScore) {
                  const win = betAmount * 2;
                  setPoints((p: number) => p + win);
                  setWinAmount(win);
                  setLastResult('win');
              } else if (pScore === dScore) {
                  setPoints((p: number) => p + betAmount);
                  setWinAmount(betAmount);
                  setLastResult('draw');
              } else {
                  setLastResult('loss');
              }
          }
      };
      drawDealer();
  };

  // ==================== ROULETTE LOGIC ====================
  const playRoulette = () => {
      if (betAmount <= 0 || isSpinning || betAmount > points) return;
      resetGame();
      setIsSpinning(true);
      setPoints((p: number) => p - betAmount);

      // Losujemy wynik (0-36)
      const resultIndex = Math.floor(Math.random() * ROULETTE_NUMBERS.length);
      const resultNum = ROULETTE_NUMBERS[resultIndex];

      // Obliczamy kąt obrotu tak, aby wynik znalazł się na górze (wskaźnik jest na górze)
      // Każdy segment to 360 / 37 stopni
      const segmentAngle = 360 / 37;
      // Losowa liczba pełnych obrotów (5-10) + kąt docelowy
      // Musimy odjąć kąt indeksu, aby "cofnąć" koło do odpowiedniej pozycji pod strzałkę
      const randomRotations = 360 * (5 + Math.floor(Math.random() * 5));
      const targetAngle = randomRotations + (360 - (resultIndex * segmentAngle));

      setRouletteAngle(targetAngle);

      setTimeout(() => {
          setIsSpinning(false);
          setRouletteResultNumber(resultNum);

          let color = 'black';
          if (resultNum === 0) color = 'green';
          else if (RED_NUMBERS.includes(resultNum)) color = 'red';

          let won = false;
          let multiplier = 0;

          if (rouletteChoice === 'green' && color === 'green') { multiplier = 35; won = true; } // Zmieniono na standardowe x35
          else if (rouletteChoice === 'red' && color === 'red') { multiplier = 2; won = true; }
          else if (rouletteChoice === 'black' && color === 'black') { multiplier = 2; won = true; }
          else if (rouletteChoice === 'even' && resultNum !== 0 && resultNum % 2 === 0) { multiplier = 2; won = true; }
          else if (rouletteChoice === 'odd' && resultNum !== 0 && resultNum % 2 !== 0) { multiplier = 2; won = true; }
          else if (rouletteChoice === 'low' && resultNum >= 1 && resultNum <= 18) { multiplier = 2; won = true; }
          else if (rouletteChoice === 'high' && resultNum >= 19 && resultNum <= 36) { multiplier = 2; won = true; }

          if (won) {
              const win = betAmount * multiplier;
              setPoints((p: number) => p + win);
              setWinAmount(win);
              setLastResult('win');
          } else {
              setLastResult('loss');
          }

      }, 4000); // Czas trwania animacji
  };


  // --- RENDER HELPERS ---
  const GameButton = ({ id, label, icon: Icon }: any) => (
      <button
          onClick={() => { setActiveGame(id); resetGame(); }}
          className={`flex-1 py-4 rounded-xl font-bold text-xs md:text-sm transition-all flex flex-col items-center gap-2 border
              ${activeGame === id 
                  ? 'bg-slate-800 border-[var(--theme-primary)] text-white shadow-lg' 
                  : 'bg-black/20 border-white/5 text-slate-500 hover:bg-white/5'
              }
          `}
      >
          <Icon size={20} className={activeGame === id ? 'text-[var(--theme-primary)]' : ''} />
          {label}
      </button>
  );

  // Funkcja pomocnicza do rysowania koła ruletki
  const renderRouletteWheel = () => {
    const segmentAngle = 360 / 37;
    return ROULETTE_NUMBERS.map((num, i) => {
        let color = 'bg-slate-900';
        if (num === 0) color = 'bg-green-600';
        else if (RED_NUMBERS.includes(num)) color = 'bg-red-600';
        
        return (
            <div
                key={num}
                className="absolute w-[20px] h-[50%] left-[calc(50%-10px)] top-0 origin-bottom flex flex-col items-center pt-2"
                style={{ transform: `rotate(${i * segmentAngle}deg)` }}
            >
                <div className={`w-[24px] h-[60px] -mt-1 ${color} clip-path-trapezoid flex items-start justify-center pt-2`}>
                     <span className="text-[10px] font-bold text-white transform rotate-180">{num}</span>
                </div>
            </div>
        );
    });
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
        
        {/* CSS dla trapezu ruletki */}
        <style>{`
            .clip-path-trapezoid {
                clip-path: polygon(0 0, 100% 0, 80% 100%, 20% 100%);
            }
        `}</style>

        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8 border-b border-white/10 pb-8">
            <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-red-600 to-red-900 rounded-2xl shadow-lg shadow-red-900/40">
                    <Dices size={32} className="text-white" />
                </div>
                <div>
                    <h2 className="text-4xl font-black text-white tracking-tighter">KASYNO</h2>
                    <p className="text-slate-400 font-mono text-sm">Rada Rodziców Entertainment™</p>
                </div>
            </div>
            <div className="ml-auto bg-black/40 px-6 py-3 rounded-xl border border-white/10 flex flex-col items-end">
                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Twoje Saldo</div>
                <div className="text-3xl font-mono font-bold text-[var(--theme-primary)]">{points.toLocaleString()}</div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* --- LEWA STRONA: MENU I STAWKI --- */}
            <div className="lg:col-span-4 space-y-6">
                
                {/* Wybór Gry */}
                <div className="grid grid-cols-2 gap-2">
                    <GameButton id="slots" label="SLOTY" icon={Zap} />
                    <GameButton id="coin" label="MONETA" icon={Coins} />
                    <GameButton id="blackjack" label="BLACKJACK" icon={Spade} />
                    <GameButton id="roulette" label="RULETKA" icon={RotateCw} />
                </div>

                {/* Panel Sterowania (Betting) */}
                <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                    <div className="relative z-10">
                        <label className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-4 block flex justify-between">
                            <span>Stawka Zakładu</span>
                            <span className="text-white">{points > 0 ? ((betAmount/points)*100).toFixed(0) : 0}%</span>
                        </label>
                        
                        <div className="relative mb-4">
                            <input 
                                type="number" 
                                value={betAmount}
                                onChange={(e) => handleSetBet(parseInt(e.target.value) || 0)}
                                className="w-full bg-black/50 border-2 border-slate-700 focus:border-[var(--theme-primary)] rounded-xl px-4 py-3 text-2xl font-mono text-white outline-none transition-colors"
                                disabled={isSpinning || (activeGame === 'blackjack' && bjGameState !== 'betting')}
                            />
                        </div>

                        <div className="grid grid-cols-4 gap-2 mb-4">
                            {[0.1, 0.25, 0.5, 1].map(pct => (
                                <button 
                                    key={pct}
                                    onClick={() => handleSetBet(points * pct)}
                                    disabled={isSpinning || (activeGame === 'blackjack' && bjGameState !== 'betting')}
                                    className="bg-white/5 hover:bg-white/10 py-2 rounded-lg text-xs font-bold text-slate-300 disabled:opacity-50"
                                >
                                    {pct * 100}%
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- PRAWA STRONA: OBSZAR GRY --- */}
            <div className="lg:col-span-8">
                <div className="h-full min-h-[500px] bg-black/40 border-4 border-slate-800 rounded-[2rem] relative overflow-hidden flex flex-col items-center justify-center p-8 shadow-inner">
                    
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_70%)]" />
                    <div className="absolute inset-0 bg-[size:40px_40px] bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] pointer-events-none" />

                    {/* === GRA: SLOTY === */}
                    {activeGame === 'slots' && (
                        <div className="relative z-10 w-full max-w-md flex flex-col items-center">
                            <div className="bg-slate-800 p-6 rounded-3xl border-b-8 border-r-8 border-slate-950 shadow-2xl w-full">
                                <div className="flex gap-2 bg-black p-4 rounded-xl border-4 border-slate-700 overflow-hidden relative h-32">
                                    {slots.map((symbol, index) => (
                                        <div key={index} className="flex-1 bg-slate-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                                            <motion.div
                                                key={isSpinning ? `spin-${index}` : `res-${index}-${symbol.id}`}
                                                initial={{ y: -100, opacity: 0, filter: 'blur(10px)' }}
                                                animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                                                transition={{ duration: 0.4, delay: index * 0.1, type: "spring" }}
                                                className={`w-full h-full flex flex-col items-center justify-center ${symbol.color}`}
                                            >
                                                {symbol.icon}
                                            </motion.div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={playSlots}
                                disabled={isSpinning || betAmount > points}
                                className={`mt-8 px-12 py-4 rounded-full font-black text-xl tracking-widest transition-all transform active:scale-95 shadow-xl
                                    ${isSpinning || betAmount > points 
                                        ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                                        : 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/50'
                                    }
                                `}
                            >
                                {isSpinning ? 'LOSOWANIE...' : 'SPIN!'}
                            </button>
                        </div>
                    )}

                    {/* === GRA: MONETA === */}
                    {activeGame === 'coin' && (
                        <div className="relative z-10 flex flex-col items-center">
                            <motion.div
                                key={isSpinning ? 'spinning' : 'stopped'}
                                animate={{ 
                                    rotateY: isSpinning ? [0, 1800] : 0,
                                    y: isSpinning ? [0, -150, 0] : 0
                                }}
                                transition={{ duration: 2, ease: "easeInOut" }}
                                className="w-56 h-56 rounded-full bg-yellow-400 border-8 border-yellow-600 shadow-[0_0_60px_rgba(234,179,8,0.3)] flex items-center justify-center relative mb-12"
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                <div className="absolute inset-4 rounded-full border-4 border-yellow-600/50 flex items-center justify-center">
                                    <span className="text-6xl font-black text-yellow-700 drop-shadow-sm">$</span>
                                </div>
                            </motion.div>
                            <button
                                onClick={playCoinFlip}
                                disabled={isSpinning || betAmount > points}
                                className={`px-10 py-4 rounded-full font-bold text-lg transition-all
                                    ${isSpinning ? 'bg-slate-700 text-slate-500' : 'bg-yellow-500 hover:bg-yellow-400 text-black'}
                                `}
                            >
                                {isSpinning ? 'W POWIETRZU...' : 'RZUĆ MONETĄ'}
                            </button>
                        </div>
                    )}

                    {/* === GRA: BLACKJACK === */}
                    {activeGame === 'blackjack' && (
                        <div className="relative z-10 w-full max-w-lg flex flex-col h-full justify-between py-4">
                            {/* Dealer Area */}
                            <div className="flex flex-col items-center">
                                <span className="text-xs font-bold text-slate-500 uppercase mb-2">Krupier ({dealerHand.length > 0 ? getHandValue(dealerHand) : 0})</span>
                                <div className="flex justify-center -space-x-4">
                                    {dealerHand.map((c, i) => (
                                        <motion.div 
                                            key={i} 
                                            initial={{ y: -20, opacity: 0 }} 
                                            animate={{ y: 0, opacity: 1 }} 
                                            className="w-20 h-28 bg-white rounded-lg shadow-xl flex flex-col items-center justify-center border-2 border-slate-300 relative z-10"
                                        >
                                            <span className={`text-lg font-bold ${c.suit.color}`}>{c.val}</span>
                                            <div className={c.suit.color}>{c.suit.icon}</div>
                                        </motion.div>
                                    ))}
                                    {bjGameState === 'playing' && (
                                         <div className="w-20 h-28 bg-slate-700 rounded-lg shadow-xl border-2 border-slate-600 flex items-center justify-center z-0">
                                            <div className="w-12 h-16 border-2 border-slate-600 rounded opacity-20" />
                                         </div>
                                    )}
                                </div>
                            </div>

                            {/* Center Status */}
                            <div className="flex justify-center my-4">
                                {bjGameState === 'betting' && (
                                    <button onClick={startBlackjack} disabled={betAmount > points} className="px-8 py-3 bg-[var(--theme-primary)] text-black font-bold rounded-xl hover:scale-105 transition-transform">
                                        ROZDAJ KARTY
                                    </button>
                                )}
                            </div>

                            {/* Player Area */}
                            <div className="flex flex-col items-center">
                                <div className="flex justify-center -space-x-4 mb-4">
                                    {playerHand.map((c, i) => (
                                        <motion.div 
                                            key={i} 
                                            initial={{ y: 20, opacity: 0 }} 
                                            animate={{ y: 0, opacity: 1 }} 
                                            className="w-20 h-28 bg-white rounded-lg shadow-xl flex flex-col items-center justify-center border-2 border-slate-300 z-10"
                                        >
                                            <span className={`text-lg font-bold ${c.suit.color}`}>{c.val}</span>
                                            <div className={c.suit.color}>{c.suit.icon}</div>
                                        </motion.div>
                                    ))}
                                </div>
                                <span className="text-xs font-bold text-slate-500 uppercase mb-4">Ty ({playerHand.length > 0 ? getHandValue(playerHand) : 0})</span>
                                
                                {bjGameState === 'playing' && (
                                    <div className="flex gap-4">
                                        <button onClick={bjHit} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center gap-2">
                                            <Hand size={18} /> DOBIERZ
                                        </button>
                                        <button onClick={bjStand} className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold flex items-center gap-2">
                                            <Skull size={18} /> PAS
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* === GRA: RULETKA (IMPROVED) === */}
                    {activeGame === 'roulette' && (
                        <div className="relative z-10 w-full flex flex-col items-center">
                            
                            {/* THE WHEEL */}
                            <div className="relative w-64 h-64 mb-10">
                                {/* Marker */}
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-30 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[24px] border-t-yellow-400 drop-shadow-lg" />
                                
                                <motion.div
                                    animate={{ rotate: isSpinning ? rouletteAngle : rouletteAngle }}
                                    initial={{ rotate: 0 }}
                                    transition={{ duration: 4, type: "spring", damping: 15, stiffness: 20 }}
                                    className="w-full h-full rounded-full border-8 border-[#2e1d0f] bg-[#2e1d0f] relative shadow-2xl overflow-hidden"
                                >
                                    <div className="absolute inset-0 rounded-full border-4 border-dashed border-white/20 z-10 pointer-events-none" />
                                    
                                    {/* Numbers */}
                                    <div className="w-full h-full relative" style={{ transform: 'rotate(-90deg)' }}>
                                        {renderRouletteWheel()}
                                    </div>
                                    
                                    {/* Center Hub */}
                                    <div className="absolute inset-0 m-auto w-16 h-16 bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-full z-20 shadow-xl border-4 border-yellow-900 flex items-center justify-center">
                                        {rouletteResultNumber !== null && !isSpinning && (
                                            <span className="text-xl font-black text-white drop-shadow-md">{rouletteResultNumber}</span>
                                        )}
                                    </div>
                                </motion.div>

                                {/* Ball Animation */}
                                {isSpinning && (
                                    <motion.div 
                                        className="absolute inset-2 z-20 rounded-full"
                                        animate={{ rotate: -360 * 6 }}
                                        transition={{ duration: 4, ease: "circOut" }}
                                    >
                                        <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_5px_white] absolute top-0 left-1/2 -translate-x-1/2" />
                                    </motion.div>
                                )}
                            </div>

                            {/* Betting Board */}
                            <div className="grid grid-cols-6 gap-2 w-full max-w-lg">
                                {/* Green Zero */}
                                <button 
                                    onClick={() => setRouletteChoice('green')}
                                    className={`col-span-6 py-2 rounded bg-green-700 hover:bg-green-600 font-bold text-white border-2 ${rouletteChoice === 'green' ? 'border-yellow-400 scale-105' : 'border-transparent'}`}
                                >
                                    0 (x14)
                                </button>
                                
                                {/* Numbers (Simplified ranges) */}
                                <button onClick={() => setRouletteChoice('low')} className={`col-span-3 py-3 rounded bg-slate-800 font-bold border-2 ${rouletteChoice === 'low' ? 'border-yellow-400' : 'border-transparent'}`}>1-18</button>
                                <button onClick={() => setRouletteChoice('high')} className={`col-span-3 py-3 rounded bg-slate-800 font-bold border-2 ${rouletteChoice === 'high' ? 'border-yellow-400' : 'border-transparent'}`}>19-36</button>

                                <button onClick={() => setRouletteChoice('even')} className={`col-span-3 py-3 rounded bg-slate-800 font-bold border-2 ${rouletteChoice === 'even' ? 'border-yellow-400' : 'border-transparent'}`}>EVEN</button>
                                <button onClick={() => setRouletteChoice('odd')} className={`col-span-3 py-3 rounded bg-slate-800 font-bold border-2 ${rouletteChoice === 'odd' ? 'border-yellow-400' : 'border-transparent'}`}>ODD</button>

                                <button onClick={() => setRouletteChoice('red')} className={`col-span-3 py-4 rounded bg-red-600 font-bold border-2 ${rouletteChoice === 'red' ? 'border-yellow-400' : 'border-transparent'}`}>RED</button>
                                <button onClick={() => setRouletteChoice('black')} className={`col-span-3 py-4 rounded bg-slate-900 font-bold border-2 ${rouletteChoice === 'black' ? 'border-yellow-400' : 'border-transparent'}`}>BLACK</button>
                            </div>

                            <button 
                                onClick={playRoulette}
                                disabled={isSpinning || betAmount > points}
                                className="mt-6 px-12 py-3 bg-[var(--theme-primary)] text-black font-black text-xl rounded-full hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100 shadow-xl"
                            >
                                {isSpinning ? 'KRĘCIMY...' : 'ZAKRĘĆ KOŁEM'}
                            </button>
                        </div>
                    )}

                    {/* === WYNIK (OVERLAY) === */}
                    <AnimatePresence>
                        {lastResult && (
                            <motion.div
                                initial={{ scale: 0, rotate: -10 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="absolute inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm rounded-[2rem]"
                            >
                                <div className={`p-8 rounded-3xl border-4 text-center shadow-2xl transform bg-slate-900 ${lastResult === 'win' ? 'border-green-500' : (lastResult === 'draw' ? 'border-yellow-500' : 'border-red-500')}`}>
                                    <div className="text-6xl mb-2">
                                        {lastResult === 'win' ? '🎉' : (lastResult === 'draw' ? '🤝' : '💸')}
                                    </div>
                                    <h3 className={`text-4xl font-black uppercase mb-2 ${lastResult === 'win' ? 'text-green-400' : (lastResult === 'draw' ? 'text-yellow-400' : 'text-red-400')}`}>
                                        {lastResult === 'win' ? 'WYGRANA!' : (lastResult === 'draw' ? 'REMIS' : 'PRZEGRANA')}
                                    </h3>
                                    {lastResult === 'win' && (
                                        <div className="text-2xl font-mono text-white font-bold mb-4">
                                            +{winAmount.toLocaleString()}
                                        </div>
                                    )}
                                    <button 
                                        onClick={() => setLastResult(null)}
                                        className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-bold transition-colors"
                                    >
                                        GRAJ DALEJ
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </div>

        </div>
    </div>
  );
};