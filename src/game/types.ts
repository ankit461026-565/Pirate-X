// ========================
// GAME TYPES
// ========================

export type ScreenName =
  | 'landing'
  | 'profile'
  | 'map'
  | 'location'
  | 'treasure'
  | 'ending';

export type LocationId =
  | 'blackwater-bay'
  | 'lighthouse'
  | 'whispering-caves'
  | 'ancient-ruins'
  | 'skull-island'
  | 'sunken-temple'
  | 'treasure-vault';

export type RelicId =
  | 'broken-compass'
  | 'ancient-key'
  | 'moonstone'
  | 'torn-map-fragment'
  | 'captains-coin';

export type EndingId = 'legendary' | 'cursed' | 'lost';

export interface Relic {
  id: RelicId;
  name: string;
  icon: string;
  description: string;
  location: string;
}

export interface Riddle {
  id: string;
  question: string;
  answer: string;
  hint: string;
  relicId: RelicId;
}

export interface Choice {
  id: string;
  label: string;
  icon: string;
  narrative: string;
  branchId: string;
}

export interface MapLocation {
  id: LocationId;
  name: string;
  shortName: string;
  description: string;
  narrative: string;
  x: number; // percentage position on map
  y: number;
  icon: string;
  initiallyUnlocked: boolean;
  riddle?: Riddle;
  choices?: Choice[];
  relicId?: RelicId;
  // Location IDs this unlocks when completed
  unlocks?: LocationId[];
  // Required relics to access (beyond initial unlock)
  requiresRelics?: RelicId[];
}

export interface GameState {
  captainName: string;
  screen: ScreenName;
  lives: number;
  maxLives: number;
  visitedLocations: LocationId[];
  completedLocations: LocationId[];
  currentLocationId: LocationId | null;
  unlockedLocations: LocationId[];
  collectedRelics: RelicId[];
  solvedRiddles: string[];
  choicesMade: { locationId: LocationId; choiceId: string; branchId: string }[];
  hintsUsed: number;
  score: number;
  startTime: number;
  endTime: number | null;
  gameMasterMessages: { id: number; text: string; tone: 'success' | 'warning' | 'info' }[];
}
