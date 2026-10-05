import React, { useState } from 'react';
import { Radio, MoreVertical, Compass, Navigation } from 'lucide-react';

export default function HomeScreen({
  songs,
  currentSongIndex,
  isPlaying,
  onSelectSong,
  onOpenRoom,
}) {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filters = ['All', 'Recently Played', 'Podcasts', 'Heavy Rotation'];

  // Jump Back In album cards
  const jumpBackAlbums = [
    {
      id: 1,
      title: 'Dawn FM',
      artist: 'The Weeknd',
      tag: 'LP',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80',
      songIndex: 1, // Blinding Lights
    },
    {
      id: 2,
      title: 'Melodrama',
      artist: 'Lorde',
      tag: 'Daily Mix',
      image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400&q=80',
      songIndex: 4, // Supercut
    },
    {
      id: 3,
      title: 'Currents',
      artist: 'Tame Impala',
      tag: 'Repeat',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80',
      songIndex: 5, // The Less I Know The Better
    },
    {
      id: 4,
      title: 'Renaissance',
      artist: 'Beyoncé',
      tag: 'Playlist',
      image: 'https://images.unsplash.com/photo-1549213783-8284d0336c4f?w=400&q=80',
      songIndex: 6, // BREAK MY SOUL
    },
  ];

  // Popular on transit songs (first 4)
  const popularSongs = [
    { song: songs[1], active: currentSongIndex === 1 && isPlaying },
    { song: songs[4], active: currentSongIndex === 4 && isPlaying },
    { song: songs[5], active: currentSongIndex === 5 && isPlaying },
    { song: songs[6], active: currentSongIndex === 6 && isPlaying },
  ];

  return (
    <div className="w-full flex flex-col gap-6 px-4 pt-2 pb-28">
      {/* 1. Greeting Section with Colored Dots */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
            GOOD AFTERNOON, BHARATH
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            Your Music
          </h2>
        </div>

        {/* Pastel accent dots: peach, yellow, teal */}
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full bg-[#f4a7bb]"></span>
          <span className="w-3.5 h-3.5 rounded-full bg-[#fde047]"></span>
          <span className="w-3.5 h-3.5 rounded-full bg-[#5eead4]"></span>
        </div>
      </div>

      {/* 2. Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        {filters.map((filter) => {
          const isActive = selectedFilter === filter;
          return (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              type="button"
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#f4a7bb] text-[#131118] shadow-md shadow-[#f4a7bb]/20 font-bold'
                  : 'bg-[#1e1b27] text-neutral-300 hover:bg-[#282434] border border-[#2d283b]'
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>

      {/* 3. Live Synced Commute Card */}
      <div className="w-full rounded-3xl bg-gradient-to-r from-[#2a1727] via-[#21182c] to-[#1a1726] border border-[#f4a7bb]/25 p-4 shadow-xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#f4a7bb]/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Top Header: LIVE badge + members + soundwave */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#e879f9]/20 border border-[#e879f9]/40 text-[#f5d0fe] text-[10px] font-bold tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f0abfc] animate-ping"></span>
              LIVE
            </span>
            <span className="text-xs font-semibold text-[#f5d0fe]">with Arun &amp; Bharath</span>
          </div>

          {/* Mini Soundwave */}
          <div className="flex items-center gap-0.5">
            <span className="w-0.5 h-3 bg-[#f4a7bb] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-0.5 h-4.5 bg-[#f4a7bb] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-0.5 h-2 bg-[#f4a7bb] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            <span className="w-0.5 h-3.5 bg-[#f4a7bb] rounded-full animate-bounce" style={{ animationDelay: '75ms' }}></span>
          </div>
        </div>

        {/* Track Preview + Join Button */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=160&q=80"
              alt="After Hours"
              className="w-12 h-12 rounded-xl object-cover border border-[#f4a7bb]/30 shrink-0"
            />
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-white truncate">After Hours</h3>
              <p className="text-xs text-neutral-400 truncate mt-0.5">The Weeknd • Synced Commute</p>
            </div>
          </div>

          <button
            onClick={() => {
              onSelectSong(0); // Save Your Tears / After Hours
              onOpenRoom();
            }}
            type="button"
            className="px-5 py-2 rounded-full bg-[#f4a7bb] hover:bg-[#f294ab] text-[#131118] font-bold text-xs shadow-lg shadow-[#f4a7bb]/25 shrink-0 transition active:scale-95"
          >
            Join
          </button>
        </div>
      </div>

      {/* 4. Jump Back In (2x2 Grid) */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white tracking-tight">Jump Back In</h3>
          <button type="button" className="text-xs text-neutral-400 hover:text-white font-semibold">
            See all
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          {jumpBackAlbums.map((album) => (
            <div
              key={album.id}
              onClick={() => onSelectSong(album.songIndex)}
              className="group cursor-pointer flex flex-col gap-2"
            >
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#1e1b27] border border-[#2d283b] shadow-md group-hover:border-[#f4a7bb]/40 transition">
                <img
                  src={album.image}
                  alt={album.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Overlay pill tag */}
                <div className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-bold text-white border border-white/10">
                  {album.tag}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white truncate group-hover:text-[#f4a7bb] transition-colors">
                  {album.title}
                </h4>
                <p className="text-xs text-neutral-400 truncate">{album.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Popular on Transit */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white tracking-tight">Popular on Transit</h3>
          <span className="text-xs text-neutral-400 font-semibold">Metro Live</span>
        </div>

        <div className="flex flex-col gap-2">
          {popularSongs.map((item, idx) => {
            const s = item.song;
            if (!s) return null;
            const isCurrent = item.active;

            return (
              <div
                key={s.id}
                onClick={() => onSelectSong(songs.findIndex((t) => t.id === s.id))}
                className={`p-3 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition border ${
                  isCurrent
                    ? 'bg-[#3b2734] border-[#f4a7bb]/40 text-white shadow-lg'
                    : 'bg-[#1b1824]/60 hover:bg-[#231f2f] border-[#292437] text-neutral-300'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Thumbnail / Animated Equalizer icon */}
                  <div className="w-11 h-11 rounded-xl bg-[#282236] overflow-hidden relative shrink-0">
                    <img src={s.albumArt} alt={s.title} className="w-full h-full object-cover" />
                    {isCurrent && (
                      <div className="absolute inset-0 bg-[#2d1b28]/80 flex items-center justify-center gap-0.5">
                        <span className="w-0.5 h-3 bg-[#f4a7bb] animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-0.5 h-4 bg-[#f4a7bb] animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-0.5 h-2 bg-[#f4a7bb] animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h4
                      className={`text-sm font-bold truncate ${
                        isCurrent ? 'text-[#f4a7bb]' : 'text-white'
                      }`}
                    >
                      {s.title}
                    </h4>
                    <p className="text-xs text-neutral-400 truncate mt-0.5">{s.artist}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-mono text-neutral-400">{s.duration}</span>
                  <button type="button" className="text-neutral-500 hover:text-neutral-300 p-1">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Your Playlists */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white tracking-tight">Your Playlists</h3>
          <span className="text-xs text-neutral-400 font-semibold">Library</span>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          {/* Late Night Transit */}
          <div
            onClick={() => onSelectSong(0)}
            className="flex flex-col gap-2 cursor-pointer group"
          >
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-[#1e1b27] border border-[#2d283b] shadow-md group-hover:border-[#f4a7bb]/40 transition">
              <img
                src="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&q=80"
                alt="Late Night Transit"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-bold text-white border border-white/10">
                42 tracks
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white truncate group-hover:text-[#f4a7bb] transition-colors">
                Late Night Transit
              </h4>
              <p className="text-xs text-neutral-400">Updated yesterday</p>
            </div>
          </div>

          {/* Lo-Fi Chill Hop */}
          <div
            onClick={() => onSelectSong(7)}
            className="flex flex-col gap-2 cursor-pointer group"
          >
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-[#1e1b27] border border-[#2d283b] shadow-md group-hover:border-[#f4a7bb]/40 transition">
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80"
                alt="Lo-Fi Chill Hop"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-bold text-white border border-white/10">
                68 tracks
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white truncate group-hover:text-[#f4a7bb] transition-colors">
                Lo-Fi Chill Hop
              </h4>
              <p className="text-xs text-neutral-400">By BusBuds Curators</p>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Transit Proximity Banner */}
      <div className="w-full p-4 rounded-3xl bg-[#1b1825] border border-[#2d273a] flex flex-col gap-1.5 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Navigation className="w-4 h-4 text-[#f4a7bb]" />
            <span>Near Bus Station #402</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f4a7bb]/15 text-[#f4a7bb] border border-[#f4a7bb]/30">
            12 Buds nearby
          </span>
        </div>
        <p className="text-xs text-neutral-400 leading-relaxed mt-0.5">
          Listening sessions pop up automatically when your bus approaches.
        </p>
      </div>
    </div>
  );
}
