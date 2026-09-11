import { useEffect, useState } from 'react';
import { RotateCcw, Heart, Skull } from 'lucide-react';
import type { GameAPI } from '@/game/useGame';
import { ParticleBackground } from '@/components/ParticleBackground';

interface GameOverScreenProps {
  game: GameAPI;
}

export function GameOverScreen({ game }: GameOverScreenProps) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowContent(true), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-ocean-900 via-ocean-800 to-ocean-900" />
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 50% 40%, rgba(139, 44, 44, 0.15) 0%, transparent 60%)',
        }}
      />
      <ParticleBackground density={50} mode="embers" color="rgba(139, 44, 44, 0.12)" />

      <div className="relative z-10 text-center px-6 max-w-xl py-12">
        {showContent && (
          <>
            <div className="text-7xl sm:text-8xl mb-6 animate-treasure-burst opacity-70">
              <Skull className="w-20 h-20 sm:w-24 sm:h-24 mx-auto text-cursed-500" />
            </div>

            <h1 className="game-title text-3xl sm:text-4xl lg:text-5xl mb-6 animate-fade-in-up text-cursed-500">
              VOYAGE LOST
            </h1>

            <div
              className="parchment-panel p-6 mb-8 animate-fade-in-up"
              style={{ animationDelay: '0.3s', opacity: 0 }}
            >
              <p className="parchment-text leading-relaxed text-base sm:text-lg italic">
                Your three lives are gone. The sea claims this voyage.
              </p>
            </div>

            <div className="dark-panel p-6 mb-8 animate-scale-in">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Heart className="w-5 h-5 text-cursed-500" />
                <span className="text-parchment-400 text-xs uppercase tracking-wider">Lives</span>
              </div>
              <p className="font-display font-bold text-2xl text-cursed-500">
                0 / 3
              </p>
            </div>

            <button
              onClick={() => game.resetGame()}
              className="btn-gold text-lg px-10 py-4 flex items-center gap-2 mx-auto animate-glow-pulse animate-fade-in-up"
              aria-label="Reset voyage and start a new game"
            >
              <RotateCcw className="w-5 h-5" />
              Sail Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
