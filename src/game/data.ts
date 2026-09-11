import type { MapLocation, Relic, EndingId, LocationId } from './types';

// ========================
// RELICS
// ========================

export const RELICS: Record<string, Relic> = {
  'broken-compass': {
    id: 'broken-compass',
    name: 'Broken Compass',
    icon: '🧭',
    description: 'A tarnished compass whose needle spins endlessly, drawn to something long forgotten.',
    location: 'Blackwater Bay',
  },
  'torn-map-fragment': {
    id: 'torn-map-fragment',
    name: 'Torn Map Fragment',
    icon: '📜',
    description: 'A weathered piece of the original map, revealing a coastline no one remembers.',
    location: 'Forgotten Lighthouse',
  },
  'moonstone': {
    id: 'moonstone',
    name: 'Moonstone',
    icon: '💎',
    description: 'A pale gem that glows under moonlight, humming with ancient energy.',
    location: 'Whispering Caves',
  },
  'ancient-key': {
    id: 'ancient-key',
    name: 'Ancient Key',
    icon: '🗝️',
    description: 'An ornate iron key, heavy with the weight of centuries beneath the sea.',
    location: 'Sunken Temple',
  },
  'captains-coin': {
    id: 'captains-coin',
    name: "Captain's Coin",
    icon: '🪙',
    description: 'A gold coin bearing the face of a captain whose name history erased.',
    location: 'Skull Island',
  },
};

export const ALL_RELIC_IDS = Object.keys(RELICS);

// ========================
// LOCATIONS
// ========================

export const LOCATIONS: MapLocation[] = [
  {
    id: 'blackwater-bay',
    name: 'Blackwater Bay',
    shortName: 'Blackwater',
    description: 'A foggy harbor where your voyage begins.',
    narrative:
      'Your ship drifts into Blackwater Bay, its waters dark as ink. An old dockmaster hands you a weathered chart — the Living Map. "This map breathes," he whispers. "It changes when you choose. Solve its riddles, and the seas will open." The first riddle is already visible on the map\'s edge...',
    x: 15,
    y: 72,
    icon: '⚓',
    initiallyUnlocked: true,
    riddle: {
      id: 'r-blackwater',
      question:
        'I have a face but no eyes,\nI have hands but no arms.\nWhat am I?',
      answer: 'clock',
      hint: 'The answer measures something, but it cannot see.',
      relicId: 'broken-compass',
    },
    relicId: 'broken-compass',
    unlocks: ['lighthouse', 'whispering-caves'],
  },
  {
    id: 'lighthouse',
    name: 'Forgotten Lighthouse',
    shortName: 'Lighthouse',
    description: 'A crumbling beacon on a lonely cliff.',
    narrative:
      'You climb the spiraling stairs of the Forgotten Lighthouse. Its light died decades ago, but something still glows at the top — a riddle carved into the lantern itself. Solve it, and the beam may reignite, revealing the path ahead.',
    x: 38,
    y: 28,
    icon: '🗼',
    initiallyUnlocked: true,
    riddle: {
      id: 'r-lighthouse',
      question:
        'I am always hungry, I must always be fed.\nThe finger I touch will soon turn red.\nWhat am I?',
      answer: 'fire',
      hint: 'I give light and warmth, but I devour everything I touch.',
      relicId: 'torn-map-fragment',
    },
    relicId: 'torn-map-fragment',
    unlocks: ['ancient-ruins'],
  },
  {
    id: 'whispering-caves',
    name: 'Whispering Caves',
    shortName: 'Caves',
    description: 'Caves that echo with voices of the drowned.',
    narrative:
      'The Whispering Caves breathe with the voices of sailors long lost. The walls are damp with salt and sorrow. Deep inside, a riddle is etched in glowing phosphorescent letters. The caves fall silent when you approach it — as if listening.',
    x: 60,
    y: 62,
    icon: '🕯️',
    initiallyUnlocked: false,
    riddle: {
      id: 'r-caves',
      question:
        'I speak without a mouth and hear without ears.\nI have nobody, but I come alive with the wind.\nWhat am I?',
      answer: 'echo',
      hint: 'You hear me in these very caves, repeating what you say.',
      relicId: 'moonstone',
    },
    relicId: 'moonstone',
    unlocks: ['skull-island'],
  },
  {
    id: 'ancient-ruins',
    name: 'Ancient Ruins',
    shortName: 'Ruins',
    description: 'Stone remnants of a civilization swallowed by time.',
    narrative:
      'Vines strangle the Ancient Ruins of a people who worshipped the sea itself. Crumbling arches frame a courtyard where a stone tablet bears a riddle. But beneath the ruins, you hear something moving... and after solving the riddle, a choice must be made.',
    x: 50,
    y: 18,
    icon: '🏛️',
    initiallyUnlocked: false,
    riddle: {
      id: 'r-ruins',
      question:
        'The more you take, the more you leave behind.\nWhat am I?',
      answer: 'footsteps',
      hint: 'You are making them right now, as you walk these ruins.',
      relicId: 'torn-map-fragment',
    },
    requiresRelics: ['torn-map-fragment'],
    unlocks: ['sunken-temple'],
    choices: [
      {
        id: 'enter-cave',
        label: 'Enter the Cave Below',
        icon: '🕳️',
        narrative:
          'You descend into the darkness beneath the ruins. The passage twists downward, and the air grows cold. Deep below, you discover the entrance to the Sunken Temple — a path few have dared to take. The map rewards your courage.',
        branchId: 'courageous',
      },
      {
        id: 'follow-light',
        label: 'Follow the Faint Light',
        icon: '✨',
        narrative:
          'A faint glow beckons from the eastern corridor. You follow it through crumbling halls until you emerge on a hidden shore — the path to the Sunken Temple reveals itself from the sea. The map rewards your curiosity.',
        branchId: 'curious',
      },
      {
        id: 'return-ship',
        label: 'Return to the Ship',
        icon: '🚢',
        narrative:
          'You decide caution is the better part of valor and return to your ship. But the map is restless — it will not let you skip the Sunken Temple. You must venture forth when you are ready, Captain.',
        branchId: 'cautious',
      },
    ],
  },
  {
    id: 'skull-island',
    name: 'Skull Island',
    shortName: 'Skull Is.',
    description: 'An island shaped like a skull. Pirates were buried here.',
    narrative:
      'Skull Island looms from the mist, its cliffs carved by centuries into a grinning death\'s head. Crossbones mark the graves of pirates who sought the same treasure you now hunt. A riddle guards their captain\'s coin — solve it, and the dead will yield their prize.',
    x: 78,
    y: 40,
    icon: '💀',
    initiallyUnlocked: false,
    riddle: {
      id: 'r-skull',
      question:
        "I have cities, but no houses.\nI have mountains, but no trees.\nI have water, but no fish.\nWhat am I?",
      answer: 'map',
      hint: 'You are holding one right now, Captain. The Living Map itself.',
      relicId: 'captains-coin',
    },
    relicId: 'captains-coin',
    // Vault is gated by riddle/relic thresholds, not by this unlock
  },
  {
    id: 'sunken-temple',
    name: 'Sunken Temple',
    shortName: 'Temple',
    description: 'A temple drowned beneath the cursed waters.',
    narrative:
      'You dive into the cursed waters where the Sunken Temple lies submerged. Eerie bioluminescence lights your way through flooded corridors. At the heart of the temple, an altar holds the Ancient Key — but a riddle must be answered to take it without triggering the temple\'s curse.',
    x: 72,
    y: 85,
    icon: '🔱',
    initiallyUnlocked: false,
    riddle: {
      id: 'r-temple',
      question:
        'What has keys but cannot open a single lock?\nWhat has space but no room?\nYou can enter, but you cannot go inside.\nWhat am I?',
      answer: 'keyboard',
      hint: 'You might be using one right now to type your answer.',
      relicId: 'ancient-key',
    },
    relicId: 'ancient-key',
    // Vault is gated by riddle/relic thresholds, not by this unlock
  },
  {
    id: 'treasure-vault',
    name: 'Treasure Vault',
    shortName: 'Vault',
    description: 'The final destination. The treasure awaits.',
    narrative:
      'The Treasure Vault. At last. Its doors are sealed with ancient mechanisms that respond only to those who have proven themselves worthy. The relics you carry pulse with recognition. The map has led you here. The treasure is within reach...',
    x: 88,
    y: 15,
    icon: '💎',
    initiallyUnlocked: false,
    requiresRelics: ['ancient-key'],
  },
];

export const LOCATION_MAP: Record<string, MapLocation> = Object.fromEntries(
  LOCATIONS.map((l) => [l.id, l])
);

// Paths between locations (for drawing on the map)
export const MAP_PATHS: [LocationId, LocationId][] = [
  ['blackwater-bay', 'lighthouse'],
  ['blackwater-bay', 'whispering-caves'],
  ['lighthouse', 'ancient-ruins'],
  ['whispering-caves', 'skull-island'],
  ['ancient-ruins', 'sunken-temple'],
  ['skull-island', 'treasure-vault'],
  ['sunken-temple', 'treasure-vault'],
];

// ========================
// ENDINGS
// ========================

export interface Ending {
  id: EndingId;
  title: string;
  narrative: string;
  icon: string;
  condition: (state: {
    lives: number;
    solvedRiddles: number;
    collectedRelics: number;
    totalRiddles: number;
    totalRelics: number;
    choicesMade: string[];
  }) => boolean;
}

export const ENDINGS: Ending[] = [
  {
    id: 'legendary',
    title: 'THE LEGENDARY CAPTAIN',
    icon: '👑',
    narrative:
      'You stand before the treasure with all riddles solved, all relics claimed, and your crew intact. Your choices were bold and true — the map itself seemed to guide your hand. The seas will tell your story for generations. Songs will be sung in every port from Blackwater Bay to the edge of the world. You are not merely a captain who found treasure — you are the captain the map was waiting for.',
    condition: (s) =>
      s.solvedRiddles >= s.totalRiddles &&
      s.collectedRelics >= s.totalRelics &&
      s.lives >= 2 &&
      s.choicesMade.includes('courageous'),
  },
  {
    id: 'cursed',
    title: 'THE CURSED CAPTAIN',
    icon: '💀',
    narrative:
      'You found the treasure, but the map demanded a price. Whether through lost lives, abandoned relics, or a cautious heart that shied from the dark path — the ocean claims its toll. The relics you failed to collect whisper your name in the dark. You are wealthy and wretched, powerful and imprisoned. The treasure is yours — but so is the curse.',
    condition: (s) =>
      s.solvedRiddles >= 4 &&
      (s.lives < 2 || s.collectedRelics < s.totalRelics || s.choicesMade.includes('cautious')),
  },
  {
    id: 'lost',
    title: 'THE LOST CAPTAIN',
    icon: '🌊',
    narrative:
      'The treasure remains hidden. Your ship drifts into an endless fog, the map\'s riddles unsolved, its paths untraveled. Somewhere beyond the cursed waters, the vault waits for another captain — perhaps braver, perhaps wiser. But the sea remembers you, and the map... the map is patient. Perhaps another voyage awaits.',
    condition: () => true, // fallback
  },
];

export function determineEnding(state: {
  lives: number;
  solvedRiddles: number;
  collectedRelics: number;
  totalRiddles: number;
  totalRelics: number;
  choicesMade: string[];
}): Ending {
  return ENDINGS.find((e) => e.condition(state)) ?? ENDINGS[ENDINGS.length - 1];
}

// ========================
// GAME MASTER MESSAGES
// ========================

export const GAME_MASTER_MESSAGES = {
  onSolve: [
    'Impressive, Captain. The old map has revealed another path.',
    'The waters calm at your wisdom. The map breathes with satisfaction.',
    'A riddle unraveled. The Living Map shifts, revealing new shores.',
    'Your mind is sharp as a cutlass. Another secret yields to you.',
  ],
  onWrong: [
    'The sea tests even the bravest captain. Look closer at the clue.',
    'A wrong turn in the fog. The map does not judge — it waits.',
    'The tides turn against you. Gather your wits and try again, Captain.',
    'Even the greatest captains stumble. The riddle remains.',
  ],
  onRelic: [
    'The compass trembles in your hand. It seems to remember this place.',
    'A relic joins your collection. The map pulses with ancient recognition.',
    'You feel the weight of history. This relic has been waiting for you.',
    'The treasure hums as you claim this prize. The map is pleased.',
  ],
  onHint: [
    'Wisdom sometimes means knowing when to seek help, Captain.',
    'A hint from the depths. Use it wisely — the sea keeps count.',
  ],
  onLowLives: [
    'Your crew grows weary, Captain. Tread carefully in these waters.',
    'The sea is merciless. One more misstep and the voyage may end.',
  ],
  onUnlock: [
    'A new path shimmers on the map. The Living Map has grown.',
    'New shores beckon. The fog lifts to reveal what was hidden.',
  ],
};

export function getRandomMessage(category: keyof typeof GAME_MASTER_MESSAGES): string {
  const messages = GAME_MASTER_MESSAGES[category];
  return messages[Math.floor(Math.random() * messages.length)];
}

// ========================
// SCORING
// ========================

export const SCORE_VALUES = {
  riddleSolved: 100,
  relicFound: 150,
  hintPenalty: 25,
  lifeBonus: 200,
};

export const TOTAL_RIDDLES = LOCATIONS.filter((l) => l.riddle).length;
export const TOTAL_LOCATIONS = LOCATIONS.length;
export const TOTAL_RELICS = ALL_RELIC_IDS.length;

// Vault unlock thresholds — meaningful exploration required
export const REQUIRED_RIDDLES = 4;
export const REQUIRED_RELICS = 3;
