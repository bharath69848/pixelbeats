import React from 'react';

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default function ProgressBar({ currentTime, duration, isPlaying, onSeek }) {
  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  function handleSliderChange(e) {
    const newTime = parseFloat(e.target.value);
    onSeek(newTime);
  }

  // Generate buffer block indicators based on progress
  const totalBlocks = 14;
  const filledBlocks = Math.min(totalBlocks, Math.floor((progressPercent / 100) * totalBlocks) + 4);
  const bufferString = '█'.repeat(Math.min(totalBlocks, filledBlocks)) + '░'.repeat(Math.max(0, totalBlocks - filledBlocks));

  return (
    <div className="w-full flex flex-col gap-2 font-mono select-none">
      {/* Time and Play Status Labels */}
      <div className="flex items-center justify-between text-xs sm:text-sm font-bold tracking-wider text-black">
        <span>{formatTime(currentTime)}</span>
        <span className="tracking-widest">
          {isPlaying ? '[ PLAYING ]' : '[ PAUSED ]'}
        </span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Retro Dithered Progress Bar with Scrubber */}
      <div className="relative flex items-center group cursor-pointer py-1">
        {/* Progress Container Box */}
        <div className="w-full h-5 border-2 border-black bg-white relative overflow-hidden flex">
          {/* Played Portion: Fine Checkered Dither Pattern */}
          <div
            className="h-full bg-black relative"
            style={{
              width: `${progressPercent}%`,
              backgroundImage: 'radial-gradient(#fff 1.2px, transparent 1.2px)',
              backgroundSize: '3.5px 3.5px'
            }}
          />
          {/* Remaining Portion */}
          <div className="flex-1 bg-white" />
        </div>

        {/* Vertical Scrubber Block Indicator */}
        <div
          className="absolute h-7 w-2 bg-black border border-white pointer-events-none transition-all shadow-[1px_1px_0px_#000]"
          style={{ left: `calc(${progressPercent}% - 4px)` }}
        />

        {/* Hidden Range Input for smooth touch and mouse seeking */}
        <input
          type="range"
          min="0"
          max={duration || 0}
          step="0.1"
          value={currentTime || 0}
          onChange={handleSliderChange}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
          aria-label="Seek tape position"
        />
      </div>

      {/* Sub-Metric Buffer and Bitrate info */}
      <div className="flex items-center justify-between text-[11px] font-mono text-black font-semibold pt-0.5">
        <span>BUFF: [{bufferString}]</span>
        <span>192 KBPS TAPE</span>
      </div>
    </div>
  );
}
