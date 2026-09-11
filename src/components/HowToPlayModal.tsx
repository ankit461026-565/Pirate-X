import { Modal } from './Modal';
import { Compass, Puzzle, Heart, Gem, Map as MapIcon, Lightbulb } from 'lucide-react';

interface HowToPlayModalProps {
  open: boolean;
  onClose: () => void;
}

export function HowToPlayModal({ open, onClose }: HowToPlayModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="How to Play" maxWidth="max-w-xl">
      <div className="space-y-4">
        <p className="text-parchment-300 text-sm leading-relaxed italic mb-4">
          Welcome to The Living Map, Captain. Here is everything you need to know to claim the treasure.
        </p>

        <Step
          icon={<Compass className="w-5 h-5" />}
          title="Explore the Map"
          text="Click on glowing locations to visit them. Some paths are locked until you solve riddles at other locations."
        />
        <Step
          icon={<Puzzle className="w-5 h-5" />}
          title="Solve Riddles"
          text="Each location has a riddle. Type your answer and submit. Correct answers unlock new paths and relics. Wrong answers cost you a life."
        />
        <Step
          icon={<Lightbulb className="w-5 h-5" />}
          title="Use Hints"
          text="Stuck? Use a hint to reveal a clue. Hints reduce your score slightly but never cost a life."
        />
        <Step
          icon={<Gem className="w-5 h-5" />}
          title="Collect Relics"
          text="Solving riddles rewards you with relics. You need the Ancient Key to enter the Treasure Vault."
        />
        <Step
          icon={<MapIcon className="w-5 h-5" />}
          title="Make Choices"
          text="At certain locations, you will face branching paths. Your choices shape your story and affect your ending."
        />
        <Step
          icon={<Heart className="w-5 h-5" />}
          title="Watch Your Lives"
          text="You start with 3 lives. Wrong answers cost lives. Lose all lives and your voyage may end badly."
        />

        <div className="parchment-panel p-4 mt-5">
          <p className="parchment-text text-sm font-bold text-center uppercase tracking-wide">
            Your ending depends on your choices, riddles solved, relics found, and lives remaining.
          </p>
        </div>
      </div>
    </Modal>
  );
}

function Step({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-gold-500/15 border border-gold-500/30 flex items-center justify-center text-gold-400 shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-display font-bold text-gold-300 text-sm uppercase tracking-wide mb-0.5">{title}</h3>
        <p className="text-parchment-400 text-sm leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
