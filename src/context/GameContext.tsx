import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { apiClient } from '../api/client';
import { AuthModal } from '../components/auth/AuthModal';
import {
  SHOP_ITEMS,
  HARDWARE_ITEMS,
  ITEM_EVOLUTIONS,
  RANKS,
  THEMES,
  MUSIC_TRACKS,
  QUOTES,
  NEWS_TICKER,
  Upgrade,
  RESEARCH_DATA
} from '../data/gameData';

const SAVE_KEY = 'nierodka-save-v6';

export interface ClickAnimation {
  id: number;
  x: number;
  y: number;
  val: number | string;
  isCrit: boolean;
}

export interface GameState {
  points: number;
  autoPoints: number;
  clickPower: number;
  totalClicks: number;
  totalEarnings: number;
  totalPlayTime: number;
  prestigeLevel: number;

  upgrades: (Upgrade & { level: number, currentCost: number })[];
  hardware: {
    mouse: number;
    monitor: number;
    keyboard: number;
    gpu: number;
    cpu: number;
    ram: number;
    cooling: number;
    power: number;
    case: number;
  };
  itemEvolutions: {
    chalk: number;
    sponge: number;
    quiz: number;
  };
  unlockedResearch: string[];
  isCoffeeUnlocked: boolean;
  unlockedAchievements: string[];

  ownedThemes: string[];
  ownedMusic: string[];
  activeThemeId: string;
  activeMusicId: string;
  volume: number;

  // --- AUDIO & VISUALS ---
  isPlaying: boolean;
  toggleMusic: () => void;
  playNextTrack: () => void;
  playPrevTrack: () => void;
  loopNotification: { visible: boolean; trackName: string } | null;

  coffeeLevel: number;
  overclockTime: number;
  totalOverclocks: number;
  maxCps: number;
  isCrashed: boolean;
  crashTime: number;

  activeQuote: string | null;
  newsIndex: number;
  currentIQ: number;
  inspekcjaVisible: boolean;
  panicMode: boolean;
  clicks: ClickAnimation[];
  hasNewLabItem: boolean;

  // Auth & Cloud
  user: any;
  syncStatus: 'saved' | 'syncing' | 'error' | 'offline';
  showAuthModal: boolean;
  setShowAuthModal: (val: boolean) => void;
  isGuest: boolean;
  setIsGuest: (val: boolean) => void;

  // Actions
  handleClick: (e: React.MouseEvent) => void;
  buyUpgrade: (id: string) => void;
  buyHardware: (type: string, tier: number) => void;
  buyResearch: (id: string) => void;
  evolveItem: (id: string) => void;
  drinkCoffee: () => void;
  activateOverclock: () => void;
  handleInspekcjaClick: () => void;
  buyTheme: (id: string) => void;
  buyMusic: (id: string) => void;
  gamble: () => void;
  prestigeReset: () => void;
  hardReset: () => void;

  // Setters
  setActiveThemeId: (id: string) => void;
  setActiveMusicId: (id: string) => void;
  setVolume: (vol: number) => void;
  setPanicMode: (val: boolean) => void;
  setHasNewLabItem: (val: boolean) => void;

  // Helpers
  getCurrentRank: () => string;
  formatTime: (sec: number) => string;
}

const GameContext = createContext<GameState | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- STATE ---
  const [points, setPoints] = useState(0);
  const [clickPower, setClickPower] = useState(1);
  const [autoPoints, setAutoPoints] = useState(0);

  // Auth State
  const { user } = useAuth();
  const [syncStatus, setSyncStatus] = useState<'saved' | 'syncing' | 'error' | 'offline'>('offline');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  // Inventory
  const [upgrades, setUpgrades] = useState(() =>
    SHOP_ITEMS.map(u => ({ ...u, level: 0, currentCost: u.baseCost }))
  );

  const [hardware, setHardware] = useState<GameState['hardware']>({ mouse: 0, monitor: 0, keyboard: 0, gpu: 0, cpu: 0, ram: 0, cooling: 0, power: 0, case: 0 });
  const [itemEvolutions, setItemEvolutions] = useState<GameState['itemEvolutions']>({ chalk: 0, sponge: 0, quiz: 0 });
  const [unlockedResearch, setUnlockedResearch] = useState<string[]>([]);
  const [hasNewLabItem, setHasNewLabItem] = useState(false);

  // Coffee
  const [coffeeLevel, setCoffeeLevel] = useState(100);
  const [coffeeBuffEndTime, setCoffeeBuffEndTime] = useState(0);
  const [totalCoffees, setTotalCoffees] = useState(0);
  const isCoffeeUnlocked = unlockedResearch.includes('caffeine_research');

  // Progression
  const [totalClicks, setTotalClicks] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalPlayTime, setTotalPlayTime] = useState(0);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [prestigeLevel, setPrestigeLevel] = useState(0);

  // Settings & Audio State
  const [ownedThemes, setOwnedThemes] = useState(['default']);
  const [ownedMusic, setOwnedMusic] = useState(['track1']);
  const [activeThemeId, setActiveThemeId] = useState('default');
  const [activeMusicId, setActiveMusicId] = useState('track1');
  const [volume, setVolume] = useState(50);
  
  // --- AUDIO LOGIC ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [loopNotification, setLoopNotification] = useState<{ visible: boolean; trackName: string } | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeMusicIdRef = useRef(activeMusicId); // Do trzymania aktualnego ID w event listenerze

  // UI State
  const [clicks, setClicks] = useState<ClickAnimation[]>([]);
  const [activeQuote, setActiveQuote] = useState<string | null>(null);
  const [inspekcjaVisible, setInspekcjaVisible] = useState(false);
  const [newsIndex, setNewsIndex] = useState(0);
  const [panicMode, setPanicMode] = useState(false);
  const [overclockTime, setOverclockTime] = useState(0);
  const [totalOverclocks, setTotalOverclocks] = useState(0);
  const [maxCps, setMaxCps] = useState(0);
  const [isCrashed, setIsCrashed] = useState(false);
  const [crashTime, setCrashTime] = useState(0);
  const [currentIQ, setCurrentIQ] = useState(100);

  // --- AUDIO SYSTEM IMPLEMENTATION ---
  
  // Update ref when state changes
  useEffect(() => {
    activeMusicIdRef.current = activeMusicId;
  }, [activeMusicId]);

  // 1. Initialization
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.loop = false; // Disable native loop to handle 'ended' event manually

    const handleEnded = () => {
        if (!audioRef.current) return;
        
        // Manual Loop
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(e => console.log("Loop play error:", e));

        // Trigger Notification
        const track = MUSIC_TRACKS.find(t => t.id === activeMusicIdRef.current);
        if (track) {
            setLoopNotification({ visible: true, trackName: track.name });
            setTimeout(() => setLoopNotification(null), 4000); // Hide after 4s
        }
    };

    audioRef.current.addEventListener('ended', handleEnded);

    return () => {
        audioRef.current?.removeEventListener('ended', handleEnded);
    };
  }, []);

  // 2. Handle Track Change
  useEffect(() => {
    if (!audioRef.current) return;

    const track = MUSIC_TRACKS.find(t => t.id === activeMusicId);
    if (track) {
        audioRef.current.src = track.path;
        audioRef.current.volume = volume / 100;
        
        if (isPlaying) {
            audioRef.current.play().catch(e => console.log("Audio play blocked/interrupted:", e));
        }
    }
  }, [activeMusicId]);

  // 3. Handle Volume Change
  useEffect(() => {
      if (audioRef.current) {
          audioRef.current.volume = volume / 100;
      }
  }, [volume]);

  // 4. Controls
  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
    } else {
        audioRef.current.play().catch(e => console.error("Play error:", e));
        setIsPlaying(true);
    }
  };

  const playNextTrack = () => {
    const currentIndex = MUSIC_TRACKS.findIndex(t => t.id === activeMusicId);
    const nextIndex = (currentIndex + 1) % MUSIC_TRACKS.length;
    setActiveMusicId(MUSIC_TRACKS[nextIndex].id);
    setIsPlaying(true);
  };

  const playPrevTrack = () => {
    const currentIndex = MUSIC_TRACKS.findIndex(t => t.id === activeMusicId);
    const prevIndex = (currentIndex - 1 + MUSIC_TRACKS.length) % MUSIC_TRACKS.length;
    setActiveMusicId(MUSIC_TRACKS[prevIndex].id);
    setIsPlaying(true);
  };

  // --- AUTH & LOAD/SAVE (Standard Logic) ---
  useEffect(() => {
    if (!user) {
        if (!localStorage.getItem(SAVE_KEY)) {
            setShowAuthModal(true);
        } else {
            setIsGuest(true);
        }
    } else {
        setIsGuest(false);
        setShowAuthModal(false);
        if (user?.id) loadFromCloud(user.id);
    }
  }, [user]);

  const loadFromCloud = async (userId: number) => {
      try {
          const data = await apiClient.loadGame(userId);
          if (data && data.saveData) {
             const cloudData = data.saveData;
             const localSaved = localStorage.getItem(SAVE_KEY);
             let useCloud = true;
             if (localSaved) {
                 const localData = JSON.parse(localSaved);
                 if ((localData.totalEarnings || 0) > (cloudData.totalEarnings || 0) + 1000) {
                     if (!window.confirm("Znaleziono zapis w chmurze, ale lokalny wygląda na nowszy/lepszy. Czy na pewno chcesz wczytać chmurę?")) {
                         useCloud = false;
                     }
                 }
             }
             if (useCloud) applySaveData(cloudData);
          }
      } catch (e) {
          console.error("Cloud load error:", e);
      }
  };

  const applySaveData = (data: any) => {
        setPoints(data.points || 0);
        setTotalClicks(data.totalClicks || 0);
        setTotalEarnings(data.totalEarnings || 0);
        setTotalPlayTime(data.totalPlayTime || 0);
        setTotalOverclocks(data.totalOverclocks || 0);
        setMaxCps(data.maxCps || 0);
        setUnlockedAchievements(data.unlockedAchievements || []);
        setPrestigeLevel(data.prestigeLevel || 0);
        setHardware(prev => ({ ...prev, ...(data.hardware || {}) }));
        setItemEvolutions(prev => ({ ...prev, ...(data.itemEvolutions || {}) }));
        setUnlockedResearch(data.unlockedResearch || []);
        setOwnedThemes(data.ownedThemes || ['default']);
        setOwnedMusic(data.ownedMusic || ['track1']);
        setActiveThemeId(data.activeThemeId || 'default');
        setActiveMusicId(data.activeMusicId || 'track1');
        setVolume(data.volume ?? 50);

        if (data.upgrades) {
          const mergedUpgrades = SHOP_ITEMS.map(initial => {
            const savedUpgrade = data.upgrades.find((u: any) => u.id === initial.id);
            if (savedUpgrade) {
              return { ...initial, level: savedUpgrade.level, currentCost: savedUpgrade.currentCost };
            }
            return { ...initial, level: 0, currentCost: initial.baseCost };
          });
          setUpgrades(mergedUpgrades);
        }
  };

  // Initial Local Load
  useEffect(() => {
    if (!user) {
        const saved = localStorage.getItem(SAVE_KEY);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                applySaveData(data);
                setIsGuest(true);
            } catch (e) {
                console.error("Failed to load local save data", e);
            }
        }
    }
  }, [user]);

  // Save Logic
  const gameStateRef = useRef<any>(null);
  useEffect(() => {
    const data = {
      points, totalClicks, totalEarnings, totalPlayTime, unlockedAchievements, prestigeLevel,
      hardware, itemEvolutions, unlockedResearch,
      upgrades: upgrades.map(({ id, level, currentCost }) => ({ id, level, currentCost })),
      ownedThemes, ownedMusic, activeThemeId, activeMusicId, volume,
      maxCps, totalOverclocks
    };
    gameStateRef.current = data;
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  }, [points, upgrades, hardware, itemEvolutions, unlockedResearch, ownedThemes, ownedMusic, activeThemeId, activeMusicId, volume, totalClicks, totalEarnings, totalPlayTime, unlockedAchievements, prestigeLevel, maxCps, totalOverclocks]);

  useEffect(() => {
    if (!user || !user.id) { setSyncStatus('offline'); return; }
    const saveToCloud = async () => {
        if (!gameStateRef.current) return;
        setSyncStatus('syncing');
        try {
            await apiClient.saveGame(user.id, gameStateRef.current);
            setSyncStatus('saved');
        } catch (error) {
            setSyncStatus('error');
        }
    };
    const intervalId = setInterval(saveToCloud, 30000);
    return () => clearInterval(intervalId);
  }, [user]);

  // --- STATS CALCULATION ---
  useEffect(() => {
    let baseClick = 1;
    let baseAuto = 0;

    upgrades.forEach(u => {
      let multiplier = 1;
      if (itemEvolutions[u.id as keyof typeof itemEvolutions]) {
        const evoTier = itemEvolutions[u.id as keyof typeof itemEvolutions];
        if (ITEM_EVOLUTIONS[u.id] && ITEM_EVOLUTIONS[u.id][evoTier]) {
           multiplier = ITEM_EVOLUTIONS[u.id][evoTier].multiplier;
        }
      }
      if (u.type === 'click') baseClick += (u.level * u.baseEffect * multiplier);
      if (u.type === 'auto') baseAuto += (u.level * u.baseEffect * multiplier);
    });

    if (hardware.mouse > 0) {
      const mouse = HARDWARE_ITEMS.mouse[hardware.mouse - 1];
      if (mouse.effect) baseClick += mouse.effect;
    }

    let globalMultiplier = 1;
    if (hardware.monitor > 0) {
      const monitor = HARDWARE_ITEMS.monitor[hardware.monitor - 1];
      if (monitor.multiplier) globalMultiplier *= monitor.multiplier;
    }
    globalMultiplier *= (1 + (prestigeLevel * 0.1));

    if (overclockTime > 0) {
      let ocMult = 2.0;
      if (hardware.power > 0) {
         const psu = HARDWARE_ITEMS.power[hardware.power - 1];
         if (psu.multiplier) ocMult = psu.multiplier;
      }
      globalMultiplier *= ocMult;
    }

    const now = Date.now();
    if (now < coffeeBuffEndTime) {
      let coffeeMult = 1.5;
      if (unlockedResearch.includes('stronger_brew')) coffeeMult = 2.0;
      globalMultiplier *= coffeeMult;
    } else if (coffeeLevel <= 0 && isCoffeeUnlocked) {
      globalMultiplier *= 0.5;
    }

    if (isCrashed) baseAuto = 0;

    const finalAuto = Math.floor(baseAuto * globalMultiplier);
    setClickPower(Math.floor(baseClick * globalMultiplier));
    setAutoPoints(finalAuto);
    if (finalAuto > maxCps) setMaxCps(finalAuto);

  }, [upgrades, hardware, prestigeLevel, overclockTime, isCrashed, itemEvolutions, coffeeLevel, coffeeBuffEndTime, unlockedResearch, isCoffeeUnlocked, maxCps]);

  // --- THEME & LOOPS ---
  useEffect(() => {
    const theme = THEMES[activeThemeId] || THEMES.default;
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', theme.colors.primary);
    root.style.setProperty('--theme-secondary', theme.colors.secondary);
    root.style.setProperty('--theme-bg', theme.colors.bg);
    root.style.setProperty('--theme-card', theme.colors.card);
  }, [activeThemeId]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isCrashed) {
         setCrashTime(prev => {
           if (prev <= 1) { setIsCrashed(false); return 0; }
           return prev - 1;
         });
         return;
      }
      setTotalPlayTime(t => t + 1);
      if (overclockTime > 0) {
        setOverclockTime(prev => {
          if (prev <= 1) {
            let baseRisk = 0.3;
            if (hardware.ram > 0) {
                const ram = HARDWARE_ITEMS.ram[hardware.ram - 1];
                if (ram.riskReduction) baseRisk -= ram.riskReduction;
            }
            baseRisk = Math.max(0, baseRisk);
            if (Math.random() < baseRisk) { setIsCrashed(true); setCrashTime(10); }
            return 0;
          }
          return prev - 1;
        });
      }
      if (isCoffeeUnlocked) setCoffeeLevel(prev => Math.max(0, prev - 1.6));
      if (autoPoints > 0) { setPoints(p => p + autoPoints); setTotalEarnings(e => e + autoPoints); }
    }, 1000);
    return () => clearInterval(interval);
  }, [autoPoints, overclockTime, isCrashed, hardware.ram, isCoffeeUnlocked]);

  // Timers
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setActiveQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
        setTimeout(() => setActiveQuote(null), 3000);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setNewsIndex(prev => (prev + 1) % NEWS_TICKER.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIQ(Math.floor(Math.random() * 150) + 50);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!inspekcjaVisible && !isCrashed && Math.random() < 0.05) {
        setInspekcjaVisible(true);
        setTimeout(() => setInspekcjaVisible(false), 10000);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [inspekcjaVisible, isCrashed]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') setPanicMode(prev => !prev); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Achievements Check
  useEffect(() => {
    const checkAchievements = setInterval(() => {
      const newUnlocked: string[] = [];
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
  }, [totalClicks, totalEarnings, upgrades, unlockedAchievements, itemEvolutions, totalCoffees]);

  // Actions
  const handleClick = (e: React.MouseEvent) => {
    if (isCrashed) return;
    let finalPoints = clickPower;
    let isCrit = false;
    let critChance = 0;
    if (hardware.gpu > 0) {
      const gpu = HARDWARE_ITEMS.gpu[hardware.gpu - 1];
      if (gpu.chance) critChance = gpu.chance;
    }
    if (Math.random() < critChance) {
      isCrit = true;
      let critMult = 2.0;
      if (hardware.cpu > 0) {
        const cpu = HARDWARE_ITEMS.cpu[hardware.cpu - 1];
        if (cpu.multiplier) critMult += cpu.multiplier;
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
    setTimeout(() => { setClicks(prev => prev.filter(c => c.id !== id)); }, 1000);
  };

  const buyUpgrade = (upgradeId: string) => {
    const upgradeIndex = upgrades.findIndex(u => u.id === upgradeId);
    if (upgradeIndex === -1) return;
    const upgrade = upgrades[upgradeIndex];
    if (points >= upgrade.currentCost) {
      setPoints(p => p - upgrade.currentCost);
      const newLevel = upgrade.level + 1;
      const newCost = Math.ceil(upgrade.baseCost * Math.pow(1.5, newLevel));
      const newUpgrades = [...upgrades];
      newUpgrades[upgradeIndex] = { ...upgrade, level: newLevel, currentCost: newCost };
      setUpgrades(newUpgrades);
      if (upgrade.level === 0 && ITEM_EVOLUTIONS[upgradeId]) setHasNewLabItem(true);
    }
  };

  const buyHardware = (type: string, tier: number) => {
    const items = HARDWARE_ITEMS[type];
    if (!items) return;
    const item = items[tier - 1];
    const currentTier = (hardware as any)[type];
    if (points >= item.cost && currentTier < tier) {
      setPoints(p => p - item.cost);
      setHardware(prev => ({ ...prev, [type]: tier }));
    }
  };

  const evolveItem = (itemId: string) => {
    const currentTier = itemEvolutions[itemId as keyof typeof itemEvolutions] || 0;
    const nextTierData = ITEM_EVOLUTIONS[itemId][currentTier + 1];
    if (nextTierData && nextTierData.cost && points >= nextTierData.cost) {
      setPoints(p => p - nextTierData.cost);
      setItemEvolutions(prev => ({ ...prev, [itemId]: currentTier + 1 }));
      alert(`Ewolucja zakończona! Przedmiot: ${nextTierData.name}`);
    }
  };

  const buyResearch = (resId: string) => {
    const res = RESEARCH_DATA.find(r => r.id === resId);
    if (res && points >= res.cost && !unlockedResearch.includes(resId)) {
        setPoints(p => p - res.cost);
        setUnlockedResearch(prev => [...prev, resId]);
        alert(`Ukończono badania: ${res.name}`);
    }
  };

  const drinkCoffee = () => {
    if (coffeeLevel < 100) {
      setCoffeeLevel(100);
      let duration = 5000;
      if (unlockedResearch.includes('bigger_mug')) duration = 7500;
      setCoffeeBuffEndTime(Date.now() + duration);
      setTotalCoffees(prev => prev + 1);
      const id = Date.now();
      setClicks(prev => [...prev, { id, x: window.innerWidth / 2 + 200, y: window.innerHeight / 2, val: "KOFEINA!", isCrit: true }]);
      setTimeout(() => { setClicks(prev => prev.filter(c => c.id !== id)); }, 1000);
    }
  };

  const activateOverclock = () => {
    let duration = 30;
    if (hardware.cooling > 0) {
        const cool = HARDWARE_ITEMS.cooling[hardware.cooling - 1];
        if (cool.durationAdd) duration += cool.durationAdd;
    }
    setOverclockTime(duration);
    setTotalOverclocks(prev => prev + 1);
  };

  const handleInspekcjaClick = () => {
    const bonus = Math.max(1000, autoPoints * 120);
    setPoints(p => p + bonus);
    setTotalEarnings(te => te + bonus);
    setInspekcjaVisible(false);
    alert(`Inspekcja zakończona sukcesem! Otrzymujesz dotację: ${bonus.toLocaleString()} punktów.`);
  };

  const buyTheme = (themeKey: string) => {
    const theme = THEMES[themeKey];
    if (!ownedThemes.includes(themeKey) && points >= theme.cost) {
      setPoints(p => p - theme.cost);
      setOwnedThemes(prev => [...prev, themeKey]);
    }
  };

  const buyMusic = (musicId: string) => {
    const track = MUSIC_TRACKS.find(m => m.id === musicId);
    if (track && !ownedMusic.includes(musicId) && points >= track.cost) {
      setPoints(p => p - track.cost);
      setOwnedMusic(prev => [...prev, musicId]);
    }
  };

  const gamble = () => {
    const bet = Math.floor(points * 0.1);
    if (bet < 10) { alert("Zbyt mało punktów, by ryzykować."); return; }
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
      setUpgrades(SHOP_ITEMS.map(u => ({ ...u, level: 0, currentCost: u.baseCost })));
      setHardware({ mouse: 0, monitor: 0, keyboard: 0, gpu: 0, cpu: 0, ram: 0, cooling: 0, power: 0, case: 0 });
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

  const getCurrentRank = () => {
    let rank = RANKS[0].title;
    for (let i = 0; i < RANKS.length; i++) {
        if (totalEarnings >= RANKS[i].threshold) { rank = RANKS[i].title; } else { break; }
    }
    return rank;
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const value: GameState = {
    points, autoPoints, clickPower, totalClicks, totalEarnings, totalPlayTime, prestigeLevel,
    upgrades, hardware, itemEvolutions, unlockedResearch, isCoffeeUnlocked, unlockedAchievements,
    ownedThemes, ownedMusic, activeThemeId, activeMusicId, volume,
    
    // Audio Exports
    isPlaying, toggleMusic, playNextTrack, playPrevTrack, loopNotification,

    coffeeLevel, overclockTime, totalOverclocks, maxCps, isCrashed, crashTime,
    activeQuote, newsIndex, currentIQ, inspekcjaVisible, panicMode, clicks, hasNewLabItem,

    handleClick, buyUpgrade, buyHardware, buyResearch, evolveItem, drinkCoffee, activateOverclock,
    handleInspekcjaClick, buyTheme, buyMusic, gamble, prestigeReset, hardReset,

    setActiveThemeId, setActiveMusicId, setVolume, setPanicMode, setHasNewLabItem,
    getCurrentRank, formatTime,
    user, syncStatus, showAuthModal, setShowAuthModal, isGuest, setIsGuest
  };

  return (
    <GameContext.Provider value={value}>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onGuest={() => { setShowAuthModal(false); setIsGuest(true); }} />
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};