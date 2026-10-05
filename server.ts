import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

interface Passenger {
  id: string;
  name: string;
  role: 'HOST DJ' | 'Listener';
  device: string;
  seat: string;
  delay: string;
  buffer: number;
}

interface QueuedSong {
  id: string;
  title: string;
  artist: string;
  duration: string;
  addedBy: string;
  votes: number;
  albumArt: string;
  file?: string;
}

interface Room {
  code: string;
  hostId: string;
  users: Passenger[];
  currentTrackIndex: number;
  isPlaying: boolean;
  currentTime: number;
  lastSyncTimestamp: number;
  queue: QueuedSong[];
}

const rooms = new Map<string, Room>();

const DEVICE_NAMES = [
  'Pixel Buds Pro 2',
  'Sony WH-1000XM5',
  'AirPods Pro (2nd Gen)',
  'Bose QuietComfort 45',
  'Sennheiser Momentum 4',
];

const SEAT_NAMES = [
  'Transit seat 4B',
  'Seat 02A',
  'Window seat 12',
  'Express seat 08',
  'Upper deck 15',
];

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

async function startServer() {
  const app = express();

  // Render provides PORT through environment variables
  const PORT = Number(process.env.PORT) || 3000;

  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  app.use(express.json());

  // Backend health check
  app.get('/', (_req, res) => {
    res.json({
      message: 'PixelBeats backend is running',
    });
  });

  app.get('/api/health', (_req, res) => {
    res.json({
      message: 'PixelBeats server is running',
      activeRooms: rooms.size,
      totalConnected: io.engine.clientsCount,
    });
  });

  // =========================================================
  // SOCKET.IO MULTIPLAYER LOGIC
  // =========================================================

  io.on('connection', (socket) => {
    console.log(`[Socket.IO] Connected: ${socket.id}`);

    const handleLeave = () => {
      const code = socket.data.roomCode;

      if (!code || !rooms.has(code)) {
        return;
      }

      const room = rooms.get(code)!;
      const leavingName = socket.data.username || 'Passenger';

      room.users = room.users.filter(
        (user) => user.id !== socket.id
      );

      socket.leave(code);
      socket.data.roomCode = null;

      if (room.users.length === 0) {
        rooms.delete(code);

        console.log(
          `[Socket.IO] Cabin ${code} closed (empty)`
        );
      } else {
        // If host left, assign a new host
        if (
          room.hostId === socket.id &&
          room.users.length > 0
        ) {
          room.hostId = room.users[0].id;
          room.users[0].role = 'HOST DJ';
        }

        io.to(code).emit('room-users', {
          roomCode: code,
          users: room.users,
          hostId: room.hostId,
        });

        io.to(code).emit('user-left', {
          message: `${leavingName} exited the bus cabin.`,
          users: room.users,
        });
      }
    };

    // =========================================================
    // 1. CREATE ROOM
    // =========================================================

    socket.on(
      'create-room',
      (data: {
        username?: string;
        device?: string;
      }) => {
        if (socket.data.roomCode) {
          handleLeave();
        }

        const roomCode = generateRoomCode();

        const username = (data?.username || '')
          .trim()
          .slice(0, 20);

        const device =
          data?.device ||
          DEVICE_NAMES[
            Math.floor(
              Math.random() * DEVICE_NAMES.length
            )
          ];

        const seat = SEAT_NAMES[0];

        const newPassenger: Passenger = {
          id: socket.id,
          name: username,
          role: 'HOST DJ',
          device,
          seat,
          delay: '<12ms',
          buffer: 100,
        };

        const newRoom: Room = {
          code: roomCode,
          hostId: socket.id,
          users: [newPassenger],
          currentTrackIndex: 0,
          isPlaying: false,
          currentTime: 0,
          lastSyncTimestamp: Date.now(),

          queue: [
            {
              id: 'q1',
              title: 'Nightcall (Drive Edit)',
              artist: 'Kavinsky',
              duration: '04:19',
              addedBy: 'Arun',
              votes: 4,
              albumArt:
                'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80',
            },
            {
              id: 'q2',
              title: 'Sunset Lover',
              artist: 'Petit Biscuit',
              duration: '03:57',
              addedBy: 'You',
              votes: 2,
              albumArt:
                'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&q=80',
            },
            {
              id: 'q3',
              title: 'Resonance',
              artist: 'HOME',
              duration: '03:32',
              addedBy: 'Bharath',
              votes: 1,
              albumArt:
                'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&q=80',
            },
          ],
        };

        rooms.set(roomCode, newRoom);

        socket.join(roomCode);

        socket.data.roomCode = roomCode;
        socket.data.username = username;

        socket.emit('room-created', {
          roomCode,
          room: newRoom,
          users: newRoom.users,
        });

        console.log(
          `[Socket.IO] Cabin created: ${roomCode} by ${username}`
        );
      }
    );

    // =========================================================
    // 2. JOIN ROOM
    // =========================================================

    socket.on(
      'join-room',
      (data: {
        roomCode?: string;
        username?: string;
        device?: string;
      }) => {
        const targetCode = (data?.roomCode || '')
          .trim()
          .toUpperCase();

        const username = (data?.username || 'Passenger')
          .trim()
          .slice(0, 20);

        if (!targetCode) {
          socket.emit('room-error', {
            message:
              'Please enter a valid room code (e.g. BUS-8921).',
          });

          return;
        }

        if (!rooms.has(targetCode)) {
          socket.emit('room-error', {
            message: `Cabin "${targetCode}" not found. Check code.`,
          });

          return;
        }

        const room = rooms.get(targetCode)!;

        if (room.users.length >= 8) {
          socket.emit('room-error', {
            message:
              'Bus cabin is at full capacity (8 passengers).',
          });

          return;
        }

        if (
          socket.data.roomCode &&
          socket.data.roomCode !== targetCode
        ) {
          handleLeave();
        }

        const seat =
          SEAT_NAMES[
            room.users.length % SEAT_NAMES.length
          ];

        const device =
          data?.device ||
          DEVICE_NAMES[
            room.users.length % DEVICE_NAMES.length
          ];

        const newPassenger: Passenger = {
          id: socket.id,
          name: username,
          role: 'Listener',
          device,
          seat,
          delay: '+1.2ms',
          buffer: 99,
        };

        room.users.push(newPassenger);

        socket.join(targetCode);

        socket.data.roomCode = targetCode;
        socket.data.username = username;

        socket.emit('room-joined', {
          roomCode: targetCode,
          room,
          users: room.users,
          currentTrackIndex: room.currentTrackIndex,
          isPlaying: room.isPlaying,
          currentTime: room.currentTime,
          queue: room.queue,
        });

        io.to(targetCode).emit('room-users', {
          roomCode: targetCode,
          users: room.users,
          hostId: room.hostId,
        });
      }
    );

    // =========================================================
    // 3. PLAY SYNC
    // =========================================================

    socket.on(
      'play',
      (data: {
        songIndex?: number;
        currentTime?: number;
      }) => {
        const code = socket.data.roomCode;

        if (!code || !rooms.has(code)) {
          return;
        }

        const room = rooms.get(code)!;

        room.isPlaying = true;

        if (typeof data.songIndex === 'number') {
          room.currentTrackIndex = data.songIndex;
        }

        if (typeof data.currentTime === 'number') {
          room.currentTime = data.currentTime;
        }

        room.lastSyncTimestamp = Date.now();

        socket.to(code).emit('play', {
          songIndex: room.currentTrackIndex,
          currentTime: room.currentTime,
          username:
            socket.data.username || 'Friend',
        });
      }
    );

    // =========================================================
    // 4. PAUSE SYNC
    // =========================================================

    socket.on(
      'pause',
      (data: {
        currentTime?: number;
      }) => {
        const code = socket.data.roomCode;

        if (!code || !rooms.has(code)) {
          return;
        }

        const room = rooms.get(code)!;

        room.isPlaying = false;

        if (typeof data.currentTime === 'number') {
          room.currentTime = data.currentTime;
        }

        socket.to(code).emit('pause', {
          currentTime: room.currentTime,
          username:
            socket.data.username || 'Friend',
        });
      }
    );

    // =========================================================
    // 5. SEEK SYNC
    // =========================================================

    socket.on(
      'seek',
      (data: {
        currentTime: number;
      }) => {
        const code = socket.data.roomCode;

        if (!code || !rooms.has(code)) {
          return;
        }

        const room = rooms.get(code)!;

        room.currentTime = data.currentTime;

        socket.to(code).emit('seek', {
          currentTime: data.currentTime,
          username:
            socket.data.username || 'Friend',
        });
      }
    );

    // =========================================================
    // 6. QUEUE UPVOTE
    // =========================================================

    socket.on(
      'upvote-song',
      (data: {
        songId: string;
      }) => {
        const code = socket.data.roomCode;

        if (!code || !rooms.has(code)) {
          return;
        }

        const room = rooms.get(code)!;

        const item = room.queue.find(
          (q) => q.id === data.songId
        );

        if (item) {
          item.votes += 1;

          room.queue.sort(
            (a, b) => b.votes - a.votes
          );

          io.to(code).emit('queue-updated', {
            queue: room.queue,
          });
        }
      }
    );

    // =========================================================
    // 7. LIVE EMOJI REACTIONS
    // =========================================================

    socket.on(
      'send-reaction',
      (data: {
        emoji: string;
      }) => {
        const code = socket.data.roomCode;

        if (!code) {
          return;
        }

        io.to(code).emit('reaction-received', {
          id: Math.random()
            .toString(36)
            .substring(2, 9),

          emoji: data.emoji,

          sender:
            socket.data.username || 'Rider',

          timestamp: Date.now(),
        });
      }
    );

    // =========================================================
    // 8. SYNC PING / PONG
    // =========================================================

    socket.on(
      'sync-ping',
      (data: {
        clientTime: number;
      }) => {
        socket.emit('sync-pong', {
          clientTime: data.clientTime,
          serverTime: Date.now(),
        });
      }
    );

    // =========================================================
    // 9. LEAVE ROOM
    // =========================================================

    socket.on('leave-room', () => {
      handleLeave();

      socket.emit('room-users', {
        roomCode: null,
        users: [],
      });
    });

    // =========================================================
    // 10. DISCONNECT
    // =========================================================

    socket.on('disconnect', () => {
      console.log(
        `[Socket.IO] Disconnected: ${socket.id}`
      );

      handleLeave();
    });
  });

  // =========================================================
  // START SERVER
  // =========================================================

  server.listen(PORT, '0.0.0.0', () => {
    console.log(
      `PixelBeats server running on port ${PORT}`
    );
  });
}

startServer();