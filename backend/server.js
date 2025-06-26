import express from 'express';
import route from './routes/routes.js';
import cors from 'cors';
import connection from './database/db.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { Server as SocketIO } from 'socket.io';
import { createServer } from 'http';
import Message from './model/message.js';
import cookieParser from 'cookie-parser';
import cookie from 'cookie';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {User} from './model/user.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
connection();
app.use('/', route);

const server = createServer(app);
const io = new SocketIO(server, {
  cors: { origin: "http://localhost:3000", credentials: true },
  pingTimeout: 60000,
  pingInterval: 25000,
  maxHttpBufferSize: 1e8,
});

const universalRoom = 'general';

io.use((socket, next) => {
  next();
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.join(universalRoom);
  socket.emit('joinedRoom', universalRoom);
  socket.to(universalRoom).emit('message', { 
    username: 'system', 
    message: `User ${socket.id} joined the chat` 
  });

  socket.on('message', async (msg) => {
    try {
      const newMessage = await Message.create({ 
        userid: msg.userid, 
        content: msg.message 
      });
      const user = await User.findById(msg.userid);
      io.to(universalRoom).emit('message', { 
        username: user.username, 
        message: msg.message 
      });
    } catch (error) {
      io.to(universalRoom).emit('message', { 
        username: 'system', 
        message: `Error: ${error.message}` 
      });
    }
  });

  socket.on('disconnect', () => {
    io.to(universalRoom).emit('message', { 
      username: 'system', 
      message: `User ${socket.id} left the chat` 
    });
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});



