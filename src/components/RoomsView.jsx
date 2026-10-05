import React, { useState } from 'react';
import { PixelRoomsBanner } from './PixelArtwork.jsx';
import socket from '../socket.js';
import { User, Hash, Plus, Copy, Check, LogOut, Radio } from 'lucide-react';

export default function RoomsView({
  currentRoom,
  roomUsers,
  username,
  setUsername,
  errorMessage,
  setErrorMessage,
  statusNotice,
  onCreateRoom,
  onJoinRoom,
  onLeaveRoom
}) {
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [copied, setCopied] = useState(false);

  function handleJoinSubmit(e) {
    e?.preventDefault();
    if (!username.trim()) {
      setErrorMessage('Please enter your name first');
      return;
    }
    if (!roomCodeInput.trim()) {
      setErrorMessage('Please enter a room code');
      return;
    }
    onJoinRoom(roomCodeInput.trim().toUpperCase(), username.trim());
  }

  function handleCreateClick() {
    if (!username.trim()) {
      setErrorMessage('Please enter your name first');
      return;
    }
    onCreateRoom(username.trim());
  }

  function handleCopyCode() {
    if (!currentRoom) return;
    navigator.clipboard.writeText(currentRoom);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const otherUser = roomUsers.find((u) => u.id !== socket.id);
  const currentUser = roomUsers.find((u) => u.id === socket.id) || { name: username || 'You' };

  return (
    <div className="w-full flex-1 flex flex-col px-5 pt-3 pb-28 select-none font-pixel min-h-screen">
      {/* Top Header without settings icon */}
      <div className="flex items-center justify-between pb-3 pt-1">
        <div className="w-6"></div> {/* Spacer for symmetry */}

        <h1 className="text-xl sm:text-2xl font-bold tracking-wider text-black text-center">
          PIXELBEATS
        </h1>

        <div className="w-6"></div> {/* Spacer for symmetry without settings button */}
      </div>

      {/* Hero Banner: Listen Together Better */}
      <div className="mb-5">
        <PixelRoomsBanner />
      </div>

      {/* Error or Notice Alert */}
      {errorMessage && (
        <div className="mb-3 px-3.5 py-2.5 bg-neutral-900 text-white text-xs rounded-xl font-bold flex items-center justify-between shadow-sm">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage('')} className="underline text-[10px] ml-2">
            DISMISS
          </button>
        </div>
      )}

      {statusNotice && !errorMessage && (
        <div className="mb-3 px-3.5 py-2 bg-neutral-200 text-black text-xs rounded-xl font-bold text-center">
          {statusNotice}
        </div>
      )}

      {currentRoom ? (
        /* STATE A: CURRENTLY IN A ROOM */
        <div className="space-y-4 mb-5">
          <div className="border border-neutral-300 rounded-2xl p-4 bg-white shadow-sm">
            <div className="flex items-center justify-between pb-2.5 border-b border-neutral-200">
              <span className="text-xs font-bold text-neutral-500 uppercase">ROOM CODE</span>
              <span
                className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5 ${
                  otherUser ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}
              >
                <Radio className="w-3 h-3" />
                {otherUser ? 'Connected (2/2)' : 'Waiting for friend (1/2)'}
              </span>
            </div>

            <div className="flex items-center justify-between pt-3">
              <span className="text-2xl font-bold tracking-widest text-black">
                #{currentRoom}
              </span>
              <button
                onClick={handleCopyCode}
                type="button"
                className="px-4 py-1.5 border border-black rounded-xl text-xs font-bold bg-[#f6f0e2] hover:bg-neutral-200 active:scale-95 transition flex items-center gap-1.5"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>COPY</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Connected Passengers */}
          <div className="border border-neutral-300 rounded-2xl p-4 bg-white shadow-sm">
            <span className="text-xs font-bold text-neutral-500 uppercase block mb-2.5">
              PASSENGERS
            </span>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm font-bold p-2 bg-[#f6f0e2] rounded-xl">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-black"></span>
                  {currentUser.name || 'You'} (You)
                </span>
                <span className="text-[10px] text-neutral-600 bg-white px-2 py-0.5 rounded-md border border-neutral-300">
                  HOST
                </span>
              </div>

              {otherUser ? (
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold p-2 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-300">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    {otherUser.name}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold">
                    SYNCED
                  </span>
                </div>
              ) : (
                <div className="text-xs text-neutral-400 p-2.5 border border-dashed border-neutral-300 rounded-xl text-center animate-pulse">
                  Waiting for your friend to join with code #{currentRoom}...
                </div>
              )}
            </div>
          </div>

          {/* Leave Room Button */}
          <button
            onClick={onLeaveRoom}
            type="button"
            className="w-full py-3 border border-black rounded-xl text-xs sm:text-sm font-bold text-black hover:bg-neutral-200 active:scale-[0.99] transition shadow-sm flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Leave Room
          </button>
        </div>
      ) : (
        /* STATE B: NOT IN A ROOM (Name + Join + Create) */
        <div className="space-y-4 mb-5">
          {/* Your Name Input Field */}
          <div className="space-y-2">
            <h2 className="text-base font-bold text-black">
              Your Name
            </h2>
            <div className="relative flex items-center">
              <User className="w-4 h-4 text-neutral-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Enter your name..."
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                maxLength={16}
                className="w-full pl-10 pr-3.5 py-3 bg-white border border-neutral-300 focus:border-black rounded-xl text-sm font-pixel outline-none shadow-sm placeholder:text-neutral-400"
              />
            </div>
          </div>

          {/* Join a Room Section */}
          <div className="space-y-2">
            <h2 className="text-base font-bold text-black">
              Join a Room
            </h2>

            <form onSubmit={handleJoinSubmit} className="space-y-2.5">
              <div className="relative flex items-center">
                <Hash className="w-4 h-4 text-neutral-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Enter room code..."
                  value={roomCodeInput}
                  onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                  maxLength={6}
                  className="w-full pl-10 pr-3.5 py-3 bg-white border border-neutral-300 focus:border-black rounded-xl text-sm font-pixel outline-none shadow-sm placeholder:text-neutral-400 uppercase"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-black text-white rounded-xl text-sm font-bold hover:bg-neutral-800 transition active:scale-[0.99] shadow-sm"
              >
                Join Room
              </button>
            </form>
          </div>

          {/* Divider: ── or ── */}
          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-neutral-300"></div>
            <span className="text-xs text-neutral-500 font-semibold">or</span>
            <div className="flex-1 h-px bg-neutral-300"></div>
          </div>

          {/* Create a Room Section */}
          <div className="space-y-2">
            <h2 className="text-base font-bold text-black">
              Create a Room
            </h2>

            <button
              onClick={handleCreateClick}
              type="button"
              className="w-full py-3 bg-white hover:bg-neutral-100 border border-neutral-300 active:border-black rounded-xl text-sm font-bold text-black transition flex items-center justify-center gap-2 shadow-sm active:scale-[0.99]"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create New Room</span>
            </button>
          </div>
        </div>
      )}

      {/* Info Card at Bottom */}
      <div className="mt-auto border border-neutral-300 rounded-2xl p-3.5 bg-white/60 flex items-center gap-3">
        <span className="text-base select-none text-black">♫</span>

        <p className="text-xs leading-tight text-neutral-600 font-medium flex-1">
          Create a room, invite your friends and listen together in real time!
        </p>

        <div className="w-8 h-8 shrink-0 flex items-center justify-center select-none text-xl">
          📻
        </div>
      </div>
    </div>
  );
}
