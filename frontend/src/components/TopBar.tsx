import React from 'react';
import { useApp } from '../context/AppContext';

export const TopBar: React.FC = () => {
  const { worker, currentTab, setCurrentTab, activeRole } = useApp();

  return (
    <header className="flex justify-between items-center pt-2.5 px-5 pb-1 relative shrink-0">
      <div className="flex items-center space-x-2">
        <h1 
          onClick={() => setCurrentTab('home')}
          className="text-2xl font-extrabold tracking-tight text-[#141715] cursor-pointer hover:opacity-80 transition-opacity"
        >
          Vouch
        </h1>
        <span className="text-[10px] font-mono tracking-wider uppercase text-gray-500 font-semibold bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200">
          {activeRole === 'worker' ? 'Worker Passport' : 'Contractor Portal'}
        </span>
      </div>

      <div className="flex items-center space-x-2">
        {/* Profile Avatar */}
        <button
          onClick={() => {
            setCurrentTab('profile');
          }}
          className="w-8 h-8 rounded-full overflow-hidden border border-black/10 shrink-0 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#162B22]"
          title="Profile & Settings"
        >
          <img alt={worker.name} className="w-full h-full object-cover" src={worker.avatarUrl} />
        </button>
      </div>
    </header>
  );
};
