import React, { useState, useEffect } from 'react';
import socket from '../socket.js';
import { Copy, Check } from 'lucide-react';

export default function RoomPanel() {
  const [username, setUsername] = useState('BHARATH');
  const [joinCode, setJoinCode] = useState('');
  const [currentRoom, setCurrentRoom] = useState(null);
  const [roomUsers, setRoomUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [statusNotice, setStatusNotice] = useState('');

  useEffect(() => {
    function onRoomCreated(data) {
      setCurrentRoom(data.roomCode);
      setRoomUsers(data.users || []);
      setErrorMessage('');
      setStatusNotice(`CABIN ${data.roomCode} INITIALIZED`);
    }

    function onRoomJoined(data) {
      setCurrentRoom(data.roomCode);
      setRoomUsers(data.users || []);
      setErrorMessage('');
      setStatusNotice(`BOARDED CABIN ${data.roomCode}`);
    }

    function onRoomUsers(data) {
      if (data.roomCode) {
        setCurrentRoom(data.roomCode);
        setRoomUsers(data.users || []);
      } else {
        setCurrentRoom(null);
        setRoomUsers([]);
      }
    }

    function onRoomError(data) {
      setErrorMessage(data.message || 'CABIN SYNC ERROR');
    }

    function onUserLeft(data) {
      setStatusNotice(data.message?.toUpperCase() || 'PASSENGER DEPARTED CABIN');
      if (data.users) {
        setRoomUsers(data.users);
      }
    }

    socket.on('room-created', onRoomCreated);
    socket.on('room-joined', onRoomJoined);
    socket.on('room-users', onRoomUsers);
    socket.on('room-error', onRoomError);
    socket.on('user-left', onUserLeft);

    return () => {
      socket.off('room-created', onRoomCreated);
      socket.off('room-joined', onRoomJoined);
      socket.off('room-users', onRoomUsers);
      socket.off('room-error', onRoomError);
      socket.off('user-left', onUserLeft);
    };
  }, []);

  function handleCreateRoom(e) {
    e?.preventDefault();
    setErrorMessage('');
    socket.emit('create-room', {
      username: username.trim().toUpperCase() || 'BHARATH',
    });
  }

  function handleJoinRoom(e) {
    e?.preventDefault();
    setErrorMessage('');
    if (!joinCode.trim()) {
      setErrorMessage('ENTER 6-CHARACTER CABIN CODE');
      return;
    }
    socket.emit('join-room', {
      roomCode: joinCode.trim().toUpperCase(),
      username: username.trim().toUpperCase() || 'FRIEND',
    });
  }

  function handleLeaveRoom() {
    socket.emit('leave-room');
    setCurrentRoom(null);
    setRoomUsers([]);
    setStatusNotice('EXITED BUS CABIN');
    setErrorMessage('');
  }

  function handleCopyCode() {
    if (!currentRoom) return;
    navigator.clipboard.writeText(currentRoom);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const otherUser = roomUsers.find((u) => u.id !== socket.id);
  const currentUser = roomUsers.find((u) => u.id === socket.id) || { name: username };
  const isConnected = !!otherUser;

  return (
    <div className="w-full border-4 border-black bg-white shadow-[6px_6px_0px_#000] font-mono text-black select-none">
      {/* Header Bar */}
      <div className="bg-black text-white px-3 py-2 flex items-center justify-between text-xs sm:text-sm font-bold tracking-wider">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-white inline-block"></span>
          <span>BUS CABIN SYNC</span>
        </div>

        <div className="flex items-center gap-2 tracking-widest text-[11px] sm:text-xs">
          {currentRoom ? (
            isConnected ? (
              <span className="flex items-center gap-1.5 text-white">
                <span className="w-2 h-2 rounded-full bg-white inline-block"></span>
                ● CONNECTED
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-neutral-300">
                <span className="w-2 h-2 rounded-full border border-white inline-block animate-ping"></span>
                ○ WAITING FOR FRIEND
              </span>
            )
          ) : (
            <span className="text-neutral-400">○ STANDALONE DECK</span>
          )}
        </div>
      </div>

      {/* Error or Notice Alert */}
      {errorMessage && (
        <div className="bg-black text-white border-b-2 border-black p-2 text-xs font-bold tracking-wider flex items-center justify-between">
          <span>[ ! ] {errorMessage}</span>
          <button
            onClick={() => setErrorMessage('')}
            className="underline hover:text-neutral-300 ml-2"
          >
            DISMISS
          </button>
        </div>
      )}

      {statusNotice && !errorMessage && (
        <div className="bg-neutral-100 border-b-2 border-black p-2 text-xs font-semibold tracking-wider text-center">
          * {statusNotice} *
        </div>
      )}

      {/* Body Content */}
      <div className="p-4 sm:p-5 flex flex-col gap-4">
        {currentRoom ? (
          /* STATE 1: ACTIVE IN A ROOM */
          <>
            {/* Room Code Inset Box */}
            <div className="border-2 border-black bg-neutral-100 p-2 sm:p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold tracking-widest text-neutral-600">ROOM:</span>
                <span className="text-lg sm:text-xl font-black tracking-widest text-black">
                  {currentRoom}
                </span>
              </div>

              <button
                onClick={handleCopyCode}
                type="button"
                className="border-2 border-black bg-white hover:bg-neutral-200 active:translate-y-0.5 px-4 py-1 text-xs font-bold tracking-wider flex items-center gap-1 shadow-[2px_2px_0px_#000]"
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

            {/* Passenger Manifest */}
            <div className="border-2 border-black p-3 flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs font-bold tracking-wider text-neutral-800">
                <span>PASSENGERS ({roomUsers.length}/2)</span>
                <span className="tracking-widest">
                  {isConnected ? 'SYNC ACTIVE' : 'WAITING FOR 2ND SEAT'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {/* Host / You */}
                <div className="bg-black text-white px-2.5 py-1 text-xs font-bold flex items-center gap-2 shadow-[2px_2px_0px_#000]">
                  <span className="w-2 h-2 bg-white inline-block"></span>
                  <span>{currentUser.name} (HOST)</span>
                </div>

                {/* Friend */}
                {otherUser ? (
                  <div className="border-2 border-black bg-white px-2.5 py-1 text-xs font-bold flex items-center gap-2 shadow-[2px_2px_0px_#000]">
                    <span className="w-2 h-2 bg-black inline-block"></span>
                    <span>{otherUser.name} [SEAT 03]</span>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-black px-2.5 py-1 text-xs text-neutral-600 flex items-center gap-2 bg-neutral-50">
                    <span className="w-2 h-2 bg-black inline-block animate-pulse"></span>
                    <span>WAITING FOR COMMUTE BUDDY...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Leave Room Button */}
            <button
              onClick={handleLeaveRoom}
              type="button"
              className="w-full border-2 border-black bg-white hover:bg-neutral-100 active:translate-y-0.5 py-2.5 text-xs sm:text-sm font-bold tracking-widest text-center shadow-[3px_3px_0px_#000]"
            >
              [ LEAVE BUS CABIN ]
            </button>
          </>
        ) : (
          /* STATE 2: NOT IN A ROOM (Create or Join) */
          <div className="flex flex-col gap-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              {/* Name Input */}
              <div className="sm:col-span-6 flex flex-col gap-1">
                <label className="text-[11px] font-bold tracking-widest text-neutral-700 uppercase">
                  PASSENGER NAME:
                </label>
                <input
                  type="text"
                  maxLength={16}
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toUpperCase())}
                  placeholder="BHARATH"
                  className="border-2 border-black bg-white px-3 py-2 text-xs sm:text-sm font-bold tracking-wider outline-none focus:bg-neutral-100 shadow-[2px_2px_0px_#000]"
                />
              </div>

              {/* Create Cabin Button */}
              <div className="sm:col-span-6">
                <button
                  onClick={handleCreateRoom}
                  type="button"
                  className="w-full border-2 border-black bg-black text-white hover:bg-neutral-800 active:translate-y-0.5 py-2.5 text-xs sm:text-sm font-bold tracking-wider shadow-[3px_3px_0px_#000]"
                >
                  [ CREATE NEW CABIN ]
                </button>
              </div>
            </div>

            {/* Join Existing Cabin Row */}
            <form onSubmit={handleJoinRoom} className="border-t-2 border-black pt-3 flex flex-col gap-1">
              <label className="text-[11px] font-bold tracking-widest text-neutral-700 uppercase">
                OR BOARD FRIEND'S CABIN:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="6-LETTER CODE"
                  className="flex-1 border-2 border-black bg-white px-3 py-2 text-xs sm:text-sm font-bold tracking-widest uppercase outline-none focus:bg-neutral-100 shadow-[2px_2px_0px_#000]"
                />
                <button
                  type="submit"
                  className="border-2 border-black bg-white hover:bg-neutral-100 active:translate-y-0.5 px-5 py-2 text-xs sm:text-sm font-bold tracking-wider shrink-0 shadow-[2px_2px_0px_#000]"
                >
                  JOIN CABIN
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
