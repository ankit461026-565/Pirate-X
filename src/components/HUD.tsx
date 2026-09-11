import { Compass, Heart, Map as MapIcon, Package, RotateCcw, Skull, Puzzle, Gem } from 'lucide-react';
import type { GameState } from '@/game/types';
import type { GameAPI } from '@/game/useGame';

interface HUDProps {
  state: GameState;
  game: GameAPI;
  onMap: () => void;
  onInventory: () => void;
  onReset: () => void;
}

export function HUD({ state, game, onMap, onInventory, onReset }: HUDProps) {
  const riddlesSolved = state.solvedRiddles.length;
  const locationsDiscovered = state.visitedLocations.length;
  const relicsCollected = state.collectedRelics.length;

  return (
    <div className="sticky top-0 z-40 bg-ocean-900/95 backdrop-blur-md border-b border-gold-700/30">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* Captain name + lives */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center gap-1.5">
              <Compass className="w-5 h-5 text-gold-400 animate-compass-spin shrink-0" aria-hidden="true" />
              <span className="font-display font-bold text-gold-300 text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">
                {state.captainName || 'Captain'}
              </span>
            </div>
            <div className="flex items-center gap-0.5" aria-label={`${state.lives} of ${state.maxLives} lives remaining`}>
              {Array.from({ length: state.maxLives }).map((_, i) => (
                <Heart
                  key={i}
                  className={`w-4 h-4 ${
                    i < state.lives
                      ? 'text-ember-500 fill-ember-500'
                      : 'text-ocean-500'
                  }`}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="hidden md:flex items-center gap-4 text-xs">
            <Stat icon={<Puzzle className="w-3.5 h-3.5" />} label="Riddles" value={`${riddlesSolved}/${game.totalRiddles}`} />
            <Stat icon={<MapIcon className="w-3.5 h-3.5" />} label="Found" value={`${locationsDiscovered}/${game.totalLocations}`} />
            <Stat icon={<Gem className="w-3.5 h-3.5" />} label="Relics" value={`${relicsCollected}/${game.totalRelics}`} />
            <Stat icon={<Skull className="w-3.5 h-3.5" />} label="Score" value={state.score.toString()} />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onMap}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-ocean-700/60 hover:bg-ocean-600/70 text-parchment-200 border border-gold-700/30 hover:border-gold-500/50 transition-all text-xs font-display font-bold uppercase tracking-wide active:scale-95 focus:outline-none focus:ring-2 focus:ring-gold-400/40"
              aria-label="Return to map"
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Map</span>
            </button>
            <button
              onClick={onInventory}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-ocean-700/60 hover:bg-ocean-600/70 text-parchment-200 border border-gold-700/30 hover:border-gold-500/50 transition-all text-xs font-display font-bold uppercase tracking-wide active:scale-95 focus:outline-none focus:ring-2 focus:ring-gold-400/40"
              aria-label="Open inventory"
            >
              <Package className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bag</span>
              {relicsCollected > 0 && (
                <span className="bg-gold-500 text-ocean-900 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                  {relicsCollected}
                </span>
              )}
            </button>
            <button
              onClick={onReset}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-cursed-500/20 hover:bg-cursed-500/40 text-ember-400 border border-cursed-500/30 hover:border-cursed-500/60 transition-all text-xs font-display font-bold uppercase tracking-wide active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-400/40"
              aria-label="Reset voyage"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Mobile stats bar */}
        <div className="md:hidden flex items-center justify-between gap-2 mt-2 text-[10px]">
          <Stat icon={<Puzzle className="w-3 h-3" />} label="Riddles" value={`${riddlesSolved}/${game.totalRiddles}`} />
          <Stat icon={<MapIcon className="w-3 h-3" />} label="Found" value={`${locationsDiscovered}/${game.totalLocations}`} />
          <Stat icon={<Gem className="w-3 h-3" />} label="Relics" value={`${relicsCollected}/${game.totalRelics}`} />
          <Stat icon={<Skull className="w-3 h-3" />} label="Score" value={state.score.toString()} />
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-1 text-parchment-300">
      <span className="text-gold-400" aria-hidden="true">{icon}</span>
      <span className="uppercase tracking-wider opacity-60">{label}</span>
      <span className="font-bold text-parchment-100">{value}</span>
    </div>
  );
}
