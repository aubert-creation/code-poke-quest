
import React from 'react';

interface HealthBarProps {
  currentHP: number;
  maxHP: number;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const HealthBar: React.FC<HealthBarProps> = ({
  currentHP,
  maxHP,
  size = 'md',
  showText = true
}) => {
  const percentage = Math.max(0, Math.min(100, (currentHP / maxHP) * 100));
  
  // Determine color based on health percentage
  let healthColor = 'bg-green-500';
  if (percentage <= 20) {
    healthColor = 'bg-red-500';
  } else if (percentage <= 50) {
    healthColor = 'bg-yellow-500';
  }
  
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        {showText && (
          <>
            <span className="text-xs font-medium text-gray-300">HP</span>
            <span className="text-xs font-medium text-gray-300">{currentHP}/{maxHP}</span>
          </>
        )}
      </div>
      <div className={`w-full bg-gray-800 rounded-full ${sizeClasses[size]}`}>
        <div
          className={`${healthColor} ${sizeClasses[size]} rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default HealthBar;
