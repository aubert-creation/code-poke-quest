
import React from 'react';
import { Pokemon } from '@/types/pokemon';

interface PokemonSpriteProps {
  pokemon: Pokemon;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animationClass?: string;
}

const PokemonSprite: React.FC<PokemonSpriteProps> = ({
  pokemon,
  size = 'md',
  className = '',
  animationClass = '',
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40',
  };

  const imageUrl = pokemon.isShiny ? pokemon.shinySprite : pokemon.sprite;

  return (
    <div className={`relative ${sizeClasses[size]} ${className} ${animationClass}`}>
      <img 
        src={imageUrl || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
        alt={pokemon.name}
        className="pixelated w-full h-full object-contain"
      />
      {pokemon.isShiny && (
        <div className="absolute -top-2 -right-2">
          <span className="text-yellow-400">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
            </svg>
          </span>
        </div>
      )}
    </div>
  );
};

export default PokemonSprite;
