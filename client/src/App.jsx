import "./App.css";
import io from "socket.io-client";
import { useEffect, useRef, useState } from "react";
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
  const [upFileName, setUpFileName] = useState("");
  const [roomCreated, setRoomCreated] = useState(false);
  const [room, setRoom] = useState("");
  const [currentUser, setUserName] = useState("");
  const [roomUsers, setRoomUsers] = useState([]);
  const [upName, setUpName] = useState("");
  const [progressMap, setProgressMap] = useState({});

  const [downloadMap, setDownloadMap] = useState({});
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io("http://localhost:3000");

    socket.current.on("connect", () => {
      console.log("Connected:", socket.current.id);
    });
    socket.current.on("room-joined", (users, room) => {
      console.log("room joined", users);
      setRoomCreated(true);
      setRoomUsers(users);
      setRoom(room);
    });
    socket.current.on("file-uploading", (fileName, uploaderName) => {
      // console.log(
      //   `File: ${fileName} is being uploaded by ${uploaderName} - ${percent}%`,
      // );
      setUpFileName(fileName);
      setUpName(uploaderName);
    });
    socket.current.on("upload-progress", (uploaderName, percent) => {
      setProgressMap((prev) => ({
        ...prev,
        [uploaderName]: percent,
      }));
    });
    socket.current.on("file-uploaded", (fileUrl, fileName, uploaderName) => {
      console.log(
        `File uploaded: ${fileName} by ${uploaderName} - URL: ${fileUrl}`,
      );
      setDownloadMap((prev) => ({
        ...prev,
        [uploaderName]: fileUrl,
      }));
    });
    return () => socket.current.disconnect();
  }, []);

  function createRoom() {
    if (!currentUser.trim()) return;
    socket.current.emit("join-room", currentUser);
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {roomCreated ? (
          <Card className="shadow-xl border-border/50">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-7 w-7 text-primary" />
              </div>

              <CardTitle className="text-2xl font-semibold text-balance">
                Room Users
              </CardTitle>

              <CardDescription className="text-muted-foreground">
                {roomUsers.length}{" "}
                {roomUsers.length === 1 ? "member" : "members"} in this room
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-3">
                {roomUsers.map((user) => (
                  <UploadSection
                    key={user.id}
                    socket={socket.current}
                    userName={user.userName}
                    currentUser={currentUser}
                    userId={user.id}
                    room={room}
                    upFileName={upFileName}
                    upName={upName}
                    progressMap={progressMap}
                    downloadLink={downloadMap[user.userName]}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-xl border-border/50">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <User className="h-7 w-7 text-primary" />
              </div>

              <CardTitle className="text-2xl font-semibold text-balance">
                Create or Join Room
              </CardTitle>

              <CardDescription className="text-muted-foreground">
                Enter your name to get started
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Enter your name..."
                  value={currentUser}
                  onChange={(e) => setUserName(e.target.value)}
                  className="h-12 text-base"
                  onKeyDown={(e) => e.key === "Enter" && createRoom()}
                />
              </div>

              <Button
                onClick={createRoom}
                className="w-full h-12 text-base gap-2"
                disabled={!currentUser.trim()}
              >
                <Plus className="h-5 w-5" />
                Create Room
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}

export default App;
