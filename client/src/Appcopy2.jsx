// import "./App.css";
// import io from "socket.io-client";
// import { useEffect, useRef, useState } from "react";
// import { Label } from "@/components/ui/label";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Loader2 } from "lucide-react";
// import UploadSection from "./components/UploadSection";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Users, Plus, User } from "lucide-react";
// import { set } from "date-fns";

// function App() {
//   const [currentUserId, setCurrentUserId] = useState(null);
//   const [upFileName, setUpFileName] = useState("");
//   const [roomCreated, setRoomCreated] = useState(false);
//   const [room, setRoom] = useState("");
//   const [roomUsers, setRoomUsers] = useState({
//     room: "",
//     users: {},
//   });

//   const [upId, setUpId] = useState("");
//   const [progressMap, setProgressMap] = useState({});

//   const [downloadMap, setDownloadMap] = useState({});
//   const socket = useRef(null);

//   const [action, setAction] = useState(null);

//   const [currentUser, setUsername] = useState("");
//   const [roomName, setRoomName] = useState("");
//   const [loading, setLoading] = useState(false);

//   //functions
//   const handleCreateRoom = async () => {
//     if (!currentUser.trim() || !roomName.trim()) {
//       alert("Please fill in all fields");
//       return;
//     }

//     setLoading(true);
//     try {
//       socket.current.emit("create-room", currentUser, roomName);
//       // Add your API call here
//       console.log("Creating room:", { currentUser, roomName });
//       // Simulate API delay
//       // await new Promise((resolve) => setTimeout(resolve, 1000));
//       // alert(`Room created! Username: ${currentUser}, Room: ${roomName}`);

//       setAction(null);
//       setUsername("");
//       setRoomName("");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleJoinRoom = async () => {
//     if (!currentUser.trim() || !roomName.trim()) {
//       alert("Please fill in all fields");
//       return;
//     }

//     setLoading(true);
//     try {
//       socket.current.emit("join-room", currentUser, roomName);
//       setAction(null);
//       // setUsername("");
//       setRoomName("");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     socket.current = io("http://localhost:3000");

//     socket.current.on("connect", () => {
//       console.log("Connected:", socket.current.id);
//     });

//     socket.current.on("room-created", (users, room, currentUserId, roomId) => {
//       setCurrentUserId(currentUserId);
//       setRoomCreated(true);
//       setRoomUsers(users);
//       setRoom(room);
//       alert("Room created successfully!\nCopy the Room ID to share: " + roomId);
//       console.log("room created", users);
//     });

//     socket.current.on("joined-success", ({ roomData, roomId, userId }) => {
//       setCurrentUserId(userId);
//       setRoom(roomId);
//       setRoomUsers(roomData);
//       setRoomCreated(true);
//     });

//     socket.current.on("file-uploading", (fileName, uploaderId) => {
//       setUpFileName(fileName);
//       setUpId(uploaderId);
//     });
//     socket.current.on("upload-progress", (uploaderId, percent) => {
//       setProgressMap((prev) => ({
//         ...prev,
//         [uploaderId]: percent,
//       }));
//     });
//     socket.current.on("file-uploaded", (fileUrl, fileName, uploaderId) => {
//       console.log(
//         `File uploaded: ${fileName} by ${uploaderId} - URL: ${fileUrl}`,
//       );
//       setDownloadMap((prev) => ({
//         ...prev,
//         [uploaderId]: fileUrl,
//       }));
//     });
//     socket.current.on("room-joined", (currRoomObject, room) => {
//       console.log("room joined", currRoomObject);
//       setRoomCreated(true);
//       setRoomUsers((prev) => ({
//         ...prev,
//         users: currRoomObject.users,
//       }));
//       setRoom(room);
//     });
//     socket.current.on("error", (message) => {
//       alert(message);
//     });
//     return () => socket.current.disconnect();
//   }, []);

//   return (
//     <main className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
//       {roomCreated ? (
//         <Card className="shadow-xl border-border/50">
//           <CardHeader className="text-center pb-2">
//             <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
//               <Users className="h-7 w-7 text-primary" />
//             </div>

//             <CardTitle className="text-2xl font-semibold text-balance">
//               Room Users
//             </CardTitle>

//             <CardDescription className="text-muted-foreground">
//               {roomUsers.length} {roomUsers.length === 1 ? "member" : "members"}{" "}
//               in this room
//             </CardDescription>
//           </CardHeader>

//           <CardContent className="pt-4">
//             <div className="grid grid-cols-2 gap-3">
//               {Object.entries(roomUsers.users).map(([userId, user]) => (
//                 <UploadSection
//                   key={userId}
//                   socket={socket.current}
//                   userName={user.userName}
//                   currentUserId={currentUserId}
//                   userId={userId}
//                   room={room}
//                   upFileName={upFileName}
//                   upId={upId}
//                   progressMap={progressMap}
//                   downloadLink={downloadMap[userId]}
//                 />
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       ) : (
//         <>
//           <div className="w-full max-w-md">
//             <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
//               <CardHeader className="text-center space-y-2">
//                 <CardTitle className="text-3xl font-bold text-white">
//                   ShareVault
//                 </CardTitle>
//                 <CardDescription className="text-slate-400">
//                   Share files securely with your team
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <Button
//                   onClick={() => setAction("create")}
//                   className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
//                   size="lg"
//                 >
//                   Create Room
//                 </Button>
//                 <Button
//                   onClick={() => setAction("join")}
//                   variant="outline"
//                   className="w-full h-12 border-slate-600 text-white hover:bg-slate-700"
//                   size="lg"
//                 >
//                   Join Room
//                 </Button>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Create Room Dialog */}
//           <Dialog
//             open={action === "create"}
//             onOpenChange={(open) => !open && setAction(null)}
//           >
//             <DialogContent className="border-slate-700 bg-slate-800">
//               <DialogHeader>
//                 <DialogTitle className="text-white">
//                   Create a New Room
//                 </DialogTitle>
//                 <DialogDescription className="text-slate-400">
//                   Set up your file-sharing room
//                 </DialogDescription>
//               </DialogHeader>
//               <div className="space-y-4 py-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="currentUser" className="text-slate-200">
//                     Username
//                   </Label>
//                   <Input
//                     id="currentUser"
//                     placeholder="Enter your currentUser"
//                     value={currentUser}
//                     onChange={(e) => setUsername(e.target.value)}
//                     className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="room-name" className="text-slate-200">
//                     Room Name
//                   </Label>
//                   <Input
//                     id="room-name"
//                     placeholder="Enter room name"
//                     value={roomName}
//                     onChange={(e) => setRoomName(e.target.value)}
//                     className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
//                   />
//                 </div>
//               </div>
//               <div className="flex gap-3">
//                 <Button
//                   variant="outline"
//                   onClick={() => {
//                     setAction(null);
//                     setUsername("");
//                     setRoomName("");
//                   }}
//                   className="flex-1 border-slate-600 text-slate-200 hover:bg-slate-700"
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   onClick={handleCreateRoom}
//                   disabled={loading}
//                   className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
//                 >
//                   {loading ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Creating...
//                     </>
//                   ) : (
//                     `Create Room`
//                   )}
//                 </Button>
//               </div>
//             </DialogContent>
//           </Dialog>

//           {/* Join Room Dialog */}
//           <Dialog
//             open={action === "join"}
//             onOpenChange={(open) => !open && setAction(null)}
//           >
//             <DialogContent className="border-slate-700 bg-slate-800">
//               <DialogHeader>
//                 <DialogTitle className="text-white">Join a Room</DialogTitle>
//                 <DialogDescription className="text-slate-400">
//                   Enter your user name and room name to join
//                 </DialogDescription>
//               </DialogHeader>
//               <div className="space-y-4 py-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="join-currentUser" className="text-slate-200">
//                     Username
//                   </Label>
//                   <Input
//                     id="join-currentUser"
//                     placeholder="Enter your currentUser"
//                     value={currentUser}
//                     onChange={(e) => setUsername(e.target.value)}
//                     className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="join-room-name" className="text-slate-200">
//                     Room Name
//                   </Label>
//                   <Input
//                     id="join-room-name"
//                     placeholder="Enter room name"
//                     value={roomName}
//                     onChange={(e) => setRoomName(e.target.value)}
//                     className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
//                   />
//                 </div>
//               </div>
//               <div className="flex gap-3">
//                 <Button
//                   variant="outline"
//                   onClick={() => {
//                     setAction(null);
//                     setUsername("");
//                     setRoomName("");
//                   }}
//                   className="flex-1 border-slate-600 text-slate-200 hover:bg-slate-700"
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   onClick={handleJoinRoom}
//                   disabled={loading}
//                   className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
//                 >
//                   {loading ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Joining...
//                     </>
//                   ) : (
//                     "Join Room"
//                   )}
//                 </Button>
//               </div>
//             </DialogContent>
//           </Dialog>
//         </>
//       )}
//     </main>
//   );
// }

// export default App;

import "./App.css";
import io from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Copy } from "lucide-react";
import UploadSection from "./components/UploadSection";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Plus, User } from "lucide-react";
import { set } from "date-fns";

function App() {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [upFileName, setUpFileName] = useState("");
  const [roomCreated, setRoomCreated] = useState(false);
  const [room, setRoom] = useState("");
  const [roomUsers, setRoomUsers] = useState({
    room: "",
    users: {},
  });

  const [upId, setUpId] = useState("");
  const [progressMap, setProgressMap] = useState({});

  const [downloadMap, setDownloadMap] = useState({});
  const socket = useRef(null);

  const [action, setAction] = useState(null);

  const [currentUser, setUsername] = useState("");
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(false);

  // States to handle the transition view
  const [showIdView, setShowIdView] = useState(false);

  //functions
  const handleCreateRoom = async () => {
    if (!currentUser.trim() || !roomName.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      socket.current.emit("create-room", currentUser, roomName);
      console.log("Creating room:", { currentUser, roomName });

      setAction(null);
      setUsername("");
      setRoomName("");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!currentUser.trim() || !roomName.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      socket.current.emit("join-room", currentUser, roomName);
      setAction(null);
      setRoomName("");
    } finally {
      setLoading(false);
    }
  };

  // Function to copy and then hide the ID view
  const handleCopyAndProceed = () => {
    navigator.clipboard.writeText(room);
    setShowIdView(false); // This switches the view to the main room card
  };

  useEffect(() => {
    socket.current = io("http://localhost:3000");

    socket.current.on("connect", () => {
      console.log("Connected:", socket.current.id);
    });

    socket.current.on("room-created", (users, room, currentUserId, roomId) => {
      setCurrentUserId(currentUserId);
      setRoomCreated(true);
      setShowIdView(true); // Show the intermediate ID view
      setRoomUsers(users);
      setRoom(roomId);
    });

    socket.current.on("joined-success", ({ roomData, roomId, userId }) => {
      setCurrentUserId(userId);
      setRoom(roomId);
      setRoomUsers(roomData);
      setRoomCreated(true);
      setShowIdView(false); // Joiners go straight to the room
    });

    socket.current.on("file-uploading", (fileName, uploaderId) => {
      setUpFileName(fileName);
      setUpId(uploaderId);
    });
    socket.current.on("upload-progress", (uploaderId, percent) => {
      setProgressMap((prev) => ({
        ...prev,
        [uploaderId]: percent,
      }));
    });
    socket.current.on("file-uploaded", (fileUrl, fileName, uploaderId) => {
      setDownloadMap((prev) => ({
        ...prev,
        [uploaderId]: fileUrl,
      }));
    });
    socket.current.on("room-joined", (currRoomObject, room) => {
      setRoomCreated(true);
      setRoomUsers((prev) => ({
        ...prev,
        users: currRoomObject.users,
      }));
      setRoom(room);
    });
    socket.current.on("error", (message) => {
      alert(message);
    });
    return () => socket.current.disconnect();
  }, []);

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {roomCreated ? (
        <Card className="shadow-xl border-border/50 min-w-[320px] border-white">
          {showIdView ? (
            /* Room ID View with styled Copy Button */
            <div className="p-8 flex flex-col items-center justify-center space-y-6">
              <div className="space-y-2 text-center">
                <CardTitle className="text-xl font-bold">Room ID</CardTitle>
                <CardDescription className="font-mono text-blue-600 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
                  {room}
                </CardDescription>
              </div>

              <Button
                onClick={handleCopyAndProceed}
                variant="outline"
                className="flex items-center gap-2 px-8 py-6 rounded-full border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all text-lg font-medium shadow-sm"
              >
                <Copy className="h-5 w-5" />
                Copy
              </Button>
            </div>
          ) : (
            /* Main Content (Upload Sections / User Cards) */
            <>
              <CardHeader className="text-center pb-2 ">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-7 w-7 text-primary text-white" />
                </div>

                <CardTitle className="text-2xl font-semibold text-balance text-white">
                  Room Users
                </CardTitle>

                <CardDescription className="text-muted-foreground text-white">
                  {Object.keys(roomUsers.users).length}{" "}
                  {Object.keys(roomUsers.users).length === 1
                    ? "member"
                    : "members"}{" "}
                  in this room
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(roomUsers.users).map(([userId, user]) => (
                    <UploadSection
                      key={userId}
                      socket={socket.current}
                      userName={user.userName}
                      currentUserId={currentUserId}
                      userId={userId}
                      room={room}
                      upFileName={upFileName}
                      upId={upId}
                      progressMap={progressMap}
                      downloadLink={downloadMap[userId]}
                    />
                  ))}
                </div>
              </CardContent>
            </>
          )}
        </Card>
      ) : (
        <>
          <div className="w-full max-w-md">
            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
              <CardHeader className="text-center space-y-2">
                <CardTitle className="text-3xl font-bold text-white">
                  ShareVault
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Share files securely with your team
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => setAction("create")}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  size="lg"
                >
                  Create Room
                </Button>
                <Button
                  onClick={() => setAction("join")}
                  variant="outline"
                  className="w-full h-12 border-slate-600 text-white hover:bg-slate-700"
                  size="lg"
                >
                  Join Room
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Create Room Dialog */}
          <Dialog
            open={action === "create"}
            onOpenChange={(open) => !open && setAction(null)}
          >
            <DialogContent className="border-slate-700 bg-slate-800">
              <DialogHeader>
                <DialogTitle className="text-white">
                  Create a New Room
                </DialogTitle>
                <DialogDescription className="text-slate-400">
                  Set up your file-sharing room
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="currentUser" className="text-slate-200">
                    Username
                  </Label>
                  <Input
                    id="currentUser"
                    placeholder="Enter your currentUser"
                    value={currentUser}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="room-name" className="text-slate-200">
                    Room Name
                  </Label>
                  <Input
                    id="room-name"
                    placeholder="Enter room name"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setAction(null);
                    setUsername("");
                    setRoomName("");
                  }}
                  className="flex-1 border-slate-600 text-slate-200 hover:bg-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateRoom}
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    `Create Room`
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Join Room Dialog */}
          <Dialog
            open={action === "join"}
            onOpenChange={(open) => !open && setAction(null)}
          >
            <DialogContent className="border-slate-700 bg-slate-800">
              <DialogHeader>
                <DialogTitle className="text-white">Join a Room</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Enter your user name and room name to join
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="join-currentUser" className="text-slate-200">
                    Username
                  </Label>
                  <Input
                    id="join-currentUser"
                    placeholder="Enter your currentUser"
                    value={currentUser}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="join-room-name" className="text-slate-200">
                    Room Name
                  </Label>
                  <Input
                    id="join-room-name"
                    placeholder="Enter room name"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setAction(null);
                    setUsername("");
                    setRoomName("");
                  }}
                  className="flex-1 border-slate-600 text-slate-200 hover:bg-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleJoinRoom}
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    "Join Room"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </main>
  );
}

export default App;
