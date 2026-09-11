import { Waves } from 'lucide-react';
import { Modal } from './Modal';
import type { GameState } from '@/game/types';
import type { GameAPI } from '@/game/useGame';

interface SeaRemembersModalProps {
  open: boolean;
  onClose: () => void;
  state: GameState;
  game: GameAPI;
}

export function SeaRemembersModal({ open, onClose, state, game }: SeaRemembersModalProps) {
  const memories = state.journeyMemories;

  return (
    <Modal open={open} onClose={onClose} title="The Sea Remembers" maxWidth="max-w-xl">
      <div className="text-center mb-4">
        <div className="flex justify-center mb-2">
          <Waves className="w-8 h-8 text-ocean-400" />
        </div>
        <p className="pirate-text text-lg text-parchment-300 italic">
          Every choice leaves a mark.
        </p>
      </div>

      {memories.length === 0 ? (
        <p className="text-parchment-400 text-sm italic text-center py-6">
          The sea has no memories of your voyage yet. Set sail and make your mark.
        </p>
      ) : (
        <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
          {memories.map((mem) => (
            <div
              key={mem.id}
              className={`flex items-start gap-3 rounded-lg p-3 border transition-all animate-slide-up ${
                mem.type === 'cursed'
                  ? 'bg-cursed-500/15 border-cursed-500/30'
                  : mem.type === 'relic'
                  ? 'bg-gold-500/10 border-gold-500/30'
                  : mem.type === 'riddle'
                  ? 'bg-ocean-700/40 border-gold-700/20'
                  : 'bg-ocean-800/50 border-gold-700/20'
              }`}
            >
              <span className="text-xl shrink-0 mt-0.5">{mem.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-gold-300 text-xs font-display font-bold uppercase tracking-wide">
                  {mem.locationName}
                </p>
                <p className="text-parchment-300 text-sm leading-relaxed mt-0.5">
                  {mem.text}
                </p>
              </div>
              {mem.type === 'cursed' && (
                <span className="text-cursed-500 text-lg shrink-0" aria-label="Cursed choice">
                  ☠️
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Journey Summary */}
      <div className="mt-5 pt-4 border-t border-gold-700/20">
        <h3 className="section-title text-xs mb-3 text-center">Your Voyage</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <SummaryStat label="Riddles Solved" value={`${state.solvedRiddles.length}/${game.totalRiddles}`} />
          <SummaryStat label="Relics Collected" value={`${state.collectedRelics.length}/${game.totalRelics}`} />
          <SummaryStat label="Locations Explored" value={`${state.visitedLocations.length}/${game.totalLocations}`} />
          <SummaryStat label="Lives Remaining" value={`${state.lives}/${state.maxLives}`} />
          <SummaryStat label="Score" value={state.score.toString()} />
          <SummaryStat label="Choices Made" value={state.choicesMade.length.toString()} />
        </div>
      </div>
    </Modal>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-ocean-800/60 rounded-lg p-2.5 text-center border border-gold-700/20">
      <p className="text-parchment-400 text-[10px] uppercase tracking-wider mb-1">{label}</p>
      <p className="font-display font-bold text-gold-300 text-sm">{value}</p>
    </div>
  );
}
