import React from 'react';
import { Music, Library, Users } from 'lucide-react';

export default function PhoneNavBar({ activeTab, onChangeTab }) {
  const tabs = [
    { id: 'now-playing', label: 'Now Playing', icon: Music },
    { id: 'library', label: 'Library', icon: Library },
    { id: 'rooms', label: 'Rooms', icon: Users },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#f6f0e2]/95 backdrop-blur-md border-t border-neutral-300">
      <div className="max-w-md mx-auto px-6 py-2.5 flex items-center justify-between select-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              type="button"
              className={`flex flex-col items-center gap-1 transition-all py-1 px-3 rounded-xl active:scale-95 ${
                isActive
                  ? 'text-black font-bold'
                  : 'text-neutral-500 hover:text-black font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
