
export interface Pokemon {
  id: number;
  name: string;
  types: string[];
  sprite: string;
  shinySprite: string;
  isShiny: boolean;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  level: number;
  experience: number;
  experienceToNextLevel: number;
  evolutionId?: number;
  evolutionLevel?: number;
}

export interface UserData {
  starter?: Pokemon;
  pokedex: Pokemon[];
  activePokemon?: Pokemon;
  userLevel: number;
  characterCount: number;
  encounterThreshold: number;
  lastEncounterTimestamp?: number;
}

export enum GameState {
  NEW_USER = 'NEW_USER',
  STARTER_SELECTION = 'STARTER_SELECTION',
  EXPLORER = 'EXPLORER',
  WILD_ENCOUNTER = 'WILD_ENCOUNTER',
  BATTLE = 'BATTLE',
  POKEDEX = 'POKEDEX',
  EVOLUTION = 'EVOLUTION'
}

export interface BattleState {
  playerPokemon: Pokemon;
  wildPokemon: Pokemon;
  playerHealth: number;
  wildHealth: number;
  battleLog: string[];
  turnCount: number;
  battleResult?: 'WIN' | 'LOSE' | 'FLED';
}
