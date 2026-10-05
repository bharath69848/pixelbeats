import React, { useState } from 'react';
import { PixelSunsetArtwork } from './PixelArtwork.jsx';
import {
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  Volume2,
  VolumeX,
  Heart,
  ChevronDown,
  Users,
  Radio
} from 'lucide-react';

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default function NowPlayingView({
  song,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isShuffle,
  isRepeat,
  onTogglePlay,
  onPrev,
  onNext,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleShuffle,
  onToggleRepeat,
  onOpenRooms,
  onOpenLibrary,
  syncNotice
}) {
  const [isLiked, setIsLiked] = useState(false);

  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div className="w-full flex-1 flex flex-col justify-between px-5 pt-3 pb-24 select-none font-pixel min-h-screen sm:min-h-0">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 pt-1">
        <button
          onClick={onOpenLibrary}
          type="button"
          className="p-1.5 hover:opacity-70 transition active:scale-95 text-black"
          title="Back to Library"
        >
          <ChevronDown className="w-6 h-6 stroke-[2.5]" />
        </button>

        <h1 className="text-xl sm:text-2xl font-bold tracking-wider text-black">
          PIXELBEATS
        </h1>

        <button
          onClick={onOpenRooms}
          type="button"
          className="p-1.5 hover:opacity-70 transition active:scale-95 text-black"
          title="Rooms"
        >
          <Users className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* Sync Notification Banner */}
      {syncNotice && (
        <div className="my-1.5 px-3 py-1.5 bg-black text-white text-xs rounded-xl text-center font-bold tracking-wider flex items-center justify-center gap-1.5 animate-pulse shadow-sm">
          <Radio className="w-3.5 h-3.5" />
          <span>{syncNotice}</span>
        </div>
      )}

      {/* Hero Pixel Album Artwork */}
      <div className="my-auto py-2 w-full flex justify-center">
        <div className="w-full max-w-[320px] aspect-square">
          <PixelSunsetArtwork isPlaying={isPlaying} />
        </div>
      </div>

      {/* Track Title, Artist & Like Button */}
      <div className="flex items-center justify-between px-1 my-3">
        <div className="min-w-0 pr-3">
          <h2 className="text-xl sm:text-2xl font-bold text-black tracking-tight truncate">
            {song?.title || 'Sunset Drives'}
          </h2>
          <p className="text-sm text-neutral-600 font-semibold truncate mt-0.5">
            {song?.artist || 'Lofi Beats'}
          </p>
        </div>

        <button
          onClick={() => setIsLiked(!isLiked)}
          type="button"
          className="p-2 hover:scale-110 active:scale-90 transition shrink-0"
          title="Like song"
        >
          <Heart
            className={`w-6 h-6 ${
              isLiked ? 'fill-black text-black' : 'text-black stroke-[2.5]'
            }`}
          />
        </button>
      </div>

      {/* Scrubber Progress Slider */}
      <div className="flex flex-col gap-1.5 px-1 my-2">
        <div className="relative flex items-center group py-2">
          {/* Track Line */}
          <div className="w-full h-1 bg-neutral-300 rounded-full overflow-hidden">
            <div
              className="h-full bg-black rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Thumb circle */}
          <div
            className="absolute w-4 h-4 bg-black rounded-full pointer-events-none -ml-2 shadow-sm"
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

        {/* Time stamps */}
        <div className="flex items-center justify-between text-xs font-bold text-neutral-600 font-mono-clean">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Main Playback Controls: Shuffle, Prev, Play/Pause, Next, Repeat */}
      <div className="flex items-center justify-between px-3 my-3">
        {/* Shuffle Button */}
        <button
          onClick={onToggleShuffle}
          type="button"
          className={`p-2 transition relative flex flex-col items-center justify-center ${
            isShuffle ? 'text-black scale-110 font-bold' : 'text-neutral-400 hover:text-black'
          }`}
          title={isShuffle ? 'Shuffle is ON' : 'Shuffle is OFF'}
        >
          <Shuffle className="w-5 h-5 stroke-[2.5]" />
          {isShuffle && (
            <span className="w-1.5 h-1.5 rounded-full bg-black absolute -bottom-1"></span>
          )}
        </button>

        <button
          onClick={onPrev}
          type="button"
          className="p-2 text-black hover:scale-110 active:scale-90 transition"
          title="Previous Track"
        >
          <SkipBack className="w-7 h-7 fill-black stroke-[1]" />
        </button>

        {/* Big Black Circle Play / Pause Button */}
        <button
          onClick={onTogglePlay}
          type="button"
          className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center hover:scale-105 active:scale-95 transition shadow-md"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-7 h-7 fill-white stroke-[0]" />
          ) : (
            <Play className="w-7 h-7 fill-white stroke-[0] ml-1" />
          )}
        </button>

        <button
          onClick={onNext}
          type="button"
          className="p-2 text-black hover:scale-110 active:scale-90 transition"
          title="Next Track"
        >
          <SkipForward className="w-7 h-7 fill-black stroke-[1]" />
        </button>

        {/* Repeat Button */}
        <button
          onClick={onToggleRepeat}
          type="button"
          className={`p-2 transition relative flex flex-col items-center justify-center ${
            isRepeat ? 'text-black scale-110 font-bold' : 'text-neutral-400 hover:text-black'
          }`}
          title={isRepeat ? 'Repeat is ON' : 'Repeat is OFF'}
        >
          <Repeat className="w-5 h-5 stroke-[2.5]" />
          {isRepeat && (
            <span className="w-1.5 h-1.5 rounded-full bg-black absolute -bottom-1"></span>
          )}
        </button>
      </div>

      {/* Sound / Volume Bar */}
      <div className="flex items-center gap-3 px-1 mt-2 mb-1">
        <span className="text-black text-sm font-bold font-mono-clean">♫</span>

        {/* Volume Slider Line */}
        <div className="relative flex-1 flex items-center py-2">
          <div className="w-full h-1 bg-neutral-300 rounded-full overflow-hidden">
            <div
              className="h-full bg-black rounded-full"
              style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
            />
          </div>

          <div
            className="absolute w-3.5 h-3.5 bg-black rounded-full pointer-events-none -ml-1.5 shadow-sm"
            style={{ left: `${(isMuted ? 0 : volume) * 100}%` }}
          />

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
            aria-label="Volume"
          />
        </div>

        {/* Speaker Volume Button */}
        <button
          onClick={onToggleMute}
          type="button"
          className="p-1.5 text-black hover:scale-110 transition"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="w-4 h-4 stroke-[2.5]" />
          ) : (
            <Volume2 className="w-4 h-4 stroke-[2.5]" />
          )}
        </button>
      </div>
    </div>
  );
}
