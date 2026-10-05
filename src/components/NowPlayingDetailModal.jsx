import React, { useState } from 'react';
import {
  ArrowLeft,
  MoreVertical,
  ChevronDown,
  Heart,
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  Radio,
  Sliders,
  ListMusic,
  CheckCircle2,
  GripVertical
} from 'lucide-react';

export default function NowPlayingDetailModal({
  currentSong,
  isPlaying,
  currentTime,
  duration,
  onTogglePlay,
  onPrevious,
  onNext,
  onSeek,
  onClose,
  songs,
  onSelectSong,
  roomCode,
  connectedPassengersCount = 2,
}) {
  const [isLiked, setIsLiked] = useState(true);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);

  // Time format helper
  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  const remainingTime = duration > 0 ? duration - currentTime : 0;
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Up next tracks
  const upNextTracks = [
    {
      id: 'un1',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      addedBy: 'Arun',
      duration: '3:20',
      art: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=160&q=80',
      songIndex: 1,
    },
    {
      id: 'un2',
      title: 'Midnight City',
      artist: 'M83',
      addedBy: 'Bharath',
      duration: '4:03',
      art: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=160&q=80',
      songIndex: 2,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#0d0c11] overflow-y-auto flex flex-col font-sans select-none animate-in fade-in slide-in-from-bottom duration-300">
      {/* Top Header */}
      <div className="w-full max-w-md mx-auto px-5 pt-4 pb-2 flex items-center justify-between sticky top-0 z-10 bg-[#0d0c11]/90 backdrop-blur-md">
        <button
          onClick={onClose}
          type="button"
          className="p-2 -ml-2 rounded-full text-white hover:bg-white/10 transition active:scale-95"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#241a2a] border border-[#f0a6b8]/30 flex items-center justify-center text-[#f0a6b8]">
            <Radio className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-white tracking-tight">Now Playing Detail</span>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" className="p-2 text-neutral-400 hover:text-white">
            <MoreVertical className="w-5 h-5" />
          </button>
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80"
            alt="User"
            className="w-8 h-8 rounded-full object-cover border border-[#f0a6b8]/40"
          />
        </div>
      </div>

      {/* Main Player Content Container */}
      <div className="w-full max-w-md mx-auto px-5 pt-2 pb-12 flex flex-col gap-5">
        {/* Playing From Album Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-left">
            <button
              onClick={onClose}
              type="button"
              className="text-neutral-400 hover:text-white"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
            <div>
              <p className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                PLAYING FROM ALBUM
              </p>
              <h3 className="text-xs sm:text-sm font-bold text-white">
                {currentSong?.album || 'After Hours (Deluxe)'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#351b32]/80 border border-[#f4a7bb]/40 text-[#fbcfe8] text-xs font-bold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#f4a7bb] animate-pulse"></span>
              <span>{connectedPassengersCount} Sync</span>
            </div>

            <button
              onClick={() => setIsLiked(!isLiked)}
              type="button"
              className="text-neutral-400 hover:text-[#f4a7bb] transition"
            >
              <Heart
                className={`w-5 h-5 ${
                  isLiked ? 'fill-[#f4a7bb] text-[#f4a7bb]' : 'text-neutral-400'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Large Album Artwork Card */}
        <div className="relative w-full aspect-square rounded-[32px] overflow-hidden shadow-2xl border border-[#2a243a] group">
          <img
            src={
              currentSong?.albumArt ||
              'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80'
            }
            alt={currentSong?.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />

          {/* Top Right: Route Tag */}
          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs font-bold text-white flex items-center gap-1.5 shadow-lg">
            <span>🚌</span>
            <span>{currentSong?.route || 'Route 44B'}</span>
          </div>

          {/* Bottom Left: Hi-Res FLAC Tag */}
          <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs font-bold text-white flex items-center gap-1.5 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#f4a7bb]"></span>
            <span>{currentSong?.quality || 'FLAC 24-bit • 96kHz'}</span>
          </div>
        </div>

        {/* Track Title, Explicit Tag, Verified Artist */}
        <div className="flex items-center justify-between mt-1">
          <div className="min-w-0 pr-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2 truncate">
              <span>{currentSong ? currentSong.title : 'Save Your Tears'}</span>
              {currentSong?.explicit && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
                  E
                </span>
              )}
            </h2>
            <p className="text-sm sm:text-base font-semibold text-neutral-300 flex items-center gap-1.5 mt-1">
              <span>{currentSong ? currentSong.artist : 'The Weeknd'}</span>
              <CheckCircle2 className="w-4 h-4 text-[#f4a7bb] fill-current" />
            </p>
          </div>

          <button
            type="button"
            className="w-10 h-10 rounded-full bg-[#201c2b] border border-[#332d44] flex items-center justify-center text-neutral-300 hover:text-white shrink-0"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>

        {/* Scrubber / Progress Bar */}
        <div className="flex flex-col gap-1.5 mt-2">
          {/* Custom Interactive Track Slider */}
          <div className="relative flex items-center group cursor-pointer py-1">
            <div className="w-full h-1.5 bg-[#2a243a] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#f4a7bb] rounded-full relative"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Draggable Circle Knob */}
            <div
              className="absolute w-4 h-4 rounded-full bg-[#f4a7bb] shadow-md border-2 border-white pointer-events-none -ml-2 group-hover:scale-125 transition-transform"
              style={{ left: `${progressPercent}%` }}
            />

            <input
              type="range"
              min="0"
              max={duration || 0}
              step="0.1"
              value={currentTime || 0}
              onChange={(e) => onSeek(parseFloat(e.target.value))}
              className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
              aria-label="Seek track"
            />
          </div>

          {/* Time Labels + Synced Bus Feed Indicator */}
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-400 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span className="text-[10px] tracking-wider text-neutral-400 font-sans font-bold flex items-center gap-1">
              <span>⇄</span> SYNCED BUS FEED
            </span>
            <span>-{formatTime(remainingTime)}</span>
          </div>
        </div>

        {/* Transport Playback Controls */}
        <div className="flex items-center justify-between px-2 mt-2">
          <button
            onClick={() => setIsShuffle(!isShuffle)}
            type="button"
            className={`p-2 transition ${isShuffle ? 'text-[#f4a7bb]' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            <Shuffle className="w-5 h-5" />
          </button>

          <button
            onClick={onPrevious}
            type="button"
            className="w-12 h-12 rounded-full bg-[#1e1b29] border border-[#302b40] text-neutral-200 hover:text-white active:scale-95 flex items-center justify-center transition shadow-md"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>

          {/* Large Pink Play/Pause Button */}
          <button
            onClick={onTogglePlay}
            type="button"
            className="w-20 h-20 rounded-full bg-[#f4a7bb] hover:bg-[#f294ab] text-[#131118] active:scale-90 flex items-center justify-center transition shadow-2xl shadow-[#f4a7bb]/30"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 fill-current" />
            ) : (
              <Play className="w-8 h-8 fill-current ml-1" />
            )}
          </button>

          <button
            onClick={onNext}
            type="button"
            className="w-12 h-12 rounded-full bg-[#1e1b29] border border-[#302b40] text-neutral-200 hover:text-white active:scale-95 flex items-center justify-center transition shadow-md"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>

          <button
            onClick={() => setIsRepeat(!isRepeat)}
            type="button"
            className={`p-2 transition ${isRepeat ? 'text-[#f4a7bb]' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            <Repeat className="w-5 h-5" />
          </button>
        </div>

        {/* Action Pills Row: Lyrics / Synced Buddies / Queue */}
        <div className="grid grid-cols-12 gap-2 mt-3 items-center">
          <button
            onClick={() => setShowLyrics(!showLyrics)}
            type="button"
            className={`col-span-3 py-2 px-3 rounded-full text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
              showLyrics
                ? 'bg-[#f4a7bb] text-[#131118] border-[#f4a7bb]'
                : 'bg-[#1b1825] border-[#2e283d] text-neutral-300 hover:bg-[#252033]'
            }`}
          >
            <span>🔤</span>
            <span>Lyrics</span>
          </button>

          {/* Center Synced Pill */}
          <div className="col-span-6 py-1.5 px-3 rounded-full bg-[#201929] border border-[#a855f7]/30 text-xs font-semibold text-neutral-200 flex items-center justify-center gap-2 shadow-sm">
            <div className="flex -space-x-2">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80"
                alt="Arun"
                className="w-5 h-5 rounded-full object-cover border border-[#0d0c11]"
              />
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80"
                alt="Bharath"
                className="w-5 h-5 rounded-full object-cover border border-[#0d0c11]"
              />
            </div>
            <span className="truncate text-[11px]">Arun • &lt;12ms SYNCED</span>
            <Radio className="w-3.5 h-3.5 text-[#c084fc] shrink-0" />
          </div>

          <button
            onClick={() => {
              document.getElementById('bus-queue-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            type="button"
            className="col-span-3 py-2 px-3 rounded-full text-xs font-bold bg-[#1b1825] border border-[#2e283d] text-neutral-300 hover:bg-[#252033] transition flex items-center justify-center gap-1.5"
          >
            <ListMusic className="w-3.5 h-3.5" />
            <span>Queue</span>
          </button>
        </div>

        {/* Interactive Lyrics Drawer if toggled */}
        {showLyrics && (
          <div className="w-full rounded-2xl bg-[#1d1929] border border-[#3b3252] p-4 text-center text-sm font-medium text-neutral-200 leading-relaxed shadow-lg">
            <p className="text-xs text-[#f4a7bb] font-bold mb-2">LIVE SYNCED LYRICS</p>
            <p className="text-neutral-400">"I saw you dancing in a crowded room"</p>
            <p className="text-white font-bold my-1 text-base">"You look so happy when I'm not with you"</p>
            <p className="text-neutral-400">"But then you saw me, caught you by surprise..."</p>
          </div>
        )}

        {/* UP NEXT ON ROUTE 44B */}
        <div id="bus-queue-section" className="flex flex-col gap-3 mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-extrabold tracking-wider text-neutral-300 uppercase">
                UP NEXT ON {currentSong?.route?.toUpperCase() || 'ROUTE 44B'}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400">
                8 in bus queue
              </span>
            </div>
            <button type="button" className="text-xs font-bold text-[#f4a7bb] hover:underline">
              Reorder
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {upNextTracks.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectSong(item.songIndex)}
                className="p-3 rounded-2xl bg-[#171420] border border-[#262133] hover:border-[#38314a] transition flex items-center justify-between gap-3 cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img src={item.art} alt={item.title} className="w-10 h-10 rounded-xl object-cover" />
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">{item.title}</h4>
                    <p className="text-xs text-neutral-400 truncate mt-0.5">
                      {item.artist} • Added by {item.addedBy}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-mono text-neutral-400">{item.duration}</span>
                  <GripVertical className="w-4 h-4 text-neutral-600" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom UltraSync Mesh Stats */}
        <div className="w-full mt-3 p-3 rounded-2xl bg-[#14121c] border border-[#241f30] text-center text-xs text-neutral-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-[#f4a7bb]" />
            <span>BusBuds UltraSync Mesh • {connectedPassengersCount + 1} devices</span>
          </div>
          <span className="font-mono text-emerald-400 font-semibold">0 packet drops</span>
        </div>
      </div>
    </div>
  );
}
