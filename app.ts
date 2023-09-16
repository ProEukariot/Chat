import http from "http";
import express from "express";
import { Server } from "socket.io";
import cors from "cors";

type SocketData = {
  room: string;
  message: string;
  sender: string;
  timestamp: Date;
};

const app = express();

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "*"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  socket.on("join_room", (room) => {
    if (room) socket.join(room);
  });

  socket.on("leave_room", (room) => {
    socket.leave(room);
  });

  socket.on("message", (data: SocketData) => {
    socket.to(data.room).emit("message", data);
  });
});

server.listen(3001, () => {
  console.log("Server started...");
});
