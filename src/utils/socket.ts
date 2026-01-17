
import { io } from 'socket.io-client'
export const socket = io(
    "https://suretrust-g29-socialmedia-backend-1.onrender.com",
    {
        transports: ["polling", "websocket"],
        autoConnect: true,
    }
);