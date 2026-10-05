import React, { useState } from 'react';
import { PixelThumbnail } from './PixelArtwork.jsx';
import { Search, MoreVertical } from 'lucide-react';

export default function LibraryView({
  songs,
  currentSongIndex,
  isPlaying,
  onSelectSong
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const filteredSongs = songs.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q);
  });

  return (
    <div className="w-full flex-1 flex flex-col px-5 pt-3 pb-24 select-none font-pixel min-h-screen">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 pt-1">
        <div className="w-6"></div> {/* Spacer for symmetry */}

        <h1 className="text-xl sm:text-2xl font-bold tracking-wider text-black text-center">
          PIXELBEATS
        </h1>

        <button
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          type="button"
          className="p-1.5 hover:opacity-70 transition active:scale-95 text-black"
          title="Search"
        >
          <Search className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* Search Input Bar (Expandable) */}
      {isSearchOpen && (
        <div className="mb-3 animate-fadeIn">
          <input
            type="text"
            placeholder="Search tracks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            className="w-full px-3.5 py-2 text-sm bg-white border border-black rounded-xl outline-none font-pixel shadow-sm"
          />
        </div>
      )}

      {/* Track List Header Count */}
      <div className="flex items-center justify-between text-xs text-neutral-500 font-semibold mb-3 px-1">
        <span>ALL TRACKS</span>
        <span className="font-mono-clean">{songs.length} SONGS</span>
      </div>

      {/* Song List */}
      <div className="flex-1 space-y-2.5">
        {filteredSongs.map((song, index) => {
          const isCurrentlyPlaying = currentSongIndex === index && isPlaying;
          const isCurrentTrack = currentSongIndex === index;

          return (
            <div
              key={song.id}
              onClick={() => onSelectSong(index)}
              className={`flex items-center justify-between p-2 rounded-2xl cursor-pointer transition active:scale-[0.98] ${
                isCurrentTrack
                  ? 'bg-black/10 border border-black/20'
                  : 'hover:bg-black/5 active:bg-black/10'
              }`}
            >
              {/* Thumbnail + Title + Artist */}
              <div className="flex items-center gap-3.5 min-w-0 pr-2">
                <PixelThumbnail theme={song.theme} />

                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-black tracking-tight truncate flex items-center gap-1.5">
                    {song.title}
                    {isCurrentlyPlaying && (
                      <span className="text-[11px] text-pink-600 animate-pulse">♫</span>
                    )}
                  </h3>
                  <p className="text-xs text-neutral-500 font-semibold truncate mt-0.5">
                    {song.artist}
                  </p>
                </div>
              </div>

              {/* Duration & Three-Dot Menu */}
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-mono-clean text-neutral-500">
                  {song.durationStr || '0:20'}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="p-1 hover:text-black text-neutral-400"
                  title="More Options"
                >
                  <MoreVertical className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
