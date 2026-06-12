# 📁 GroupShare — Real-Time File Sharing Web App

A full-stack real-time file sharing application built with the **MERN stack** and **WebSockets (Socket.io)**. Users can create private groups using a unique code, invite others to join, and instantly share files — all stored securely in the cloud via **Supabase**.


## 🧠 Overview

GroupShare solves a simple problem: **quickly sharing files within a private group without sign-up friction**. A user creates a group and gets a unique invite code. Others paste that code to instantly join the group room. From there, everyone in the room can upload and download files in real time — no email, no links, no hassle.

---

## ✨ FeaturesFile Sharing App

A real-time file sharing platform built with the MERN Stack, Socket.IO, and Supabase Storage. Users can instantly create a sharing group, invite others using a unique group code, and transfer files securely in real time without creating accounts.

🚀 Overview

This application enables fast and simple file sharing between multiple users connected to the same group.

A user creates a group and receives a unique group code. Other users can join the group using that code. Once connected, all members can upload and share files with each other in real time. Files are stored in Supabase Storage, while Socket.IO handles instant communication between connected clients.

✨ Features
Create a file-sharing group instantly
Join existing groups using a unique group code
Real-time communication using Socket.IO
Upload and share files with group members
Secure cloud file storage using Supabase Storage
Multi-user group collaboration
Responsive and user-friendly interface
Fast file synchronization across connected users
No complex setup or registration required
🛠️ Tech Stack
Frontend
React.js
Tailwind CSS
Shadcn UI
Axios
Socket.IO Client
Backend
Node.js
Express.js
Socket.IO
MongoDB
Mongoose
Cloud Services
Supabase Storage (File Storage)
⚙️ How It Works
A user creates a new sharing group.
The system generates a unique group code.
Other users enter the code to join the group.
Members upload files through the application.
Files are stored in Supabase Storage.
Socket.IO instantly notifies all connected group members about new files.
Users can view and download shared files in real time.
🏗️ Architecture
React Frontend
       │
       ▼
Node.js + Express Backend
       │
       ├── Socket.IO (Real-Time Communication)
       │
       ├── MongoDB (Group & User Data)
       │
       ▼
Supabase Storage (File Storage)
🎯 Key Learning Outcomes
Built a full-stack MERN application from scratch.
Implemented real-time communication using WebSockets with Socket.IO.
Integrated Supabase Storage for scalable file management.
Designed a group-based file-sharing workflow.
Managed file uploads, downloads, and synchronization.
Developed REST APIs and real-time event handling.
Applied modern React development practices and component-based architecture.
📸 Project Highlights
Real-time file sharing across multiple connected users.
Group-based collaboration using shareable codes.
Cloud-based file storage with instant synchronization.
Modern full-stack architecture using MERN + Socket.IO + Supabase.
🔮 Future Improvements
User authentication and authorization
Drag-and-drop file uploads
File previews
Group chat functionality
File expiration and auto-deletion
File access permissions
Upload progress tracking
👨‍💻 Author

Sannan Sherzada
Full-Stack MERN Developer

Passionate about building scalable web applications, real-time systems, and solving real-world problems using modern web technologies.

- 🔑 **Group Rooms via Invite Code** — Create a group and share the code; others join instantly
- ⚡ **Real-Time Updates** — File uploads appear instantly for all group members via WebSockets
- ☁️ **Cloud File Storage** — Files are stored securely using Supabase Storage
- 📂 **File Sharing** — Upload any file type and share within the group
- 🔒 **Private Groups** — Only users with the code can access the group
- 🧹 **Clean UI** — Simple and intuitive interface to create, join, and share

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB (via Mongoose) |
| **Real-Time** | Socket.io (WebSockets) |
| **File Storage** | Supabase Storage |
| **Styling** |  Tailwind (update as needed) |

---

## ⚙️ How It Works

```
1. User A creates a group → receives a unique 6-digit invite code
2. User B, C, D... paste the code → instantly join the same group room
3. Any user uploads a file → stored in Supabase Storage
4. Socket.io broadcasts the new file event to all users in the room
5. All group members see the file appear in real time and can download it
```

---

## 🏗️ Architecture

```
Client (React)
    │
    ├── REST API (Express) ──► MongoDB (group metadata, user sessions)
    │
    ├── Socket.io ──────────► Real-time file event broadcasting
    │
    └── Supabase SDK ───────► File upload / download (cloud storage)
