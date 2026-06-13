process.on("uncaughtException", (err) => {
  console.error("❌ UNCAUGHT EXCEPTION");
  console.error(err);
});

process.on("unhandledRejection", (reason) => {
  console.error("❌ UNHANDLED REJECTION");
  console.error(reason);
});

process.on("SIGTERM", () => {
  console.log("⚠️ SIGTERM received");
});

process.on("SIGINT", () => {
  console.log("⚠️ SIGINT received");
});

console.log("🚀 Server starting...");
console.log("🕒", new Date().toISOString());
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { nanoid } = require("nanoid");

const dotenv = require("dotenv").config();
const cors = require("cors");
const routes = require("./routes");
console.log("Loaded routes successfully");
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());

app.use(express.json());
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});
console.log("CLIENT_URL:", process.env.CLIENT_URL);
const roomData = {};

const liveProgress = new Map();
io.on("connection", (socket) => {
  console.log("🔗 Socket connected:", socket.id);

  socket.on("disconnect", (reason) => {
    console.log("❌ Socket disconnected:", socket.id);
    console.log("Reason:", reason);
  });
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
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  console.log("🏥 Health check hit");

  res.status(200).json({
    success: true,
    message: "Server is running",
    port: PORT,
    time: new Date().toISOString(),
  });
});

app.get("/debug", (req, res) => {
  console.log("🛠 Debug route hit");

  res.json({
    port: PORT,
    clientUrl: process.env.CLIENT_URL,
    nodeEnv: process.env.NODE_ENV,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

app.use(routes);

setInterval(() => {
  console.log(`💓 Alive | Uptime: ${Math.floor(process.uptime())}s`);
}, 10000);

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log("✅ Server listening");
  console.log("🌍 Host: 0.0.0.0");
  console.log("🔌 Port:", PORT);
});
