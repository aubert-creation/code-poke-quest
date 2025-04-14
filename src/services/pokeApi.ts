
import axios from 'axios';
import { Pokemon } from '@/types/pokemon';

const API_URL = 'https://pokeapi.co/api/v2';

export const fetchPokemonById = async (id: number): Promise<Pokemon> => {
  try {
    const response = await axios.get(`${API_URL}/pokemon/${id}`);
    const data = response.data;
    
    return {
      id: data.id,
      name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
      types: data.types.map((type: any) => type.type.name),
      sprite: data.sprites.versions['generation-v']['black-white'].animated.front_default || data.sprites.front_default,
      shinySprite: data.sprites.versions['generation-v']['black-white'].animated.front_shiny || data.sprites.front_shiny,
      isShiny: false,
      hp: data.stats.find((stat: any) => stat.stat.name === 'hp').base_stat,
      attack: data.stats.find((stat: any) => stat.stat.name === 'attack').base_stat,
      defense: data.stats.find((stat: any) => stat.stat.name === 'defense').base_stat,
      speed: data.stats.find((stat: any) => stat.stat.name === 'speed').base_stat,
      level: 5,
      experience: 0,
      experienceToNextLevel: 100
    };
  } catch (error) {
    console.error('Failed to fetch Pokémon:', error);
    throw error;
  }
};

export const fetchStarterPokemon = async (): Promise<Pokemon[]> => {
  // Standard starters: Bulbasaur (1), Charmander (4), Squirtle (7)
  return Promise.all([1, 4, 7].map(id => fetchPokemonById(id)));
};

export const fetchRandomPokemon = async (userLevel: number): Promise<Pokemon> => {
  // Higher user level increases chance of rarer Pokémon
  // For simplicity, we're using the first 151 Pokémon (Gen 1)
  const maxPokemonId = Math.min(151, Math.max(50, userLevel * 10));
  const randomId = Math.floor(Math.random() * maxPokemonId) + 1;
  
  const pokemon = await fetchPokemonById(randomId);
  
  // Small chance of shiny (1/100 base chance, improved by user level)
  const shinyChance = Math.min(0.1, 0.01 + (userLevel * 0.005)); // Max 10% chance at high levels
  pokemon.isShiny = Math.random() < shinyChance;
  
  // Check for potential evolution
  try {
    const speciesResponse = await axios.get(`${API_URL}/pokemon-species/${randomId}`);
    const evolutionChainUrl = speciesResponse.data.evolution_chain.url;
    const evolutionResponse = await axios.get(evolutionChainUrl);
    
    let currentEvolution = evolutionResponse.data.chain;
    
    // Find the current Pokémon in the evolution chain
    while (currentEvolution) {
      const speciesName = currentEvolution.species.name;
      const speciesUrl = currentEvolution.species.url;
      const speciesId = parseInt(speciesUrl.split('/').filter(Boolean).pop() || '0');
      
      if (speciesId === randomId && currentEvolution.evolves_to.length > 0) {
        const nextEvolution = currentEvolution.evolves_to[0];
        const nextEvolutionSpeciesUrl = nextEvolution.species.url;
        const nextEvolutionId = parseInt(nextEvolutionSpeciesUrl.split('/').filter(Boolean).pop() || '0');
        
        // Find evolution level requirement
        const evolutionDetails = nextEvolution.evolution_details[0];
        const levelRequired = evolutionDetails?.min_level || 20; // Default to level 20 if not specified
        
        pokemon.evolutionId = nextEvolutionId;
        pokemon.evolutionLevel = levelRequired;
        break;
      }
      
      // Move to next evolution if no match found
      if (currentEvolution.evolves_to.length > 0) {
        currentEvolution = currentEvolution.evolves_to[0];
      } else {
        currentEvolution = null;
      }
    }
  } catch (error) {
    console.error('Failed to fetch evolution data:', error);
    // Continue without evolution data if it fails
  }
  
  return pokemon;
};

export const getPokemonTypeColor = (type: string): string => {
  const typeColors: Record<string, string> = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD',
  };
  
  return typeColors[type.toLowerCase()] || '#777777';
};
