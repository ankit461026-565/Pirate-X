import { useState, useEffect } from 'react';
import { RotateCcw, Heart, Puzzle, Map as MapIcon, Gem, Clock, Compass, ArrowLeft } from 'lucide-react';
import type { GameState } from '@/game/types';
import type { GameAPI } from '@/game/useGame';
import { determineEnding, RELICS } from '@/game/data';
import { ParticleBackground } from '@/components/ParticleBackground';

interface EndingScreenProps {
  state: GameState;
  game: GameAPI;
  onReturnToMap: () => void;
}

export function EndingScreen({ state, game, onReturnToMap }: EndingScreenProps) {
  const [showStats, setShowStats] = useState(false);

  const ending = determineEnding({
    lives: state.lives,
    solvedRiddles: state.solvedRiddles.length,
    collectedRelics: state.collectedRelics.length,
    totalRiddles: game.totalRiddles,
    totalRelics: game.totalRelics,
    choicesMade: state.choicesMade.map((c) => c.branchId),
  });

  useEffect(() => {
    const timer = window.setTimeout(() => setShowStats(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const durationMs = (state.endTime ?? Date.now()) - state.startTime;
  const durationMin = Math.floor(durationMs / 60000);
  const durationSec = Math.floor((durationMs % 60000) / 1000);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-ocean-900 via-ocean-800 to-ocean-900" />

      {/* Ending-specific atmosphere */}
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{
          backgroundImage:
            ending.id === 'legendary'
              ? 'radial-gradient(ellipse at 50% 40%, rgba(212, 168, 60, 0.2) 0%, transparent 60%)'
              : ending.id === 'cursed'
              ? 'radial-gradient(ellipse at 50% 40%, rgba(139, 44, 44, 0.15) 0%, transparent 60%)'
              : 'radial-gradient(ellipse at 50% 40%, rgba(30, 39, 69, 0.3) 0%, transparent 60%)',
        }}
      />

      <ParticleBackground
        density={60}
        mode="embers"
        color={
          ending.id === 'legendary'
            ? 'rgba(240, 212, 128, 0.2)'
            : ending.id === 'cursed'
            ? 'rgba(139, 44, 44, 0.15)'
            : 'rgba(100, 120, 160, 0.1)'
        }
      />

      <div className="relative z-10 text-center px-6 max-w-2xl py-12">
        {/* Ending icon */}
        <div className="text-7xl sm:text-8xl mb-6 animate-treasure-burst">{ending.icon}</div>

        {/* Ending title */}
        <h1
          className={`game-title text-3xl sm:text-4xl lg:text-5xl mb-6 animate-fade-in-up ${
            ending.id === 'legendary'
              ? 'text-gold-300 animate-shine'
              : ending.id === 'cursed'
              ? 'text-cursed-500'
              : 'text-ocean-400'
          }`}
        >
          {ending.title}
        </h1>

        {/* Narrative */}
        <div
          className="parchment-panel p-6 mb-8 animate-fade-in-up"
          style={{ animationDelay: '0.3s', opacity: 0 }}
        >
          <p className="parchment-text leading-relaxed text-base sm:text-lg italic">
            {ending.narrative}
          </p>
        </div>

        {/* Stats */}
        {showStats && (
          <div
            className="dark-panel p-6 mb-8 animate-scale-in"
          >
            <h2 className="section-title text-sm mb-4">Voyage Summary</h2>
            <div className="grid grid-cols-2 gap-4 text-left">
              <StatRow
                icon={<Compass className="w-4 h-4" />}
                label="Captain"
                value={state.captainName}
              />
              <StatRow
                icon={<Clock className="w-4 h-4" />}
                label="Duration"
                value={`${durationMin}m ${durationSec}s`}
              />
              <StatRow
                icon={<Puzzle className="w-4 h-4" />}
                label="Riddles Solved"
                value={`${state.solvedRiddles.length} / ${game.totalRiddles}`}
              />
              <StatRow
                icon={<MapIcon className="w-4 h-4" />}
                label="Locations Explored"
                value={`${state.visitedLocations.length} / ${game.totalLocations}`}
              />
              <StatRow
                icon={<Gem className="w-4 h-4" />}
                label="Relics Collected"
                value={`${state.collectedRelics.length} / ${game.totalRelics}`}
              />
              <StatRow
                icon={<Heart className="w-4 h-4" />}
                label="Lives Remaining"
                value={`${state.lives} / ${state.maxLives}`}
              />
              <StatRow
                icon={<span className="text-sm">⚙</span>}
                label="Path Taken"
                value={state.choicesMade.map((c) => c.branchId).join(', ') || 'none'}
              />
              <StatRow
                icon={<span className="text-sm">★</span>}
                label="Final Score"
                value={state.score.toString()}
                highlight
              />
            </div>

            {/* Relics earned */}
            <div className="mt-4 pt-4 border-t border-gold-700/20">
              <p className="text-parchment-400 text-xs uppercase tracking-wider mb-2">Relics</p>
              <div className="flex flex-wrap justify-center gap-2">
                {state.collectedRelics.length > 0 ? (
                  state.collectedRelics.map((id) => (
                    <span
                      key={id}
                      className="text-2xl"
                      title={RELICS[id]?.name}
                    >
                      {RELICS[id]?.icon}
                    </span>
                  ))
                ) : (
                  <span className="text-parchment-500 text-sm italic">None collected</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Restart + Return to Map */}
        {showStats && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up">
            <button
              onClick={() => game.resetGame()}
              className="btn-gold text-lg px-10 py-4 flex items-center gap-2 animate-glow-pulse"
              aria-label="Start a new voyage"
            >
              <RotateCcw className="w-5 h-5" />
              Sail Again
            </button>
            <button
              onClick={onReturnToMap}
              className="btn-outline text-sm flex items-center gap-2"
              aria-label="Return to the map without resetting"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Map
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function StatRow({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-gold-400 shrink-0" aria-hidden="true">{icon}</span>
      <div className="min-w-0">
        <p className="text-parchment-400 text-[10px] uppercase tracking-wider">{label}</p>
        <p className={`font-display font-bold text-sm truncate ${highlight ? 'text-gold-300 text-lg' : 'text-parchment-100'}`}>
          {value}
        </p>
      </div>
    </div>
  );
}
