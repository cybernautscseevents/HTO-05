import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, FileText, Award, User, Search, BookmarkCheck } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentTab, setCurrentTab, activeRole, savedWorkerIds } = useApp();

  if (activeRole === 'contractor') {
    return (
      <nav className="sticky bottom-0 inset-x-0 bg-[#F5F2EB]/95 backdrop-blur-md border-t border-[#DFD9CE] px-6 pt-2 pb-3.5 z-30 shrink-0">
        <div className="flex justify-around items-center">
          <button
            onClick={() => setCurrentTab('home')}
            className={`flex flex-col items-center space-y-1 transition-colors ${
              currentTab === 'home' ? 'text-[#162B22]' : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            <Search className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Directory</span>
          </button>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky bottom-0 inset-x-0 bg-[#F5F2EB]/95 backdrop-blur-md border-t border-[#DFD9CE] px-6 pt-2 pb-3.5 z-30 shrink-0">
      <div className="flex justify-around items-center">
        {/* Nav Item: Home */}
        <button
          onClick={() => setCurrentTab('home')}
          className={`flex flex-col items-center space-y-1 transition-colors ${
            currentTab === 'home' ? 'text-[#162B22]' : 'text-[#737C8A] hover:text-[#162B22]'
          }`}
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z"></path>
            <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z"></path>
          </svg>
          <span className={`text-[10px] ${currentTab === 'home' ? 'font-semibold' : 'font-medium'} tracking-tight`}>
            Home
          </span>
        </button>

        {/* Nav Item: Work */}
        <button
          onClick={() => setCurrentTab('work')}
          className={`flex flex-col items-center space-y-1 transition-colors ${
            currentTab === 'work' ? 'text-[#162B22]' : 'text-[#737C8A] hover:text-[#162B22]'
          }`}
        >
          <svg className="w-5 h-5 stroke-[1.8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M9 13.5h6m-6 3h6" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
          <span className={`text-[10px] ${currentTab === 'work' ? 'font-semibold' : 'font-medium'} tracking-tight`}>
            Work
          </span>
        </button>

        {/* Nav Item: Passport */}
        <button
          onClick={() => setCurrentTab('passport')}
          className={`flex flex-col items-center space-y-1 transition-colors ${
            currentTab === 'passport' ? 'text-[#162B22]' : 'text-[#737C8A] hover:text-[#162B22]'
          }`}
        >
          <div className="w-5 h-5 border-[1.8px] border-current rounded-[5px] flex flex-col items-center justify-center p-[1px]">
            <div className="w-2 h-2 rounded-full border border-current"></div>
            <div className="w-2.5 h-1 border-t border-current mt-0.5"></div>
          </div>
          <span className={`text-[10px] ${currentTab === 'passport' ? 'font-semibold' : 'font-medium'} tracking-tight`}>
            Passport
          </span>
        </button>

        {/* Nav Item: Profile */}
        <button
          onClick={() => setCurrentTab('profile')}
          className={`flex flex-col items-center space-y-1 transition-colors ${
            currentTab === 'profile' ? 'text-[#162B22]' : 'text-[#737C8A] hover:text-[#162B22]'
          }`}
        >
          <svg className="w-5 h-5 stroke-[1.8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
          <span className={`text-[10px] ${currentTab === 'profile' ? 'font-semibold' : 'font-medium'} tracking-tight`}>
            Profile
          </span>
        </button>
      </div>
    </nav>
  );
};
