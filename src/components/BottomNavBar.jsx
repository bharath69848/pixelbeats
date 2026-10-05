import React from 'react';
import { Home, Library, Search, Radio } from 'lucide-react';

export default function BottomNavBar({ currentTab, onChangeTab }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'library', label: 'Library', icon: Library },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'room', label: 'Room', icon: Radio },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0d0c11]/95 backdrop-blur-2xl border-t border-[#231f2f] px-4 py-2">
      <div className="max-w-md mx-auto grid grid-cols-4 items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              type="button"
              className="flex flex-col items-center justify-center gap-1 py-1 transition-all group"
            >
              <div
                className={`p-1.5 rounded-full transition-all ${
                  isActive
                    ? 'bg-[#f4a7bb]/15 text-[#f4a7bb] scale-110'
                    : 'text-neutral-500 group-hover:text-neutral-300'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`text-[11px] font-semibold tracking-tight transition-colors ${
                  isActive ? 'text-white' : 'text-neutral-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
