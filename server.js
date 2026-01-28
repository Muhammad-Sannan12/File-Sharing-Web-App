const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { nanoid } = require("nanoid");

const dotenv = require("dotenv").config();
const cors = require("cors");
const routes = require("./routes");

const app = express();
app.use(cors());

app.use(express.json());
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: "http://localhost:5173" },
});
const roomData = {};
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("create-room", async (userName, room) => {
    //room is roomName
    const roomId = nanoid(8);
    const userId = nanoid(10);
    if (!roomData[roomId]) roomData[roomId] = [];
    roomData[roomId] = {
      room,
      users: {
        [userId]: {
          socketId: socket.id,
          userName,
        },
      },
    };

    await socket.join(roomId);
    console.log("Current room data:", roomData[roomId]);
    io.to(roomId).emit("room-created", roomData[roomId], room, userId, roomId); //(broadcasting) show to all users in that room except sender
  });
  socket.on("join-room", async (userName, roomId) => {
    if (!roomData[roomId]) {
      socket.emit("error", "Room does not exist");
    } else {
      await socket.join(roomId);
      const userId = nanoid(10);
      roomData[roomId].users[userId] = {
        socketId: socket.id,
        userName,
      };
      console.log("Current room data:", roomData[roomId]);
      socket.emit("joined-success", {
        roomData: roomData[roomId],
        roomId,
        userId,
      });

      io.to(roomId).emit("room-joined", roomData[roomId], roomId); //(broadcasting) show to all users in that room except sender
    }
  });

  socket.on("file-uploading", ({ room, fileName, uploaderId, percent }) => {
    socket.to(room).emit("file-uploading", fileName, uploaderId);

    io.to(room).emit("upload-progress", uploaderId, percent);
  });
  socket.on("file-uploaded", ({ room, fileUrl, fileName, uploaderId }) => {
    io.to(room).emit("file-uploaded", fileUrl, fileName, uploaderId);
  });
});
app.use(routes);
httpServer.listen(3000, () => {
  console.log("Server is connected");
});
