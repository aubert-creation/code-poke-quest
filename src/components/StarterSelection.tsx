
import React, { useState, useEffect } from 'react';
import { Pokemon } from '@/types/pokemon';
import PokemonSprite from './PokemonSprite';
import { fetchStarterPokemon } from '@/services/pokeApi';
import { getPokemonTypeColor } from '@/services/pokeApi';

interface StarterSelectionProps {
  onSelect: (pokemon: Pokemon) => void;
}

const StarterSelection: React.FC<StarterSelectionProps> = ({ onSelect }) => {
  const [starters, setStarters] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    const loadStarters = async () => {
      try {
        const starterPokemon = await fetchStarterPokemon();
        setStarters(starterPokemon);
      } catch (error) {
        console.error('Failed to load starter Pokémon:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStarters();
  }, []);

  const handleConfirmSelection = () => {
    const selected = starters.find(p => p.id === selectedId);
    if (selected) {
      onSelect(selected);
    }
  };

  if (loading) {
    return (
      <div className="bg-pokemon-vscode-panel p-6 text-white text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-24 h-24 bg-gray-700 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-1/3"></div>
        </div>
        <p className="mt-4">Loading starter Pokémon...</p>
      </div>
    );
  }

  return (
    <div className="bg-pokemon-vscode-panel p-6 text-white">
      <h2 className="text-xl font-bold mb-6 text-center">Choose Your Starter Pokémon</h2>
      
      <div className="grid grid-cols-1 gap-6 mb-6">
        {starters.map((pokemon) => {
          const primaryType = pokemon.types[0] || 'normal';
          const bgColor = getPokemonTypeColor(primaryType);
          
          return (
            <div
              key={pokemon.id}
              className={`
                relative flex flex-col items-center p-4 rounded-lg cursor-pointer transition-all
                ${selectedId === pokemon.id ? 'ring-2 ring-pokemon-yellow transform scale-102' : 'hover:bg-opacity-30'}
              `}
              style={{ background: `linear-gradient(135deg, ${bgColor}30 0%, #22222280 100%)` }}
              onClick={() => setSelectedId(pokemon.id)}
            >
              <PokemonSprite pokemon={pokemon} size="lg" className="mb-4" />
              
              <h3 className="text-lg font-semibold">{pokemon.name}</h3>
              
              <div className="flex space-x-2 mt-2">
                {pokemon.types.map((type) => (
                  <span
                    key={type}
                    className="px-2 py-1 text-xs rounded capitalize"
                    style={{ backgroundColor: getPokemonTypeColor(type) }}
                  >
                    {type}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">HP:</span>
                  <span>{pokemon.hp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">ATK:</span>
                  <span>{pokemon.attack}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">DEF:</span>
                  <span>{pokemon.defense}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">SPD:</span>
                  <span>{pokemon.speed}</span>
                </div>
              </div>
              
              {selectedId === pokemon.id && (
                <div className="absolute -top-2 -right-2 bg-pokemon-yellow w-6 h-6 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="text-center">
        <button
          className={`
            py-2 px-8 rounded-md font-medium
            ${selectedId ? 'bg-pokemon-red hover:bg-red-600 text-white' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}
          `}
          disabled={!selectedId}
          onClick={handleConfirmSelection}
        >
          Choose {selectedId ? starters.find(p => p.id === selectedId)?.name : 'Pokémon'}
        </button>
        
        <p className="mt-4 text-sm text-gray-400">
          Your starter Pokémon will be your companion in your coding journey!
        </p>
      </div>
    </div>
  );
};

export default StarterSelection;
