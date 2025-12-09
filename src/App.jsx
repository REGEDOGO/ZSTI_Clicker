import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coins, 
  ShoppingBag, 
  Settings, 
  Zap, 
  Brain, 
  GraduationCap, 
  AlertTriangle,
  TrendingUp,
  MousePointer2,
  Trophy,
  Activity,
  User,
  AlertOctagon,
  Music,
  Palette,
  Volume2,
  Briefcase,
  Check,
  Star,
  Award,
  Lock,
  Unlock,
  CreditCard,
  PieChart,
  EyeOff,
  Dices,
  Monitor,
  Cpu,
  Keyboard,
  Mouse,
  Server,
  X,
  FlaskConical,
  Coffee,
  CircuitBoard
} from 'lucide-react';

// --- DATA CONSTANTS ---

const SAVE_KEY = 'nierodka-save-v6';

const QUOTES = [
  "Siadaj, pała!",
  "To nie jest koncert życzeń",
  "Wyjmijcie karteczki",
  "Kto nie uważa, ten nie zdaje",
  "Nie dyskutuj ze mną",
  "Znowu nieprzygotowany?",
  "To jest wiedza elementarna",
  "Gdzie jest praca domowa?",
  "Z czego się śmiejecie? Może ja też się pośmieję?",
  "Dzwonek jest dla nauczyciela"
];

const NEWS_TICKER = [
  "PILNE: Ceny kredy szybują w górę!",
  "BREAKING: Nierodka widziany w dwóch miejscach naraz.",
  "GIEŁDA: Akcje firmy 'Zbyszko 3 Cytryny' spadają o 5%.",
  "UWAGA: Jutro kartkówka z wczoraj.",
  "SPORT: Rzut dziennikiem do kosza nową dyscypliną olimpijską.",
  "EKONOMIA: Inflacja punktów absurdu osiąga rekordowy poziom.",
  "POGODA: Przewidywane opady jedynek w całym kraju.",
  "EDUKACJA: Ministerstwo wprowadza obowiązkowe drzemki dla kadry.",
  "NAUKA: Odkryto nowy pierwiastek - Ignorancjum."
];

const RANKS = [
  { threshold: 0, title: "Amator Kredy" },
  { threshold: 1000, title: "Czeladnik Mazaka" },
  { threshold: 10000, title: "Magister Cytrynologii" },
  { threshold: 100000, title: "Doktor Habilitowany Absurdu" },
  { threshold: 1000000, title: "Profesor Nierodka" },
  { threshold: 10000000, title: "Minister Edukacji Wszechświata" }
];

const THEMES = {
  default: { 
    id: 'default',
    name: "Domyślny Mrok", 
    cost: 0,
    colors: { primary: '#10b981', secondary: '#8b5cf6', bg: '#020617', card: '#0f172a' } 
  },
  red: { 
    id: 'red',
    name: "Krwawa Kartkówka", 
    cost: 50000,
    colors: { primary: '#ef4444', secondary: '#f97316', bg: '#18181b', card: '#27272a' } 
  },
  neon: { 
    id: 'neon',
    name: "Cyber-Nierodka", 
    cost: 100000,
    colors: { primary: '#22c55e', secondary: '#eab308', bg: '#052e16', card: '#000000' } 
  },
  gold: { 
    id: 'gold',
    name: "Złoty Długopis", 
    cost: 1000000,
    colors: { primary: '#eab308', secondary: '#f59e0b', bg: '#1c1917', card: '#292524' } 
  }
};

const MUSIC_TRACKS = [
  { id: 'silence', name: "Cisza Egzaminacyjna", cost: 0 },
  { id: 'lofi', name: "LoFi do Sprawdzania Prac", cost: 5000 },
  { id: 'techno', name: "Techno Dzwonek", cost: 25000 },
  { id: 'classical', name: "Symfonia Cierpienia", cost: 100000 }
];

const UPGRADES_DATA = [
  // TIER 1
  {
    id: 'chalk',
    tier: 1,
    name: "Złamana Kreda",
    description: "Pisze tylko po ścianach.",
    baseCost: 15,
    baseEffect: 1,
    type: "click",
    imgColor: "4ade80",
    deskImage: "https://placehold.co/100x100/1e293b/4ade80?text=Kreda"
  },
  {
    id: 'sponge',
    tier: 1,
    name: "Gąbka Nasiąknięta Strachem",
    description: "Zmywa tablicę i marzenia uczniów.",
    baseCost: 100,
    baseEffect: 5,
    type: "auto",
    imgColor: "22d3ee",
    deskImage: "https://placehold.co/100x100/1e293b/22d3ee?text=Gabka"
  },
  {
    id: 'keys',
    tier: 1,
    name: "Klucze Woźnego",
    description: "Otwierają każde drzwi, nawet te do innej dymensji.",
    baseCost: 500,
    baseEffect: 12,
    type: "auto",
    imgColor: "facc15",
    deskImage: "https://placehold.co/100x100/1e293b/facc15?text=Klucze"
  },
  {
    id: 'quiz',
    tier: 1,
    name: "Niezapowiedziana Kartkówka",
    description: "Zwiększa tętno i punkty.",
    baseCost: 1200,
    baseEffect: 25,
    type: "auto",
    imgColor: "f87171",
    deskImage: "https://placehold.co/100x100/1e293b/f87171?text=Test"
  },
  {
    id: 'coffee_machine',
    tier: 1,
    name: "Automat z Kawą",
    description: "Generuje stały przypływ kofeiny.",
    baseCost: 3000,
    baseEffect: 50,
    type: "auto",
    imgColor: "a97142",
    deskImage: "https://placehold.co/100x100/1e293b/a97142?text=Kawa"
  },

  // TIER 2
  {
    id: 'zbyszko',
    tier: 2,
    name: "Syn w Zbyszko 3 Cytryny",
    description: "Klasyk. Transformacja genetyczna w napój gazowany.",
    baseCost: 10000,
    baseEffect: 150,
    type: "auto",
    imgColor: "bef264",
    deskImage: "https://placehold.co/100x100/1e293b/bef264?text=Zbyszko"
  },
  {
    id: 'pen',
    tier: 2,
    name: "Złoty Długopis Oceniania",
    description: "Sam stawia jedynki. Ty tylko patrzysz.",
    baseCost: 50000,
    baseEffect: 400,
    type: "click",
    imgColor: "fbbf24",
    deskImage: "https://placehold.co/100x100/1e293b/fbbf24?text=Pioro"
  },
  {
    id: 'physics',
    tier: 2,
    name: "Podręcznik Zakazanej Fizyki",
    description: "Uczy jak zaginać czas na lekcji.",
    baseCost: 150000,
    baseEffect: 1000,
    type: "auto",
    imgColor: "818cf8",
    deskImage: "https://placehold.co/100x100/1e293b/818cf8?text=Fizyka"
  },
  {
    id: 'projector',
    tier: 2,
    name: "Projektor z 1995",
    description: "Wyświetla slajdy z przyszłości.",
    baseCost: 500000,
    baseEffect: 2500,
    type: "auto",
    imgColor: "94a3b8",
    deskImage: "https://placehold.co/100x100/1e293b/94a3b8?text=Rzutnik"
  },
  {
    id: 'ai',
    tier: 2,
    name: "Dziennik Elektroniczny AI",
    description: "Wpisuje uwagi uczniom, którzy się jeszcze nie urodzili.",
    baseCost: 1500000,
    baseEffect: 6000,
    type: "auto",
    imgColor: "2dd4bf",
    deskImage: "https://placehold.co/100x100/1e293b/2dd4bf?text=AI"
  },

  // TIER 3
  {
    id: 'explosion',
    tier: 3,
    name: "Eksplozja Wiedzy",
    description: "Mózgi parują. Poziom absurdu krytyczny.",
    baseCost: 10000000,
    baseEffect: 20000,
    type: "auto",
    imgColor: "ef4444",
    deskImage: "https://placehold.co/100x100/1e293b/ef4444?text=Boom"
  },
  {
    id: 'clone',
    tier: 3,
    name: "Klonowanie Nierodki",
    description: "Jeden uczy, drugi pije kawę, trzeci jest cytryną.",
    baseCost: 50000000,
    baseEffect: 80000,
    type: "auto",
    imgColor: "10b981",
    deskImage: "https://placehold.co/100x100/1e293b/10b981?text=Klon"
  },
  {
    id: 'parents',
    tier: 3,
    name: "Symulator Wywiadówki",
    description: "Generuje nieskończone pokłady stresu (punktów).",
    baseCost: 250000000,
    baseEffect: 250000,
    type: "auto",
    imgColor: "c084fc",
    deskImage: "https://placehold.co/100x100/1e293b/c084fc?text=Rodzice"
  },
  {
    id: 'blackhole',
    tier: 3,
    name: "Czarna Dziura w Sali 105",
    description: "Wsysa uczniów i wypluwa ich jako Noblistów.",
    baseCost: 1000000000,
    baseEffect: 1000000,
    type: "auto",
    imgColor: "000000",
    deskImage: "https://placehold.co/100x100/1e293b/000000?text=Void"
  }
];

// --- EVOLUTION DATA (LABORATORIUM) ---
const ITEM_EVOLUTIONS = {
  chalk: [
    { tier: 0, name: "Złamana Kreda", multiplier: 1, imgColor: "4ade80" },
    { tier: 1, name: "Solidna Kreda", cost: 10000, multiplier: 5, desc: "Bielsza, twardsza, lepsza.", imgColor: "ffffff" },
    { tier: 2, name: "Kreda Laserowa", cost: 250000, multiplier: 20, desc: "Wypala wiedzę na siatkówce.", imgColor: "f472b6" }
  ],
  sponge: [
    { tier: 0, name: "Brudna Gąbka", multiplier: 1, imgColor: "22d3ee" },
    { tier: 1, name: "Gąbka z Mikrofibry", cost: 25000, multiplier: 5, desc: "Wchłania 150% normy płynów.", imgColor: "3b82f6" },
    { tier: 2, name: "Czarna Dziura Chłonna", cost: 500000, multiplier: 25, desc: "Wchłania światło i nadzieję.", imgColor: "1e1b4b" }
  ],
  quiz: [
    { tier: 0, name: "Kartkówka", multiplier: 1, imgColor: "f87171" },
    { tier: 1, name: "Sprawdzian Semestralny", cost: 100000, multiplier: 4, desc: "Cztery razy więcej strachu.", imgColor: "ef4444" },
    { tier: 2, name: "Egzamin Dojrzałości", cost: 2000000, multiplier: 15, desc: "Poważna sprawa.", imgColor: "991b1b" }
  ]
};

const HARDWARE_DATA = {
  mouse: [
    { id: 'mouse_1', name: "Myszka z Kulką", desc: "Wymaga czyszczenia.", effect: 1, cost: 50 },
    { id: 'mouse_2', name: "Bezprzewodowa", desc: "Czasem gubi zasięg.", effect: 50, cost: 2500 },
    { id: 'mouse_3', name: "Gryzoń RGB", desc: "Oślepia wrogów.", effect: 500, cost: 50000 },
  ],
  monitor: [
    { id: 'monitor_1', name: "CRT 14 cali", desc: "Mnożnik x1.2", multiplier: 1.2, cost: 1000 },
    { id: 'monitor_2', name: "Płaski LCD", desc: "Mnożnik x2.0", multiplier: 2.0, cost: 25000 },
    { id: 'monitor_3', name: "Ściana Wideo", desc: "Mnożnik x5.0", multiplier: 5.0, cost: 1000000 },
  ],
  keyboard: [
    { id: 'kb_1', name: "Biblioteczna", desc: "Odblokowuje Tier 1.", unlockTier: 1, cost: 100 },
    { id: 'kb_2', name: "Mechaniczna", desc: "Odblokowuje Tier 2.", unlockTier: 2, cost: 10000 },
    { id: 'kb_3', name: "Neural Link", desc: "Odblokowuje Tier 3.", unlockTier: 3, cost: 500000 },
  ],
  gpu: [
    { id: 'gpu_1', name: "Zintegrowana Grafika", desc: "Ledwo działa. +1% Krytyka.", chance: 0.01, cost: 1000 },
    { id: 'gpu_2', name: "Riva TNT2", desc: "Klasyk. +3% Krytyka.", chance: 0.03, cost: 15000 },
    { id: 'gpu_3', name: "Koparka Kryptowalut", desc: "Huczy. +10% Krytyka.", chance: 0.10, cost: 200000 },
    { id: 'gpu_4', name: "RTX 9090 Ti", desc: "Ciekły azot. +25% Krytyka.", chance: 0.25, cost: 5000000 },
  ],
  cpu: [
    { id: 'cpu_1', name: "Procesor Ziemniaczany", desc: "Frytki gratis. Mnożnik Krytyka +1.5x", multiplier: 1.5, cost: 5000 },
    { id: 'cpu_2', name: "Intel Core i-Nierodka", desc: "Szybki. Mnożnik Krytyka +3.0x", multiplier: 3.0, cost: 100000 },
    { id: 'cpu_3', name: "Kwantowy Mózg", desc: "Superpozycja. Mnożnik Krytyka +10.0x", multiplier: 10.0, cost: 10000000 },
  ]
};

const ACHIEVEMENTS_DATA = [
  { id: 'first_bell', name: "Pierwszy Dzwonek", desc: "Kliknij 100 razy.", icon: <Music /> },
  { id: 'lemon_king', name: "Król Cytryn", desc: "Kup ulepszenie 'Syn w Zbyszko'.", icon: <Trophy /> },
  { id: 'inflation', name: "Inflacja Ocen", desc: "Zdobądź 1,000,000 punktów.", icon: <TrendingUp /> },
  { id: 'ceo', name: "Dyrektor Generalny", desc: "Kup wszystkie ulepszenia z Tier 1.", icon: <Briefcase /> },
  { id: 'lab_rat', name: "Szczur Laboratoryjny", desc: "Ewoluuj przedmiot w Laboratorium.", icon: <FlaskConical /> },
  { id: 'coffee_addict', name: "Kofeinowy Nałóg", desc: "Wypij 50 kubków kawy.", icon: <Coffee /> },
];

const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export default function App() {
  // --- STATE ---
  const [points, setPoints] = useState(0);
  const [clickPower, setClickPower] = useState(1);
  const [autoPoints, setAutoPoints] = useState(0);
  const [upgrades, setUpgrades] = useState(() => UPGRADES_DATA.map(u => ({ ...u, level: 0, currentCost: u.baseCost })));
  
  // Hardware State
  const [hardware, setHardware] = useState({
    mouse: 0,
    monitor: 0,
    keyboard: 0,
    gpu: 0,
    cpu: 0
  });

  // Item Evolutions State
  const [itemEvolutions, setItemEvolutions] = useState({
    chalk: 0,
    sponge: 0,
    quiz: 0
  });

  // Coffee Mechanic State
  const [coffeeLevel, setCoffeeLevel] = useState(100); // 0-100%
  const [coffeeBuffEndTime, setCoffeeBuffEndTime] = useState(0); // timestamp
  const [totalCoffees, setTotalCoffees] = useState(0);

  // Progression tracking
  const [totalClicks, setTotalClicks] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalPlayTime, setTotalPlayTime] = useState(0);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [prestigeLevel, setPrestigeLevel] = useState(0); 

  // Inventory & Settings
  const [ownedThemes, setOwnedThemes] = useState(['default']);
  const [ownedMusic, setOwnedMusic] = useState(['silence']);
  const [activeThemeId, setActiveThemeId] = useState('default');
  const [activeMusicId, setActiveMusicId] = useState('silence');
  const [volume, setVolume] = useState(50);

  // UI State
  const [activeTab, setActiveTab] = useState('home');
  const [activeShopTab, setActiveShopTab] = useState('education');
  const [clicks, setClicks] = useState([]);
  const [activeQuote, setActiveQuote] = useState(null);
  const [focusMode, setFocusMode] = useState(false);
  const [inspekcjaVisible, setInspekcjaVisible] = useState(false);
  const [newsIndex, setNewsIndex] = useState(0);
  const [panicMode, setPanicMode] = useState(false);
  
  // Modals
  const [selectedUpgrade, setSelectedUpgrade] = useState(null);

  // Overclock State
  const [overclockTime, setOverclockTime] = useState(0);
  const [isCrashed, setIsCrashed] = useState(false);
  const [crashTime, setCrashTime] = useState(0);

  // Absurd Stats
  const [currentIQ, setCurrentIQ] = useState(100);

  // Refs
  const sessionStartRef = useRef(Date.now());
  
  // --- LOAD/SAVE ---
  useEffect(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setPoints(data.points || 0);
        setTotalClicks(data.totalClicks || 0);
        setTotalEarnings(data.totalEarnings || 0);
        setTotalPlayTime(data.totalPlayTime || 0);
        setUnlockedAchievements(data.unlockedAchievements || []);
        setPrestigeLevel(data.prestigeLevel || 0);
        setHardware(prev => ({ ...prev, ...(data.hardware || {}) }));
        setItemEvolutions(prev => ({ ...prev, ...(data.itemEvolutions || {}) }));
        
        setOwnedThemes(data.ownedThemes || ['default']);
        setOwnedMusic(data.ownedMusic || ['silence']);
        setActiveThemeId(data.activeThemeId || 'default');
        setActiveMusicId(data.activeMusicId || 'silence');
        setVolume(data.volume ?? 50);

        if (data.upgrades) {
          const mergedUpgrades = UPGRADES_DATA.map(initial => {
            const savedUpgrade = data.upgrades.find(u => u.id === initial.id);
            if (savedUpgrade) {
              return { 
                ...initial, 
                level: savedUpgrade.level, 
                currentCost: savedUpgrade.currentCost 
              };
            }
            return { ...initial, level: 0, currentCost: initial.baseCost };
          });
          setUpgrades(mergedUpgrades);
        }
      } catch (e) {
        console.error("Failed to load save data", e);
      }
    }
  }, []);

  useEffect(() => {
    const data = {
      points,
      totalClicks,
      totalEarnings,
      totalPlayTime,
      unlockedAchievements,
      prestigeLevel,
      hardware,
      itemEvolutions,
      upgrades: upgrades.map(({ id, level, currentCost }) => ({ id, level, currentCost })),
      ownedThemes,
      ownedMusic,
      activeThemeId,
      activeMusicId,
      volume
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  }, [points, upgrades, hardware, itemEvolutions, ownedThemes, ownedMusic, activeThemeId, activeMusicId, volume, totalClicks, totalEarnings, totalPlayTime, unlockedAchievements, prestigeLevel]);

  // --- STATS CALCULATION ---
  useEffect(() => {
    let baseClick = 1;
    let baseAuto = 0;

    // Upgrades with Evolution Multipliers
    upgrades.forEach(u => {
      let multiplier = 1;
      // Check for evolution
      if (itemEvolutions[u.id]) {
        const evoTier = itemEvolutions[u.id];
        if (ITEM_EVOLUTIONS[u.id] && ITEM_EVOLUTIONS[u.id][evoTier]) {
           multiplier = ITEM_EVOLUTIONS[u.id][evoTier].multiplier;
        }
      }

      if (u.type === 'click') baseClick += (u.level * u.baseEffect * multiplier);
      if (u.type === 'auto') baseAuto += (u.level * u.baseEffect * multiplier);
    });

    // Hardware: Mouse (Click)
    if (hardware.mouse > 0) {
      const mouse = HARDWARE_DATA.mouse[hardware.mouse - 1];
      baseClick += mouse.effect;
    }

    // Global Multipliers
    let globalMultiplier = 1;

    // Hardware: Monitor
    if (hardware.monitor > 0) {
      const monitor = HARDWARE_DATA.monitor[hardware.monitor - 1];
      globalMultiplier *= monitor.multiplier;
    }

    // Prestige
    globalMultiplier *= (1 + (prestigeLevel * 0.1));

    // Overclock
    if (overclockTime > 0) {
      globalMultiplier *= 2;
    }

    // Coffee Effects
    const now = Date.now();
    if (now < coffeeBuffEndTime) {
      globalMultiplier *= 1.5; // +50% Buff
    } else if (coffeeLevel <= 0) {
      globalMultiplier *= 0.5; // -50% Debuff (Sleepy)
    }

    // Crash Penalty
    if (isCrashed) {
      baseAuto = 0; 
    }

    setClickPower(Math.floor(baseClick * globalMultiplier));
    setAutoPoints(Math.floor(baseAuto * globalMultiplier));

  }, [upgrades, hardware, prestigeLevel, overclockTime, isCrashed, itemEvolutions, coffeeLevel, coffeeBuffEndTime]);

  // --- THEME ---
  useEffect(() => {
    const theme = THEMES[activeThemeId] || THEMES.default;
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', theme.colors.primary);
    root.style.setProperty('--theme-secondary', theme.colors.secondary);
    root.style.setProperty('--theme-bg', theme.colors.bg);
    root.style.setProperty('--theme-card', theme.colors.card);
  }, [activeThemeId]);

  // --- GAME LOOPS ---
  
  // Auto Points & Time & Coffee Drain
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();

      // Crash Logic
      if (isCrashed) {
         setCrashTime(prev => {
           if (prev <= 1) {
             setIsCrashed(false);
             return 0;
           }
           return prev - 1;
         });
         return; 
      }

      setTotalPlayTime(t => t + 1);

      // Overclock Timer
      if (overclockTime > 0) {
        setOverclockTime(prev => {
          if (prev <= 1) {
            if (Math.random() < 0.3) {
              setIsCrashed(true);
              setCrashTime(10);
            }
            return 0;
          }
          return prev - 1;
        });
      }

      // Coffee Drain: Drains in 60 seconds (approx 1.6% per sec)
      setCoffeeLevel(prev => Math.max(0, prev - 1.6));

      // Auto Points
      if (autoPoints > 0) {
        setPoints(p => p + autoPoints);
        setTotalEarnings(e => e + autoPoints);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [autoPoints, overclockTime, isCrashed]);

  // Quotes
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setActiveQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
        setTimeout(() => setActiveQuote(null), 3000);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // News Ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setNewsIndex(prev => (prev + 1) % NEWS_TICKER.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // IQ Fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIQ(Math.floor(Math.random() * 150) + 50);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Random Event: Inspekcja
  useEffect(() => {
    const interval = setInterval(() => {
      if (!inspekcjaVisible && !isCrashed && Math.random() < 0.05) {
        setInspekcjaVisible(true);
        setTimeout(() => setInspekcjaVisible(false), 10000);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [inspekcjaVisible, isCrashed]);

  // Panic Mode Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setPanicMode(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Achievements Check
  useEffect(() => {
    const checkAchievements = setInterval(() => {
      const now = Date.now();
      const newUnlocked = [];

      if (!unlockedAchievements.includes('first_bell') && totalClicks >= 100) newUnlocked.push('first_bell');
      if (!unlockedAchievements.includes('lemon_king')) {
        const zbyszko = upgrades.find(u => u.id === 'zbyszko');
        if (zbyszko && zbyszko.level > 0) newUnlocked.push('lemon_king');
      }
      if (!unlockedAchievements.includes('inflation') && totalEarnings >= 1000000) newUnlocked.push('inflation');
      if (!unlockedAchievements.includes('ceo')) {
        const tier1 = upgrades.filter(u => u.tier === 1);
        if (tier1.every(u => u.level > 0)) newUnlocked.push('ceo');
      }
      if (!unlockedAchievements.includes('lab_rat')) {
         if (Object.values(itemEvolutions).some(v => v > 0)) newUnlocked.push('lab_rat');
      }
      if (!unlockedAchievements.includes('coffee_addict') && totalCoffees >= 50) newUnlocked.push('coffee_addict');
      
      if (newUnlocked.length > 0) {
        setUnlockedAchievements(prev => [...prev, ...newUnlocked]);
      }
    }, 2000);
    return () => clearInterval(checkAchievements);
  }, [totalClicks, totalEarnings, upgrades, autoPoints, unlockedAchievements, itemEvolutions, totalCoffees]);

  // --- ACTIONS ---

  const handleClick = (e) => {
    if (isCrashed) return;

    // Crit Logic
    let finalPoints = clickPower;
    let isCrit = false;
    
    // Calculate Crit Chance
    let critChance = 0;
    if (hardware.gpu > 0) {
      critChance = HARDWARE_DATA.gpu[hardware.gpu - 1].chance;
    }

    if (Math.random() < critChance) {
      isCrit = true;
      let critMult = 2.0; // Base Crit Multiplier
      if (hardware.cpu > 0) {
        critMult += HARDWARE_DATA.cpu[hardware.cpu - 1].multiplier;
      }
      finalPoints = Math.floor(clickPower * critMult);
    }

    setPoints(p => p + finalPoints);
    setTotalClicks(tc => tc + 1);
    setTotalEarnings(te => te + finalPoints);
    
    const id = Date.now() + Math.random();
    const x = e.clientX;
    const y = e.clientY;
    setClicks(prev => [...prev, { id, x, y, val: finalPoints, isCrit }]);
    setTimeout(() => {
      setClicks(prev => prev.filter(c => c.id !== id));
    }, 1000);
  };

  const handleInspekcjaClick = () => {
    const bonus = Math.max(1000, autoPoints * 120);
    setPoints(p => p + bonus);
    setTotalEarnings(te => te + bonus);
    setInspekcjaVisible(false);
    alert(`Inspekcja zakończona sukcesem! Otrzymujesz dotację: ${bonus.toLocaleString()} punktów.`);
  };

  const buyUpgrade = (upgradeId) => {
    const upgradeIndex = upgrades.findIndex(u => u.id === upgradeId);
    const upgrade = upgrades[upgradeIndex];
    if (points >= upgrade.currentCost) {
      setPoints(p => p - upgrade.currentCost);
      const newLevel = upgrade.level + 1;
      const newCost = Math.ceil(upgrade.baseCost * Math.pow(1.5, newLevel));
      const newUpgrades = [...upgrades];
      newUpgrades[upgradeIndex] = { ...upgrade, level: newLevel, currentCost: newCost };
      setUpgrades(newUpgrades);
    }
  };

  const buyHardware = (type, tier) => {
    const item = HARDWARE_DATA[type][tier - 1];
    if (points >= item.cost && hardware[type] < tier) {
      setPoints(p => p - item.cost);
      setHardware(prev => ({ ...prev, [type]: tier }));
    }
  };

  const evolveItem = (itemId) => {
    const currentTier = itemEvolutions[itemId] || 0;
    const nextTierData = ITEM_EVOLUTIONS[itemId][currentTier + 1];
    if (nextTierData && points >= nextTierData.cost) {
      setPoints(p => p - nextTierData.cost);
      setItemEvolutions(prev => ({ ...prev, [itemId]: currentTier + 1 }));
      alert(`Ewolucja zakończona! Przedmiot: ${nextTierData.name}`);
    }
  };

  const activateOverclock = () => {
    setOverclockTime(30);
  };

  const drinkCoffee = () => {
    if (coffeeLevel < 100) {
      setCoffeeLevel(100);
      setCoffeeBuffEndTime(Date.now() + 5000); // 5 seconds boost
      setTotalCoffees(prev => prev + 1);
      
      // Floating text for coffee
      const id = Date.now();
      setClicks(prev => [...prev, { 
        id, 
        x: window.innerWidth / 2 + 200, // Approximate location on desk
        y: window.innerHeight / 2, 
        val: "KOFEINA!", 
        isCrit: true // Reuse style
      }]);
      setTimeout(() => {
        setClicks(prev => prev.filter(c => c.id !== id));
      }, 1000);
    }
  };

  const buyTheme = (themeKey) => {
    const theme = THEMES[themeKey];
    if (!ownedThemes.includes(themeKey) && points >= theme.cost) {
      setPoints(p => p - theme.cost);
      setOwnedThemes(prev => [...prev, themeKey]);
    }
  };

  const buyMusic = (musicId) => {
    const track = MUSIC_TRACKS.find(m => m.id === musicId);
    if (!ownedMusic.includes(musicId) && points >= track.cost) {
      setPoints(p => p - track.cost);
      setOwnedMusic(prev => [...prev, musicId]);
    }
  };

  const gamble = () => {
    const bet = Math.floor(points * 0.1);
    if (bet < 10) {
        alert("Zbyt mało punktów, by ryzykować.");
        return;
    }
    
    if (Math.random() > 0.5) {
        const win = bet;
        setPoints(p => p + win);
        setTotalEarnings(e => e + win);
        alert(`Udało się! Nie zauważył ściągi. (+${win.toLocaleString()} pkt)`);
    } else {
        setPoints(p => p - bet);
        alert(`Przyłapany! Siadaj, pała. (-${bet.toLocaleString()} pkt)`);
    }
  };

  const prestigeReset = () => {
    if (points < 1000000000) return;
    if (window.confirm("Awans na Ministra Edukacji?\n\nStracisz wszystkie punkty i ulepszenia, ale zyskasz Tekę Ministra (+10% do wszystkiego na zawsze).")) {
      const newPrestige = prestigeLevel + 1;
      setPrestigeLevel(newPrestige);
      setPoints(0);
      setTotalEarnings(0); 
      setTotalClicks(0);
      setUpgrades(UPGRADES_DATA.map(u => ({ ...u, level: 0, currentCost: u.baseCost })));
      setHardware({ mouse: 0, monitor: 0, keyboard: 0, gpu: 0, cpu: 0 });
      setItemEvolutions({ chalk: 0, sponge: 0, quiz: 0 });
      setCoffeeLevel(100);
      alert(`Gratulacje Panie Ministrze! Twój obecny bonus: +${newPrestige * 10}%`);
    }
  };

  const hardReset = () => {
    if (window.confirm("Czy na pewno chcesz zresetować WSZYSTKO? To operacja nieodwracalna.")) {
      localStorage.removeItem(SAVE_KEY);
      window.location.reload();
    }
  };

  // --- UI HELPERS ---
  const activeTheme = THEMES[activeThemeId];
  
  const getCurrentRank = () => {
    let rank = RANKS[0].title;
    for (let i = 0; i < RANKS.length; i++) {
        if (totalEarnings >= RANKS[i].threshold) {
            rank = RANKS[i].title;
        } else {
            break;
        }
    }
    return rank;
  };

  const getImageUrl = (name, color) => {
    const text = encodeURIComponent(name);
    return `https://placehold.co/600x400/1e293b/${color}?text=${text}`;
  };

  const getEvolutionName = (itemId) => {
    if (itemEvolutions[itemId] && ITEM_EVOLUTIONS[itemId][itemEvolutions[itemId]]) {
      return ITEM_EVOLUTIONS[itemId][itemEvolutions[itemId]].name;
    }
    return null; // Fallback to base name
  };

  const getEvolutionImage = (itemId) => {
     if (itemEvolutions[itemId] && ITEM_EVOLUTIONS[itemId][itemEvolutions[itemId]]) {
        const evo = ITEM_EVOLUTIONS[itemId][itemEvolutions[itemId]];
        return `https://placehold.co/100x100/1e293b/${evo.imgColor}?text=${encodeURIComponent(evo.name.split(' ')[0])}`;
     }
     return null;
  };

  // --- PANIC MODE OVERLAY ---
  if (panicMode) {
    return (
      <div 
        className="fixed inset-0 bg-white text-black font-serif z-[9999] overflow-auto p-8"
        onClick={() => setPanicMode(false)}
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Roczne Sprawozdanie Zużycia Gąbki 2024/2025</h1>
        <table className="w-full border-collapse border border-black text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-black p-2">Miesiąc</th>
              <th className="border border-black p-2">Kreda (kg)</th>
              <th className="border border-black p-2">Gąbki (szt)</th>
              <th className="border border-black p-2">Uwagi</th>
            </tr>
          </thead>
          <tbody>
            {["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec"].map((m, i) => (
              <tr key={i}>
                <td className="border border-black p-2">{m}</td>
                <td className="border border-black p-2">{(Math.random() * 5).toFixed(2)}</td>
                <td className="border border-black p-2">{Math.floor(Math.random() * 3)}</td>
                <td className="border border-black p-2">Brak</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-4 text-xs text-gray-500">Kliknij gdziekolwiek, aby wrócić do pracy.</p>
      </div>
    );
  }

  // --- BSOD OVERLAY ---
  if (isCrashed) {
    return (
      <div className="fixed inset-0 bg-blue-700 text-white font-mono z-[9999] p-8 md:p-24 flex flex-col justify-center select-none">
        <h1 className="text-4xl md:text-6xl mb-8">:(</h1>
        <p className="text-xl md:text-2xl mb-8">
          Twoje urządzenie napotkało problem i musi zostać uruchomione ponownie.
          Trwa zbieranie informacji o błędzie.
        </p>
        <p className="text-lg">UKOŃCZONO: {100 - (crashTime * 10)}%</p>
        <div className="mt-8 text-sm opacity-80">
          <p>Kod zatrzymania: NIERODKA_CRITICAL_PROCESS_DIED</p>
          <p>Żródło: nadmierne_podkrecanie_absurdu.sys</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen text-slate-100 font-sans overflow-hidden relative selection:bg-[var(--theme-primary)] selection:text-white ${focusMode ? 'grayscale' : ''} ${overclockTime > 0 ? 'animate-pulse' : ''}`}
      style={{ backgroundColor: 'var(--theme-bg)' }}
    >
      {/* Glitch Effect CSS for Overclock */}
      {overclockTime > 0 && (
         <style>{`
           @keyframes shake {
             0% { transform: translate(1px, 1px) rotate(0deg); }
             10% { transform: translate(-1px, -2px) rotate(-1deg); }
             20% { transform: translate(-3px, 0px) rotate(1deg); }
             30% { transform: translate(3px, 2px) rotate(0deg); }
             40% { transform: translate(1px, -1px) rotate(1deg); }
             50% { transform: translate(-1px, 2px) rotate(-1deg); }
             60% { transform: translate(-3px, 1px) rotate(0deg); }
             70% { transform: translate(3px, 1px) rotate(-1deg); }
             80% { transform: translate(-1px, -1px) rotate(1deg); }
             90% { transform: translate(1px, 2px) rotate(0deg); }
             100% { transform: translate(1px, -2px) rotate(-1deg); }
           }
           main { animation: shake 0.5s infinite; filter: contrast(150%) hue-rotate(90deg); }
         `}</style>
      )}

      {/* Panic Button */}
      <button 
        onClick={() => setPanicMode(true)}
        className="fixed top-2 right-2 md:top-6 md:right-6 z-[60] bg-red-600/80 hover:bg-red-600 text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded shadow-lg flex items-center gap-1 border border-red-400/50"
      >
        <EyeOff size={12} /> IDZIE DYREKTOR!
      </button>

      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
         <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" 
              style={{ backgroundColor: 'var(--theme-primary)' }} />
         <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"
              style={{ backgroundColor: 'var(--theme-secondary)' }} />
      </div>

      {/* Floating Click Texts */}
      <AnimatePresence>
        {clicks.map(click => (
          <motion.div
            key={click.id}
            initial={{ opacity: 1, y: click.y - 20, x: click.x, scale: click.isCrit ? 1.5 : 1 }}
            animate={{ opacity: 0, y: click.y - 100 }}
            exit={{ opacity: 0 }}
            className={`fixed z-50 font-bold pointer-events-none ${click.isCrit ? 'text-red-500 text-4xl drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]' : 'text-2xl'}`}
            style={!click.isCrit ? { left: 0, top: 0, color: 'var(--theme-primary)' } : { left: 0, top: 0 }}
          >
             {click.isCrit && "CRIT! "}+{click.val}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Inspekcja Event */}
      <AnimatePresence>
        {inspekcjaVisible && (
          <motion.button
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 20 }}
            whileHover={{ scale: 1.1 }}
            onClick={handleInspekcjaClick}
            className="fixed top-24 right-4 md:right-32 z-50 p-4 bg-yellow-500 rounded-full shadow-[0_0_50px_rgba(234,179,8,0.6)] animate-bounce"
          >
            <Briefcase className="text-black w-8 h-8" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="relative z-10 h-screen flex flex-col pb-24 md:pb-12 md:pl-24">
        
        {/* Header */}
        <div className="p-4 md:p-6 flex justify-between items-end border-b border-white/10 bg-black/20 backdrop-blur-sm shrink-0">
          <div>
             <h1 className="text-xl md:text-3xl font-black bg-clip-text text-transparent mb-1"
                 style={{ backgroundImage: 'linear-gradient(to right, var(--theme-primary), var(--theme-secondary))' }}>
               NIERODKA CLICKER
             </h1>
             <p className="text-slate-400 text-[10px] md:text-xs flex items-center gap-2">
               <GraduationCap size={14} /> Symulator Edukacji Absurdalnej {prestigeLevel > 0 && <span className="text-yellow-400 font-bold ml-2">★ MINISTER LVL {prestigeLevel}</span>}
             </p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-right">
            <div>
               <div className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wider mb-1">Punkty Absurdu</div>
               <div className="text-xl md:text-3xl font-mono font-bold text-white">{points.toLocaleString()}</div>
            </div>
            <div>
               <div className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wider mb-1">Na sekundę</div>
               <div className="text-lg md:text-2xl font-mono font-bold" style={{ color: 'var(--theme-primary)' }}>+{autoPoints}</div>
            </div>
          </div>
        </div>

        {/* Views */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            
            {/* HOME TAB (SPLIT VIEW) */}
            {activeTab === 'home' && (
              <motion.div 
                key="home"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full"
              >
                 {/* Left: Avatar / Clicker */}
                 <div className="flex flex-col items-center justify-center gap-8 min-h-[50vh]">
                    <div className="h-12 flex items-center justify-center text-center px-4 w-full">
                      <AnimatePresence>
                        {activeQuote && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl text-sm italic text-slate-200 shadow-xl"
                          >
                            "{activeQuote}"
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleClick}
                      className="group relative w-64 h-64 md:w-80 md:h-80 rounded-full border-8 shadow-[0_0_50px_-10px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden transition-all"
                      style={{ 
                        borderColor: 'rgba(255,255,255,0.1)', 
                        backgroundColor: 'var(--theme-card)' 
                      }}
                    >
                       <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity"
                            style={{ background: `radial-gradient(circle, var(--theme-primary) 0%, transparent 70%)` }} />
                       <div className="relative z-10 text-center">
                          <User size={80} className="mx-auto text-slate-400 mb-4 transition-colors"
                                style={{ color: 'var(--theme-primary)' }} />
                          <span className="text-2xl font-bold text-slate-300 tracking-wider">NIERODKA</span>
                          <div className="text-xs text-slate-500 mt-2 font-mono">KLIKNIJ ABY ZDAĆ</div>
                       </div>
                    </motion.button>
                 </div>

                 {/* Right: The Desk (Biurko Nauczyciela) */}
                 <div className="bg-black/20 rounded-3xl border border-white/10 p-6 flex flex-col overflow-hidden relative">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                       <Monitor size={20} /> Biurko Nauczyciela
                    </h2>
                    
                    {/* Coffee Mug Widget */}
                    <div className="absolute top-6 right-6 z-20">
                      <motion.button 
                        onClick={drinkCoffee}
                        whileTap={{ scale: 0.9 }}
                        className="relative group"
                      >
                         <div className="w-12 h-14 bg-slate-800 rounded-lg border-2 border-slate-600 flex items-end justify-center overflow-hidden relative">
                            {/* Coffee Liquid */}
                            <motion.div 
                              initial={false}
                              animate={{ height: `${coffeeLevel}%` }}
                              className="w-full bg-[#3c2f2f] absolute bottom-0 left-0"
                            />
                            {/* Steam */}
                            {coffeeLevel > 80 && (
                              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/20 blur-md rounded-full animate-ping" />
                            )}
                            <span className="relative z-10 text-[8px] font-bold text-white/50 mb-2">MUG</span>
                         </div>
                         <div className="absolute top-2 -right-3 w-4 h-8 border-2 border-l-0 border-slate-600 rounded-r-lg" />
                         
                         {/* Status Tooltip */}
                         <div className="absolute right-full mr-2 top-0 bg-black/80 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
                           {coffeeLevel === 0 ? "PUSTY! (-50% CPS)" : `Poziom Kawy: ${Math.floor(coffeeLevel)}%`}
                         </div>
                      </motion.button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                       {/* Render Upgrades as Visual Objects */}
                       <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {upgrades.filter(u => u.level > 0).map(u => {
                             const evolvedName = getEvolutionName(u.id);
                             const evolvedImg = getEvolutionImage(u.id);
                             const finalName = evolvedName || u.name;
                             const finalImg = evolvedImg || u.deskImage;

                             return (
                               <motion.button
                                  key={u.id}
                                  layoutId={u.id}
                                  onClick={() => setSelectedUpgrade(u)}
                                  className="aspect-square bg-white/5 rounded-xl border border-white/10 flex flex-col items-center justify-center p-2 relative hover:bg-white/10 transition-colors group"
                               >
                                  <img src={finalImg} alt={finalName} className={`w-2/3 h-2/3 object-contain mb-2 transition-all ${u.level > 50 ? 'drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'grayscale group-hover:grayscale-0'}`} />
                                  <span className="text-xs text-center text-slate-300 leading-tight">{finalName}</span>
                                  <span className="absolute top-2 right-2 text-[10px] bg-black/50 px-1 rounded text-[var(--theme-primary)]">Lvl {u.level}</span>
                               </motion.button>
                             );
                          })}
                          {upgrades.every(u => u.level === 0) && (
                            <div className="col-span-full text-center text-slate-500 italic py-12">
                               Biurko jest puste. Kup coś w sklepie.
                            </div>
                          )}
                       </div>
                    </div>
                 </div>
              </motion.div>
            )}
            
            {/* ITEM UPGRADE MODAL */}
            <AnimatePresence>
               {selectedUpgrade && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedUpgrade(null)}>
                     <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-slate-900 border border-white/20 p-6 rounded-2xl max-w-md w-full shadow-2xl"
                     >
                        <div className="flex justify-between items-start mb-4">
                           <h3 className="text-xl font-bold text-white">{selectedUpgrade.name}</h3>
                           <button onClick={() => setSelectedUpgrade(null)}><X size={20} /></button>
                        </div>
                        <p className="text-slate-400 text-sm mb-6">{selectedUpgrade.description}</p>
                        <div className="flex justify-between items-center mb-4">
                           <div>
                              <div className="text-xs text-slate-500 uppercase">Obecny Poziom</div>
                              <div className="text-xl font-mono text-white">{selectedUpgrade.level}</div>
                           </div>
                           <div>
                              <div className="text-xs text-slate-500 uppercase">Efekt</div>
                              <div className="text-xl font-mono text-[var(--theme-primary)]">+{selectedUpgrade.level * selectedUpgrade.baseEffect}</div>
                           </div>
                        </div>
                        <button
                           onClick={() => {
                             buyUpgrade(selectedUpgrade.id);
                             setSelectedUpgrade(null); 
                           }}
                           disabled={points < selectedUpgrade.currentCost}
                           className={`w-full py-3 rounded-xl font-bold flex justify-center items-center gap-2 ${points >= selectedUpgrade.currentCost ? 'bg-[var(--theme-primary)] text-black hover:opacity-90' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                        >
                           Ulepsz za {selectedUpgrade.currentCost.toLocaleString()}
                        </button>
                     </motion.div>
                  </div>
               )}
            </AnimatePresence>

            {/* SHOP TAB */}
            {activeTab === 'shop' && (
              <motion.div 
                key="shop"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-6xl mx-auto"
              >
                <div className="flex justify-between items-center mb-8">
                  <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {[
                      { id: 'education', label: 'Edukacja', icon: <GraduationCap size={18} /> },
                      { id: 'lab', label: 'Laboratorium', icon: <FlaskConical size={18} /> },
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
                         return (
                           <div key={tier} className="opacity-50 grayscale select-none filter blur-sm relative overflow-hidden rounded-2xl border border-white/5 bg-black/20 p-8 text-center">
                              <div className="absolute inset-0 flex items-center justify-center z-10">
                                 <div className="bg-black/80 p-4 rounded-xl border border-white/20 backdrop-blur-md">
                                    <Lock className="mx-auto mb-2 text-red-500" />
                                    <h3 className="text-xl font-bold text-white mb-1">TIER {tier} ZABLOKOWANY</h3>
                                    <p className="text-sm text-slate-400">Wymagana lepsza klawiatura w Serwerowni.</p>
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

                {/* LABORATORIUM (ITEM EVOLUTIONS) */}
                {activeShopTab === 'lab' && (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="col-span-full mb-4 p-4 bg-purple-900/20 border border-purple-500/30 rounded-xl flex items-center gap-4">
                         <FlaskConical className="text-purple-400" size={32} />
                         <div>
                            <h3 className="font-bold text-purple-300">Laboratorium Metodyczne</h3>
                            <p className="text-sm text-purple-200/70">Tutaj możesz ulepszać JAKOŚĆ swoich przedmiotów. Ewolucja zmienia wygląd i drastycznie zwiększa moc.</p>
                         </div>
                      </div>

                      {Object.keys(ITEM_EVOLUTIONS).map(itemId => {
                         const currentTier = itemEvolutions[itemId] || 0;
                         const nextTier = ITEM_EVOLUTIONS[itemId][currentTier + 1];
                         const currentData = ITEM_EVOLUTIONS[itemId][currentTier];

                         if (!nextTier) {
                            return (
                               <div key={itemId} className="p-6 bg-green-900/20 border border-green-500/30 rounded-xl flex flex-col items-center text-center">
                                  <Check className="text-green-500 mb-2" size={32} />
                                  <h3 className="font-bold text-white text-xl">{currentData.name} (MAX)</h3>
                                  <p className="text-green-400">Osiągnięto szczyt ewolucji.</p>
                               </div>
                            );
                         }

                         const canAfford = points >= nextTier.cost;

                         return (
                            <button
                               key={itemId}
                               onClick={() => evolveItem(itemId)}
                               disabled={!canAfford}
                               className={`p-6 border rounded-xl flex flex-col text-left transition-all
                                  ${canAfford ? 'bg-white/5 border-purple-500/50 hover:bg-white/10' : 'bg-black/20 border-white/5 opacity-60'}
                               `}
                            >
                               <div className="flex justify-between items-start w-full mb-4">
                                  <div className="flex gap-4">
                                     <div className="w-16 h-16 bg-slate-800 rounded-lg overflow-hidden border border-white/10">
                                        <img src={`https://placehold.co/100x100/1e293b/${nextTier.imgColor}?text=Evo`} alt="Evo" className="w-full h-full object-cover" />
                                     </div>
                                     <div>
                                        <div className="text-xs text-slate-500 uppercase">Ewolucja Przedmiotu</div>
                                        <h3 className="font-bold text-white text-lg">{currentData.name} <span className="text-slate-500">→</span> <span className="text-purple-400">{nextTier.name}</span></h3>
                                     </div>
                                  </div>
                               </div>
                               <p className="text-slate-300 mb-4 text-sm">{nextTier.desc}</p>
                               <div className="mt-auto w-full flex justify-between items-center border-t border-white/10 pt-4">
                                  <div className="text-purple-400 font-mono text-xs">Mnożnik Mocy: x{nextTier.multiplier}</div>
                                  <div className={`font-bold font-mono ${canAfford ? 'text-white' : 'text-red-400'}`}>
                                     {nextTier.cost.toLocaleString()} pkt
                                  </div>
                               </div>
                            </button>
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
              </motion.div>
            )}

            {/* HARDWARE TAB (SERWEROWNIA) */}
            {activeTab === 'hardware' && (
              <motion.div 
                key="hardware"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-6xl mx-auto"
              >
                {/* Rack Visualization */}
                <div className="mb-8 p-6 bg-black/40 border border-white/10 rounded-3xl flex flex-col md:flex-row gap-8 items-center justify-center shadow-inner relative overflow-hidden">
                   {/* Background Grid */}
                   <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                   <div className="flex flex-col items-center z-10">
                     <div className="w-32 h-24 bg-slate-800 rounded-lg border-4 border-slate-600 flex items-center justify-center mb-2 relative overflow-hidden">
                        {hardware.monitor === 0 && <span className="text-xs text-slate-500">Brak Monitora</span>}
                        {hardware.monitor === 1 && <div className="w-20 h-16 bg-gray-400 rounded-full opacity-50 animate-pulse">CRT</div>}
                        {hardware.monitor === 2 && <div className="w-28 h-20 bg-blue-900/50 flex items-center justify-center text-xs">LCD <div className="w-1 h-1 bg-red-500 absolute top-4 left-8" /></div>}
                        {hardware.monitor === 3 && <div className="absolute inset-0 bg-[url('https://placehold.co/128x96/000/fff?text=WALL')] opacity-50" />}
                     </div>
                     <span className="text-xs text-slate-400 uppercase tracking-wider">Monitor (Tier {hardware.monitor})</span>
                   </div>
                   
                   <div className="flex flex-col items-center z-10">
                     <div className="w-32 h-10 bg-slate-800 rounded-md border-b-4 border-slate-900 flex items-center justify-center mb-2">
                        {hardware.keyboard === 0 && <span className="text-xs text-slate-500">Brak Klawiatury</span>}
                        {hardware.keyboard === 1 && <div className="flex gap-1"><div className="w-2 h-2 bg-white/20"/> ...</div>}
                        {hardware.keyboard === 2 && <div className="text-[10px] font-mono">CLICK-CLACK</div>}
                        {hardware.keyboard === 3 && <div className="text-[10px] text-purple-400 animate-pulse">NEURAL LINK</div>}
                     </div>
                     <span className="text-xs text-slate-400 uppercase tracking-wider">Klawiatura (Tier {hardware.keyboard})</span>
                   </div>

                   <div className="flex flex-col items-center z-10">
                     <div className="w-16 h-24 bg-slate-800 rounded-t-full border-b-0 border-4 border-slate-700 flex items-center justify-center mb-2">
                        {hardware.mouse === 0 && <span className="text-[10px] text-slate-500">Brak</span>}
                        {hardware.mouse === 1 && <div className="w-2 h-2 rounded-full bg-gray-500" />}
                        {hardware.mouse === 2 && <div className="text-[10px]">Wireless</div>}
                        {hardware.mouse === 3 && <div className="w-full h-full bg-gradient-to-t from-red-500 via-green-500 to-blue-500 opacity-20 animate-pulse" />}
                     </div>
                     <span className="text-xs text-slate-400 uppercase tracking-wider">Mysz (Tier {hardware.mouse})</span>
                   </div>
                   
                   {/* NEW: GPU/CPU Vis */}
                   <div className="flex flex-col items-center z-10 p-2 border border-white/5 rounded-lg bg-white/5">
                      <div className="flex gap-2">
                        <div className="flex flex-col items-center">
                           <Cpu className={`mb-1 ${hardware.cpu > 0 ? 'text-[var(--theme-primary)]' : 'text-slate-600'}`} />
                           <span className="text-[10px] text-slate-400">CPU T{hardware.cpu}</span>
                        </div>
                        <div className="flex flex-col items-center">
                           <CircuitBoard className={`mb-1 ${hardware.gpu > 0 ? 'text-green-400' : 'text-slate-600'}`} />
                           <span className="text-[10px] text-slate-400">GPU T{hardware.gpu}</span>
                        </div>
                      </div>
                   </div>

                   {/* Overclock Button */}
                   <div className="ml-auto pl-8 border-l border-white/10 z-10">
                      <button
                         onClick={activateOverclock}
                         disabled={overclockTime > 0}
                         className={`w-40 h-40 rounded-full border-8 font-bold flex flex-col items-center justify-center transition-all
                            ${overclockTime > 0 
                              ? 'border-yellow-500 bg-yellow-500/20 text-yellow-500 animate-pulse cursor-not-allowed' 
                              : 'border-red-600 bg-red-900/20 text-red-500 hover:bg-red-900/40 hover:scale-105 shadow-[0_0_30px_rgba(220,38,38,0.4)]'}
                         `}
                      >
                         <Zap size={32} className="mb-2" />
                         {overclockTime > 0 ? (
                           <>
                             <span className="text-2xl">{overclockTime}s</span>
                             <span className="text-xs">PODKRĘCONO</span>
                           </>
                         ) : (
                           <>
                             <span className="text-lg text-center leading-tight">PODKRĘĆ<br/>SPRZĘT</span>
                             <span className="text-[10px] mt-1 opacity-70">Ryzyko awarii 30%</span>
                           </>
                         )}
                      </button>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                   {/* MICE */}
                   <div className="space-y-4">
                      <h3 className="text-sm font-bold text-slate-400 uppercase flex items-center gap-2"><MousePointer2 size={14}/> Myszki</h3>
                      {HARDWARE_DATA.mouse.map((item, idx) => (
                         <button
                           key={item.id}
                           onClick={() => buyHardware('mouse', idx + 1)}
                           disabled={hardware.mouse >= idx + 1 || points < item.cost}
                           className={`w-full p-3 rounded-lg border text-left transition-all relative overflow-hidden
                              ${hardware.mouse >= idx + 1 
                                ? 'bg-[var(--theme-primary)]/10 border-[var(--theme-primary)] opacity-50' 
                                : (points >= item.cost ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-black/20 border-white/5 opacity-50')}
                           `}
                         >
                            <h4 className="font-bold text-white text-xs mb-1">{item.name}</h4>
                            <div className="text-[10px] font-mono text-[var(--theme-primary)] mb-1">+{item.effect} click</div>
                            {hardware.mouse < idx + 1 && <span className="font-mono text-xs text-slate-400">{item.cost.toLocaleString()}</span>}
                         </button>
                      ))}
                   </div>

                   {/* MONITORS */}
                   <div className="space-y-4">
                      <h3 className="text-sm font-bold text-slate-400 uppercase flex items-center gap-2"><Monitor size={14}/> Monitory</h3>
                      {HARDWARE_DATA.monitor.map((item, idx) => (
                         <button
                           key={item.id}
                           onClick={() => buyHardware('monitor', idx + 1)}
                           disabled={hardware.monitor >= idx + 1 || points < item.cost}
                           className={`w-full p-3 rounded-lg border text-left transition-all relative overflow-hidden
                              ${hardware.monitor >= idx + 1 
                                ? 'bg-[var(--theme-primary)]/10 border-[var(--theme-primary)] opacity-50' 
                                : (points >= item.cost ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-black/20 border-white/5 opacity-50')}
                           `}
                         >
                            <h4 className="font-bold text-white text-xs mb-1">{item.name}</h4>
                            <div className="text-[10px] font-mono text-[var(--theme-primary)] mb-1">Mnożnik x{item.multiplier}</div>
                            {hardware.monitor < idx + 1 && <span className="font-mono text-xs text-slate-400">{item.cost.toLocaleString()}</span>}
                         </button>
                      ))}
                   </div>

                   {/* KEYBOARDS */}
                   <div className="space-y-4">
                      <h3 className="text-sm font-bold text-slate-400 uppercase flex items-center gap-2"><Keyboard size={14}/> Klawiatury</h3>
                      {HARDWARE_DATA.keyboard.map((item, idx) => (
                         <button
                           key={item.id}
                           onClick={() => buyHardware('keyboard', idx + 1)}
                           disabled={hardware.keyboard >= idx + 1 || points < item.cost}
                           className={`w-full p-3 rounded-lg border text-left transition-all relative overflow-hidden
                              ${hardware.keyboard >= idx + 1 
                                ? 'bg-[var(--theme-primary)]/10 border-[var(--theme-primary)] opacity-50' 
                                : (points >= item.cost ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-black/20 border-white/5 opacity-50')}
                           `}
                         >
                            <h4 className="font-bold text-white text-xs mb-1">{item.name}</h4>
                            <div className="text-[10px] font-mono text-yellow-500 mb-1">Odblokowuje Tier {item.unlockTier}</div>
                            {hardware.keyboard < idx + 1 && <span className="font-mono text-xs text-slate-400">{item.cost.toLocaleString()}</span>}
                         </button>
                      ))}
                   </div>

                   {/* GPU */}
                   <div className="space-y-4">
                      <h3 className="text-sm font-bold text-slate-400 uppercase flex items-center gap-2"><CircuitBoard size={14}/> Karty Graficzne</h3>
                      {HARDWARE_DATA.gpu.map((item, idx) => (
                         <button
                           key={item.id}
                           onClick={() => buyHardware('gpu', idx + 1)}
                           disabled={hardware.gpu >= idx + 1 || points < item.cost}
                           className={`w-full p-3 rounded-lg border text-left transition-all relative overflow-hidden
                              ${hardware.gpu >= idx + 1 
                                ? 'bg-green-500/10 border-green-500 opacity-50' 
                                : (points >= item.cost ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-black/20 border-white/5 opacity-50')}
                           `}
                         >
                            <h4 className="font-bold text-white text-xs mb-1">{item.name}</h4>
                            <div className="text-[10px] font-mono text-green-400 mb-1">Szansa Kryt: {Math.round(item.chance * 100)}%</div>
                            {hardware.gpu < idx + 1 && <span className="font-mono text-xs text-slate-400">{item.cost.toLocaleString()}</span>}
                         </button>
                      ))}
                   </div>

                   {/* CPU */}
                   <div className="space-y-4">
                      <h3 className="text-sm font-bold text-slate-400 uppercase flex items-center gap-2"><Cpu size={14}/> Procesory</h3>
                      {HARDWARE_DATA.cpu.map((item, idx) => (
                         <button
                           key={item.id}
                           onClick={() => buyHardware('cpu', idx + 1)}
                           disabled={hardware.cpu >= idx + 1 || points < item.cost}
                           className={`w-full p-3 rounded-lg border text-left transition-all relative overflow-hidden
                              ${hardware.cpu >= idx + 1 
                                ? 'bg-blue-500/10 border-blue-500 opacity-50' 
                                : (points >= item.cost ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-black/20 border-white/5 opacity-50')}
                           `}
                         >
                            <h4 className="font-bold text-white text-xs mb-1">{item.name}</h4>
                            <div className="text-[10px] font-mono text-blue-400 mb-1">Moc Kryt: +{item.multiplier}x</div>
                            {hardware.cpu < idx + 1 && <span className="font-mono text-xs text-slate-400">{item.cost.toLocaleString()}</span>}
                         </button>
                      ))}
                   </div>

                </div>
              </motion.div>
            )}

            {/* ACHIEVEMENTS TAB */}
            {activeTab === 'achievements' && (
              <motion.div
                key="achievements"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-5xl mx-auto"
              >
                <div className="text-center mb-10">
                   <h2 className="text-3xl font-bold text-white mb-2">Sala Chwały</h2>
                   <p className="text-slate-400">Twoje osiągnięcia w świecie absurdu.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ACHIEVEMENTS_DATA.map(ach => {
                    const unlocked = unlockedAchievements.includes(ach.id);
                    return (
                      <div 
                        key={ach.id}
                        className={`relative p-6 rounded-2xl border flex items-center gap-4 overflow-hidden
                          ${unlocked ? 'bg-white/5 border-yellow-500/50' : 'bg-black/40 border-white/5 grayscale opacity-60'}
                        `}
                      >
                         <div className={`p-4 rounded-full shrink-0 ${unlocked ? 'bg-yellow-500/20 text-yellow-500' : 'bg-white/5 text-slate-600'}`}>
                           {unlocked ? ach.icon : <Lock size={24} />}
                         </div>
                         <div>
                           <h3 className={`font-bold text-lg ${unlocked ? 'text-white' : 'text-slate-500'}`}>{ach.name}</h3>
                           <p className="text-sm text-slate-400">{ach.desc}</p>
                         </div>
                         {unlocked && (
                           <div className="absolute top-0 right-0 p-2 bg-yellow-500/20 rounded-bl-xl">
                             <Check size={14} className="text-yellow-500" />
                           </div>
                         )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <motion.div 
                key="profile"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-4xl mx-auto"
              >
                <h2 className="text-3xl font-bold text-white mb-8">Teczka Personalna</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  
                  {/* Student ID Card */}
                  <div className="md:col-span-1 bg-white/5 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm p-4 flex flex-col items-center text-center">
                    <div className="w-full aspect-[3/4] bg-slate-800 rounded mb-4 overflow-hidden relative">
                      <img src="https://placehold.co/300x400/1e293b/a3a3a3?text=STUDENT" alt="Avatar" className="w-full h-full object-cover opacity-50" />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-xs font-mono text-white">
                        ID: {Date.now().toString().slice(-8)}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">Anonimowy Uczeń</h3>
                    <p className="text-sm font-mono text-[var(--theme-primary)]">{getCurrentRank()}</p>
                    
                    <div className="w-full mt-6 pt-6 border-t border-white/10">
                       <div className="flex justify-between items-center mb-2">
                         <span className="text-xs text-slate-400">POZIOM STRESU</span>
                         <span className="text-xs text-red-400 font-bold">99%</span>
                       </div>
                       <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                         <div className="h-full bg-red-500 w-[99%]" />
                       </div>
                    </div>

                    <div className="w-full mt-4">
                       <div className="flex justify-between items-center mb-2">
                         <span className="text-xs text-slate-400">SZACOWANE IQ</span>
                         <span className="text-xs text-blue-400 font-bold">{currentIQ}</span>
                       </div>
                       <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                         <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${(currentIQ / 200) * 100}%` }} />
                       </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
                     <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                        <div className="text-slate-400 text-xs uppercase mb-2 flex items-center gap-2"><CreditCard size={14}/> Całkowity Dochód</div>
                        <div className="text-2xl font-mono font-bold text-white">{totalEarnings.toLocaleString()}</div>
                     </div>
                     <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                        <div className="text-slate-400 text-xs uppercase mb-2 flex items-center gap-2"><Activity size={14}/> Zmarnowany Czas</div>
                        <div className="text-2xl font-mono font-bold text-white">{formatTime(totalPlayTime)}</div>
                     </div>
                     <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                        <div className="text-slate-400 text-xs uppercase mb-2 flex items-center gap-2"><MousePointer2 size={14}/> Ilość Kliknięć</div>
                        <div className="text-2xl font-mono font-bold text-white">{totalClicks.toLocaleString()}</div>
                     </div>
                     <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                        <div className="text-slate-400 text-xs uppercase mb-2 flex items-center gap-2"><Star size={14}/> Poziom Prestiżu</div>
                        <div className="text-2xl font-mono font-bold text-yellow-500">{prestigeLevel}</div>
                     </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
              <motion.div 
                key="settings"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-2xl mx-auto pb-8"
              >
                <h2 className="text-3xl font-bold text-white mb-8">Ustawienia Systemowe</h2>
                
                {/* Audio Player */}
                <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mb-8 backdrop-blur-sm">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Music size={20} /> Odtwarzacz
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div>
                      <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">Utwór</label>
                      <select 
                        value={activeMusicId}
                        onChange={(e) => setActiveMusicId(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[var(--theme-primary)]"
                        style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                      >
                        {ownedMusic.map(id => {
                          const track = MUSIC_TRACKS.find(t => t.id === id);
                          return <option key={id} value={id}>{track.name}</option>;
                        })}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block flex justify-between">
                        <span>Głośność</span>
                        <span>{volume}%</span>
                      </label>
                      <div className="flex items-center gap-3">
                        <Volume2 size={16} className="text-slate-500" />
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={volume} 
                          onChange={(e) => setVolume(e.target.value)}
                          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[var(--theme-primary)]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Theme Selector */}
                <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mb-8 backdrop-blur-sm">
                   <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Palette size={20} /> Motyw Graficzny
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {ownedThemes.map(id => {
                      const theme = THEMES[id];
                      return (
                        <button
                          key={id}
                          onClick={() => setActiveThemeId(id)}
                          className={`p-2 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${activeThemeId === id ? 'bg-white/10' : 'bg-transparent border-transparent hover:bg-white/5'}`}
                          style={{ borderColor: activeThemeId === id ? theme.colors.primary : 'transparent' }}
                        >
                          <div className="w-10 h-10 rounded-full border-2 border-white/20 shadow-lg" style={{ backgroundColor: theme.colors.bg }}>
                             <div className="w-full h-full rounded-full opacity-50" style={{ backgroundColor: theme.colors.primary }} />
                          </div>
                          <span className="text-xs font-bold text-slate-300 text-center">{theme.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Prestige / Minister Promotion */}
                {points > 100000000 && (
                   <div className="bg-yellow-500/10 rounded-2xl border border-yellow-500/30 overflow-hidden mb-8">
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4 text-yellow-500">
                        <Star size={24} />
                        <h3 className="text-lg font-bold">Ścieżka Kariery</h3>
                      </div>
                      <p className="text-sm text-slate-400 mb-4">
                        Masz szansę awansować na Ministra Edukacji. To zresetuje twoje postępy (oprócz kolekcji i osiągnięć), 
                        ale otrzymasz stały bonus do produkcji.
                      </p>
                      <button 
                        onClick={prestigeReset}
                        disabled={points < 1000000000}
                        className={`w-full py-3 px-4 font-bold rounded-xl transition-colors flex items-center justify-center gap-2
                          ${points >= 1000000000 ? 'bg-yellow-500 hover:bg-yellow-400 text-black' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}
                        `}
                      >
                         <GraduationCap size={18} /> 
                         {points >= 1000000000 ? "AWANS NA MINISTRA (RESET + BONUS)" : "WYMAGANE 1 MLD PUNKTÓW"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Danger Zone */}
                <div className="bg-red-950/20 rounded-2xl border border-red-900/50 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4 text-red-500">
                      <AlertOctagon />
                      <h3 className="text-lg font-bold">Strefa Niebezpieczna</h3>
                    </div>
                    <button 
                      onClick={hardReset}
                      className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <AlertTriangle size={18} /> PEŁNY RESET DANYCH
                    </button>
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </main>

      {/* Footer News Ticker */}
      <div className="fixed bottom-0 left-0 md:left-24 right-0 h-8 md:h-12 bg-black border-t border-white/10 flex items-center z-50 overflow-hidden">
        <div className="bg-[var(--theme-primary)] px-4 h-full flex items-center font-bold text-black text-xs md:text-sm whitespace-nowrap z-10">
          WIADOMOŚCI
        </div>
        <div className="flex-1 overflow-hidden relative h-full flex items-center">
           <motion.div 
             key={newsIndex}
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             exit={{ y: -20, opacity: 0 }}
             className="absolute left-4 text-xs md:text-sm text-slate-300 font-mono"
           >
             {NEWS_TICKER[newsIndex]}
           </motion.div>
        </div>
      </div>

      {/* Navigation */}
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

    </div>
  );
}
