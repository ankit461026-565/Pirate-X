import { useEffect, useRef, useState } from 'react';
import type { GameState } from '@/game/types';

/**
 * Reusable Game Master message component.
 * Architecture: the messageSource prop can be a predefined function or later
 * replaced with an async AI API call — the component itself just renders messages.
 */
export function GameMaster({
  state,
  className = '',
}: {
  state: GameState;
  className?: string;
}) {
  const [displayMessages, setDisplayMessages] = useState(state.gameMasterMessages);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastIdRef = useRef<number>(0);

  useEffect(() => {
    if (state.gameMasterMessages.length === 0) return;
    const latest = state.gameMasterMessages[state.gameMasterMessages.length - 1];
    if (latest.id !== lastIdRef.current) {
      lastIdRef.current = latest.id;
      setDisplayMessages(state.gameMasterMessages.slice(-5));
    }
  }, [state.gameMasterMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayMessages]);

  if (displayMessages.length === 0) return null;

  return (
    <div
      className={`dark-panel p-4 ${className}`}
      aria-live="polite"
      aria-label="Game Master messages"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-gold-400 text-lg" aria-hidden="true">📜</span>
        <h3 className="section-title text-xs">Game Master</h3>
      </div>
      <div
        ref={scrollRef}
        className="space-y-2 max-h-32 overflow-y-auto pr-1"
      >
        {displayMessages.map((msg) => (
          <p
            key={msg.id}
            className={`text-sm leading-relaxed animate-slide-up ${
              msg.tone === 'success'
                ? 'text-gold-300'
                : msg.tone === 'warning'
                ? 'text-ember-400'
                : 'text-parchment-300'
            }`}
          >
            <span className="text-gold-500/60 mr-1">›</span>
            {msg.text}
          </p>
        ))}
      </div>
    </div>
  );
}

/**
 * Re-exported here for convenience; the canonical source is src/game/data.ts.
 * This is the seam where an AI API can be connected later:
 * replace getRandomMessage with an async fetch to an AI endpoint.
 */
