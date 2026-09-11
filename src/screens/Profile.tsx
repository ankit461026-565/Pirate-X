import { useState } from 'react';
import { Compass, Ship } from 'lucide-react';
import { ParticleBackground } from '@/components/ParticleBackground';

interface ProfileProps {
  onSubmit: (name: string) => void;
  onBack: () => void;
}

export function Profile({ onSubmit, onBack }: ProfileProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-ocean-900 via-ocean-800 to-ocean-900" />
      <ParticleBackground density={35} mode="fog" color="rgba(212, 168, 60, 0.1)" />

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="text-center mb-8 animate-fade-in-down">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Compass className="w-14 h-14 text-gold-400 animate-compass-spin" aria-hidden="true" />
              <div className="absolute inset-0 blur-xl bg-gold-400/30 rounded-full" aria-hidden="true" />
            </div>
          </div>
          <h2 className="game-title text-3xl sm:text-4xl text-gold-400 mb-3">
            NAME YOUR CAPTAIN
          </h2>
          <p className="pirate-text text-xl text-parchment-300">
            What shall the seas remember you as?
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="parchment-panel p-6 sm:p-8 animate-scale-in"
        >
          <label
            htmlFor="captain-name"
            className="block parchment-text text-sm font-display font-bold uppercase tracking-wider mb-3"
          >
            Captain Name
          </label>
          <input
            id="captain-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={24}
            autoFocus
            placeholder="e.g. Captain Morgan, Blackbeard..."
            className="input-parchment w-full mb-5"
            aria-describedby="name-hint"
          />
          <p id="name-hint" className="parchment-text/70 text-xs mb-5 italic text-parchment-700">
            Your name will be etched into the map and remembered across the seven seas.
          </p>

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={!name.trim()}
              className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              aria-label="Set sail and begin the adventure"
            >
              <Ship className="w-5 h-5" />
              Set Sail
            </button>
            <button
              type="button"
              onClick={onBack}
              className="btn-outline text-sm w-full"
              aria-label="Go back to the start screen"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
