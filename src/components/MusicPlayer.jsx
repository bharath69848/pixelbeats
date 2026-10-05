import React, { useState, useEffect, useRef } from 'react';
import ProgressBar from './ProgressBar.jsx';
import BusWindowGraphic from './BusWindowGraphic.jsx';
import socket from '../socket.js';
import { Volume2, VolumeX, AlertCircle } from 'lucide-react';

export default function MusicPlayer({
  songs,
  currentSongIndex,
  setCurrentSongIndex,
  isPlaying,
  setIsPlaying
}) {
  const audioRef = useRef(null);

  // Playback state
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [syncNotice, setSyncNotice] = useState('');

  const currentSong = songs[currentSongIndex] || songs[0];

  // Socket.IO Play/Pause Synchronization (Phase 2.2)
  useEffect(() => {
    function onRemotePlay(data) {
      if (typeof data.songIndex === 'number' && data.songIndex !== currentSongIndex) {
        setCurrentSongIndex(data.songIndex);
      }

      if (audioRef.current && typeof data.currentTime === 'number') {
        if (Math.abs(audioRef.current.currentTime - data.currentTime) > 0.5) {
          audioRef.current.currentTime = data.currentTime;
          setCurrentTime(data.currentTime);
        }
      }

      setIsPlaying(true);
      setSyncNotice(`${data.username || 'FRIEND'} TRIGGERED PLAY`);
      setTimeout(() => setSyncNotice(''), 3000);
    }

    function onRemotePause(data) {
      if (audioRef.current && typeof data.currentTime === 'number') {
        audioRef.current.currentTime = data.currentTime;
        setCurrentTime(data.currentTime);
      }

      setIsPlaying(false);
      setSyncNotice(`${data.username || 'FRIEND'} TRIGGERED PAUSE`);
      setTimeout(() => setSyncNotice(''), 3000);
    }

    socket.on('play', onRemotePlay);
    socket.on('pause', onRemotePause);

    return () => {
      socket.off('play', onRemotePlay);
      socket.off('pause', onRemotePause);
    };
  }, [currentSongIndex, setCurrentSongIndex, setIsPlaying]);

  // Sync song file change
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    setErrorMessage('');
    audio.src = currentSong.file;
    audio.load();

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Playback error:', err);
          setIsPlaying(false);
        });
      }
    }
  }, [currentSongIndex, currentSong]);

  // Sync play/pause with HTML audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Playback error:', err);
          setIsPlaying(false);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Sync volume & mute
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.muted = isMuted;
  }, [volume, isMuted]);

  // Play / Pause Toggle with Socket.IO broadcast
  function togglePlayPause() {
    if (errorMessage) setErrorMessage('');
    const nextState = !isPlaying;
    setIsPlaying(nextState);

    const pos = audioRef.current ? audioRef.current.currentTime : 0;
    if (nextState) {
      socket.emit('play', {
        songIndex: currentSongIndex,
        currentTime: pos,
      });
    } else {
      socket.emit('pause', {
        currentTime: pos,
      });
    }
  }

  // Previous Song
  function handlePrevious() {
    const nextIdx = currentSongIndex === 0 ? songs.length - 1 : currentSongIndex - 1;
    setCurrentSongIndex(nextIdx);
    setIsPlaying(true);
    socket.emit('play', {
      songIndex: nextIdx,
      currentTime: 0,
    });
  }

  // Next Song
  function handleNext() {
    const nextIdx = currentSongIndex === songs.length - 1 ? 0 : currentSongIndex + 1;
    setCurrentSongIndex(nextIdx);
    setIsPlaying(true);
    socket.emit('play', {
      songIndex: nextIdx,
      currentTime: 0,
    });
  }

  // Seek Handler
  function handleSeek(newTime) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  }

  // Volume Change
  function handleVolumeChange(e) {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (newVol > 0 && isMuted) {
      setIsMuted(false);
    }
  }

  function toggleMute() {
    setIsMuted(!isMuted);
  }

  function handleTimeUpdate() {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }

  function handleLoadedMetadata() {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  }

  function handleEnded() {
    handleNext();
  }

  function handleError() {
    setErrorMessage('ERROR: UNABLE TO LOAD COMMUTE TAPE');
    setIsPlaying(false);
  }

  const trackNumStr = (currentSongIndex + 1).toString().padStart(2, '0');
  const totalTracksStr = songs.length.toString().padStart(2, '0');

  return (
    <div className="w-full flex flex-col font-mono text-black">
      {/* Hidden Native Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={handleError}
      />

      {/* Retro Window Container: NOW-PLAYING.EXE */}
      <div className="w-full border-4 border-black bg-white shadow-[6px_6px_0px_#000] flex flex-col">
        {/* Title Bar */}
        <div className="border-b-2 border-black bg-white px-3 py-2 flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-black inline-block"></span>
            <span className="font-bold text-sm tracking-wider">NOW-PLAYING.EXE</span>
          </div>

          {/* Horizontal Scanlines in center */}
          <div className="hidden sm:flex flex-1 mx-4 flex-col gap-0.5 opacity-60">
            <div className="w-full h-0.5 bg-black"></div>
            <div className="w-full h-0.5 bg-black"></div>
            <div className="w-full h-0.5 bg-black"></div>
          </div>

          {/* Retro Window Control Buttons: [ - ] [ □ ] [ X ] */}
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <button
              type="button"
              className="w-6 h-6 border-2 border-black flex items-center justify-center hover:bg-neutral-200"
              title="Minimize"
            >
              -
            </button>
            <button
              type="button"
              className="w-6 h-6 border-2 border-black flex items-center justify-center hover:bg-neutral-200"
              title="Maximize"
            >
              □
            </button>
            <button
              type="button"
              className="w-6 h-6 border-2 border-black bg-black text-white flex items-center justify-center hover:bg-neutral-800"
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Sync Toast if Friend triggers action */}
        {syncNotice && (
          <div className="bg-black text-white text-xs px-3 py-1 text-center font-bold tracking-widest border-b-2 border-black animate-pulse">
            [ SYNC: {syncNotice} ]
          </div>
        )}

        {/* Content Body */}
        <div className="p-4 sm:p-6 flex flex-col gap-5">
          {/* 1-Bit Screen Art + Graphic Equalizer */}
          <BusWindowGraphic isPlaying={isPlaying} currentSong={currentSong} />

          {/* Track Info Section */}
          <div className="border-b-2 border-black pb-4 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs tracking-wider">
              <span className="border border-black px-2 py-0.5 bg-neutral-100 font-bold">
                TRACK {trackNumStr}/{totalTracksStr}
              </span>
              <span className="font-bold tracking-widest">MONO AUDIO</span>
            </div>

            {/* Song Title (Big, Bold, Retro Typography) */}
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-black uppercase mt-1">
              {currentSong ? currentSong.title : 'NO TAPE LOADED'}
            </h2>

            {/* Commute Route Subtitle */}
            <div className="text-xs sm:text-sm font-semibold tracking-wider text-black">
              {currentSong?.route || 'ROUTE 42'} • {currentSong?.seat || 'SEAT 02'} • NEXT STOP: {currentSong?.nextStop || 'CENTRAL'}
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mt-2 text-xs bg-black text-white px-3 py-1 font-bold flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-white" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Custom Dithered Progress Bar */}
          <div className="border-b-2 border-black pb-4">
            <ProgressBar
              currentTime={currentTime}
              duration={duration}
              isPlaying={isPlaying}
              onSeek={handleSeek}
            />
          </div>

          {/* Brutalist Transport Controls: PREV, PLAY/PAUSE, NEXT */}
          <div className="grid grid-cols-12 gap-3 items-stretch select-none">
            {/* Prev Button */}
            <button
              onClick={handlePrevious}
              type="button"
              className="col-span-4 border-2 border-black bg-white hover:bg-neutral-100 active:translate-y-0.5 py-3 font-bold text-xs sm:text-sm tracking-wider flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#000]"
            >
              <span>◀◀</span>
              <span>PREV</span>
            </button>

            {/* Center Play/Pause Button (Solid Black Inverted) */}
            <button
              onClick={togglePlayPause}
              type="button"
              className="col-span-4 border-2 border-black bg-black text-white hover:bg-neutral-900 active:translate-y-0.5 py-3 font-bold text-xs sm:text-sm tracking-wider flex items-center justify-center gap-2 shadow-[2px_2px_0px_#000]"
            >
              {isPlaying ? (
                <>
                  <span className="tracking-tighter">❚❚</span>
                  <span>PAUSE</span>
                </>
              ) : (
                <>
                  <span>▶</span>
                  <span>PLAY</span>
                </>
              )}
            </button>

            {/* Next Button */}
            <button
              onClick={handleNext}
              type="button"
              className="col-span-4 border-2 border-black bg-white hover:bg-neutral-100 active:translate-y-0.5 py-3 font-bold text-xs sm:text-sm tracking-wider flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#000]"
            >
              <span>NEXT</span>
              <span>▶▶</span>
            </button>
          </div>

          {/* Volume Control */}
          <div className="border-t-2 border-black pt-4 flex items-center justify-between gap-4">
            {/* Left Vol Box */}
            <button
              onClick={toggleMute}
              type="button"
              className="border-2 border-black px-2.5 py-1 text-xs font-bold flex items-center gap-1.5 bg-white hover:bg-neutral-100 shrink-0 shadow-[2px_2px_0px_#000]"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-3.5 h-3.5" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
              <span>VOL</span>
            </button>

            {/* Center Retro Line Slider */}
            <div className="relative flex-1 flex items-center py-2">
              {/* Background Track Line */}
              <div className="w-full h-1 bg-black rounded-none"></div>

              {/* Slider Input */}
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                aria-label="Volume"
                className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
              />

              {/* Round Black Thumb Node */}
              <div
                className="absolute w-3.5 h-3.5 bg-black border-2 border-white pointer-events-none -ml-1.5 shadow-[1px_1px_0px_#000]"
                style={{ left: `${(isMuted ? 0 : volume) * 100}%` }}
              />
            </div>

            {/* Right Percentage */}
            <span className="text-xs sm:text-sm font-bold w-12 text-right">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
