
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
    <div 
      className="bg-cover bg-center p-6 text-white rounded-lg" 
      style={{ 
        backgroundImage: "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb')",
        minHeight: "400px",
        position: "relative"
      }}
    >
      <h2 className="text-2xl font-bold mb-8 text-center text-shadow">Choose Your Starter Pokémon</h2>
      
      <div className="flex justify-center items-end space-x-4 mb-6">
        {starters.map((pokemon) => {
          const primaryType = pokemon.types[0] || 'normal';
          const bgColor = getPokemonTypeColor(primaryType);
          
          return (
            <div
              key={pokemon.id}
              className={`
                relative flex flex-col items-center p-4 rounded-lg cursor-pointer transition-all
                ${selectedId === pokemon.id ? 'ring-2 ring-pokemon-yellow transform scale-110' : 'hover:scale-105'}
                backdrop-blur-sm bg-black/40
              `}
              onClick={() => setSelectedId(pokemon.id)}
            >
              <PokemonSprite pokemon={pokemon} size="xl" className="mb-4" />
              
              <h3 className="text-lg font-semibold capitalize">{pokemon.name}</h3>
              
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
                  <span className="text-gray-300">HP:</span>
                  <span>{pokemon.hp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">ATK:</span>
                  <span>{pokemon.attack}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">DEF:</span>
                  <span>{pokemon.defense}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">SPD:</span>
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
      
      <div className="text-center mt-8">
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
        
        <p className="mt-4 text-sm text-white bg-black/50 p-2 rounded inline-block">
          Your starter Pokémon will be your companion in your coding journey!
        </p>
      </div>
    </div>
  );
};

export default StarterSelection;
