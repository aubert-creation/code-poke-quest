
import React, { useState, useEffect } from 'react';
import { Pokemon } from '@/types/pokemon';
import PokemonSprite from './PokemonSprite';
import { getPokemonTypeColor } from '@/services/pokeApi';

interface WildEncounterProps {
  pokemon: Pokemon;
  onBattle: () => void;
  onFlee: () => void;
  autoHideTime?: number; // Time in ms before auto-hiding
}

const WildEncounter: React.FC<WildEncounterProps> = ({
  pokemon,
  onBattle,
  onFlee,
  autoHideTime = 30000, // Default 30 seconds
}) => {
  const [timeLeft, setTimeLeft] = useState(autoHideTime / 1000);
  const [isTimerActive, setIsTimerActive] = useState(true);
  
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    
    // Start countdown timer
    if (isTimerActive && timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Time's up, Pokémon flees
      onFlee();
    }
    
    return () => clearInterval(timerId);
  }, [timeLeft, isTimerActive, onFlee]);
  
  // Pause timer when hovering
  const handleMouseEnter = () => setIsTimerActive(false);
  const handleMouseLeave = () => setIsTimerActive(true);
  
  const primaryType = pokemon.types[0] || 'normal';
  const bgColor = getPokemonTypeColor(primaryType);
  
  return (
    <div 
      className="p-4 rounded-lg animate-pokemon-appear"
      style={{ background: `linear-gradient(135deg, ${bgColor}30 0%, #22222280 100%)` }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="text-center mb-2">
        <h3 className="text-lg font-bold text-white">A wild Pokémon appears!</h3>
        <p className="text-sm text-gray-300">It will flee in <span className="text-pokemon-yellow">{timeLeft}</span> seconds</p>
      </div>
      
      <div className="flex flex-col items-center my-4">
        <PokemonSprite pokemon={pokemon} size="lg" className="animate-float" />
        
        <div className="mt-2 text-center">
          <h4 className="font-bold text-white">{pokemon.name}</h4>
          <p className="text-sm text-gray-300">Lv. {pokemon.level}</p>
          
          <div className="flex justify-center space-x-1 mt-1">
            {pokemon.types.map((type) => (
              <span 
                key={type}
                className="text-xs px-2 py-0.5 rounded capitalize" 
                style={{ backgroundColor: getPokemonTypeColor(type) }}
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <button 
          onClick={onBattle}
          className="flex-1 py-2 px-4 rounded font-medium text-white bg-pokemon-red hover:bg-red-600 transition"
        >
          Battle
        </button>
        <button 
          onClick={onFlee}
          className="flex-1 py-2 px-4 rounded font-medium text-white bg-gray-600 hover:bg-gray-500 transition"
        >
          Ignore
        </button>
      </div>
    </div>
  );
};

export default WildEncounter;
