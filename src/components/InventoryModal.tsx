import { Package, MapPin } from 'lucide-react';
import { Modal } from './Modal';

import type { GameState } from '@/game/types';
import type { GameAPI } from '@/game/useGame';

interface InventoryModalProps {
  open: boolean;
  onClose: () => void;
  state: GameState;
  game: GameAPI;
}

export function InventoryModal({ open, onClose, state, game }: InventoryModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Captain's Relics" maxWidth="max-w-2xl">
      {/* Progress summary */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <ProgressCard label="Relics" value={state.collectedRelics.length} total={game.totalRelics} />
        <ProgressCard label="Riddles" value={state.solvedRiddles.length} total={game.totalRiddles} />
        <ProgressCard label="Locations" value={state.visitedLocations.length} total={game.totalLocations} />
      </div>

      {/* Relic grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {game.allRelics.map((relic) => {
          const collected = state.collectedRelics.includes(relic.id);
          return (
            <div
              key={relic.id}
              className={`rounded-lg p-4 border-2 transition-all ${
                collected
                  ? 'bg-gold-500/10 border-gold-500/40 border-glow'
                  : 'bg-ocean-800/40 border-ocean-600/30 opacity-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`text-3xl ${collected ? '' : 'grayscale'}`} aria-hidden="true">
                  {relic.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`font-display font-bold text-sm uppercase tracking-wide ${collected ? 'text-gold-300' : 'text-ocean-400'}`}>
                    {relic.name}
                  </p>
                  {collected ? (
                    <>
                      <p className="text-parchment-300 text-xs mt-1 leading-relaxed">{relic.description}</p>
                      <p className="text-gold-600/70 text-[10px] mt-2 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        Found at {relic.location}
                      </p>
                    </>
                  ) : (
                    <p className="text-ocean-400 text-xs mt-1 italic">Not yet discovered...</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {state.collectedRelics.length === 0 && (
        <div className="text-center py-6 text-parchment-400">
          <Package className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <p className="text-sm italic">Your bag is empty. Solve riddles to collect relics!</p>
        </div>
      )}

      {/* Choices made */}
      {state.choicesMade.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gold-700/20">
          <h3 className="section-title text-xs mb-3">Choices Made</h3>
          <div className="space-y-2">
            {state.choicesMade.map((c, i) => {
              const loc = state.visitedLocations.find((l) => l === c.locationId);
              return (
                <div key={i} className="flex items-center gap-2 text-xs text-parchment-300">
                  <span className="text-gold-500">›</span>
                  <span className="capitalize">{loc?.replace(/-/g, ' ')}</span>
                  <span className="text-gold-600/60">→</span>
                  <span className="font-display uppercase tracking-wide text-gold-400">{c.branchId}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Modal>
  );
}

function ProgressCard({ label, value, total }: { label: string; value: number; total: number }) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="bg-ocean-800/60 rounded-lg p-3 text-center border border-gold-700/20">
      <p className="text-parchment-400 text-[10px] uppercase tracking-wider mb-1">{label}</p>
      <p className="font-display font-bold text-gold-300 text-lg">{value}<span className="text-parchment-500 text-sm">/{total}</span></p>
      <div className="h-1.5 bg-ocean-700 rounded-full mt-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-gold-500 to-gold-300 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
