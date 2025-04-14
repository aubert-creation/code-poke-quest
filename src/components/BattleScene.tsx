
import React, { useState, useEffect } from 'react';
import { Pokemon, BattleState } from '@/types/pokemon';
import PokemonSprite from './PokemonSprite';
import HealthBar from './HealthBar';

interface BattleSceneProps {
  battleState: BattleState;
  onAttack: () => void;
  onFlee: () => void;
}

const BattleScene: React.FC<BattleSceneProps> = ({
  battleState,
  onAttack,
  onFlee,
}) => {
  const { playerPokemon, wildPokemon, playerHealth, wildHealth, battleLog, battleResult } = battleState;
  const [showLog, setShowLog] = useState(false);
  const [animation, setAnimation] = useState<string>('');
  
  // Animation effect when taking actions
  useEffect(() => {
    if (battleResult) {
      setAnimation(battleResult === 'WIN' ? 'animate-pokemon-disappear' : '');
    }
  }, [battleResult]);

  const handleAttack = () => {
    setAnimation('animate-battle-shake');
    setTimeout(() => {
      setAnimation('');
      onAttack();
    }, 300);
  };

  return (
    <div className="bg-pokemon-vscode-panel p-4 rounded-md border border-gray-800">
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold text-white">Wild Encounter!</h2>
        <p className="text-sm text-gray-400">A wild {wildPokemon.name} appeared!</p>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Wild Pokemon */}
        <div className="flex flex-col items-center">
          <div className="mb-2 w-full">
            <HealthBar currentHP={wildHealth} maxHP={wildPokemon.hp} />
          </div>
          <PokemonSprite 
            pokemon={wildPokemon} 
            size="lg" 
            className="mb-2"
            animationClass={animation === 'animate-pokemon-disappear' ? 'animate-pokemon-disappear' : ''}
          />
          <div className="text-center">
            <p className="font-bold text-white">{wildPokemon.name} <span className="font-normal text-sm text-gray-400">Lv.{wildPokemon.level}</span></p>
          </div>
        </div>
        
        {/* Player Pokemon */}
        <div className="flex flex-col items-center">
          <div className="mb-2 w-full">
            <HealthBar currentHP={playerHealth} maxHP={playerPokemon.hp} />
          </div>
          <PokemonSprite 
            pokemon={playerPokemon} 
            size="lg" 
            className="mb-2" 
            animationClass={animation === 'animate-battle-shake' ? 'animate-battle-shake' : ''}
          />
          <div className="text-center">
            <p className="font-bold text-white">{playerPokemon.name} <span className="font-normal text-sm text-gray-400">Lv.{playerPokemon.level}</span></p>
          </div>
        </div>
      </div>
      
      {/* Battle log (collapsible) */}
      <div className="mt-4">
        <button 
          onClick={() => setShowLog(!showLog)}
          className="w-full bg-gray-800 text-gray-300 text-sm py-1 rounded flex items-center justify-between px-3 hover:bg-gray-700 transition-colors"
        >
          <span>Battle Log</span>
          <span>{showLog ? '▲' : '▼'}</span>
        </button>
        
        {showLog && (
          <div className="mt-2 bg-gray-900 rounded p-2 max-h-24 overflow-y-auto text-xs">
            {battleLog.map((log, index) => (
              <div key={index} className="text-gray-300 py-0.5">{log}</div>
            ))}
          </div>
        )}
      </div>
      
      {/* Battle actions */}
      <div className="mt-4 flex space-x-2">
        <button 
          onClick={handleAttack}
          disabled={!!battleResult}
          className={`flex-1 py-2 px-4 rounded font-medium text-white ${
            battleResult ? 'bg-gray-700 cursor-not-allowed' : 'bg-pokemon-red hover:bg-red-600'
          }`}
        >
          Fight
        </button>
        <button 
          onClick={onFlee}
          disabled={!!battleResult}
          className={`flex-1 py-2 px-4 rounded font-medium text-white ${
            battleResult ? 'bg-gray-700 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-500'
          }`}
        >
          Run Away
        </button>
      </div>
      
      {/* Battle result message */}
      {battleResult && (
        <div className={`mt-4 p-2 text-center rounded font-medium ${
          battleResult === 'WIN' ? 'bg-green-800 text-green-100' : 
          battleResult === 'LOSE' ? 'bg-red-900 text-red-100' : 'bg-gray-700 text-gray-300'
        }`}>
          {battleResult === 'WIN' && 'Victory! You caught the wild Pokémon!'}
          {battleResult === 'LOSE' && 'Your Pokémon fainted! The wild Pokémon escaped.'}
          {battleResult === 'FLED' && 'You ran away safely!'}
        </div>
      )}
    </div>
  );
};

export default BattleScene;
