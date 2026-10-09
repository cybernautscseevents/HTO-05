import React from 'react';
import { Smartphone, Monitor } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const { isDeviceFramed, setIsDeviceFramed } = useApp();

  return (
    <div className="min-h-screen bg-[#E5E7EB] flex flex-col items-center justify-start py-0 sm:py-6 px-0 sm:px-4">
      {/* Presentation Control Bar */}
      <div className="w-full max-w-xl hidden sm:flex items-center justify-between mb-3 px-3 py-1.5 bg-white/80 backdrop-blur-md rounded-full border border-gray-300 text-xs shadow-sm">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold text-gray-800">VOUCH Application</span>
          <span className="text-gray-400">|</span>
          <span className="text-gray-600 font-mono text-[11px]">Verified Credential Suite</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setIsDeviceFramed(true)}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-full font-medium transition-all ${
              isDeviceFramed
                ? 'bg-[#162B22] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile Device</span>
          </button>
          <button
            onClick={() => setIsDeviceFramed(false)}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-full font-medium transition-all ${
              !isDeviceFramed
                ? 'bg-[#162B22] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Fluid View</span>
          </button>
        </div>
      </div>

      {/* Frame Wrapper */}
      <div
        className={`w-full transition-all duration-300 ${
          isDeviceFramed
            ? 'max-w-[412px] min-h-screen sm:min-h-[890px] sm:max-h-[915px] sm:rounded-[52px] shadow-2xl relative overflow-hidden flex flex-col border-0 sm:border-[9px] sm:border-[#141715] bg-[#F5F2EB]'
            : 'max-w-2xl min-h-screen sm:min-h-[850px] sm:rounded-[24px] shadow-xl relative overflow-hidden flex flex-col border border-gray-200 bg-[#F5F2EB]'
        }`}
      >
        {/* iOS-Style Status Bar */}
        {isDeviceFramed && (
          <div className="w-full pt-3 px-7 pb-1 flex justify-between items-center text-xs font-semibold text-[#141715] select-none z-20 shrink-0">
            <span>9:41</span>
            <div className="flex items-center space-x-1.5">
              {/* Cellular Signal Icon */}
              <svg className="w-4 h-3.5 fill-current" viewBox="0 0 16 12">
                <rect height="4" rx="0.5" width="2.5" x="0" y="8"></rect>
                <rect height="6.5" rx="0.5" width="2.5" x="4.5" y="5.5"></rect>
                <rect height="9" rx="0.5" width="2.5" x="9" y="3"></rect>
                <rect height="11.5" rx="0.5" width="2.5" x="13.5" y="0.5"></rect>
              </svg>
              {/* Wifi Icon */}
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 16 16">
                <path d="M8 12.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-4.24-2.83a6 6 0 0 1 8.48 0 .75.75 0 1 0 1.06-1.06 7.5 7.5 0 0 0-10.6 0 .75.75 0 0 0 1.06 1.06zm-2.83-2.83a10 10 0 0 1 14.14 0 .75.75 0 1 0 1.06-1.06 11.5 11.5 0 0 0-16.26 0 .75.75 0 1 0 1.06 1.06z"></path>
              </svg>
              {/* Battery Icon */}
              <div className="w-6 h-3 border border-current rounded-[4px] p-0.5 flex items-center">
                <div className="h-full bg-current w-full rounded-[1.5px]"></div>
              </div>
            </div>
          </div>
        )}

        {/* Scrollable Content View */}
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col relative">
          {children}
        </div>

        {/* Home Indicator Bar */}
        {isDeviceFramed && (
          <div className="w-full pb-2 pt-1 flex justify-center bg-[#F5F2EB]/90 pointer-events-none z-30 shrink-0">
            <div className="w-32 h-1 bg-[#1F2937] rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
};
