const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { nanoid } = require("nanoid");

const dotenv = require("dotenv").config();
const cors = require("cors");
const routes = require("./routes");
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());

app.use(express.json());
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: "http://localhost:5173" },
});
const roomData = {};

const liveProgress = new Map();
io.on("connection", (socket) => {
  socket.on("rejoin-room", ({ roomId, userId }) => {
    if (roomData[roomId] && roomData[roomId].users[userId]) {
      roomData[roomId].users[userId].socketId = socket.id;
      socket.join(roomId);

      const existingFiles = roomData[roomId].files || [];

      const currentActiveUploads = {};
      liveProgress.forEach((value, key) => {
        if (key.startsWith(roomId)) {
          const uploaderId = key.split(`${roomId}-`)[1];
          currentActiveUploads[uploaderId] = value;
        }
      });

      socket.emit("rejoin-success", {
        roomData: roomData[roomId], // This now includes the files array
        roomId,
        userId,
        existingFiles, // Explicitly passing this makes frontend state setting easier
        activeUploads: currentActiveUploads, // Send the "stitched" state
      });
    }
  });

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
          isActive: true, // New: Tracks current status
          lastSeen: Date.now(), // New: Records time of last activity
        },
      },
      // Add this field
      files: [],
      activeUploads: {}, // New: Store { [uploaderId]: { fileName, percent } }
    };

    await socket.join(roomId);
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

      const existingFiles = roomData[roomId].files || [];

      const currentActiveUploads = {};
      liveProgress.forEach((value, key) => {
        if (key.startsWith(roomId)) {
          const uploaderId = key.split(`${roomId}-`)[1];
          currentActiveUploads[uploaderId] = value;
        }
      });

      socket.emit("joined-success", {
        roomData: roomData[roomId], // This now includes the files array
        roomId,
        userId,
        existingFiles, // Explicitly passing this makes frontend state setting easier
        activeUploads: currentActiveUploads, // Send the "stitched" state
      });
      io.to(roomId).emit("room-joined", roomData[roomId], roomId); //(broadcasting) show to all users in that room except sender
    }
  });
  socket.on("file-uploading", ({ room, fileName, uploaderId, percent }) => {
    liveProgress.set(`${room}-${uploaderId}`, { fileName, percent });
    socket.to(room).emit("file-uploading", fileName, uploaderId);

    io.to(room).emit("upload-progress", uploaderId, percent);
  });
  socket.on("file-uploaded", ({ room, fileUrls, uploaderId }) => {
    if (roomData[room]) {
      // Map incoming array to your room's internal file structure
      const newFiles = fileUrls.map((f) => ({
        fileUrl: f.url,
        fileName: f.name,
        uploaderId,
        fileId: nanoid(10),
      }));

      roomData[room].files.push(...newFiles);

      // Tell everyone to hide the progress bar and show the Download Button
      io.to(room).emit("file-uploaded", newFiles);
    }
  });
  socket.on("leave-room", (roomId, userId) => {
    if (roomData[roomId] && roomData[roomId].users[userId]) {
      console.log("Processing leave-room for", userId, "from", roomId);

      roomData[roomId].users[userId].isActive = false;
      roomData[roomId].users[userId].lastSeen = Date.now();
      roomData[roomId].users[userId].socketId = null;

      console.log(`User ${userId} left room ${roomId}`);
      io.to(roomId).emit("user-status-changed", {
        userId: userId,
        isActive: false,
      });

      socket.leave(roomId);
    }
  });
});
app.use(routes);
httpServer.listen(PORT, () => {
  console.log("Server is connected");
});
