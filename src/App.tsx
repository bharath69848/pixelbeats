import React, { useState, useEffect, useRef } from 'react';
import songs from './data/songs.js';
import NowPlayingView from './components/NowPlayingView.jsx';
import LibraryView from './components/LibraryView.jsx';
import RoomsView from './components/RoomsView.jsx';
import PhoneNavBar from './components/PhoneNavBar.jsx';
import socket from './socket.js';

export default function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Playback state
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(18);
  const [volume, setVolume] = useState<number>(0.75);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);
  const [syncNotice, setSyncNotice] = useState<string>('');

  // Persistent Room state (lifted to root so it never resets on tab change)
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [roomUsers, setRoomUsers] = useState<any[]>([]);
  const [username, setUsername] = useState<string>(() => {
    try {
      return localStorage.getItem('pixelbeats_user') || '';
    } catch {
      return '';
    }
  });
  const [roomError, setRoomError] = useState<string>('');
  const [roomNotice, setRoomNotice] = useState<string>('');

  // Mobile navigation tab: 'now-playing' | 'library' | 'rooms'
  const [activeTab, setActiveTab] = useState<'now-playing' | 'library' | 'rooms'>('now-playing');

  const currentSong = songs[currentSongIndex] || songs[0];

  // Socket.IO Play/Pause Synchronization
  useEffect(() => {
    function onRemotePlay(data: any) {
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
      setSyncNotice(`${data.username || 'Friend'} started playback ▶`);
      setTimeout(() => setSyncNotice(''), 3500);
    }

    function onRemotePause(data: any) {
      if (audioRef.current && typeof data.currentTime === 'number') {
        audioRef.current.currentTime = data.currentTime;
        setCurrentTime(data.currentTime);
      }

      setIsPlaying(false);
      setSyncNotice(`${data.username || 'Friend'} paused playback ⏸`);
      setTimeout(() => setSyncNotice(''), 3500);
    }

    socket.on('play', onRemotePlay);
    socket.on('pause', onRemotePause);

    return () => {
      socket.off('play', onRemotePlay);
      socket.off('pause', onRemotePause);
    };
  }, [currentSongIndex]);

  // Persistent Room Socket Listeners (never unmount during session)
  useEffect(() => {
    function onRoomCreated(data: any) {
      setCurrentRoom(data.roomCode);
      setRoomUsers(data.users || []);
      setRoomError('');
      setRoomNotice(`Room #${data.roomCode} created! Share with your friend.`);
    }

    function onRoomJoined(data: any) {
      setCurrentRoom(data.roomCode);
      setRoomUsers(data.users || []);
      setRoomError('');
      setRoomNotice(`Joined room #${data.roomCode}!`);
    }

    function onRoomUsers(data: any) {
      if (data.roomCode) {
        setCurrentRoom(data.roomCode);
        setRoomUsers(data.users || []);
      } else {
        setCurrentRoom(null);
        setRoomUsers([]);
      }
    }

    function onRoomError(data: any) {
      setRoomError(data.message || 'Room error occurred');
    }

    function onUserLeft(data: any) {
      setRoomNotice(data.message || 'Friend left the room.');
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

  // Load new audio file when song changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    audio.src = currentSong.file;
    audio.load();

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err: any) => {
          console.warn('Playback error:', err);
          setIsPlaying(false);
        });
      }
    }
  }, [currentSongIndex, currentSong]);

  // Handle Play/Pause with HTML Audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err: any) => {
          console.warn('Playback initiation error:', err);
          setIsPlaying(false);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Volume & Mute
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.muted = isMuted;
  }, [volume, isMuted]);

  // Audio Event Listeners
  function handleTimeUpdate() {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }

  function handleLoadedMetadata() {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 18);
    }
  }

  function handleEnded() {
    if (isRepeat) {
      // Loop the current song from the start
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch((err: any) => console.warn(err));
      }
      setCurrentTime(0);
      setIsPlaying(true);
      socket.emit('play', {
        songIndex: currentSongIndex,
        currentTime: 0,
      });
    } else {
      handleNext();
    }
  }

  // Shuffle calculation helper
  function getNextIndex(): number {
    if (songs.length <= 1) return 0;
    if (isShuffle) {
      let rand = currentSongIndex;
      let attempts = 0;
      while (rand === currentSongIndex && attempts < 10) {
        rand = Math.floor(Math.random() * songs.length);
        attempts++;
      }
      return rand;
    }
    return currentSongIndex === songs.length - 1 ? 0 : currentSongIndex + 1;
  }

  function getPrevIndex(): number {
    if (songs.length <= 1) return 0;
    if (isShuffle) {
      let rand = currentSongIndex;
      let attempts = 0;
      while (rand === currentSongIndex && attempts < 10) {
        rand = Math.floor(Math.random() * songs.length);
        attempts++;
      }
      return rand;
    }
    return currentSongIndex === 0 ? songs.length - 1 : currentSongIndex - 1;
  }

  // User Actions
  function handleTogglePlay() {
    const nextState = !isPlaying;
    setIsPlaying(nextState);

    const pos = audioRef.current ? audioRef.current.currentTime : currentTime;
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

  function handlePrev() {
    const prevIdx = getPrevIndex();
    setCurrentSongIndex(prevIdx);
    setIsPlaying(true);
    socket.emit('play', {
      songIndex: prevIdx,
      currentTime: 0,
    });
  }

  function handleNext() {
    const nextIdx = getNextIndex();
    setCurrentSongIndex(nextIdx);
    setIsPlaying(true);
    socket.emit('play', {
      songIndex: nextIdx,
      currentTime: 0,
    });
  }

  function handleToggleShuffle() {
    const next = !isShuffle;
    setIsShuffle(next);
    setSyncNotice(next ? 'Shuffle: ON 🔀' : 'Shuffle: OFF');
    setTimeout(() => setSyncNotice(''), 2200);
  }

  function handleToggleRepeat() {
    const next = !isRepeat;
    setIsRepeat(next);
    setSyncNotice(next ? 'Repeat: ON 🔁' : 'Repeat: OFF');
    setTimeout(() => setSyncNotice(''), 2200);
  }

  function handleSeek(newTime: number) {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = newTime;
    }
    setCurrentTime(newTime);
  }

  function handleSelectSong(index: number) {
    setCurrentSongIndex(index);
    setIsPlaying(true);
    socket.emit('play', {
      songIndex: index,
      currentTime: 0,
    });
    // Switch to Now Playing screen
    setActiveTab('now-playing');
  }

  // Room Actions
  function handleCreateRoom(customName?: string) {
    const finalName = (customName || username).trim();
    if (!finalName) {
      setRoomError('Please enter your name first');
      return;
    }
    try {
      localStorage.setItem('pixelbeats_user', finalName);
    } catch {}
    setUsername(finalName);
    setRoomError('');
    socket.emit('create-room', {
      username: finalName,
    });
  }

  function handleJoinRoom(code: string, customName?: string) {
    const finalName = (customName || username).trim();
    if (!finalName) {
      setRoomError('Please enter your name first');
      return;
    }
    if (!code.trim()) {
      setRoomError('Please enter a room code');
      return;
    }
    try {
      localStorage.setItem('pixelbeats_user', finalName);
    } catch {}
    setUsername(finalName);
    setRoomError('');
    socket.emit('join-room', {
      roomCode: code.trim().toUpperCase(),
      username: finalName,
    });
  }

  function handleLeaveRoom() {
    socket.emit('leave-room');
    setCurrentRoom(null);
    setRoomUsers([]);
    setRoomNotice('You left the room.');
    setRoomError('');
  }

  return (
    <div className="min-h-screen bg-[#f6f0e2] text-black font-pixel flex flex-col selection:bg-black selection:text-white">
      {/* Hidden Native Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* Main Mobile App Container */}
      <main className="flex-1 w-full max-w-md mx-auto flex flex-col bg-[#f6f0e2]">
        {/* Now Playing Screen */}
        <div className={activeTab === 'now-playing' ? 'flex-1 flex flex-col' : 'hidden'}>
          <NowPlayingView
            song={currentSong}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            volume={volume}
            isMuted={isMuted}
            isShuffle={isShuffle}
            isRepeat={isRepeat}
            onTogglePlay={handleTogglePlay}
            onPrev={handlePrev}
            onNext={handleNext}
            onSeek={handleSeek}
            onVolumeChange={setVolume}
            onToggleMute={() => setIsMuted(!isMuted)}
            onToggleShuffle={handleToggleShuffle}
            onToggleRepeat={handleToggleRepeat}
            onOpenRooms={() => setActiveTab('rooms')}
            onOpenLibrary={() => setActiveTab('library')}
            syncNotice={syncNotice}
          />
        </div>

        {/* Library Screen */}
        <div className={activeTab === 'library' ? 'flex-1 flex flex-col' : 'hidden'}>
          <LibraryView
            songs={songs}
            currentSongIndex={currentSongIndex}
            isPlaying={isPlaying}
            onSelectSong={handleSelectSong}
          />
        </div>

        {/* Rooms Screen (State is completely preserved when navigating!) */}
        <div className={activeTab === 'rooms' ? 'flex-1 flex flex-col' : 'hidden'}>
          <RoomsView
            currentRoom={currentRoom}
            roomUsers={roomUsers}
            username={username}
            setUsername={setUsername}
            errorMessage={roomError}
            setErrorMessage={setRoomError}
            statusNotice={roomNotice}
            onCreateRoom={handleCreateRoom}
            onJoinRoom={handleJoinRoom}
            onLeaveRoom={handleLeaveRoom}
          />
        </div>
      </main>

      {/* Sticky Bottom Navigation Bar */}
      <PhoneNavBar activeTab={activeTab} onChangeTab={setActiveTab} />
    </div>
  );
}
