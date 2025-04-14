
import React from 'react';
import { Pokemon } from '@/types/pokemon';
import PokemonSprite from './PokemonSprite';
import { getPokemonTypeColor } from '@/services/pokeApi';

interface PokemonCardProps {
  pokemon: Pokemon;
  isActive?: boolean;
  onClick?: () => void;
  showStats?: boolean;
}

const PokemonCard: React.FC<PokemonCardProps> = ({
  pokemon,
  isActive = false,
  onClick,
  showStats = false,
}) => {
  const handleClick = () => {
    if (onClick) onClick();
  };

  // Get background color based on Pokémon's primary type
  const primaryType = pokemon.types[0] || 'normal';
  const typeColor = getPokemonTypeColor(primaryType);

  return (
    <div 
      className={`
        relative rounded-md overflow-hidden transition-all duration-300
        border-2 p-2 mb-2 cursor-pointer
        ${isActive 
          ? 'border-pokemon-yellow bg-opacity-20 shadow-md transform scale-102' 
          : 'border-gray-700 hover:border-gray-500'}
      `}
      onClick={handleClick}
      style={{ background: `linear-gradient(135deg, ${typeColor}40 0%, #22222280 100%)` }}
    >
      <div className="flex items-center">
        <PokemonSprite pokemon={pokemon} size="sm" />
        
        <div className="ml-2 flex-1">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-white">{pokemon.name}</h3>
            <span className="text-xs text-gray-300">Lvl {pokemon.level}</span>
          </div>
          
          <div className="flex space-x-1 mt-1">
            {pokemon.types.map((type) => (
              <span 
                key={type}
                className="text-xs px-2 py-0.5 rounded" 
                style={{ backgroundColor: getPokemonTypeColor(type) }}
              >
                {type}
              </span>
            ))}
          </div>
          
          {/* XP Bar */}
          <div className="w-full bg-gray-800 rounded-full h-1.5 mt-2">
            <div 
              className="bg-pokemon-blue h-1.5 rounded-full transition-all duration-300" 
              style={{ width: `${(pokemon.experience / pokemon.experienceToNextLevel) * 100}%` }}
            />
          </div>
          <div className="text-xs text-gray-400 mt-0.5">
            XP: {pokemon.experience}/{pokemon.experienceToNextLevel}
          </div>
        </div>
      </div>
      
      {/* Stats (conditionally shown) */}
      {showStats && (
        <div className="mt-2 pt-2 border-t border-gray-700 grid grid-cols-2 gap-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-400">HP:</span>
            <span className="text-white">{pokemon.hp}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">ATK:</span>
            <span className="text-white">{pokemon.attack}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">DEF:</span>
            <span className="text-white">{pokemon.defense}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">SPD:</span>
            <span className="text-white">{pokemon.speed}</span>
          </div>
        </div>
      )}
      
      {/* Evolution indicator */}
      {pokemon.evolutionLevel && pokemon.level >= pokemon.evolutionLevel - 3 && (
        <div className="absolute top-1 right-1">
          <span className="text-yellow-400 animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
              <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z" clipRule="evenodd" />
              <path d="M2.25 18a.75.75 0 000 1.5h19.5a.75.75 0 000-1.5H2.25z" />
            </svg>
          </span>
        </div>
      )}
      
      {isActive && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-pokemon-red rounded-full border border-white"></div>
      )}
    </div>
  );
};

export default PokemonCard;
