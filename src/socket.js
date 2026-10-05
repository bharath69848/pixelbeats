import { io } from 'socket.io-client';

const socket = io('https://pixelbeats-m51j.onrender.com', {
  transports: ['websocket', 'polling'],

  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});

export default socket;