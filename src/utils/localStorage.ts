
import { UserData, GameState, Pokemon } from '@/types/pokemon';

const STORAGE_KEY = 'pokecode_data';

export const DEFAULT_USER_DATA: UserData = {
  pokedex: [],
  userLevel: 1,
  characterCount: 0,
  encounterThreshold: 500, // Characters typed before possible encounter
};

export const loadUserData = (): UserData => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      return JSON.parse(savedData);
    }
  } catch (error) {
    console.error('Error loading user data:', error);
  }
  
  return DEFAULT_USER_DATA;
};

export const saveUserData = (data: UserData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

export const saveStarterSelection = (pokemon: Pokemon): UserData => {
  const userData = loadUserData();
  const updatedData = {
    ...userData,
    starter: pokemon,
    activePokemon: pokemon,
    pokedex: [...userData.pokedex, pokemon],
  };
  
  saveUserData(updatedData);
  return updatedData;
};

export const addPokemonToPokedex = (pokemon: Pokemon): UserData => {
  const userData = loadUserData();
  const updatedData = {
    ...userData,
    pokedex: [...userData.pokedex, pokemon],
  };
  
  saveUserData(updatedData);
  return updatedData;
};

export const updateActivePokemon = (pokemon: Pokemon): UserData => {
  const userData = loadUserData();
  const updatedData = {
    ...userData,
    activePokemon: pokemon,
  };
  
  saveUserData(updatedData);
  return updatedData;
};

export const updatePokemonExperience = (
  pokemonId: number, 
  experienceGain: number
): UserData => {
  const userData = loadUserData();
  
  if (!userData.activePokemon || userData.activePokemon.id !== pokemonId) {
    return userData;
  }
  
  const activePokemon = { ...userData.activePokemon };
  activePokemon.experience += experienceGain;
  
  // Level up if enough experience
  if (activePokemon.experience >= activePokemon.experienceToNextLevel) {
    activePokemon.level += 1;
    activePokemon.experience -= activePokemon.experienceToNextLevel;
    activePokemon.experienceToNextLevel = Math.floor(activePokemon.experienceToNextLevel * 1.2);
    
    // Increase stats on level up
    activePokemon.hp += Math.floor(Math.random() * 3) + 1;
    activePokemon.attack += Math.floor(Math.random() * 2) + 1;
    activePokemon.defense += Math.floor(Math.random() * 2) + 1;
    activePokemon.speed += Math.floor(Math.random() * 2) + 1;
  }
  
  // Update active pokemon in pokedex
  const updatedPokedex = userData.pokedex.map(p => 
    p.id === activePokemon.id ? activePokemon : p
  );
  
  const updatedData = {
    ...userData,
    activePokemon,
    pokedex: updatedPokedex,
  };
  
  saveUserData(updatedData);
  return updatedData;
};

export const updateUserLevel = (newLevel: number): UserData => {
  const userData = loadUserData();
  const updatedData = {
    ...userData,
    userLevel: newLevel,
  };
  
  saveUserData(updatedData);
  return updatedData;
};

export const updateCharacterCount = (count: number): UserData => {
  const userData = loadUserData();
  const updatedData = {
    ...userData,
    characterCount: userData.characterCount + count,
    lastEncounterTimestamp: userData.lastEncounterTimestamp || Date.now(),
  };
  
  saveUserData(updatedData);
  return updatedData;
};

export const resetEncounterCounter = (): UserData => {
  const userData = loadUserData();
  const updatedData = {
    ...userData,
    characterCount: 0,
    lastEncounterTimestamp: Date.now(),
  };
  
  saveUserData(updatedData);
  return updatedData;
};

export const shouldTriggerEncounter = (userData: UserData): boolean => {
  // Check if enough characters have been typed since last encounter
  if (userData.characterCount >= userData.encounterThreshold) {
    // Make sure at least 1 minute has passed since last encounter
    const timeSinceLastEncounter = userData.lastEncounterTimestamp 
      ? Date.now() - userData.lastEncounterTimestamp 
      : Infinity;
      
    if (timeSinceLastEncounter > 300) { // 1 minute in milliseconds
      return true;
    }
  }
  
  return false;
};
