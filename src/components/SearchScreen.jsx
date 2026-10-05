import React, { useState } from 'react';
import { Search, X, Clock, Play } from 'lucide-react';

export default function SearchScreen({ songs, onSelectSong }) {
  const [query, setQuery] = useState('');

  const recentSearches = ['The Weeknd', 'Route 44B Express', 'Midnight City', 'Lo-Fi Chill Hop'];

  const results = songs.filter(
    (s) =>
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      s.artist.toLowerCase().includes(query.toLowerCase()) ||
      (s.route && s.route.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="w-full flex flex-col gap-5 px-4 pt-2 pb-28">
      {/* Search Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Search</h2>
        <p className="text-xs text-neutral-400 font-medium mt-0.5">Find tracks, transit routes &amp; riders</p>
      </div>

      {/* Search Input Bar */}
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Songs, artists, transit lines..."
          className="w-full bg-[#1b1725] border border-[#2e273d] focus:border-[#f4a7bb] rounded-full pl-11 pr-10 py-3 text-sm text-white placeholder-neutral-500 outline-none transition shadow-inner"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* If Query Empty: Show Recent Searches */}
      {!query ? (
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Recent Searches
          </h3>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((term) => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className="px-4 py-2 rounded-full bg-[#1e1b27] border border-[#2d283b] text-xs font-semibold text-neutral-300 hover:text-white hover:border-[#f4a7bb]/40 transition flex items-center gap-2"
              >
                <Clock className="w-3.5 h-3.5 text-neutral-500" />
                <span>{term}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Results */
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Results ({results.length})
          </h3>
          {results.length === 0 ? (
            <div className="text-center py-8 text-neutral-500 text-xs">
              No matching tracks found.
            </div>
          ) : (
            results.map((s) => {
              const originalIdx = songs.findIndex((t) => t.id === s.id);
              return (
                <div
                  key={s.id}
                  onClick={() => onSelectSong(originalIdx)}
                  className="p-3 rounded-2xl bg-[#1a1725] hover:bg-[#252033] border border-[#2b253b] flex items-center justify-between gap-3 cursor-pointer transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={s.albumArt} alt={s.title} className="w-10 h-10 rounded-xl object-cover" />
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{s.title}</h4>
                      <p className="text-xs text-neutral-400 truncate">
                        {s.artist} • {s.route || 'Transit Audio'}
                      </p>
                    </div>
                  </div>
                  <button className="w-8 h-8 rounded-full bg-[#f4a7bb]/20 text-[#f4a7bb] flex items-center justify-center shrink-0">
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
