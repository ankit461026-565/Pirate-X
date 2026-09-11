import { useState } from 'react';
import { useGame } from '@/game/useGame';
import { HUD } from '@/components/HUD';
import { InventoryModal } from '@/components/InventoryModal';
import { HowToPlayModal } from '@/components/HowToPlayModal';
import { ConfirmModal } from '@/components/ConfirmModal';
import { Landing } from '@/screens/Landing';
import { Profile } from '@/screens/Profile';
import { GameMap } from '@/screens/GameMap';
import { LocationView } from '@/screens/LocationView';
import { TreasureVault } from '@/screens/TreasureVault';
import { EndingScreen } from '@/screens/EndingScreen';

function App() {
  const game = useGame();
  const { state } = game;

  const [showInventory, setShowInventory] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showReset, setShowReset] = useState(false);

  // Landing screen — if a captain name is already saved, resume directly to the map
  if (state.screen === 'landing') {
    const handleBegin = () => {
      if (state.captainName) {
        game.setScreen('map');
      } else {
        game.setScreen('profile');
      }
    };
    return (
      <>
        <Landing
          onBegin={handleBegin}
          onHowToPlay={() => setShowHowToPlay(true)}
          hasSave={!!state.captainName}
          captainName={state.captainName}
        />
        <HowToPlayModal open={showHowToPlay} onClose={() => setShowHowToPlay(false)} />
      </>
    );
  }

  // Profile / captain naming
  if (state.screen === 'profile') {
    return (
      <Profile
        onSubmit={(name) => game.setCaptainName(name)}
        onBack={() => game.setScreen('landing')}
      />
    );
  }

  // Treasure vault cinematic
  if (state.screen === 'treasure') {
    return <TreasureVault state={state} game={game} onBack={() => game.returnToMap()} />;
  }

  // Ending screen
  if (state.screen === 'ending') {
    return <EndingScreen state={state} game={game} onReturnToMap={() => game.returnToMap()} />;
  }

  // Main game screens (map + location) share the HUD
  return (
    <div className="min-h-screen">
      <HUD
        state={state}
        game={game}
        onMap={() => game.returnToMap()}
        onInventory={() => setShowInventory(true)}
        onReset={() => setShowReset(true)}
      />

      {state.screen === 'map' && (
        <GameMap
          state={state}
          game={game}
          onOpenInventory={() => setShowInventory(true)}
          onOpenHowToPlay={() => setShowHowToPlay(true)}
          onBackHome={() => game.setScreen('landing')}
        />
      )}

      {state.screen === 'location' && <LocationView state={state} game={game} />}

      {/* Modals */}
      <InventoryModal
        open={showInventory}
        onClose={() => setShowInventory(false)}
        state={state}
        game={game}
      />
      <HowToPlayModal
        open={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
      />
      <ConfirmModal
        open={showReset}
        onClose={() => setShowReset(false)}
        onConfirm={() => game.resetGame()}
        title="Reset Voyage?"
        message="This will erase all progress, relics, and choices. Your captain name will be forgotten by the seas. Are you sure?"
        confirmLabel="Reset Everything"
        cancelLabel="Keep Sailing"
      />
    </div>
  );
}

export default App;
