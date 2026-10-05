import React from 'react';

export default function SongItem({ song, index, isActive, onSelect }) {
  const trackNumber = (index + 1).toString().padStart(2, '0');

  return (
    <button
      onClick={() => onSelect(index)}
      type="button"
      className={`w-full text-left p-3.5 flex items-center justify-between border-b-2 border-black font-mono transition-colors last:border-b-0 cursor-pointer ${
        isActive
          ? 'bg-black text-white font-bold'
          : 'bg-white hover:bg-neutral-100 text-black'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {isActive && <span className="text-white text-xs">▶</span>}
        <span className="text-xs sm:text-sm font-bold tracking-wider">{trackNumber}</span>
        <span className="text-xs sm:text-sm font-bold tracking-wider truncate uppercase">
          {song.title}
        </span>
      </div>

      <span
        className={`text-[11px] sm:text-xs tracking-wider uppercase font-semibold shrink-0 ml-3 ${
          isActive ? 'text-neutral-200' : 'text-neutral-700'
        }`}
      >
        {song.artist}
      </span>
    </button>
  );
}
