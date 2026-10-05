import React from 'react';
import SongItem from './SongItem.jsx';

export default function SongList({ songs, currentSongIndex, onSelectSong }) {
  return (
    <div className="w-full border-4 border-black bg-white shadow-[6px_6px_0px_#000] font-mono text-black select-none">
      {/* Header Bar */}
      <div className="border-b-2 border-black bg-white px-3 py-2 flex items-center justify-between text-xs sm:text-sm font-bold tracking-wider">
        <span>TAPE CASSETTE QUEUE</span>
        <span>{songs.length} ITEMS</span>
      </div>

      {/* Track Rows */}
      <div className="flex flex-col divide-y-2 divide-black">
        {songs.map((song, index) => (
          <SongItem
            key={song.id}
            song={song}
            index={index}
            isActive={currentSongIndex === index}
            onSelect={onSelectSong}
          />
        ))}
      </div>
    </div>
  );
}
