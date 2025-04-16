
import React, { useState, useEffect } from 'react';
import { Pokemon, BattleState } from '@/types/pokemon';
import PokemonSprite from './PokemonSprite';
import HealthBar from './HealthBar';
import { Button } from './ui/button';
import { CircleDashed } from 'lucide-react';

interface BattleSceneProps {
  battleState: BattleState;
  onAttack: () => void;
  onFlee: () => void;
  onCatchAttempt: () => void;
}

const BattleScene: React.FC<BattleSceneProps> = ({
  battleState,
  onAttack,
  onFlee,
  onCatchAttempt,
}) => {
  const { playerPokemon, wildPokemon, playerHealth, wildHealth, battleLog, battleResult } = battleState;
  const [showLog, setShowLog] = useState(false);
  const [animation, setAnimation] = useState<string>('');
  const [pokeballAnimation, setPokeballAnimation] = useState<string>('');
  
  // Calculate catch rate based on remaining HP percentage
  const catchRateModifier = 1 - (wildHealth / wildPokemon.hp);
  
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
  
  const handleCatchAttempt = () => {
    setPokeballAnimation('animate-pokeball-throw');
    setTimeout(() => {
      setPokeballAnimation('');
      onCatchAttempt();
    }, 800);
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
          <div className="relative">
            <PokemonSprite 
              pokemon={wildPokemon} 
              size="lg" 
              className="mb-2"
              animationClass={`${animation === 'animate-pokemon-disappear' ? 'animate-pokemon-disappear' : ''} ${pokeballAnimation === 'animate-pokeball-throw' ? 'animate-pokemon-shake' : ''}`}
            />
            {pokeballAnimation && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pokeball-throw">
                <div className="w-8 h-8 bg-white rounded-full border-4 border-red-500 relative overflow-hidden">
                  <div className="absolute w-full h-1 bg-red-500 top-1/2 -translate-y-1/2"></div>
                  <div className="absolute w-4 h-4 bg-white rounded-full border-2 border-gray-800 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>
              </div>
            )}
          </div>
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
      
      {/* Catch rate indicator */}
      {wildHealth > 0 && !battleResult && (
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-gray-400">Catch rate:</span>
          <div className="w-1/2 bg-gray-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full ${
                catchRateModifier > 0.7 ? 'bg-green-500' : 
                catchRateModifier > 0.4 ? 'bg-yellow-500' : 'bg-red-500'
              }`} 
              style={{width: `${Math.min(100, catchRateModifier * 100 + 20)}%`}}
            ></div>
          </div>
        </div>
      )}
      
      {/* Battle actions */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <button 
          onClick={handleAttack}
          disabled={!!battleResult || wildHealth <= 0}
          className={`py-2 px-4 rounded font-medium text-white ${
            battleResult || wildHealth <= 0 ? 'bg-gray-700 cursor-not-allowed' : 'bg-pokemon-red hover:bg-red-600'
          }`}
        >
          Fight
        </button>
        <button 
          onClick={handleCatchAttempt}
          disabled={!!battleResult || wildHealth <= 0}
          className={`py-2 px-4 rounded font-medium text-white ${
            battleResult || wildHealth <= 0 ? 'bg-gray-700 cursor-not-allowed' : 'bg-pokemon-blue hover:bg-blue-600'
          }`}
        >
          <div className="flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full border-2 border-red-500 relative mr-1">
              <div className="absolute w-full h-0.5 bg-red-500 top-1/2 -translate-y-1/2"></div>
            </div>
            Catch
          </div>
        </button>
        <button 
          onClick={onFlee}
          disabled={!!battleResult}
          className={`py-2 px-4 rounded font-medium text-white ${
            battleResult ? 'bg-gray-700 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-500'
          }`}
        >
          Run
        </button>
      </div>
      
      {/* Battle result message */}
      {battleResult && (
        <div className={`mt-4 p-2 text-center rounded font-medium ${
          battleResult === 'WIN' ? 'bg-green-800 text-green-100' : 
          battleResult === 'LOSE' ? 'bg-red-900 text-red-100' : 
          battleResult === 'FLED' ? 'bg-gray-700 text-gray-300' :
          battleResult === 'CAUGHT' ? 'bg-blue-800 text-blue-100' : 'bg-gray-700 text-gray-300'
        }`}>
          {battleResult === 'WIN' && 'Victory! You defeated the wild Pokémon!'}
          {battleResult === 'LOSE' && 'Your Pokémon fainted! The wild Pokémon escaped.'}
          {battleResult === 'FLED' && 'You ran away safely!'}
          {battleResult === 'CAUGHT' && 'Gotcha! You caught the wild Pokémon!'}
          {battleResult === 'ESCAPED' && 'Oh no! The wild Pokémon ran away!'}
        </div>
      )}
    </div>
  );
};

export default BattleScene;
