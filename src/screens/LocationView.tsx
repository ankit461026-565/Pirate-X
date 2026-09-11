import { useState } from 'react';
import { ArrowLeft, Lightbulb, Check, AlertTriangle, Sparkles } from 'lucide-react';
import type { GameState, LocationId } from '@/game/types';
import { LOCATION_MAP, RELICS } from '@/game/data';
import type { GameAPI } from '@/game/useGame';
import { GameMaster } from '@/components/GameMaster';
import { ParticleBackground } from '@/components/ParticleBackground';

interface LocationViewProps {
  state: GameState;
  game: GameAPI;
}

export function LocationView({ state, game }: LocationViewProps) {
  const locationId = state.currentLocationId;
  if (!locationId) return null;
  const loc = LOCATION_MAP[locationId];

  const riddleSolved = loc.riddle ? state.solvedRiddles.includes(loc.riddle.id) : false;
  const choiceMade = state.choicesMade.find((c) => c.locationId === locationId);
  const hasChoices = loc.choices && loc.choices.length > 0;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-ocean-800 via-ocean-900 to-ocean-800" />
      <ParticleBackground density={25} mode="embers" color="rgba(232, 122, 62, 0.1)" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-6">
        {/* Back button */}
        <button
          onClick={() => game.returnToMap()}
          className="flex items-center gap-2 text-parchment-400 hover:text-gold-300 transition-colors mb-6 text-sm font-display font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-gold-400/40 rounded-lg px-2 py-1"
          aria-label="Return to the map"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Map
        </button>

        {/* Location header */}
        <div className="text-center mb-6 animate-fade-in-down">
          <div className="text-5xl sm:text-6xl mb-3 animate-float-slow">{loc.icon}</div>
          <h2 className="game-title text-3xl sm:text-4xl text-gold-400 mb-2">{loc.name}</h2>
          <p className="text-parchment-400 text-sm italic">{loc.description}</p>
        </div>

        {/* Narrative */}
        <div className="parchment-panel p-5 sm:p-6 mb-6 animate-fade-in-up">
          <p className="parchment-text leading-relaxed text-base sm:text-lg">
            {loc.narrative}
          </p>
        </div>

        {/* Riddle section */}
        {loc.riddle && !riddleSolved && (
          <RiddlePanel
            key={loc.riddle.id}
            locationId={locationId}
            state={state}
            game={game}
          />
        )}

        {/* Riddle solved feedback */}
        {loc.riddle && riddleSolved && (
          <div className="dark-panel p-5 mb-6 animate-scale-in border-gold-500/40 border-glow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center">
                <Check className="w-6 h-6 text-gold-400" strokeWidth={3} />
              </div>
              <div>
                <h3 className="section-title text-sm">Riddle Solved</h3>
                <p className="text-gold-300 text-sm">The answer was: {loc.riddle.answer.toUpperCase()}</p>
              </div>
            </div>
            {loc.relicId && state.collectedRelics.includes(loc.relicId) && (
              <div className="flex items-center gap-3 mt-3 p-3 bg-gold-500/10 rounded-lg border border-gold-500/20">
                <span className="text-3xl">{RELICS[loc.relicId].icon}</span>
                <div>
                  <p className="text-gold-300 font-display font-bold text-sm uppercase tracking-wide">
                    Relic Obtained
                  </p>
                  <p className="text-parchment-200 text-sm">{RELICS[loc.relicId].name}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Branching choices */}
        {hasChoices && riddleSolved && !choiceMade && (
          <ChoicePanel locationId={locationId} game={game} />
        )}

        {hasChoices && choiceMade && (
          <div className="dark-panel p-5 mb-6 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-gold-400" />
              <h3 className="section-title text-sm">Your Path</h3>
            </div>
            <p className="text-parchment-200 leading-relaxed italic">
              {loc.choices!.find((c) => c.id === choiceMade.choiceId)?.narrative}
            </p>
          </div>
        )}

        {/* Continue button if completed */}
        {(riddleSolved || !loc.riddle) && (!hasChoices || choiceMade) && (
          <div className="text-center animate-fade-in-up">
            <button
              onClick={() => game.returnToMap()}
              className="btn-gold flex items-center gap-2 mx-auto"
              aria-label="Continue exploring the map"
            >
              Continue Exploring
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </button>
          </div>
        )}

        {/* Game Master messages */}
        <div className="mt-8">
          <GameMaster state={state} />
        </div>
      </div>
    </div>
  );
}

// ========================
// RIDDLE PANEL
// ========================

function RiddlePanel({
  locationId,
  state,
  game,
}: {
  locationId: LocationId;
  state: GameState;
  game: GameAPI;
}) {
  const loc = LOCATION_MAP[locationId];
  const riddle = loc.riddle!;
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [wrongShake, setWrongShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;

    const normalized = answer.trim().toLowerCase().replace(/[^a-z\s]/g, '');
    const expected = riddle.answer.toLowerCase().trim();

    if (normalized === expected || normalized.includes(expected)) {
      setFeedback('correct');
      game.solveRiddle(locationId);
    } else {
      setFeedback('wrong');
      setWrongShake(true);
      game.wrongAnswer();
      setTimeout(() => setWrongShake(false), 500);
      setAnswer('');
    }
  };

  const handleHint = () => {
    setShowHint(true);
    game.useHint(locationId);
  };

  return (
    <div
      className={`parchment-panel p-5 sm:p-7 mb-6 animate-fade-in-up ${wrongShake ? 'animate-shake' : ''}`}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl" aria-hidden="true">🧩</span>
        <h3 className="font-display font-bold uppercase tracking-[0.15em] text-parchment-800 text-lg">
          The Riddle
        </h3>
      </div>

      <blockquote className="parchment-text text-lg sm:text-xl leading-relaxed italic mb-5 border-l-4 border-gold-600/40 pl-4">
        {riddle.question.split('\n').map((line, i) => (
          <span key={i} className="block">{line}</span>
        ))}
      </blockquote>

      {/* Hint */}
      {showHint && (
        <div className="bg-gold-500/15 border border-gold-500/30 rounded-lg p-3 mb-5 animate-slide-up">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-gold-700 shrink-0 mt-0.5" />
            <p className="text-parchment-800 text-sm italic">{riddle.hint}</p>
          </div>
        </div>
      )}

      {/* Wrong answer feedback */}
      {feedback === 'wrong' && state.lives > 0 && (
        <div className="bg-cursed-500/15 border border-cursed-500/30 rounded-lg p-3 mb-5 animate-slide-up flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-cursed-500 shrink-0" />
          <p className="text-cursed-600 text-sm font-bold">
            Wrong answer! You lose a life. The riddle remains...
          </p>
        </div>
      )}

      {/* Answer form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <label
          htmlFor="riddle-answer"
          className="block parchment-text text-sm font-display font-bold uppercase tracking-wider"
        >
          Your Answer
        </label>
        <input
          id="riddle-answer"
          type="text"
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
            if (feedback === 'wrong') setFeedback('none');
          }}
          maxLength={30}
          autoFocus
          placeholder="Speak your answer, Captain..."
          className="input-parchment w-full"
          aria-describedby="answer-help"
        />
        <p id="answer-help" className="text-parchment-700 text-xs italic">
          Type a single word or short phrase. Not case-sensitive.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={!answer.trim()}
            className="btn-gold flex-1 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            aria-label="Submit your answer"
          >
            Submit Answer
          </button>
          <button
            type="button"
            onClick={handleHint}
            disabled={showHint}
            className="btn-outline flex-1 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Use a hint"
          >
            <Lightbulb className="w-4 h-4" />
            Use Hint
            {showHint && <span className="text-xs opacity-60">(used)</span>}
          </button>
        </div>
      </form>
    </div>
  );
}

// ========================
// CHOICE PANEL
// ========================

function ChoicePanel({
  locationId,
  game,
}: {
  locationId: LocationId;
  game: GameAPI;
}) {
  const loc = LOCATION_MAP[locationId];
  const choices = loc.choices!;
  const [selectedNarrative, setSelectedNarrative] = useState<string | null>(null);

  const handleChoice = (choiceId: string, branchId: string, narrative: string) => {
    game.makeChoice(locationId, choiceId, branchId);
    setSelectedNarrative(narrative);
  };

  if (selectedNarrative) {
    return (
      <div className="parchment-panel p-5 sm:p-6 mb-6 animate-fade-in-up">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-gold-700" />
          <h3 className="font-display font-bold uppercase tracking-[0.15em] text-parchment-800 text-lg">
            The Path Unfolds
          </h3>
        </div>
        <p className="parchment-text leading-relaxed text-base sm:text-lg italic">
          {selectedNarrative}
        </p>
      </div>
    );
  }

  return (
    <div className="dark-panel p-5 sm:p-7 mb-6 animate-fade-in-up border-glow">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl" aria-hidden="true">⚔</span>
        <h3 className="section-title text-sm">Choose Your Path</h3>
      </div>
      <p className="text-parchment-300 text-sm mb-5 italic">
        Your decision will be remembered. Each path leads somewhere different...
      </p>

      <div className="space-y-3">
        {choices.map((choice, i) => (
          <button
            key={choice.id}
            onClick={() => handleChoice(choice.id, choice.branchId, choice.narrative)}
            className="w-full text-left p-4 rounded-lg bg-ocean-700/50 border-2 border-gold-700/30
                       hover:bg-ocean-600/60 hover:border-gold-500/60 transition-all duration-300
                       active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-gold-400/40
                       group animate-slide-up"
            style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}
            aria-label={`Choose: ${choice.label}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl group-hover:scale-110 transition-transform">{choice.icon}</span>
              <div className="flex-1">
                <p className="font-display font-bold text-gold-300 uppercase tracking-wide text-sm group-hover:text-gold-200">
                  {String.fromCharCode(65 + i)}. {choice.label}
                </p>
              </div>
              <ArrowLeft className="w-4 h-4 text-gold-600 group-hover:text-gold-400 group-hover:rotate-180 transition-all" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
