import React, { useState, useEffect } from 'react';
import socket from '../socket.js';
import {
  Copy,
  Check,
  UserPlus,
  Volume2,
  Lock,
  Headphones,
  Heart,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Plus,
  LogOut,
  Radio,
  Sparkles,
  Wifi
} from 'lucide-react';

export default function ListeningRoomScreen({
  currentSong,
  isPlaying,
  currentTime,
  duration,
  onSeek,
  onSelectSong,
}) {
  const [roomCode, setRoomCode] = useState('BUS-8921');
  const [isInRoom, setIsInRoom] = useState(true);
  const [passengers, setPassengers] = useState([
    {
      id: 'host1',
      name: 'Bharath',
      role: 'HOST DJ',
      device: 'Master output • Pixel Buds Pro 2',
      volume: '100%',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=80',
    },
    {
      id: 'user2',
      name: 'You',
      role: 'Listener',
      device: 'Synced delay: +1.2ms • Sony WH-1000XM5',
      badge: 'In-Ear',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&q=80',
    },
    {
      id: 'user3',
      name: 'Arun',
      role: 'Listener',
      device: 'Joined 18m ago • Transit seat 4B',
      buffer: 'Buffer 99%',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80',
    },
  ]);

  const [queue, setQueue] = useState([
    {
      id: 'q1',
      title: 'Nightcall (Drive Edit)',
      artist: 'Kavinsky',
      addedBy: 'Arun',
      duration: '04:19',
      votes: 4,
      art: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=160&q=80',
    },
    {
      id: 'q2',
      title: 'Sunset Lover',
      artist: 'Petit Biscuit',
      addedBy: 'You',
      duration: '03:57',
      votes: 2,
      art: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=160&q=80',
    },
    {
      id: 'q3',
      title: 'Resonance',
      artist: 'HOME',
      addedBy: 'Bharath',
      duration: '03:32',
      votes: 1,
      art: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=160&q=80',
    },
  ]);

  const [copied, setCopied] = useState(false);
  const [floatingReactions, setFloatingReactions] = useState([]);
  const [usernameInput, setUsernameInput] = useState('BHARATH');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [roomError, setRoomError] = useState('');
  const [showAddSong, setShowAddSong] = useState(false);
  const [customSongTitle, setCustomSongTitle] = useState('');

  // Socket.IO Listening Room Event Listeners
  useEffect(() => {
    function onRoomCreated(data) {
      setRoomCode(data.roomCode);
      setIsInRoom(true);
      if (data.users) {
        setPassengers(data.users);
      }
      setRoomError('');
    }

    function onRoomJoined(data) {
      setRoomCode(data.roomCode);
      setIsInRoom(true);
      if (data.users) {
        setPassengers(data.users);
      }
      if (data.queue) {
        setQueue(data.queue);
      }
      setRoomError('');
    }

    function onRoomUsers(data) {
      if (data.roomCode) {
        setRoomCode(data.roomCode);
        setIsInRoom(true);
        if (data.users) setPassengers(data.users);
      } else {
        setIsInRoom(false);
      }
    }

    function onQueueUpdated(data) {
      if (data.queue) setQueue(data.queue);
    }

    function onReactionReceived(data) {
      setFloatingReactions((prev) => [...prev, { id: data.id || Math.random().toString(), emoji: data.emoji }]);
      setTimeout(() => {
        setFloatingReactions((prev) => prev.filter((r) => r.id !== data.id));
      }, 2500);
    }

    function onRoomError(data) {
      setRoomError(data.message || 'Error occurred');
    }

    socket.on('room-created', onRoomCreated);
    socket.on('room-joined', onRoomJoined);
    socket.on('room-users', onRoomUsers);
    socket.on('queue-updated', onQueueUpdated);
    socket.on('reaction-received', onReactionReceived);
    socket.on('room-error', onRoomError);

    return () => {
      socket.off('room-created', onRoomCreated);
      socket.off('room-joined', onRoomJoined);
      socket.off('room-users', onRoomUsers);
      socket.off('queue-updated', onQueueUpdated);
      socket.off('reaction-received', onReactionReceived);
      socket.off('room-error', onRoomError);
    };
  }, []);

  function handleCopy() {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleSendReaction(emoji) {
    socket.emit('send-reaction', { emoji });
    // Local instant burst
    const reactionId = Math.random().toString();
    setFloatingReactions((prev) => [...prev, { id: reactionId, emoji }]);
    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== reactionId));
    }, 2500);
  }

  function handleUpvote(songId) {
    socket.emit('upvote-song', { songId });
    setQueue((prev) =>
      prev
        .map((q) => (q.id === songId ? { ...q, votes: q.votes + 1 } : q))
        .sort((a, b) => b.votes - a.votes)
    );
  }

  function handleCreateRoom() {
    socket.emit('create-room', { username: usernameInput });
  }

  function handleJoinRoom(e) {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;
    socket.emit('join-room', { roomCode: joinCodeInput.trim().toUpperCase(), username: usernameInput });
  }

  function handleLeaveRoom() {
    socket.emit('leave-room');
    setIsInRoom(false);
  }

  function handleAddSongToQueue(e) {
    e.preventDefault();
    if (!customSongTitle.trim()) return;
    const newSong = {
      id: `custom_${Date.now()}`,
      title: customSongTitle.trim(),
      artist: 'Requested by Rider',
      addedBy: 'You',
      duration: '03:45',
      votes: 1,
      art: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=160&q=80',
    };
    setQueue((prev) => [...prev, newSong]);
    setCustomSongTitle('');
    setShowAddSong(false);
  }

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full flex flex-col gap-6 px-4 pt-2 pb-28 relative">
      {/* Floating Reaction Emojis Overlay */}
      <div className="fixed top-24 right-8 z-50 pointer-events-none flex flex-col gap-2 items-end">
        {floatingReactions.map((r) => (
          <div
            key={r.id}
            className="text-3xl animate-bounce transition-all drop-shadow-lg"
          >
            {r.emoji}
          </div>
        ))}
      </div>

      {/* 1. Header with Synced Stats & Room Code */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Listening Room
          </h2>
          <p className="text-xs text-neutral-400 font-medium mt-0.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#f4a7bb] animate-ping"></span>
            <span>SYNCED • 24MS JITTER</span>
          </p>
        </div>

        {/* Room Code Badge */}
        <button
          onClick={handleCopy}
          type="button"
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#201b2a] border border-[#f4a7bb]/40 hover:bg-[#2b2438] transition active:scale-95 shadow-md shadow-[#f4a7bb]/10"
        >
          <span className="font-mono text-xs font-bold text-white tracking-wider">
            {roomCode}
          </span>
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-neutral-400" />
          )}
        </button>
      </div>

      {roomError && (
        <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300 flex items-center justify-between">
          <span>{roomError}</span>
          <button onClick={() => setRoomError('')} className="underline font-bold">Dismiss</button>
        </div>
      )}

      {/* 2. Synced Now Playing Card (Screen 4) */}
      <div className="w-full rounded-3xl bg-gradient-to-b from-[#2d1c2d] to-[#1a1726] border border-[#f4a7bb]/30 p-5 shadow-2xl flex flex-col gap-4">
        {/* Top Badges */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9333ea]/25 border border-[#c084fc]/40 text-[#f5d0fe] text-xs font-bold shadow-sm">
            <Radio className="w-3.5 h-3.5 text-[#f0abfc] animate-pulse" />
            <span>Bharath is Host DJ</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-semibold">
            <Lock className="w-3.5 h-3.5 text-neutral-400" />
            <span>Audio Clock Synced</span>
          </div>
        </div>

        {/* Track Details */}
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-lg border border-[#f4a7bb]/40 shrink-0">
            <img
              src={
                currentSong?.albumArt ||
                'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&q=80'
              }
              alt="Artwork"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <Headphones className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold tracking-widest text-[#f4a7bb] uppercase">
              STREAMING VIA BUSBUDS HI-FI
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white truncate mt-0.5">
              {currentSong ? currentSong.title : 'Midnight Transit Echoes'}
            </h3>
            <p className="text-xs text-neutral-300 truncate">
              {currentSong ? currentSong.artist : 'Kavinsky, Phoenix'} • Re-routed Drift
            </p>
            <p className="text-[11px] text-neutral-400 mt-0.5 flex items-center gap-1">
              <span>🚌</span>
              <span>Shared on Route 38 Express</span>
            </p>
          </div>
        </div>

        {/* Scrubber with Host Controlling Scrub Label */}
        <div className="flex flex-col gap-1.5 pt-1">
          <div className="relative flex items-center group cursor-pointer py-1">
            <div className="w-full h-1.5 bg-[#3c2a3f] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#d946ef] to-[#f4a7bb] rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Star scrubber thumb */}
            <div
              className="absolute text-sm -ml-2 pointer-events-none drop-shadow"
              style={{ left: `${progressPercent}%` }}
            >
              ⭐
            </div>

            <input
              type="range"
              min="0"
              max={duration || 0}
              step="0.1"
              value={currentTime || 0}
              onChange={(e) => onSeek(parseFloat(e.target.value))}
              className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
            />
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
            <span>{formatTime(currentTime)}</span>
            <span className="text-[10px] font-sans font-bold text-[#f4a7bb] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f4a7bb]"></span>
              Host controlling scrub
            </span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Bottom Badges */}
        <div className="flex items-center justify-between pt-1 border-t border-[#3d2940]">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1b1825] border border-[#3b324d] text-xs font-semibold text-neutral-300">
            <Headphones className="w-3.5 h-3.5 text-[#f4a7bb]" />
            <span>Dolby Atmos Synced</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSendReaction('🎵')}
              type="button"
              className="p-2 rounded-full text-neutral-400 hover:text-white transition hover:bg-white/5"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleSendReaction('❤️')}
              type="button"
              className="p-2 rounded-full text-[#f4a7bb] hover:scale-110 transition"
            >
              <Heart className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. In This Room (Passenger list) */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white tracking-tight">In This Room</h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#1f1b2b] text-neutral-400 border border-[#2d273d]">
              {passengers.length} Active
            </span>
          </div>

          <button
            onClick={handleCopy}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f4a7bb] hover:bg-[#f294ab] text-[#131118] text-xs font-bold shadow-md shadow-[#f4a7bb]/20 transition"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Invite Friend</span>
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {passengers.map((p, idx) => (
            <div
              key={p.id || idx}
              className="p-3 rounded-2xl bg-[#1a1725] border border-[#282337] flex items-center justify-between gap-3 shadow-sm"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative">
                  <img
                    src={
                      p.avatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80'
                    }
                    alt={p.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#f4a7bb]/30"
                  />
                  {p.role === 'HOST DJ' && (
                    <span className="absolute -top-1 -right-1 text-xs">👑</span>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white truncate">{p.name}</h4>
                    <span
                      className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full ${
                        p.role === 'HOST DJ'
                          ? 'bg-[#f4a7bb] text-[#131118]'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {p.role}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 truncate mt-0.5">{p.device}</p>
                </div>
              </div>

              <div className="shrink-0">
                {p.volume && (
                  <span className="text-xs font-bold text-neutral-300 flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5 text-[#f4a7bb]" />
                    {p.volume}
                  </span>
                )}
                {p.badge && (
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#2a243a] text-neutral-200 border border-[#3b3350]">
                    {p.badge}
                  </span>
                )}
                {p.buffer && (
                  <span className="text-[11px] font-bold text-neutral-400 flex items-center gap-1">
                    <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                    {p.buffer}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Shared Queue with Upvoting */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Shared Queue</h3>
            <p className="text-xs text-neutral-400">Upvote tracks to play next in sync</p>
          </div>

          <button
            onClick={() => setShowAddSong(!showAddSong)}
            type="button"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#2a243b] hover:bg-[#39314f] border border-[#3e3555] text-xs font-bold text-white transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Song</span>
          </button>
        </div>

        {/* Add Song Input Field if toggled */}
        {showAddSong && (
          <form onSubmit={handleAddSongToQueue} className="flex gap-2">
            <input
              type="text"
              value={customSongTitle}
              onChange={(e) => setCustomSongTitle(e.target.value)}
              placeholder="Song title & artist..."
              className="flex-1 bg-[#191624] border border-[#332b45] rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-[#f4a7bb]"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#f4a7bb] text-[#131118] font-bold text-xs shrink-0 shadow-md"
            >
              Add
            </button>
          </form>
        )}

        <div className="flex flex-col gap-2">
          {queue.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-2xl bg-[#1a1725] border border-[#282337] flex items-center justify-between gap-3 shadow-sm hover:border-[#38314e] transition"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-neutral-600 font-bold text-xs select-none">⋮⋮</span>
                <img src={item.art} alt={item.title} className="w-10 h-10 rounded-xl object-cover" />
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">{item.title}</h4>
                  <p className="text-xs text-neutral-400 truncate mt-0.5">
                    Added by {item.addedBy} • {item.duration}
                  </p>
                </div>
              </div>

              {/* Upvote & Downvote buttons */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleUpvote(item.id)}
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#272136] hover:bg-[#382f4d] border border-[#3a3250] text-xs font-bold text-white active:scale-95 transition"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-[#f4a7bb]" />
                  <span>{item.votes}</span>
                </button>
                <button
                  type="button"
                  className="p-1.5 text-neutral-500 hover:text-neutral-300"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Live Emoji Reactions Bar */}
      <div className="w-full p-3.5 rounded-3xl bg-[#1b1726] border border-[#2d273d] flex items-center justify-between gap-2 shadow-lg">
        <span className="text-xs font-bold text-neutral-300">React live:</span>
        <div className="flex items-center gap-2">
          {['🔥', '❤️', '🎵', '⚡'].map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleSendReaction(emoji)}
              type="button"
              className="w-9 h-9 rounded-full bg-[#282236] hover:bg-[#3a314f] active:scale-90 flex items-center justify-center text-lg transition shadow"
            >
              {emoji}
            </button>
          ))}

          <button
            onClick={() => handleSendReaction('👏')}
            type="button"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#282236] hover:bg-[#3a314f] text-xs font-bold text-white active:scale-90 transition border border-[#39304e]"
          >
            <span>👏</span>
            <span>Nod</span>
          </button>
        </div>
      </div>

      {/* 6. Leave Room / Re-join Container */}
      <div className="flex flex-col gap-3">
        {isInRoom ? (
          <button
            onClick={handleLeaveRoom}
            type="button"
            className="w-full py-3.5 rounded-2xl bg-[#181522] hover:bg-rose-950/40 border border-[#2b2438] hover:border-rose-800 text-xs font-bold text-neutral-300 hover:text-rose-300 flex items-center justify-center gap-2 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Leave Listening Room</span>
          </button>
        ) : (
          <div className="p-4 rounded-3xl bg-[#1b1726] border border-[#2d273d] flex flex-col gap-3">
            <h4 className="text-sm font-bold text-white">Join or Create Room</h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                placeholder="BUS-8921"
                className="flex-1 bg-[#15121f] border border-[#2f283f] rounded-xl px-3 py-2 text-xs text-white"
              />
              <button
                onClick={handleJoinRoom}
                type="button"
                className="px-4 py-2 rounded-xl bg-[#f4a7bb] text-[#131118] font-bold text-xs"
              >
                Join
              </button>
            </div>
            <button
              onClick={handleCreateRoom}
              type="button"
              className="py-2.5 rounded-xl bg-[#2b243a] text-white font-bold text-xs"
            >
              Create New Cabin
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
