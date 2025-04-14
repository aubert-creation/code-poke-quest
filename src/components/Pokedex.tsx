
import React from 'react';
import { Pokemon } from '@/types/pokemon';
import PokemonCard from './PokemonCard';

interface PokedexProps {
  pokedex: Pokemon[];
  activePokemon?: Pokemon;
  onSelectPokemon: (pokemon: Pokemon) => void;
}

const Pokedex: React.FC<PokedexProps> = ({
  pokedex,
  activePokemon,
  onSelectPokemon,
}) => {
  if (pokedex.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-400">Your Pokédex is empty.</p>
        <p className="text-gray-500 text-sm mt-2">Keep coding to encounter wild Pokémon!</p>
      </div>
    );
  }

  return (
    <div className="p-2">
      <h2 className="text-lg font-bold mb-3 text-white flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-pokemon-red mr-1">
          <path d="M11.25 5.337c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.036 1.007-1.875 2.25-1.875S15 2.34 15 3.375c0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959 0 .332.278.598.61.578 1.91-.114 3.79-.342 5.632-.676a.75.75 0 01.878.645 49.17 49.17 0 01.376 5.452.657.657 0 01-.66.664c-.354 0-.675-.186-.958-.401a1.647 1.647 0 00-1.003-.349c-1.035 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401.31 0 .557.262.534.571a48.774 48.774 0 01-.595 4.845.75.75 0 01-.61.61c-1.82.317-3.673.533-5.555.642a.58.58 0 01-.611-.581c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.035-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959a.641.641 0 01-.658.643 49.118 49.118 0 01-4.708-.36.75.75 0 01-.645-.878c.293-1.614.504-3.257.629-4.924A.53.53 0 005.337 15c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.036 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.369 0 .713.128 1.003.349.283.215.604.401.959.401a.656.656 0 00.659-.663 47.703 47.703 0 00-.31-4.82.75.75 0 01.83-.832c1.343.155 2.703.254 4.077.294a.64.64 0 00.657-.642z" />
        </svg>
        Pokédex <span className="ml-2 text-sm text-gray-400">({pokedex.length} caught)</span>
      </h2>
      
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
        {pokedex.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
            isActive={activePokemon?.id === pokemon.id}
            onClick={() => onSelectPokemon(pokemon)}
            showStats={false}
          />
        ))}
      </div>
      
      {/* Active Pokemon Details */}
      {activePokemon && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <h3 className="text-md font-bold mb-3 text-white">Active Pokémon</h3>
          <PokemonCard
            pokemon={activePokemon}
            isActive={true}
            showStats={true}
          />
        </div>
      )}
    </div>
  );
};

export default Pokedex;
