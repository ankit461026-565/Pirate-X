import { useState, useEffect } from 'react';
import { Gem, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import type { GameState } from '@/game/types';
import type { GameAPI } from '@/game/useGame';
import { ParticleBackground } from '@/components/ParticleBackground';

interface TreasureVaultProps {
  state: GameState;
  game: GameAPI;
  onBack: () => void;
}

export function TreasureVault({ state, game, onBack }: TreasureVaultProps) {
  const [revealed, setRevealed] = useState(false);
  const [phase, setPhase] = useState(0);

  // Cinematic reveal sequence
  useEffect(() => {
    const timers: number[] = [];
    timers.push(window.setTimeout(() => setPhase(1), 500));
    timers.push(window.setTimeout(() => setPhase(2), 1500));
    timers.push(window.setTimeout(() => setPhase(3), 2800));
    timers.push(window.setTimeout(() => setRevealed(true), 4000));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-ocean-900 via-ocean-800 to-ocean-900" />

      {/* Intensifying glow */}
      <div
        className="absolute inset-0 transition-all duration-[2000ms]"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 50% 50%, rgba(212, 168, 60, 0.25) 0%, transparent 60%)',
          opacity: phase >= 2 ? 1 : 0,
        }}
      />

      <ParticleBackground density={80} mode="embers" color="rgba(240, 212, 128, 0.2)" />

      <div className="relative z-10 text-center px-6 max-w-2xl">
        {/* Back button — only visible before the final reveal */}
        {phase < 3 && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-parchment-400 hover:text-gold-300 transition-colors mb-6 text-sm font-display font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-gold-400/40 rounded-lg px-2 py-1 absolute top-4 left-4 z-20"
            aria-label="Return to the map"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Map
          </button>
        )}

        {/* Phase 0: Doors */}
        {phase < 2 && (
          <div className="animate-fade-in">
            <p className="pirate-text text-2xl text-parchment-300 mb-6">
              The vault doors groan open...
            </p>
            <div className="flex justify-center">
              <div className="relative">
                <div className="text-6xl opacity-30">🏰</div>
                <div className="absolute inset-0 blur-2xl bg-gold-500/20 rounded-full animate-glow-pulse" />
              </div>
            </div>
          </div>
        )}

        {/* Phase 2: Light burst */}
        {phase >= 2 && phase < 3 && (
          <div className="animate-scale-in">
            <Sparkles className="w-16 h-16 text-gold-300 mx-auto mb-4 animate-shine" />
            <p className="text-gold-300 text-xl font-display tracking-wider uppercase animate-shine">
              Light floods the chamber...
            </p>
          </div>
        )}

        {/* Phase 3+: Treasure revealed */}
        {phase >= 3 && (
          <div className="animate-treasure-burst">
            <div className="relative mb-6">
              <div className="text-8xl sm:text-9xl animate-float-slow">💎</div>
              <div className="absolute inset-0 blur-3xl bg-gold-400/30 rounded-full" aria-hidden="true" />
            </div>

            <h1 className="game-title text-4xl sm:text-5xl lg:text-6xl text-gold-300 mb-4 animate-shine">
              TREASURE DISCOVERED
            </h1>

            <p className="pirate-text text-xl text-parchment-300 mb-8">
              Captain {state.captainName}, the treasure is yours!
            </p>

            {revealed && (
              <button
                onClick={() => game.goToEnding()}
                className="btn-gold text-lg px-10 py-4 animate-glow-pulse flex items-center gap-2 mx-auto animate-fade-in-up"
                aria-label="See your final ending"
              >
                <Gem className="w-5 h-5" />
                Reveal Your Fate
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
