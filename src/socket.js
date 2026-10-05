import { io } from 'socket.io-client';

// Single application-level socket connection
const socket = io(typeof window !== 'undefined' ? window.location.origin : undefined, {
  autoConnect: true,
  transports: ['polling', 'websocket'],
});

export default socket;
