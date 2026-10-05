import React, { useState } from 'react';
import {
  Search,
  ArrowUpDown,
  Shuffle,
  SlidersHorizontal,
  Bus,
  MoreVertical,
  CheckCircle2,
  Share2,
  Music,
  Disc,
  User,
  ListMusic
} from 'lucide-react';

export default function LibraryScreen({
  songs,
  currentSongIndex,
  isPlaying,
  onSelectSong,
}) {
  const [activeTab, setActiveTab] = useState<'songs' | 'albums' | 'artists' | 'playlists'>('songs');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLetter, setActiveLetter] = useState('ALL');

  const alphabet = ['ALL', 'A', 'C', 'D', 'E', 'L', 'M', 'N', 'S', '#'];

  const filteredSongs = songs.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.artist.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (activeLetter === 'ALL') return true;
    if (activeLetter === '#') return !/^[A-Za-z]/.test(s.title);
    return s.title.toUpperCase().startsWith(activeLetter);
  });

  return (
    <div className="w-full flex flex-col gap-5 px-4 pt-2 pb-28">
      {/* 1. Header with Stats & Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Library
          </h2>
          <p className="text-xs text-neutral-400 font-medium mt-0.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#f4a7bb]"></span>
            <span>348 tracks • 22.4 GB synced</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-2.5 rounded-full bg-[#1e1b27] border border-[#2d283b] text-neutral-300 hover:text-white"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#1e1b27] border border-[#2d283b] text-xs font-semibold text-neutral-300 hover:text-white"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Recently Added</span>
          </button>
        </div>
      </div>

      {/* 2. Filter Tabs: Songs, Albums, Artists, Playlists */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        {[
          { id: 'songs', label: 'Songs', icon: Music },
          { id: 'albums', label: 'Albums', icon: Disc },
          { id: 'artists', label: 'Artists', icon: User },
          { id: 'playlists', label: 'Playlists', icon: ListMusic },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              type="button"
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#9333ea] to-[#d946ef] text-white shadow-md shadow-[#9333ea]/30 font-bold'
                  : 'bg-[#1e1b27] text-neutral-300 hover:bg-[#282434] border border-[#2d283b]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Action Bar: Shuffle All + Filter + Bus Mode */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => onSelectSong(Math.floor(Math.random() * songs.length))}
          type="button"
          className="flex-1 py-3 px-4 rounded-full bg-[#f4a7bb] hover:bg-[#f294ab] text-[#131118] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#f4a7bb]/20 active:scale-98 transition"
        >
          <Shuffle className="w-4 h-4" />
          <span>Shuffle All ({songs.length})</span>
        </button>

        <button
          type="button"
          className="w-11 h-11 rounded-full bg-[#1e1b27] border border-[#2d283b] flex items-center justify-center text-neutral-300 hover:text-white shrink-0"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>

        <button
          type="button"
          className="w-11 h-11 rounded-full bg-[#1e1b27] border border-[#2d283b] flex items-center justify-center text-neutral-300 hover:text-white shrink-0"
        >
          <Bus className="w-4 h-4" />
        </button>
      </div>

      {/* 4. Alphabet Quick Scroller */}
      <div className="flex items-center justify-between text-xs font-bold text-neutral-500 overflow-x-auto no-scrollbar py-1 border-b border-[#252033]">
        {alphabet.map((letter) => (
          <button
            key={letter}
            onClick={() => setActiveLetter(letter)}
            className={`px-2 py-0.5 rounded transition ${
              activeLetter === letter ? 'text-[#f4a7bb] bg-[#f4a7bb]/10 font-extrabold' : 'hover:text-neutral-300'
            }`}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* 5. Song List */}
      <div className="flex flex-col gap-1.5">
        {filteredSongs.map((s) => {
          const originalIndex = songs.findIndex((t) => t.id === s.id);
          const isCurrent = currentSongIndex === originalIndex;

          return (
            <div
              key={s.id}
              onClick={() => onSelectSong(originalIndex)}
              className={`p-3 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition border ${
                isCurrent
                  ? 'bg-[#291b29] border-[#f4a7bb]/40 text-white shadow-lg'
                  : 'bg-transparent hover:bg-[#1a1725] border-transparent text-neutral-300'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Artwork */}
                <div className="w-12 h-12 rounded-xl bg-[#282236] overflow-hidden relative shrink-0">
                  <img src={s.albumArt} alt={s.title} className="w-full h-full object-cover" />
                  {isCurrent && isPlaying && (
                    <div className="absolute inset-0 bg-[#2d1b28]/80 flex items-center justify-center gap-0.5">
                      <span className="w-0.5 h-3 bg-[#f4a7bb] animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-0.5 h-4 bg-[#f4a7bb] animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-0.5 h-2 bg-[#f4a7bb] animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <h4
                    className={`text-sm font-bold truncate flex items-center gap-1.5 ${
                      isCurrent ? 'text-[#f4a7bb]' : 'text-white'
                    }`}
                  >
                    <span>{s.title}</span>
                    {isCurrent && <span className="w-2 h-2 rounded-full bg-[#f4a7bb]"></span>}
                  </h4>
                  <p className="text-xs text-neutral-400 truncate mt-0.5">
                    {s.artist} • {s.album}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-mono text-neutral-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-neutral-500" />
                  {s.duration}
                </span>
                <button type="button" className="text-neutral-500 hover:text-neutral-300 p-1">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 6. Transit Buddy Sharing Banner */}
      <div className="w-full p-4 rounded-3xl bg-[#1b1825] border border-[#2d273a] flex items-center justify-between gap-3 shadow-md mt-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-[#2e1d35] flex items-center justify-center text-[#d946ef] shrink-0">
            <Share2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-white truncate">Transit Buddy Sharing</h4>
            <p className="text-xs text-neutral-400 truncate">Nearby riders on Route 38 Express</p>
          </div>
        </div>

        <button
          type="button"
          className="px-4 py-2 rounded-full bg-[#2a243b] hover:bg-[#39314f] border border-[#473e61] text-xs font-bold text-white transition shrink-0"
        >
          Broadcast
        </button>
      </div>
    </div>
  );
}
