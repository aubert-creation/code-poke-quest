import React, { useState, useEffect } from 'react';
import { GameState, Pokemon, UserData, BattleState } from '@/types/pokemon';
import { 
  loadUserData, saveStarterSelection, updateCharacterCount,
  resetEncounterCounter, shouldTriggerEncounter, updatePokemonExperience,
  addPokemonToPokedex, updateActivePokemon
} from '@/utils/localStorage';
import { fetchRandomPokemon, fetchPokemonById } from '@/services/pokeApi';
import StarterSelection from './StarterSelection';
import Pokedex from './Pokedex';
import WildEncounter from './WildEncounter';
import BattleScene from './BattleScene';
import EvolutionAnimation from './EvolutionAnimation';
import PokemonSprite from './PokemonSprite';

const PokecodeGame: React.FC = () => {
  // Game state
  const [gameState, setGameState] = useState<GameState>(GameState.NEW_USER);
  const [userData, setUserData] = useState<UserData>({ pokedex: [], userLevel: 1, characterCount: 0, encounterThreshold: 500 });
  const [wildPokemon, setWildPokemon] = useState<Pokemon | null>(null);
  const [battleState, setBattleState] = useState<BattleState | null>(null);
  const [evolutionData, setEvolutionData] = useState<{ original: Pokemon, evolved: Pokemon } | null>(null);

  // Load user data on mount
  useEffect(() => {
    const data = loadUserData();
    setUserData(data);
    
    if (data.starter) {
      setGameState(GameState.EXPLORER);
    } else {
      setGameState(GameState.STARTER_SELECTION);
    }
  }, []);

  // Simulate code typing for demo purposes
  useEffect(() => {
    if (gameState !== GameState.EXPLORER) return;
    
    // Simulate typing code every few seconds to trigger encounters
    const interval = setInterval(() => {
      // Add random number of characters (10-30)
      const charsTyped = Math.floor(Math.random() * 20) + 10;
      const updated = updateCharacterCount(charsTyped);
      setUserData(updated);
      
      // Check if we should trigger an encounter
      if (shouldTriggerEncounter(updated)) {
        triggerWildEncounter();
      }
    }, 300); // Every 5 seconds
    
    return () => clearInterval(interval);
  }, [gameState]);

  // Handle starter selection
  const handleStarterSelection = (pokemon: Pokemon) => {
    const updated = saveStarterSelection(pokemon);
    setUserData(updated);
    setGameState(GameState.EXPLORER);
  };

  // Trigger wild encounter
  const triggerWildEncounter = async () => {
    try {
      // Reset encounter counter
      const updated = resetEncounterCounter();
      setUserData(updated);
      
      // Get a random Pokemon based on user level
      const pokemon = await fetchRandomPokemon(updated.userLevel);
      setWildPokemon(pokemon);
      setGameState(GameState.WILD_ENCOUNTER);
    } catch (error) {
      console.error('Failed to trigger wild encounter:', error);
    }
  };

  // Start battle with wild Pokemon
  const startBattle = () => {
    if (!wildPokemon || !userData.activePokemon) return;
    
    setBattleState({
      playerPokemon: userData.activePokemon,
      wildPokemon: wildPokemon,
      playerHealth: userData.activePokemon.hp,
      wildHealth: wildPokemon.hp,
      battleLog: [`Battle started with wild ${wildPokemon.name}!`],
      turnCount: 0
    });
    
    setGameState(GameState.BATTLE);
  };

  // Handle battle attack
  const handleBattleAttack = () => {
    if (!battleState) return;
    
    const { playerPokemon, wildPokemon, playerHealth, wildHealth, battleLog, turnCount } = battleState;
    let newPlayerHealth = playerHealth;
    let newWildHealth = wildHealth;
    const newBattleLog = [...battleLog];
    let result: 'WIN' | 'LOSE' | 'ESCAPED' | undefined;
    
    // Player attacks first
    const playerDamage = Math.max(1, Math.floor(playerPokemon.attack * (1 - (wildPokemon.defense / 100)) * (Math.random() * 0.4 + 0.8)));
    newWildHealth = Math.max(0, newWildHealth - playerDamage);
    newBattleLog.push(`${playerPokemon.name} deals ${playerDamage} damage to ${wildPokemon.name}!`);
    
    // Check if wild Pokemon health is reduced to 0
    if (newWildHealth <= 0) {
      newBattleLog.push(`${wildPokemon.name} fainted and ran away!`);
      result = 'ESCAPED';
      
      // Add experience to player's Pokemon
      const expGain = Math.floor(wildPokemon.level * 8 * (1 + Math.random() * 0.2));
      newBattleLog.push(`${playerPokemon.name} gained ${expGain} exp!`);
      
      // Update experience (will be applied after battle)
      setTimeout(() => {
        const updated = updatePokemonExperience(playerPokemon.id, expGain);
        setUserData(updated);
        checkForEvolution(updated.activePokemon);
      }, 2000);
    } else {
      // Wild Pokemon attacks back
      const wildDamage = Math.max(1, Math.floor(wildPokemon.attack * (1 - (playerPokemon.defense / 100)) * (Math.random() * 0.3 + 0.7)));
      newPlayerHealth = Math.max(0, newPlayerHealth - wildDamage);
      newBattleLog.push(`${wildPokemon.name} deals ${wildDamage} damage to ${playerPokemon.name}!`);
      
      // Check if player's Pokemon fainted
      if (newPlayerHealth <= 0) {
        newBattleLog.push(`${playerPokemon.name} fainted!`);
        result = 'LOSE';
      }
    }
    
    // Update battle state
    setBattleState({
      ...battleState,
      playerHealth: newPlayerHealth,
      wildHealth: newWildHealth,
      battleLog: newBattleLog,
      turnCount: turnCount + 1,
      battleResult: result
    });
  };

  // Handle catch attempt
  const handleCatchAttempt = () => {
    if (!battleState) return;
    
    const { playerPokemon, wildPokemon, wildHealth, battleLog, turnCount } = battleState;
    const newBattleLog = [...battleLog];
    
    // Calculate catch probability based on remaining HP percentage AND pokemon level
    // Formula: 
    // - base chance is higher (40%)
    // - up to 40% more based on how much HP is depleted
    // - up to 40% more based on how low the Pokémon's level is
    const hpPercentage = wildHealth / wildPokemon.hp;
    const levelFactor = Math.max(0.2, 1 - (wildPokemon.level / 100)); // Higher for lower levels
    const catchProbability = 0.4 + ((1 - hpPercentage) * 0.4) + (levelFactor * 0.4);
    
    // Random roll for catch success
    const catchRoll = Math.random();
    let result: 'CAUGHT' | 'ESCAPED' | undefined;
    
    newBattleLog.push(`You threw a Pokéball at ${wildPokemon.name}!`);
    
    if (catchRoll < catchProbability) {
      // Caught the Pokemon
      newBattleLog.push(`Gotcha! ${wildPokemon.name} was caught!`);
      result = 'CAUGHT';
      
      // Add experience to player's Pokemon
      const expGain = Math.floor(wildPokemon.level * 12 * (1 + Math.random() * 0.2));
      newBattleLog.push(`${playerPokemon.name} gained ${expGain} exp!`);
      
      // Update experience and add Pokemon to Pokedex (will be applied after battle)
      setTimeout(() => {
        const updated1 = updatePokemonExperience(playerPokemon.id, expGain);
        const updated2 = addPokemonToPokedex(wildPokemon);
        setUserData({ ...updated1, pokedex: updated2.pokedex });
        checkForEvolution(updated1.activePokemon);
      }, 2000);
    } else {
      // Failed to catch
      newBattleLog.push(`Oh no! ${wildPokemon.name} broke free!`);
      
      // Wild Pokemon attacks back
      const wildDamage = Math.max(1, Math.floor(wildPokemon.attack * (1 - (playerPokemon.defense / 100)) * (Math.random() * 0.3 + 0.7)));
      const newPlayerHealth = Math.max(0, battleState.playerHealth - wildDamage);
      newBattleLog.push(`${wildPokemon.name} deals ${wildDamage} damage to ${playerPokemon.name}!`);
      
      // Check if player's Pokemon fainted
      if (newPlayerHealth <= 0) {
        newBattleLog.push(`${playerPokemon.name} fainted!`);
        result = 'ESCAPED';
      }
      
      // Update battle state
      setBattleState({
        ...battleState,
        playerHealth: newPlayerHealth,
        battleLog: newBattleLog,
        turnCount: turnCount + 1,
        battleResult: result
      });
    }
    
    if (result) {
      // Update battle state with result
      setBattleState({
        ...battleState,
        battleLog: newBattleLog,
        turnCount: turnCount + 1,
        battleResult: result
      });
    }
  };

  // Handle fleeing from battle/encounter
  const handleFlee = () => {
    if (gameState === GameState.BATTLE) {
      setBattleState({
        ...battleState!,
        battleResult: 'FLED',
        battleLog: [...battleState!.battleLog, 'You fled from the battle!']
      });
    } else {
      setWildPokemon(null);
      setGameState(GameState.EXPLORER);
    }
  };

  // Check for evolution
  const checkForEvolution = async (pokemon?: Pokemon) => {
    if (!pokemon || !pokemon.evolutionId || !pokemon.evolutionLevel) return;
    
    // Check if Pokemon should evolve
    if (pokemon.level >= pokemon.evolutionLevel) {
      try {
        // Fetch evolved form data
        const evolvedPokemon = await fetchPokemonById(pokemon.evolutionId);
        
        // Set evolution data to show animation
        setEvolutionData({
          original: pokemon,
          evolved: {
            ...evolvedPokemon,
            level: pokemon.level,
            experience: pokemon.experience,
            experienceToNextLevel: pokemon.experienceToNextLevel
          }
        });
        
        setGameState(GameState.EVOLUTION);
      } catch (error) {
        console.error('Failed to evolve Pokemon:', error);
      }
    }
  };

  // Handle evolution complete
  const handleEvolutionComplete = () => {
    if (!evolutionData) return;
    
    // Update the evolved Pokemon in storage
    const updated = addPokemonToPokedex(evolutionData.evolved);
    updateActivePokemon(evolutionData.evolved);
    setUserData(updated);
    setEvolutionData(null);
    setGameState(GameState.EXPLORER);
  };

  // End the current encounter/battle and return to explorer
  const handleReturnToExplorer = () => {
    setWildPokemon(null);
    setBattleState(null);
    setGameState(GameState.EXPLORER);
  };

  // Toggle Pokedex view
  const handleTogglePokedex = () => {
    if (gameState === GameState.POKEDEX) {
      setGameState(GameState.EXPLORER);
    } else {
      setGameState(GameState.POKEDEX);
    }
  };

  // Select active Pokemon from Pokedex
  const handleSelectActivePokemon = (pokemon: Pokemon) => {
    const updated = updateActivePokemon(pokemon);
    setUserData(updated);
  };

  // Render game state
  const renderGameContent = () => {
    switch (gameState) {
      case GameState.STARTER_SELECTION:
        return <StarterSelection onSelect={handleStarterSelection} />;
        
      case GameState.WILD_ENCOUNTER:
        if (!wildPokemon) return null;
        return (
          <WildEncounter
            pokemon={wildPokemon}
            onBattle={startBattle}
            onFlee={handleFlee}
          />
        );
        
      case GameState.BATTLE:
        if (!battleState) return null;
        return (
          <BattleScene
            battleState={battleState}
            onAttack={handleBattleAttack}
            onFlee={handleFlee}
            onCatchAttempt={handleCatchAttempt}
          />
        );
        
      case GameState.POKEDEX:
        return (
          <Pokedex
            pokedex={userData.pokedex}
            activePokemon={userData.activePokemon}
            onSelectPokemon={handleSelectActivePokemon}
          />
        );
        
      case GameState.EVOLUTION:
        if (!evolutionData) return null;
        return (
          <EvolutionAnimation
            originalPokemon={evolutionData.original}
            evolvedPokemon={evolutionData.evolved}
            onComplete={handleEvolutionComplete}
          />
        );
        
      case GameState.EXPLORER:
      default:
        // Explorer view
        return (
          <div className="p-2">
            {userData.activePokemon && (
              <div className="mb-4 p-3 rounded-md bg-gray-800 bg-opacity-50">
                <div className="flex items-center">
                  <PokemonSprite pokemon={userData.activePokemon} size="sm" className="mr-2" />
                  <div>
                    <h3 className="text-white font-bold">{userData.activePokemon.name}</h3>
                    <div className="text-xs text-gray-400">Lv. {userData.activePokemon.level}</div>
                  </div>
                  <div className="ml-auto text-xs text-gray-400">
                    XP: {userData.activePokemon.experience}/{userData.activePokemon.experienceToNextLevel}
                  </div>
                </div>
                
                {/* XP Bar */}
                <div className="w-full bg-gray-800 rounded-full h-1.5 mt-2">
                  <div 
                    className="bg-pokemon-blue h-1.5 rounded-full transition-all duration-300" 
                    style={{ width: `${(userData.activePokemon.experience / userData.activePokemon.experienceToNextLevel) * 100}%` }}
                  />
                </div>
              </div>
            )}
            
            <button
              onClick={handleTogglePokedex}
              className="w-full py-2 px-4 mb-4 bg-pokemon-red hover:bg-red-600 text-white rounded flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                <path d="M11.25 5.337c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.036 1.007-1.875 2.25-1.875S15 2.34 15 3.375c0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959 0 .332.278.598.61.578 1.91-.114 3.79-.342 5.632-.676a.75.75 0 01.878.645 49.17 49.17 0 01.376 5.452.657.657 0 01-.66.664c-.354 0-.675-.186-.958-.401a1.647 1.647 0 00-1.003-.349c-1.035 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713.128 1.003.349.283.215.604.401.959.401.31 0 .557.262.534.571a48.774 48.774 0 01-.595 4.845.75.75 0 01-.61.61c-1.82.317-3.673.533-5.555.642a.58.58 0 01-.611-.581c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.035-1.007-1.875-2.25-1.875s.84-2.25 1.875-2.25c.369 0 .713.128 1.003.349.283.215.604.401.959.401a.656.656 0 00.659-.663 47.703 47.703 0 00-.31-4.82.75.75 0 01.83-.832c1.343.155 2.703.254 4.077.294a.64.64 0 00.657-.642z" />
              </svg>
              Open Pokédex
            </button>
            
            <div className="p-3 bg-gray-800 bg-opacity-50 rounded-md mb-4">
              <h3 className="font-bold text-white mb-2">Trainer Stats</h3>
              <div className="grid grid-cols-2 gap-y-1 text-sm">
                <div className="text-gray-400">Trainer Level:</div>
                <div className="text-right text-white">{userData.userLevel}</div>
                <div className="text-gray-400">Pokémon Caught:</div>
                <div className="text-right text-white">{userData.pokedex.length}</div>
                <div className="text-gray-400">Activity Score:</div>
                <div className="text-right text-white">{userData.characterCount}/{userData.encounterThreshold}</div>
              </div>
              
              {/* Progress bar to next encounter */}
              <div className="w-full bg-gray-800 rounded-full h-1.5 mt-2">
                <div 
                  className="bg-pokemon-green h-1.5 rounded-full transition-all duration-300" 
                  style={{ width: `${(userData.characterCount / userData.encounterThreshold) * 100}%` }}
                />
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Keep coding to encounter more Pokémon! 
              </div>
            </div>
            
            <div className="text-sm text-gray-500">
              <p className="mb-2">• Code activity tracked</p>
              <p className="mb-2">• Random encounters while coding</p>
              <p>• Data persisted between sessions</p>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {renderGameContent()}
      
      {/* Post-battle modal */}
      {battleState?.battleResult && gameState === GameState.BATTLE && (
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleReturnToExplorer}
            className="w-full py-2 px-4 bg-pokemon-blue hover:bg-blue-600 text-white rounded"
          >
            Return to Coding
          </button>
        </div>
      )}
    </>
  );
};

export default PokecodeGame;
