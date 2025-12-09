import React from 'react';
import {
  Music,
  Trophy,
  TrendingUp,
  Briefcase,
  FlaskConical,
  Coffee,
  Zap,
  Award
} from 'lucide-react';

export interface Theme {
  id: string;
  name: string;
  cost: number;
  colors: {
    primary: string;
    secondary: string;
    bg: string;
    card: string;
  };
}

export interface MusicTrack {
  id: string;
  name: string;
  cost: number;
}

export interface Upgrade {
  id: string;
  tier: number;
  name: string;
  description: string;
  baseCost: number;
  baseEffect: number;
  type: "click" | "auto";
  imgColor: string;
  deskImage: string;
}

export interface Research {
  id: string;
  name: string;
  cost: number;
  desc: string;
  icon: React.ElementType;
  type: string;
  req?: string;
}

export interface ItemEvolution {
  tier: number;
  name: string;
  multiplier: number;
  imgColor: string;
  cost?: number;
  desc?: string;
}

export interface HardwareItem {
  id: string;
  name: string;
  desc: string;
  cost: number;
  effect?: number; // for mouse
  multiplier?: number; // for monitor, cpu, power
  unlockTier?: number; // for keyboard
  chance?: number; // for gpu
  riskReduction?: number; // for ram
  durationAdd?: number; // for cooling
}

export interface Achievement {
  id: string;
  name: string;
  desc: string;
  icon: React.ElementType;
}

export const QUOTES = [
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

export const NEWS_TICKER = [
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

export const RANKS = [
  { threshold: 0, title: "Amator Kredy" },
  { threshold: 1000, title: "Czeladnik Mazaka" },
  { threshold: 10000, title: "Magister Cytrynologii" },
  { threshold: 100000, title: "Doktor Habilitowany Absurdu" },
  { threshold: 1000000, title: "Profesor Nierodka" },
  { threshold: 10000000, title: "Minister Edukacji Wszechświata" }
];

export const THEMES: Record<string, Theme> = {
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

export const MUSIC_TRACKS: MusicTrack[] = [
  { id: 'silence', name: "Cisza Egzaminacyjna", cost: 0 },
  { id: 'lofi', name: "LoFi do Sprawdzania Prac", cost: 5000 },
  { id: 'techno', name: "Techno Dzwonek", cost: 25000 },
  { id: 'classical', name: "Symfonia Cierpienia", cost: 100000 }
];

export const SHOP_ITEMS: Upgrade[] = [
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

export const RESEARCH_DATA: Research[] = [
  { id: 'caffeine_research', name: "Badania nad Kofeiną", cost: 500, desc: "Odblokowuje kubek z kawą.", icon: Coffee, type: "unlock" },
  { id: 'overclock_license', name: "Licencja na Podkręcanie", cost: 2000, desc: "Odblokowuje przycisk Overclock w Serwerowni.", icon: Zap, type: "unlock" },
  { id: 'it_certificate', name: "Certyfikat Informatyka", cost: 10000, desc: "Odblokowuje Tier 2 w Sklepie Sprzętowym.", icon: Award, type: "unlock" },
  { id: 'bigger_mug', name: "Większy Kubek", cost: 5000, desc: "Dłuższy czas działania kawy (+50%).", req: 'caffeine_research', type: 'coffee_duration' },
  { id: 'stronger_brew', name: "Mocniejsza Parzona", cost: 15000, desc: "Zwiększa mnożnik kawy do +100%.", req: 'caffeine_research', type: 'coffee_power' }
];

export const ITEM_EVOLUTIONS: Record<string, ItemEvolution[]> = {
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

export const HARDWARE_ITEMS: Record<string, HardwareItem[]> = {
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
  ],
  ram: [
    { id: 'ram_1', name: "Karteczka Samoprzylepna", desc: "Ryzyko -5%", riskReduction: 0.05, cost: 500 },
    { id: 'ram_2', name: "RAM Ściągnięty z Internetu", desc: "Ryzyko -15%", riskReduction: 0.15, cost: 5000 },
    { id: 'ram_3', name: "Mózg Prymusa", desc: "Ryzyko -50%", riskReduction: 0.50, cost: 50000 },
  ],
  cooling: [
    { id: 'cool_1', name: "Dmuchanie na Procesor", desc: "+5s czasu", durationAdd: 5, cost: 1000 },
    { id: 'cool_2', name: "Wiatrak Biurowy z PRL", desc: "+15s czasu", durationAdd: 15, cost: 15000 },
    { id: 'cool_3', name: "Otwarte Okno w Zimie", desc: "+40s czasu", durationAdd: 40, cost: 200000 },
  ],
  power: [
    { id: 'psu_1', name: "Chomik w Kołowrotku", desc: "Mnożnik 2.2x", multiplier: 2.2, cost: 2000 },
    { id: 'psu_2', name: "Kabel od Sąsiada", desc: "Mnożnik 3.0x", multiplier: 3.0, cost: 25000 },
    { id: 'psu_3', name: "Mini-Reaktor Czarnobylski", desc: "Mnożnik 5.0x", multiplier: 5.0, cost: 500000 },
  ]
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_bell', name: "Pierwszy Dzwonek", desc: "Kliknij 100 razy.", icon: Music },
  { id: 'lemon_king', name: "Król Cytryn", desc: "Kup ulepszenie 'Syn w Zbyszko'.", icon: Trophy },
  { id: 'inflation', name: "Inflacja Ocen", desc: "Zdobądź 1,000,000 punktów.", icon: TrendingUp },
  { id: 'ceo', name: "Dyrektor Generalny", desc: "Kup wszystkie ulepszenia z Tier 1.", icon: Briefcase },
  { id: 'lab_rat', name: "Szczur Laboratoryjny", desc: "Ewoluuj przedmiot w Laboratorium.", icon: FlaskConical },
  { id: 'coffee_addict', name: "Kofeinowy Nałóg", desc: "Wypij 50 kubków kawy.", icon: Coffee },
];
