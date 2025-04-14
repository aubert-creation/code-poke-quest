
import React, { useState, useEffect } from 'react';
import { Pokemon } from '@/types/pokemon';
import PokemonSprite from './PokemonSprite';

interface EvolutionAnimationProps {
  originalPokemon: Pokemon;
  evolvedPokemon: Pokemon;
  onComplete: () => void;
}

const EvolutionAnimation: React.FC<EvolutionAnimationProps> = ({
  originalPokemon,
  evolvedPokemon,
  onComplete
}) => {
  const [stage, setStage] = useState<'initial' | 'flashing' | 'evolved' | 'complete'>('initial');
  
  useEffect(() => {
    // Start the evolution animation sequence
    const startAnimation = async () => {
      // Wait a moment before starting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Flash animation
      setStage('flashing');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Show evolved pokemon
      setStage('evolved');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Complete animation
      setStage('complete');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Call onComplete callback
      onComplete();
    };
    
    startAnimation();
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="text-center p-8 rounded-lg">
        <h2 className="text-2xl font-bold text-white mb-8">
          {originalPokemon.name} is evolving!
        </h2>
        
        <div className="relative flex justify-center items-center">
          {/* Original Pokémon */}
          <div 
            className={`transition-opacity duration-500 ${
              stage === 'initial' ? 'opacity-100' : 
              stage === 'flashing' ? 'animate-pokemon-evolution' : 
              'opacity-0'
            }`}
          >
            <PokemonSprite pokemon={originalPokemon} size="xl" />
          </div>
          
          {/* Evolved Pokémon */}
          <div 
            className={`absolute inset-0 flex justify-center items-center transition-opacity duration-500 ${
              stage === 'evolved' || stage === 'complete' ? 'opacity-100 animate-pokemon-appear' : 'opacity-0'
            }`}
          >
            <PokemonSprite pokemon={evolvedPokemon} size="xl" />
          </div>
        </div>
        
        {stage === 'evolved' && (
          <div className="mt-8 animate-fade-in">
            <h3 className="text-xl font-bold text-white mb-2">
              {originalPokemon.name} evolved into {evolvedPokemon.name}!
            </h3>
            
            <p className="text-gray-300">
              Congratulations!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EvolutionAnimation;
