// src/utils/socket.js
import { io } from 'socket.io-client';

const socket = io('http://localhost:5001', {
  withCredentials: true,
  autoConnect: false  // We'll connect manually
});

export default socket;