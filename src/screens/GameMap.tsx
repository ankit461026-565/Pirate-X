import { useState, useMemo } from 'react';
import { Lock, Check, MapPin, Gem, Puzzle, Home } from 'lucide-react';
import type { GameState, LocationId } from '@/game/types';
import { LOCATIONS, LOCATION_MAP, MAP_PATHS, RELICS } from '@/game/data';
import type { GameAPI } from '@/game/useGame';
import { ParticleBackground } from '@/components/ParticleBackground';
import { Modal } from '@/components/Modal';

interface GameMapProps {
  state: GameState;
  game: GameAPI;
  onOpenInventory: () => void;
  onOpenHowToPlay: () => void;
  onBackHome: () => void;
}

export function GameMap({ state, game, onOpenInventory, onOpenHowToPlay, onBackHome }: GameMapProps) {
  const [hoveredId, setHoveredId] = useState<LocationId | null>(null);
  const [selectedId, setSelectedId] = useState<LocationId | null>(null);
  const [legendFilter, setLegendFilter] = useState<'explored' | 'available' | 'locked' | null>(null);

  const canAccessTreasure = game.canAccessTreasure();
  const progress = game.treasureProgress();

  const isLocationUnlocked = (id: LocationId): boolean => {
    if (id === 'treasure-vault') return canAccessTreasure;
    return state.unlockedLocations.includes(id);
  };

  const exploredLocations = useMemo(
    () => LOCATIONS.filter((l) => state.visitedLocations.includes(l.id)),
    [state.visitedLocations]
  );

  const availableLocations = useMemo(
    () => LOCATIONS.filter((l) => isLocationUnlocked(l.id) && !state.visitedLocations.includes(l.id)),
    [state.unlockedLocations, state.visitedLocations, canAccessTreasure]
  );

  const lockedLocations = useMemo(
    () => LOCATIONS.filter((l) => !isLocationUnlocked(l.id)),
    [state.unlockedLocations, canAccessTreasure]
  );

  const handleNodeClick = (id: LocationId) => {
    if (id === 'treasure-vault' && canAccessTreasure) {
      game.openTreasureVault();
      return;
    }
    if (!isLocationUnlocked(id)) {
      setSelectedId(id);
      return;
    }
    game.visitLocation(id);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-ocean-800 via-ocean-900 to-ocean-800" />
      <div className="absolute inset-0 bg-map-grid opacity-40" />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 50% 50%, rgba(212, 168, 60, 0.1) 0%, transparent 70%)',
        }}
      />
      <ParticleBackground density={30} mode="fog" color="rgba(212, 168, 60, 0.1)" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-6 pb-32">
        {/* Map header */}
        <div className="flex items-center justify-between gap-2 mb-4 animate-fade-in-down">
          <button
            onClick={onBackHome}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ocean-700/60 hover:bg-ocean-600/70 text-parchment-200 border border-gold-700/30 hover:border-gold-500/50 transition-all text-xs font-display font-bold uppercase tracking-wide active:scale-95 focus:outline-none focus:ring-2 focus:ring-gold-400/40"
            aria-label="Return to home screen"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Home</span>
          </button>
          <div className="text-center flex-1">
            <h2 className="section-title text-lg sm:text-xl mb-1">The Living Map</h2>
            <p className="text-parchment-300 text-sm italic">
              {state.captainName ? `Captain ${state.captainName}, choose your path.` : 'Choose your path.'}
            </p>
          </div>
          <div className="w-[72px] sm:w-[88px] shrink-0" />
        </div>

        {/* SVG Map container */}
        <div
          className="relative w-full rounded-2xl border-2 border-gold-700/40 overflow-hidden bg-ocean-900/50"
          style={{ aspectRatio: '16 / 10', maxHeight: '70vh' }}
        >
          {/* Decorative compass rose */}
          <div className="absolute top-4 right-4 opacity-25 pointer-events-none" aria-hidden="true">
            <svg width="80" height="80" viewBox="0 0 100 100" className="animate-compass-spin" style={{ animationDuration: '60s' }}>
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(212, 168, 60, 0.4)" strokeWidth="1" />
              <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(212, 168, 60, 0.25)" strokeWidth="0.5" />
              <path d="M50,5 L55,50 L50,95 L45,50 Z" fill="rgba(212, 168, 60, 0.35)" />
              <path d="M5,50 L50,55 L95,50 L50,45 Z" fill="rgba(212, 168, 60, 0.25)" />
              <text x="50" y="15" textAnchor="middle" fill="rgba(212, 168, 60, 0.6)" fontSize="8" fontFamily="serif">N</text>
            </svg>
          </div>

          {/* Paths SVG — boosted contrast */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 62.5" preserveAspectRatio="none">
            {MAP_PATHS.map(([fromId, toId], i) => {
              const from = LOCATION_MAP[fromId];
              const to = LOCATION_MAP[toId];
              const fromUnlocked = isLocationUnlocked(fromId);
              const toUnlocked = isLocationUnlocked(toId);
              const bothDiscovered = state.visitedLocations.includes(fromId) && state.visitedLocations.includes(toId);
              const isActive = fromUnlocked && toUnlocked;

              const midX = (from.x + to.x) / 2;
              const midY = (from.y + to.y) / 2 - 5;
              const d = `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;

              return (
                <path
                  key={i}
                  d={d}
                  fill="none"
                  stroke={isActive ? 'rgba(212, 168, 60, 0.6)' : 'rgba(80, 90, 120, 0.25)'}
                  strokeWidth={isActive ? '0.6' : '0.4'}
                  strokeDasharray={bothDiscovered ? '0' : '2 1.5'}
                  className="transition-all duration-500"
                />
              );
            })}
          </svg>

          {/* Location nodes */}
          {LOCATIONS.map((loc) => {
            const unlocked = isLocationUnlocked(loc.id);
            const visited = state.visitedLocations.includes(loc.id);
            const completed = state.completedLocations.includes(loc.id);
            const isCurrent = state.currentLocationId === loc.id;
            const isHovered = hoveredId === loc.id;
            const isSelected = selectedId === loc.id;
            const isVault = loc.id === 'treasure-vault';

            return (
              <div key={loc.id}>
                <button
                  onClick={() => handleNodeClick(loc.id)}
                  onMouseEnter={() => setHoveredId(loc.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onFocus={() => setHoveredId(loc.id)}
                  onBlur={() => setHoveredId(null)}
                  className="absolute z-20 focus:outline-none"
                  style={{
                    left: `${loc.x}%`,
                    top: `${loc.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  aria-label={`${loc.name}${!unlocked ? ' (locked)' : visited ? ' (explored)' : ' (available)'}`}
                >
                  {/* Node */}
                  <div
                    className={`
                      relative flex items-center justify-center rounded-full border-2
                      transition-all duration-300
                      ${unlocked
                        ? completed
                          ? 'bg-gold-500/25 border-gold-400 text-gold-200'
                          : 'bg-ocean-600/90 border-gold-400/80 text-gold-200'
                        : isVault
                        ? 'bg-ocean-800/90 border-gold-700/50 text-gold-600/60'
                        : 'bg-ocean-800/80 border-ocean-500/50 text-ocean-400'
                      }
                      ${isCurrent ? 'ring-4 ring-gold-400/50' : ''}
                      ${unlocked && !completed ? 'animate-node-pulse' : ''}
                      ${isHovered && unlocked ? 'scale-125' : ''}
                      ${!unlocked && isHovered ? 'scale-110' : ''}
                    `}
                    style={{ width: 'clamp(36px, 5vw, 52px)', height: 'clamp(36px, 5vw, 52px)' }}
                  >
                    {unlocked ? (
                      <span className="text-lg sm:text-xl drop-shadow-[0_0_4px_rgba(212,168,60,0.5)]">{loc.icon}</span>
                    ) : isVault ? (
                      <Gem className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}

                    {completed && (
                      <div className="absolute -top-1 -right-1 bg-gold-400 text-ocean-900 rounded-full w-5 h-5 flex items-center justify-center">
                        <Check className="w-3 h-3" strokeWidth={3} />
                      </div>
                    )}

                    {unlocked && !visited && !completed && (
                      <div className="absolute inset-0 rounded-full border-2 border-gold-300/40 animate-ping" aria-hidden="true" />
                    )}
                  </div>

                  {/* Label — boosted opacity and text shadow for readability */}
                  <div
                    className={`
                      absolute top-full left-1/2 -translate-x-1/2 mt-1.5
                      whitespace-nowrap text-[10px] sm:text-xs font-display font-bold uppercase tracking-wider
                      transition-all duration-200
                      ${unlocked ? 'text-gold-200' : isVault ? 'text-gold-600/70' : 'text-ocean-300/70'}
                      ${isHovered || isCurrent ? 'opacity-100' : 'opacity-80'}
                    `}
                    style={{ textShadow: '0 1px 4px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.6)' }}
                  >
                    {loc.shortName}
                  </div>
                </button>

                {/* Tooltip for locked non-vault nodes */}
                {isSelected && !unlocked && !isVault && (
                  <div
                    className="absolute z-30 bg-ocean-800 border border-gold-700/40 rounded-lg p-3 max-w-[200px] animate-scale-in"
                    style={{
                      left: `${loc.x}%`,
                      top: `${loc.y}%`,
                      transform: 'translate(-50%, calc(-100% - 10px))',
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <Lock className="w-4 h-4 text-ocean-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-gold-300 text-xs font-bold uppercase tracking-wide mb-1">{loc.name}</p>
                        <p className="text-parchment-400 text-[11px] leading-relaxed">
                          {loc.requiresRelics && loc.requiresRelics.length > 0
                            ? `Requires: ${loc.requiresRelics.map(r => RELICS[r]?.name).join(', ')}`
                            : 'Solve riddles at other locations to unlock this path.'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedId(null)}
                      className="absolute -bottom-1 -right-1 bg-ocean-700 hover:bg-ocean-600 text-parchment-300 rounded-full w-6 h-6 flex items-center justify-center text-xs border border-gold-700/30"
                      aria-label="Close tooltip"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* Vault progress tooltip when locked */}
                {isSelected && isVault && !canAccessTreasure && (
                  <div
                    className="absolute z-30 bg-ocean-800 border-2 border-gold-600/40 rounded-lg p-4 max-w-[240px] animate-scale-in"
                    style={{
                      left: `${loc.x}%`,
                      top: `${loc.y}%`,
                      transform: 'translate(-50%, calc(-100% - 10px))',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Gem className="w-4 h-4 text-gold-500 shrink-0" />
                      <p className="text-gold-300 text-xs font-bold uppercase tracking-wide">Treasure Vault — Sealed</p>
                    </div>
                    <div className="space-y-2 mb-3">
                      <ProgressBar label="Riddles" value={progress.riddlesSolved} max={progress.riddlesRequired} />
                      <ProgressBar label="Relics" value={progress.relicsCollected} max={progress.relicsRequired} />
                    </div>
                    <p className="text-parchment-400 text-[11px] italic leading-relaxed text-center">
                      {progress.ready
                        ? 'The vault awakens...'
                        : 'Solve more riddles and collect relics to break the seal.'}
                    </p>
                    <button
                      onClick={() => setSelectedId(null)}
                      className="absolute -bottom-1 -right-1 bg-ocean-700 hover:bg-ocean-600 text-parchment-300 rounded-full w-6 h-6 flex items-center justify-center text-xs border border-gold-700/30"
                      aria-label="Close tooltip"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {/* X marks the spot for treasure when accessible */}
          {canAccessTreasure && (
            <div
              className="absolute z-10 animate-treasure-burst"
              style={{ left: '88%', top: '15%', transform: 'translate(-50%, -50%)' }}
              aria-hidden="true"
            >
              <div className="text-gold-400 text-glow-strong font-display font-black text-2xl">✦</div>
            </div>
          )}
        </div>

        {/* Vault status panel — always visible on map */}
        <div className="mt-4 animate-fade-in-up">
          {canAccessTreasure ? (
            <div className="text-center">
              <button
                onClick={() => game.openTreasureVault()}
                className="btn-gold text-lg px-10 py-4 animate-glow-pulse flex items-center gap-2 mx-auto"
                aria-label="Open the treasure vault"
              >
                <Gem className="w-5 h-5" />
                Enter the Treasure Vault
              </button>
            </div>
          ) : (
            <div className="dark-panel p-4 max-w-md mx-auto">
              <div className="flex items-center gap-2 mb-3 justify-center">
                <Lock className="w-4 h-4 text-gold-600" />
                <h3 className="section-title text-xs">The Vault Remains Sealed</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <VaultStat
                  icon={<Puzzle className="w-3.5 h-3.5" />}
                  label="Riddles"
                  value={`${progress.riddlesSolved}/${progress.riddlesRequired}`}
                  ready={progress.riddlesReady}
                />
                <VaultStat
                  icon={<Gem className="w-3.5 h-3.5" />}
                  label="Relics"
                  value={`${progress.relicsCollected}/${progress.relicsRequired}`}
                  ready={progress.relicsReady}
                />
              </div>
              <p className="text-parchment-400 text-xs italic text-center mt-3">
                {progress.riddlesReady && progress.relicsReady
                  ? 'The vault awakens... Click the gem to enter.'
                  : 'Explore more locations and solve riddles to break the seal.'}
              </p>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-xs text-parchment-300">
          <LegendButton
            icon={<div className="w-3 h-3 rounded-full bg-gold-500/25 border border-gold-400" />}
            label="Explored"
            count={exploredLocations.length}
            onClick={() => setLegendFilter('explored')}
          />
          <LegendButton
            icon={<div className="w-3 h-3 rounded-full bg-ocean-600 border border-gold-400/80 animate-node-pulse" />}
            label="Available"
            count={availableLocations.length}
            onClick={() => setLegendFilter('available')}
          />
          <LegendButton
            icon={<div className="w-3 h-3 rounded-full bg-ocean-800 border border-ocean-500/50" />}
            label="Locked"
            count={lockedLocations.length}
            onClick={() => setLegendFilter('locked')}
          />
        </div>
      </div>

      {/* Legend modal */}
      <Modal
        open={legendFilter !== null}
        onClose={() => setLegendFilter(null)}
        title={
          legendFilter === 'explored'
            ? 'Explored Locations'
            : legendFilter === 'available'
              ? 'Available Locations'
              : 'Locked Locations'
        }
        maxWidth="max-w-md"
      >
        {legendFilter === 'explored' && (
          <LegendLocationList
            locations={exploredLocations}
            emptyText="No locations explored yet. Set sail and begin your voyage!"
            statusIcon={(loc) => (
              <span className="text-gold-400 font-bold" aria-label="Explored">
                <Check className="w-4 h-4" strokeWidth={3} />
              </span>
            )}
          />
        )}
        {legendFilter === 'available' && (
          <LegendLocationList
            locations={availableLocations}
            emptyText="No locations waiting. Explore the map to reveal new paths!"
            statusIcon={() => (
              <span className="text-gold-300/80" aria-label="Available">
                <MapPin className="w-4 h-4" />
              </span>
            )}
          />
        )}
        {legendFilter === 'locked' && (
          <LegendLocationList
            locations={lockedLocations}
            emptyText="All locations are unlocked. The seas are yours!"
            statusIcon={() => (
              <span className="text-ocean-400" aria-label="Locked">
                <Lock className="w-4 h-4" />
              </span>
            )}
          />
        )}
      </Modal>

      {/* Quick action bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-ocean-900/90 backdrop-blur-md border-t border-gold-700/30 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
          <button
            onClick={onOpenInventory}
            className="btn-outline text-sm flex items-center gap-2"
            aria-label="View your collected relics"
          >
            <MapPin className="w-4 h-4" />
            Relics ({state.collectedRelics.length}/{game.totalRelics})
          </button>
          <button
            onClick={onOpenHowToPlay}
            className="btn-outline text-sm"
            aria-label="How to play"
          >
            Help
          </button>
        </div>
      </div>
    </div>
  );
}

function LegendButton({
  icon,
  label,
  count,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-ocean-700/50 hover:text-gold-200 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-gold-400/40"
      aria-label={`Show ${label} locations`}
    >
      {icon}
      <span className="uppercase tracking-wider">{label}</span>
      <span className="text-gold-500/60 font-bold tabular-nums">({count})</span>
    </button>
  );
}

function LegendLocationList({
  locations,
  emptyText,
  statusIcon,
}: {
  locations: typeof LOCATIONS;
  emptyText: string;
  statusIcon: (loc: (typeof LOCATIONS)[number]) => React.ReactNode;
}) {
  if (locations.length === 0) {
    return (
      <p className="text-parchment-400 text-sm italic text-center py-6">{emptyText}</p>
    );
  }
  return (
    <ul className="space-y-2">
      {locations.map((loc) => (
        <li
          key={loc.id}
          className="flex items-center gap-3 rounded-lg bg-ocean-800/60 border border-gold-700/20 px-3 py-2.5"
        >
          <span className="text-lg shrink-0">{loc.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-gold-200 text-sm font-bold uppercase tracking-wide truncate">
              {loc.name}
            </p>
            <p className="text-parchment-400 text-xs truncate">{loc.description}</p>
          </div>
          {statusIcon(loc)}
        </li>
      ))}
    </ul>
  );
}

function ProgressBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const ready = value >= max;
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] mb-1">
        <span className="text-parchment-300 uppercase tracking-wider">{label}</span>
        <span className={`font-bold ${ready ? 'text-gold-300' : 'text-parchment-400'}`}>
          {value}/{max}
          {ready && <span className="ml-1 text-gold-400">✓</span>}
        </span>
      </div>
      <div className="h-1.5 bg-ocean-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${ready ? 'bg-gold-400' : 'bg-gold-600/60'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function VaultStat({ icon, label, value, ready }: { icon: React.ReactNode; label: string; value: string; ready: boolean }) {
  return (
    <div className={`rounded-lg p-2.5 text-center border ${ready ? 'bg-gold-500/15 border-gold-500/40' : 'bg-ocean-800/50 border-ocean-600/30'}`}>
      <div className={`flex items-center justify-center gap-1 mb-0.5 ${ready ? 'text-gold-300' : 'text-parchment-400'}`}>
        {icon}
        <span className="text-[10px] uppercase tracking-wider">{label}</span>
      </div>
      <p className={`font-display font-bold text-sm ${ready ? 'text-gold-300' : 'text-parchment-200'}`}>
        {value}
      </p>
    </div>
  );
}
