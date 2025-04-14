
import React from 'react';

interface VSCodeWrapperProps {
  children: React.ReactNode;
}

const VSCodeWrapper: React.FC<VSCodeWrapperProps> = ({ children }) => {
  return (
    <div className="flex h-screen w-screen bg-pokemon-vscode-bg text-white font-mono overflow-hidden">
      {/* VSCode-like left sidebar with icons */}
      <div className="w-12 h-full bg-black flex flex-col items-center py-4 border-r border-gray-800">
        <div className="w-6 h-6 mb-6">
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </div>
        <div className="w-6 h-6 mb-3 text-pokemon-blue">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <div className="w-6 h-6 mb-3 text-white">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="w-6 h-6 mb-3 text-white">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="w-6 h-6 text-pokemon-red">
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            <circle cx="12" cy="12" r="3" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* Explorer panel and main content */}
      <div className="flex flex-1 h-full">
        {/* Explorer panel */}
        <div className="w-64 h-full bg-pokemon-vscode-panel border-r border-gray-800 flex flex-col">
          <div className="py-3 px-4 text-sm font-medium border-b border-gray-800 flex justify-between items-center">
            <span>EXPLORER: POKECODE</span>
            <button className="text-gray-400 hover:text-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </div>

        {/* Main content area (editor) - Just for visual context */}
        <div className="flex-1 bg-pokemon-vscode-bg p-6">
          <div className="h-6 flex mb-4 text-xs text-gray-400 border-b border-gray-800 pb-1">
            <div className="px-3 flex items-center border-r border-gray-800">
              main.ts
            </div>
            <div className="px-3 flex items-center border-r border-gray-800">
              game.ts
            </div>
            <div className="px-3 flex items-center text-white bg-gray-700">
              pokemon.ts
            </div>
          </div>
          
          <div className="text-sm font-mono text-gray-300">
            <pre className="leading-6">
              <div className="flex">
                <span className="inline-block w-6 text-gray-500 text-right pr-2">1</span>
                <span><span className="text-purple-400">import</span> <span className="text-blue-300">&#123; Pokemon &#125;</span> <span className="text-purple-400">from</span> <span className="text-green-300">'./types'</span>;</span>
              </div>
              <div className="flex">
                <span className="inline-block w-6 text-gray-500 text-right pr-2">2</span>
                <span></span>
              </div>
              <div className="flex">
                <span className="inline-block w-6 text-gray-500 text-right pr-2">3</span>
                <span><span className="text-purple-400">export function</span> <span className="text-yellow-300">calculateDamage</span><span className="text-blue-300">(</span><span className="text-orange-300">attacker</span>: <span className="text-blue-300">Pokemon</span>, <span className="text-orange-300">defender</span>: <span className="text-blue-300">Pokemon</span><span className="text-blue-300">)</span>: <span className="text-blue-300">number</span> <span className="text-blue-300">&#123;</span></span>
              </div>
              <div className="flex">
                <span className="inline-block w-6 text-gray-500 text-right pr-2">4</span>
                <span>  <span className="text-purple-400">const</span> <span className="text-blue-300">attack</span> = <span className="text-orange-300">attacker</span>.<span className="text-blue-300">attack</span>;</span>
              </div>
              <div className="flex">
                <span className="inline-block w-6 text-gray-500 text-right pr-2">5</span>
                <span>  <span className="text-purple-400">const</span> <span className="text-blue-300">defense</span> = <span className="text-orange-300">defender</span>.<span className="text-blue-300">defense</span>;</span>
              </div>
              <div className="flex">
                <span className="inline-block w-6 text-gray-500 text-right pr-2">6</span>
                <span>  <span className="text-purple-400">const</span> <span className="text-blue-300">level</span> = <span className="text-orange-300">attacker</span>.<span className="text-blue-300">level</span>;</span>
              </div>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VSCodeWrapper;
