import React from 'react';
import { Headphones } from 'lucide-react';

export default function HeaderBar({ subtitle, listenersCount = 2 }) {
  return (
    <header className="w-full px-5 pt-4 pb-2 flex items-center justify-between sticky top-0 z-30 bg-[#0d0c11]/90 backdrop-blur-md">
      {/* Brand Logo & Current Section */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#301b28] to-[#1c1926] border border-[#f0a6b8]/20 flex items-center justify-center text-[#f0a6b8] shadow-lg shadow-[#f0a6b8]/10">
          <Headphones className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5 leading-tight">
            BusBuds
          </h1>
          <p className="text-[11px] text-neutral-400 font-medium">{subtitle || 'Home'}</p>
        </div>
      </div>

      {/* Right: Presence Badge & User Avatar */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#241a2a] border border-[#a855f7]/30 text-[11px] text-[#e9d5ff] font-medium shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#c084fc] animate-pulse"></span>
          <span>{listenersCount} listening</span>
        </div>

        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&q=80"
            alt="Alex"
            className="w-9 h-9 rounded-full object-cover border-2 border-[#f0a6b8]/40 shadow-md"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0d0c11]"></span>
        </div>
      </div>
    </header>
  );
}
