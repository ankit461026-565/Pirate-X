import { useCallback, useEffect, useState } from 'react';
import type { GameState, LocationId, ScreenName } from './types';
import {
  LOCATIONS,
  LOCATION_MAP,
  RELICS,
  ALL_RELIC_IDS,
  SCORE_VALUES,
  TOTAL_RIDDLES,
  TOTAL_RELICS,
  REQUIRED_RIDDLES,
  REQUIRED_RELICS,
  getRandomMessage,
} from './data';

const STORAGE_KEY = 'the-living-map-save';

const INITIAL_STATE: GameState = {
  captainName: '',
  screen: 'landing',
  lives: 3,
  maxLives: 3,
  visitedLocations: [],
  completedLocations: [],
  currentLocationId: null,
  unlockedLocations: ['blackwater-bay', 'lighthouse'],
  collectedRelics: [],
  solvedRiddles: [],
  choicesMade: [],
  hintsUsed: 0,
  score: 0,
  startTime: 0,
  endTime: null,
  gameMasterMessages: [],
};

let messageIdCounter = 1;

function loadState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATE;
    const parsed = JSON.parse(raw) as GameState;
    // Merge with initial to handle new fields
    return { ...INITIAL_STATE, ...parsed };
  } catch {
    return INITIAL_STATE;
  }
}

function saveState(state: GameState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage may be unavailable; game still works in-memory
  }
}

export function useGame() {
  const [state, setState] = useState<GameState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const setScreen = useCallback((screen: ScreenName) => {
    setState((s) => ({ ...s, screen }));
  }, []);

  const setCaptainName = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    messageIdCounter += 1;
    setState((s) => ({
      ...s,
      captainName: trimmed,
      screen: 'map',
      startTime: s.startTime || Date.now(),
      gameMasterMessages: [
        ...s.gameMasterMessages.slice(-4),
        {
          id: messageIdCounter,
          text: `Welcome, Captain ${trimmed}. The Living Map stirs at your touch. Your voyage begins at Blackwater Bay.`,
          tone: 'info' as const,
        },
      ],
    }));
  }, []);

  const visitLocation = useCallback((locationId: LocationId) => {
    setState((s) => {
      if (s.lives <= 0) return s;
      if (!s.unlockedLocations.includes(locationId)) return s;
      const loc = LOCATION_MAP[locationId];
      const visited = s.visitedLocations.includes(locationId)
        ? s.visitedLocations
        : [...s.visitedLocations, locationId];
      messageIdCounter += 1;
      return {
        ...s,
        screen: 'location',
        currentLocationId: locationId,
        visitedLocations: visited,
        gameMasterMessages: [
          ...s.gameMasterMessages.slice(-4),
          {
            id: messageIdCounter,
            text: `You arrive at ${loc.name}. ${loc.description}`,
            tone: 'info' as const,
          },
        ],
      };
    });
  }, []);

  const solveRiddle = useCallback((locationId: LocationId) => {
    setState((s) => {
      if (s.lives <= 0) return s;
      const loc = LOCATION_MAP[locationId];
      if (!loc.riddle) return s;
      if (s.solvedRiddles.includes(loc.riddle.id)) return s;

      const newSolved = [...s.solvedRiddles, loc.riddle.id];
      const newRelics = loc.relicId && !s.collectedRelics.includes(loc.relicId)
        ? [...s.collectedRelics, loc.relicId]
        : s.collectedRelics;
      const newCompleted = s.completedLocations.includes(locationId)
        ? s.completedLocations
        : [...s.completedLocations, locationId];

      // Unlock next locations
      let newUnlocked = [...s.unlockedLocations];
      if (loc.unlocks) {
        for (const unlockId of loc.unlocks) {
          if (!newUnlocked.includes(unlockId)) {
            newUnlocked = [...newUnlocked, unlockId];
          }
        }
      }

      const scoreGain = SCORE_VALUES.riddleSolved +
        (loc.relicId && !s.collectedRelics.includes(loc.relicId) ? SCORE_VALUES.relicFound : 0);

      messageIdCounter += 1;
      const relicMsg = loc.relicId
        ? getRandomMessage('onRelic')
        : getRandomMessage('onSolve');

      return {
        ...s,
        solvedRiddles: newSolved,
        collectedRelics: newRelics,
        completedLocations: newCompleted,
        unlockedLocations: newUnlocked,
        score: s.score + scoreGain,
        gameMasterMessages: [
          ...s.gameMasterMessages.slice(-4),
          { id: messageIdCounter, text: relicMsg, tone: 'success' as const },
        ],
      };
    });
  }, []);

  const wrongAnswer = useCallback(() => {
    setState((s) => {
      const newLives = s.lives - 1;
      messageIdCounter += 1;
      if (newLives <= 0) {
        return {
          ...s,
          lives: 0,
          screen: 'gameover',
          endTime: Date.now(),
          gameMasterMessages: [
            ...s.gameMasterMessages.slice(-4),
            { id: messageIdCounter, text: 'Your three lives are gone. The sea claims this voyage.', tone: 'warning' as const },
          ],
        };
      }
      const msg = newLives <= 1
        ? getRandomMessage('onLowLives')
        : getRandomMessage('onWrong');
      return {
        ...s,
        lives: newLives,
        gameMasterMessages: [
          ...s.gameMasterMessages.slice(-4),
          { id: messageIdCounter, text: msg, tone: 'warning' as const },
        ],
      };
    });
  }, []);

  const useHint = useCallback((locationId: LocationId) => {
    setState((s) => {
      if (s.lives <= 0) return s;
      const loc = LOCATION_MAP[locationId];
      if (!loc.riddle) return s;
      messageIdCounter += 1;
      return {
        ...s,
        hintsUsed: s.hintsUsed + 1,
        score: Math.max(0, s.score - SCORE_VALUES.hintPenalty),
        gameMasterMessages: [
          ...s.gameMasterMessages.slice(-4),
          { id: messageIdCounter, text: getRandomMessage('onHint'), tone: 'info' as const },
        ],
      };
    });
  }, []);

  const makeChoice = useCallback((locationId: LocationId, choiceId: string, branchId: string) => {
    setState((s) => {
      if (s.lives <= 0) return s;
      if (s.choicesMade.some((c) => c.locationId === locationId)) return s;
      messageIdCounter += 1;
      return {
        ...s,
        choicesMade: [...s.choicesMade, { locationId, choiceId, branchId }],
        gameMasterMessages: [
          ...s.gameMasterMessages.slice(-4),
          { id: messageIdCounter, text: 'Your choice has been etched into the map. The path shifts accordingly.', tone: 'info' as const },
        ],
      };
    });
  }, []);

  const completeLocation = useCallback((locationId: LocationId) => {
    setState((s) => {
      const newCompleted = s.completedLocations.includes(locationId)
        ? s.completedLocations
        : [...s.completedLocations, locationId];
      return { ...s, completedLocations: newCompleted };
    });
  }, []);

  const returnToMap = useCallback(() => {
    setState((s) => ({ ...s, screen: 'map', currentLocationId: null }));
  }, []);

  const openTreasureVault = useCallback(() => {
    setState((s) => {
      if (s.lives <= 0) return s;
      return {
      ...s,
      screen: 'treasure',
      currentLocationId: 'treasure-vault',
      endTime: Date.now(),
      score: s.score + s.lives * SCORE_VALUES.lifeBonus,
      };
    });
  }, []);

  const goToEnding = useCallback(() => {
    setState((s) => ({ ...s, screen: 'ending' }));
  }, []);

  const canAccessTreasure = useCallback(() => {
    return state.solvedRiddles.length >= REQUIRED_RIDDLES &&
      state.collectedRelics.length >= REQUIRED_RELICS;
  }, [state.solvedRiddles, state.collectedRelics]);

  const treasureProgress = useCallback(() => {
    return {
      riddlesSolved: state.solvedRiddles.length,
      riddlesRequired: REQUIRED_RIDDLES,
      relicsCollected: state.collectedRelics.length,
      relicsRequired: REQUIRED_RELICS,
      riddlesReady: state.solvedRiddles.length >= REQUIRED_RIDDLES,
      relicsReady: state.collectedRelics.length >= REQUIRED_RELICS,
      ready: state.solvedRiddles.length >= REQUIRED_RIDDLES && state.collectedRelics.length >= REQUIRED_RELICS,
    };
  }, [state.solvedRiddles, state.collectedRelics]);

  const resetGame = useCallback(() => {
    setState((s) => {
      const savedName = s.captainName;
      messageIdCounter = 1;
      return {
        ...INITIAL_STATE,
        captainName: savedName,
        screen: 'map',
        startTime: Date.now(),
      };
    });
  }, []);

  // Derived data
  const totalRiddles = TOTAL_RIDDLES;
  const totalRelics = TOTAL_RELICS;
  const totalLocations = LOCATIONS.length;

  return {
    state,
    setScreen,
    setCaptainName,
    visitLocation,
    solveRiddle,
    wrongAnswer,
    useHint,
    makeChoice,
    completeLocation,
    returnToMap,
    openTreasureVault,
    goToEnding,
    canAccessTreasure,
    treasureProgress,
    resetGame,
    totalRiddles,
    totalRelics,
    totalLocations,
    allRelics: ALL_RELIC_IDS.map((id) => RELICS[id]),
  };
}

export type GameAPI = ReturnType<typeof useGame>;
