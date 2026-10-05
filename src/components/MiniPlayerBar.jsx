import React, { useState } from 'react';
import { Play, Pause, Heart, Radio } from 'lucide-react';

export default function MiniPlayerBar({
  currentSong,
  isPlaying,
  onTogglePlay,
  onOpenDetail,
}) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="fixed bottom-16 left-0 right-0 z-40 px-3 pb-1 max-w-xl mx-auto">
      <div
        onClick={onOpenDetail}
        className="w-full bg-[#1b1822]/95 backdrop-blur-xl border border-[#2d283b] rounded-2xl p-2.5 px-3.5 flex items-center justify-between shadow-2xl cursor-pointer hover:border-[#3e3852] transition group"
      >
        {/* Left: Wave/Art */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-[#282333] border border-[#3f3850] overflow-hidden flex items-center justify-center shrink-0 relative group-hover:scale-105 transition-transform">
            {currentSong?.albumArt ? (
              <img
                src={currentSong.albumArt}
                alt={currentSong.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <Radio className="w-5 h-5 text-[#f0a6b8]" />
            )}
            {isPlaying && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center gap-0.5">
                <span className="w-0.5 h-3 bg-[#f0a6b8] animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-0.5 h-4 bg-[#f0a6b8] animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-0.5 h-2.5 bg-[#f0a6b8] animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            )}
          </div>

          {/* Title and Route Info */}
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-white truncate leading-tight group-hover:text-[#f0a6b8] transition-colors">
              {currentSong ? currentSong.title : 'Commute Stream #04'}
            </h4>
            <p className="text-[11px] text-neutral-400 truncate mt-0.5">
              {currentSong ? `${currentSong.artist} • ${currentSong.route || 'Route 38 Express'}` : 'Shared route • Route 38 Express'}
            </p>
          </div>
        </div>

        {/* Right Actions: Heart + Round Play/Pause */}
        <div className="flex items-center gap-2 shrink-0 ml-3" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setIsLiked(!isLiked)}
            className="p-2 text-neutral-400 hover:text-[#f0a6b8] transition"
            aria-label="Like"
          >
            <Heart
              className={`w-4 h-4 ${
                isLiked ? 'fill-[#f0a6b8] text-[#f0a6b8]' : 'text-neutral-400'
              }`}
            />
          </button>

          <button
            type="button"
            onClick={onTogglePlay}
            className="w-10 h-10 rounded-full bg-[#f4a7bb] hover:bg-[#f294ab] active:scale-95 text-[#1b1822] flex items-center justify-center shadow-lg shadow-[#f4a7bb]/25 transition"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
