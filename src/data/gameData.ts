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
  "Dzwonek jest dla nauczyciela",
  "Trzeba kupić naboje i strzelać",
  "Może się pindolem bawi",
  "Oglądałem koncert Travisa Scotta w fortnite",
  "Nie ma gorszego komunizmu, jest tylko dobry i lepszy",
  "Mój kolega pracował na Harvardzie",
  "Masturbacja nie jest złym nawykiem",
  "Co cie bawki Klimczak chyba często sobie pornosy przesyłasz",
  "Możecie mieć swoje osoby co podziwiacie, np. Juliusza Cezara, Hitlera, i tym podobne",
  "Jak cię dotknę to będziesz pamiętał do końca życia",
  "Tymek, masz literówkę w masturbacji",
  "Wysrałeś chyba te 3 kilo",
  "Jak was suszy to się napijcie",
  "No Klimczak, co trzymasz w domu w katalogu xxx?",
  "Proszę się nie dotykać",
  "Te chuje",
  "Hitler nam dał ziemie zachodnie",
  "Przestań klikać, za chwilę ja ci kliknę. Po jajach se poklikaj",
  "Szesnastka jest taka, taka mała cipka",
  "Przerwa! Zamknij Mordę",
  "I największe rozczarowanie Rolecki 2",
  "Kto chatem wojuje, od chata ginie",
  "Teraz już wiemy co się dzieje w głowach urzędników, tysiące chińczyków siekają kapustę",
  "Idźże tylko mięsa nie męcz",
  "Nie whores tylko chores",
  "Czemu narysowałeś siusiaki w zeszycie kolegi?",
  "Dotykam cioci Genowefy hehe",
  "Chyba ktoś zapomniał wibratora wyłączyć",
  "Wustrau posprzątałeś pokój?",
  "No ja wiem że Natan Gajos, ale jak się nazywasz?",
  "Jak stworzycie te sieci to nie nazywajcie ich chuje albo pizdy",
  "Karol schowaj fleta",
  "O czym ty myślisz że sie nie możesz na lekcji skupić? O cyckach?",
  "Młody, spytam kolokwialnie cycki cię swędzą?",
  "Wyobraźcie sobie że na wesele przyjechałby redaktor naczelny Playboya",
  "Umarł kiedyś chłop na oko bo nie wiadomo co miał",
  "Najwidoczniej był do dupy",
  "Lepiej razy 2 niż razy ta sama liczba... bo 2x4=4",
  "To nie jest żydowska szkoła, mówimy po kolei",
  "Ten jest tęczowy, a ten jest czarny",
  "A se ciulikiem nawet zresetuj, byle by sie zresetowało",
  "Nie bądźcie jak społeczeństwo",
  "Będzie to sprawdzian ułożony przez Panią Gawlik, więc możecie się spodziewać komunistycznych pytań",
  "Dochodzimy do Sigmy",
  "Metaamfetamina jest lepsza od amfetaminy",
  "Ping poszedł się ruchać całkowicie",
  "Mam takie wąskie gardło, że muszę je przefragmentować",
  "Oto nasz bohater (wskazuje na Adolfa Hitlera)",
  "O kurwa co ja zrobiłam, jakiś skrót klawiszowy",
  "Gdzie jest moje krzesełko... :(",
  "Ja się za ciebie nie napiję, ale mogę na ciebie nasikać",
  "Nie palisz? I co z tego, i tak będziesz miał raka",
  "Nie skacz, pojebało cię",
  "Ma ktoś może scyzoryk albo nóż?"
];

export const NEWS_TICKER = [
  "PILNE: W sali 105 pada śnieg.",
  "INFO: Winda dla niepełnosprawnych wymaga prawa jazdy kat. C.",
  "BIZNES: Opłata za wdech w palarni wzrosła o 23% VAT.",
  "Z OSTATNIEJ CHWILI: Szkoła została sprzedana na Allegro.",
  "PILNE: Tablica pękła ze wstydu.",
  "INFO: Przerwa trwa 5 minut, lekcja 45 lat.",
  "OSTRZEŻENIE: Poziom siarki w sali 202 przekroczył normy unijne.",
  "NAUKA: W sali 309 odkryto nowy stan skupienia: spalony plastik.",
  "SPORT: Rzut dziennikiem do kosza nową dyscypliną olimpijską.",
  "INFO: Ktoś wylał mleko, płaczemy wszyscy.",
  "PILNE: Ktoś włączył projektor i oślepił pół miasta.",
  "MODA: Naszyjniki z RJ45 hitem sezonu jesień-zima.",
  "INFO: Zaginął sens życia, znalazcę prosi się o kontakt.",
  "PILNE: Ktoś ukradł dzwonek, lekcja trwa wiecznie.",
  "STATYSTYKA: Frekwencja na religii osiągnęła poziom morza.",
  "INFO: Jutro dzień dresa, czyli zwykły wtorek.",
  "PILNE: Znaleziono chęci do nauki - a nie, to tylko śmieć.",
  "BIZNES: Sklepik szkolny wprowadza płatności nerkami.",
  "INFO: Dyrektor ogłasza, że piątek jest dniem bez spodni (ż art, ubierzcie się).",
  "POGODA: Przewidywane opady jedynek w całym kraju.",
  "PILNE: Cerber widziany pod tablicą w 202, zjadł gąbkę.",
  "INFO: Nauczyciel od gegry zgubił się na mapie.",
  "KULTURA: 'Ptoszek' zakazany konwencją genewską.",
  "PILNE: Woźna znowu wygrała PvP z podłogą.",
  "SPORT: Polska gola, lekcje do kosza!",
  "INFO: Zakaz parkowania UFO na boisku.",
  "TECHNOLOGIA: NASA potwierdza: Gaming Night widać z kosmosu (teoretycznie).",
  "PILNE: Ktoś zrozumiał o co chodzi w 'Lalce'.",
  "GIEŁDA: Akcje firmy 'Zbyszko 3 Cytryny' spadają o 5%.",
  "INFO: Prosimy nie lizać ścian.",
  "ZDROWIE: Sala od chemii zamieniła się w komorę wędzarniczą.",
  "PILNE: Zaginął rozsądek, ostatnio widziany w pierwszej klasie.",
  "INFO: Uczeń zapytał 'po co nam to?' - nauczyciel eksplodował.",
  "PILNE: W sali 13 znaleziono portal do Narnii.",
  "BIZNES: Sprzedam notatki, stan igła, nieśmigane.",
  "NAUKA: Odkryto nowy pierwiastek - Ignorancjum.",
  "INFO: Zakaz wnoszenia czołgów na teren szkoły.",
  "PILNE: Nauczyciel od fizyki oblicza trajektorię wyjazdu z parkingu.",
  "INFO: Kto czyta ten pasek, ten nie uważa na lekcji.",
  "ŚWIĘTA: Barszcz z uszkami o smaku Mango-Marakuja.",
  "PILNE: Ktoś podpalił kosz na śmieci, żeby było cieplej.",
  "EDUKACJA: Nauczyciele ogłaszają strajk włoski na czas meczu.",
  "INFO: Kto nie skacze ten z policji - WF.",
  "MOTORYZACJA: Kto zaparkował Tico w poprzek bramy?!",
  "PILNE: Ktoś przyniósł zeszyt na lekcję - szok i niedowierzanie.",
  "INFO: Kawa z automatu ma właściwości żrące.",
  "BUDOWNICTWO: Drzwi do męskiej ogłosiły niepodległość i wyszły.",
  "POGODA: W sali 202 przewidywane deszcze ognia i siarki.",
  "PILNE: Nauczycielka od matmy potrafi dzielić przez zero.",
  "SPORT: Wyścigi do kantyny wpisane na listę UNESCO.",
  "INFO: Sprzedam miejsce w kolejce do ksero.",
  "PILNE: Ktoś ukradł światło w tunelu.",
  "NAUKA: Fizyka w tej szkole działa tylko we wtorki.",
  "INFO: W toaletach zamontowano kamery 4K (żart... chyba).",
  "PILNE: W sali od biologii ożył szkielet.",
  "BIZNES: Wymienię kanapkę z serem na zaliczenie z historii.",
  "INFO: Ziemia jest płaska - stwierdził uczeń 1B.",
  "PILNE: Ktoś wreszcie zrozumiał matematykę - trafił do szpitala.",
  "RELIGIA: Egzorcyzmy w 202 zakończone niepowodzeniem, demon zostaje na etacie.",
  "INFO: Prosimy nie dokarmiać informatyków.",
  "PILNE: Zaginął dziennik, wszyscy zdali.",
  "SPORT: Slalom gigant między pierwszakami na korytarzu.",
  "INFO: Zakaz miauczenia na lekcjach matematyki.",
  "PILNE: Ceny kredy szybują w górę!",
  "NAUKA: Odkryto życie w kanapce zostawionej w szafce przed wakacjami.",
  "INFO: W piątek szkoła nieczynna z powodu braku chęci.",
  "PILNE: Alarm bombowy okazał się sprawdzianem z fizyki.",
  "INFO: Nauczyciel od WF-u przyszedł w garniturze (to nie żart).",
  "ZDROWIE: 8 osób w stanie krytycznym po obejrzeniu filmu edukacyjnego.",
  "PILNE: Ktoś użył mydła w łazience - wzywamy sanepid.",
  "GIEŁDA: Akcje 'Marlboro' stabilne dzięki klasie 3C.",
  "INFO: Prosimy nie rzucać pierwszakami.",
  "Z OSTATNIEJ CHWILI: Wakacje odwołane.",
  "NAUKA: Lekcja chemii zakończona ewakuacją powiatu.",
  "PILNE: W sali 210 straszy duch jedynki.",
  "INFO: To jest ostatnia wiadomość, scrolluj dalej.",
  "SPORT: Pchnięcie kulą w okno sąsiada.",
  "PILNE: Znaleziono godność, właściciel poszukiwany.",
  "TECHNOLOGIA: Wi-Fi szkolne szybsze niż gołąb pocztowy (o 2%).",
  "INFO: Ktoś wylał kwas na chemii, teraz mamy dziurę do Chin.",
  "KRYMINAŁ: Kradzież sosu czosnkowego wstrząsnęła społecznością.",
  "PILNE: W bibliotece jest książka, której nikt nie otworzył.",
  "INFO: 2+2=5, bo inflacja.",
  "ZDROWIE: Mini pizza leczy smutek, raka i zagrożenie z matmy.",
  "PILNE: Nauczyciel kazał wyciągnąć karteczki - panika w tłumie.",
  "INFO: Za znalezienie włosa przewidziana nagroda dyrektora.",
  "SZKOŁA: Oficjalna dyspensa od myślenia na czas Mundialu.",
  "BIZNES: Otwarto nielegalne kasyno w szatni.",
  "PILNE: Ktoś zamienił szkołę w cyrk.",
  "INFO: Kolejka po pizzę dłuższa niż mur chiński.",
  "SPORT: Wyrywanie drzwi nowym sportem narodowym.",
  "PILNE: W sali 101 jest zima stulecia.",
  "INFO: Pani od polskiego recytuje rap.",
  "PREZENTY: Mikołaj w tym roku przyniósł grzałki zamiast rózgi.",
  "PILNE: Zawiasy w drzwiach to tylko sugestia.",
  "INFO: Zakaz umierania na terenie szkoły.",
  "SPOŁECZEŃSTWO: Uczniowie budują ołtarz ku czci przyszłego Gaming Night.",
  "PILNE: Zaginął woźny, ostatnio widziany w Narnii.",
  "INFO: Dzwonek dzwoni losowo, zależnie od humoru.",
  "BIZNES: Odkupię usprawiedliwienie in blanco.",
  "NAUKA: Stwierdzono, że spóźnienie to pojęcie względne.",
  "PILNE: Ktoś włączył projektor i oślepił pół miasta.",
  "INFO: Ktoś podmienił dzwonek na 'Despacito'.",
  "POGODA: Lokalnie możliwe opady tynku z sufitu.",
  "PILNE: Ktoś ukradł słońce.",
  "INFO: Warunkiem zaliczenia semestru jest wytypowanie wyniku finału.",
  "SPORT: Rzut okiem na ściągę - dyscyplina ekstremalna.",
  "PILNE: Nauczyciel się uśmiechnął - koniec świata bliski.",
  "INFO: Plan lekcji ułożony przez generator liczb losowych.",
  "KULTURA: Graffiti w kiblu mądrzejsze niż podręcznik.",
  "PILNE: W bibliotece widziano ducha Mickiewicza, szukał 'Pana Tadeusza' w streszczeniu.",
  "INFO: Dzwonek to tylko sugestia.",
  "TECHNOLOGIA: Brak internetu, ktoś ukradł wtyczkę jako talizman.",
  "Z OSTATNIEJ CHWILI: Koniec świata zaplanowany na 8:00 rano.",
  "PILNE: Dyrektor tańczy makarenę na apelu.",
  "INFO: Krzesła w sali 203 są narzędziem tortur.",
  "SPORT: Bieg po schodach z plecakiem nowym testem Coopera.",
  "PILNE: Nauczyciel od fizyki lewituje.",
  "INFO: Woda w kranie ma smak tablicy Mendelejewa.",
  "BIZNES: Wynajem długopisu: 2zł za godzinę.",
  "TEORIE SPISKOWE: Dyrektor to reptilianin? Dowody z 3 stycznia.",
  "PILNE: Tablica interaktywna wyświetla przyszłość.",
  "INFO: Jutro wszyscy przychodzą w pidżamach (nieoficjalnie).",
  "MODA: Uszy kota obowiązkowym elementem stroju galowego.",
  "PILNE: Ktoś ukradł dzwonek, lekcja trwa wiecznie.",
  "INFO: Zbiórka na nowy mózg dla kolegi z ostatniej ławki.",
  "SPORT: Rzut plecakiem do celu (czyli w kolegę).",
  "PILNE: Ktoś zjadł kredę i mówi po francusku.",
  "INFO: Sprzątaczka jest tajnym agentem CIA.",
  "EDUKACJA: Ministerstwo wprowadza obowiązkowe drzemki dla kadry.",
  "PILNE: Ksero zacięło się na 50 lat.",
  "INFO: Zakaz przynoszenia własnych ławek.",
  "KATASTROFA: Nauczyciel odpalił 'Ptoszka', straty w ludziach szacowane na miliony.",
  "PILNE: Znaleziono motywację, była pod szafą.",
  "INFO: W szatni śmierdzi, ale to normalne.",
  "SPORT: Skok przez kozła zakończony wizytą na SORze.",
  "PILNE: Ktoś wyłączył grawitację w sali gimnastycznej.",
  "INFO: 'Nie wiem' - najczęściej używane zdanie w roku szkolnym.",
  "EKONOMIA: Inflacja punktów absurdu osiąga rekordowy poziom.",
  "PILNE: Korytarz zablokowany przez grupę dyskusyjną o anime.",
  "INFO: Ktoś zamienił wodę święconą na wódkę.",
  "POŻAR: Komputer w 309 osiągnął temperaturę fuzji jądrowej.",
  "PILNE: W sali 202 odkryto portal do innego wymiaru (cieplejszego).",
  "INFO: Jutro kartkówka z wczoraj.",
  "SPORT: Turniej w 'Łysiaka' przerwany przez dzwonek.",
  "PILNE: Ktoś ukradł słońce.",
  "INFO: Woda w poidełku to łzy uczniów.",
  "Z OSTATNIEJ CHWILI: Dzwonek zadzwonił 3 sekundy za wcześnie.",
  "PILNE: Toaleta męska znowu zamknięta z powodu skażenia biologicznego.",
  "INFO: Prosimy nie deptać trawników (na suficie).",
  "BIZNES: Sklepik wprowadza abonament na bułki.",
  "PILNE: Ogrzewanie w szkole wyłączone, sala 202 grzeje cały powiat.",
  "INFO: Prosimy nie wnosić broni atomowej.",
  "HISTORIA: 3 stycznia wymazany z kalendarza szkolnego.",
  "PILNE: Nierodka widziany w dwóch miejscach naraz.",
  "INFO: Wymiana uczniów na szympansy przebiegła pomyślnie.",
  "ROZRYWKA: Premiera gry 'Gdzie jest włos?' bije rekordy popularności.",
  "PILNE: Ktoś wyłączył grawitację w sali gimnastycznej.",
  "INFO: Zadanie domowe dla chętnych (nikt nie zrobił).",
  "POGODA: Przeciąg na korytarzu urwał głowę woźnemu.",
  "PILNE: Ktoś zamienił wodę święconą na wódkę.",
  "INFO: Sprawdzian przełożony, bo psu zjadł drukarkę.",
  "Z OSTATNIEJ CHWILI: Koniec roku szkolnego przesunięty na lipiec.",
  "PILNE: Ktoś użył mydła w łazience - wzywamy sanepid.",
  "INFO: 'Co wyniosłeś ze szkoły?' - 'Kabel i depresję'.",
  "SPORT: Skok w dal z drugiego piętra (nie polecamy).",
  "PILNE: W sali informatycznej działa jedna myszka.",
  "INFO: Prosimy nie gryźć ławek.",
  "BIOLOGIA: W szkole zaobserwowano migrację lisów i wilków (na dwóch nogach).",
  "PILNE: Znaleziono rozum, nikt się nie zgłasza.",
  "INFO: Nauczyciel od historii jest starszy niż historia.",
  "GASTRONOMIA: Mini pizza uznana za walutę wewnątrzszkolną.",
  "PILNE: Szkoła została przejęta przez kosmitów.",
  "INFO: Prosimy nie rzucać zaklęć na korytarzu.",
  "TECHNOLOGIA: Cyberpunk 2077 odpalił w 309 (razem z obudową).",
  "INFO: Jutro kartkówka z oddychania.",
  "PILNE: Telewizor w świetlicy zyskał status relikwii.",
  "ZDROWIE: Energetyk dożylnie nową metodą nauczania.",
  "BREAKING: Woda w kranie ma smak tablicy Mendelejewa.",
  "PILNE: Nauczyciel od WOS-u został prezydentem.",
  "INFO: Symulacja próbna matury zakończona zbiorowym płaczem.",
  "SPORT: Wyścigi rzędów do toalety na dużej przerwie.",
  "INFO: Kto przyniesie kredę, ten dostanie plusa (albo nie).",
  "PILNE: Znaleziono sens istnienia szkoły - żartowałem, nie znaleziono.",
  "INFO: Rzutnik działa, ale wyświetla tylko na niebiesko.",
  "GIEŁDA: Długopisy pożyczone od kolegi zyskały na wartości.",
  "PILNE: W sali 202 przewidywane deszcze ognia i siarki.",
  "INFO: W sali 202 odkryto portal do innego wymiaru (cieplejszego).",
  "DROGÓWKA: Wyjazd z parkingu możliwy tylko helikopterem.",
  "INFO: Zakaz parkowania UFO na boisku.",
  "Z OSTATNIEJ CHWILI: Dzwonek nie działa, siedzimy do nocy.",
  "PILNE: Ktoś ukradł światło w tunelu."
];

export const RANKS = [
  { threshold: 0, title: "Pachołek Dyżurnego" },
  { threshold: 500, title: "Konsument Mini Pizzy" },
  { threshold: 1500, title: "Złodziej Kabli RJ45" },
  { threshold: 3000, title: "Bywalec Palarni (Premium)" },
  { threshold: 7500, title: "Ocalały z Sali 202 (Hades)" },
  { threshold: 15000, title: "Strażnik Drzwi Bez Zawiasów" },
  { threshold: 30000, title: "Saper Parkingu Szkolnego" },
  { threshold: 50000, title: "Technik Spalonego Komputera w 309" },
  { threshold: 100000, title: "Weteran 'Ptoszka'" },
  { threshold: 200000, title: "Poszukiwacz Gaming Night" },
  { threshold: 500000, title: "Magister Cytrynologii" },
  { threshold: 1000000, title: "Świadek 3 Stycznia 2023" },
  { threshold: 2500000, title: "Sigma Kornaś" },
  { threshold: 5000000, title: "Prorok Nierodka" },
  { threshold: 10000000, title: "Imperator E-Peta" },
  { threshold: 50000000, title: "Awatar Czasu (Władca Dzwonka)" },
  { threshold: 100000000, title: "Minister Edukacji Wszechświata" },
  { threshold: 1000000000, title: "Byt Absolutny (Librus)" }
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
  { id: 'overclock_license', name: "Licencja na Podkręcanie", cost: 2000, desc: "Odblokowuje przycisk Overclock w Serwerowni.", icon: Zap, type: "unlock" },
  { id: 'it_certificate', name: "Certyfikat Informatyka", cost: 10000, desc: "Odblokowuje Tier 2 w Sklepie Sprzętowym.", icon: Award, type: "unlock" },
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
  ],
  case: [
    { id: 'case_1', name: "Karton po mleku", desc: "Dobra wentylacja, słaba ognioodporność.", cost: 500 },
    { id: 'case_2', name: "Stara Obudowa ATX", desc: "Beżowa, brzydka, niezniszczalna.", cost: 2500 },
    { id: 'case_3', name: "Szklana Pułapka RGB", desc: "Widać kurz, ale świeci na tęczowo.", cost: 15000 },
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
