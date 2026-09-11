import { useState } from 'react';
import { Skull, HelpCircle } from 'lucide-react';
import { ParticleBackground } from '@/components/ParticleBackground';

interface LandingProps {
  onBegin: () => void;
  onHowToPlay: () => void;
  hasSave?: boolean;
  captainName?: string;
}

export function Landing({ onBegin, onHowToPlay, hasSave, captainName }: LandingProps) {
  const [beginHover, setBeginHover] = useState(false);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Layered background */}
      <div className="absolute inset-0 bg-gradient-to-b from-ocean-900 via-ocean-800 to-ocean-900" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 50% 80%, rgba(212, 168, 60, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 20% 30%, rgba(30, 39, 69, 0.5) 0%, transparent 60%)',
        }}
      />
      <ParticleBackground density={50} mode="fog" color="rgba(212, 168, 60, 0.12)" />

      {/* Wave decoration at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none">
        <svg viewBox="0 0 1440 120" className="w-full h-full" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M0,60 C320,100 420,20 720,60 C1020,100 1120,20 1440,60 L1440,120 L0,120 Z"
            fill="rgba(15, 21, 37, 0.6)"
          />
          <path
            d="M0,80 C240,40 480,120 720,80 C960,40 1200,120 1440,80 L1440,120 L0,120 Z"
            fill="rgba(10, 14, 26, 0.8)"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl">
        {/* Skull ornament */}
        <div className="flex justify-center mb-6 animate-fade-in-down">
          <div className="relative">
            <Skull
              className="w-12 h-12 text-gold-500 animate-float-slow"
              aria-hidden="true"
            />
            <div className="absolute inset-0 blur-xl bg-gold-500/30 rounded-full" aria-hidden="true" />
          </div>
        </div>

        {/* Title */}
        <h1
          className="game-title text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-gold-400 mb-4 animate-fade-in-up text-glow"
          style={{ animationDelay: '0.2s', opacity: 0 }}
        >
          THE LIVING MAP
        </h1>

        {/* Tagline */}
        <p
          className="pirate-text text-xl sm:text-2xl md:text-3xl text-parchment-300 mb-8 animate-fade-in-up"
          style={{ animationDelay: '0.5s', opacity: 0 }}
        >
          Every choice changes your fate.
        </p>

        {/* Story */}
        <div
          className="parchment-panel p-5 sm:p-7 mb-8 animate-fade-in-up max-w-2xl mx-auto"
          style={{ animationDelay: '0.8s', opacity: 0 }}
        >
          <p className="parchment-text text-base sm:text-lg leading-relaxed italic">
            "An ancient map has resurfaced. Its riddles are incomplete, its paths
            are forgotten, and somewhere beyond the cursed waters lies a treasure
            no captain has ever claimed."
          </p>
        </div>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
          style={{ animationDelay: '1.1s', opacity: 0 }}
        >
          <button
            onClick={onBegin}
            onMouseEnter={() => setBeginHover(true)}
            onMouseLeave={() => setBeginHover(false)}
            className="btn-gold text-lg px-10 py-4 animate-glow-pulse"
            aria-label={hasSave ? 'Resume your voyage' : 'Begin your voyage'}
          >
            {hasSave
              ? (beginHover ? '⚔ Resume Voyage ⚔' : 'Resume Voyage')
              : (beginHover ? '⚔ Set Sail ⚔' : 'Begin Voyage')}
          </button>
          <button
            onClick={onHowToPlay}
            className="btn-outline text-sm"
            aria-label="Learn how to play"
          >
            <span className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              How to Play
            </span>
          </button>
        </div>

        {/* Footer ornament */}
        {hasSave && captainName && (
          <p
            className="mt-4 text-gold-400/70 text-sm italic animate-fade-in"
            style={{ animationDelay: '1.3s', opacity: 0 }}
          >
            Welcome back, Captain {captainName}. Your voyage awaits.
          </p>
        )}
        <div
          className="mt-10 flex items-center justify-center gap-3 text-gold-600/50 animate-fade-in"
          style={{ animationDelay: '1.5s', opacity: 0 }}
        >
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold-600/40" />
          <span className="text-xs font-display tracking-[0.3em] uppercase">A Pirate Adventure</span>
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold-600/40" />
        </div>
      </div>
    </div>
  );
}
