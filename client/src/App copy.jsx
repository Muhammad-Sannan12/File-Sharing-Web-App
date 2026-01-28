// import "./App.css";

// import io from "socket.io-client";
// import { useEffect } from "react";
// import { useRef } from "react";
// import UploadSection from "./components/UploadSection";
// import { useState } from "react";
// function App() {
//   const [roomCreated, setRoomCreated] = useState(false);

//   const socketRef = useRef(null);
//   const inputRef = useRef(null); //io() is provided by Socket.IO client

//   useEffect(() => {
//     socketRef.current = io("http://localhost:3000");
//     socketRef.current.on("connect", () => {
//       console.log("Connected to server", socketRef.current.id);
//     });
//     socketRef.current.on("room-joined", (userName) => {
//       console.log("Joined room:", userName);
//       setRoomCreated(true);
//     });
//     return () => {
//       socketRef.current.off();
//     };
//   }, []);
//   function createRoom() {
//     const userName = inputRef.current.value;
//     if (!userName) return;
//     console.log("Joining room:", userName);
//     socketRef.current.emit("join-room", userName);
//   }
//   function joinRoom() {
//     const userName = inputRef.current.value;
//     if (!userName) return;
//     socketRef.current.emit("join-room", userName);
//     // console.log("Joining room:", userName);
//   }
//   return (
//     <>
//       {roomCreated ? (
//         <UploadSection
//           socket={socketRef.current}
//           userName={inputRef.current.value}
//         />
//       ) : (
//         <>
//           <h2>Create Or Add to Room</h2>

//           <input
//             type="text"
//             placeholder="Enter room name..."
//             ref={inputRef}
//             // value={room}
//             // onChange={(e) => setRoom(e.target.value)}
//           />

//           <br />
//           <br />

//           <button onClick={createRoom}>Create Room</button>
//           <button onClick={joinRoom}>Join Room</button>
//         </>
//       )}
//     </>
//   );
// }

// export default App;
// import "./App.css";

// import io from "socket.io-client";
// import { useEffect } from "react";
// import { useRef } from "react";
// import UploadSection from "./components/UploadSection";
// import { useState } from "react";
// function App() {
//   const [roomCreated, setRoomCreated] = useState(false);

//   const socketRef = useRef(null);
//   const inputRef = useRef(null); //io() is provided by Socket.IO client

//   useEffect(() => {
//     socketRef.current = io("http://localhost:3000");
//     socketRef.current.on("connect", () => {
//       console.log("Connected to server", socketRef.current.id);
//       socketRef.current.on("room-joined", (userName) => {
//         console.log("Joined room:", userName);
//         setRoomCreated(true);
//       });
//     });

//     return () => {
//       socketRef.current.off();
//     };
//   }, []);
//   function createRoom() {
//     const userName = inputRef.current.value;
//     if (!userName) return;
//     console.log("Joining room:", userName);
//     socketRef.current.emit("join-room", userName);
//   }
//   function joinRoom() {
//     const userName = inputRef.current.value;
//     if (!userName) return;
//     // socketRef.current.emit("join-room", userName);
//     // console.log("Joining room:", userName);
//   }
//   return (
//     <>
//       {roomCreated ? (
//         <UploadSection
//           socket={socketRef.current}
//           userName={inputRef.current.value}
//         />
//       ) : (
//         <>
//           <h2>Create Or Add to Room</h2>

//           <input
//             type="text"
//             placeholder="Enter room name..."
//             ref={inputRef}
//             // value={room}
//             // onChange={(e) => setRoom(e.target.value)}
//           />

//           <br />
//           <br />

//           <button onClick={createRoom}>Create Room</button>
//           <button onClick={joinRoom}>Join Room</button>
//         </>
//       )}
//     </>
//   );
// }

// export default App;
import "./App.css";

import io from "socket.io-client";
import { useEffect } from "react";
import { useRef } from "react";
import UploadSection from "./components/UploadSection";
import { useState } from "react";
function App() {
  const [roomCreated, setRoomCreated] = useState(false);
  const [userName, setUserName] = useState("");
  const [roomUsers, setRoomUsers] = useState([]);
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io("http://localhost:3000");

    socket.current.on("connect", () => {
      console.log("Connected:", socket.current.id);
    });

    socket.current.on("room-joined", (users) => {
      console.log("room joined", users);
      setRoomCreated(true);
      setRoomUsers(users);
    });

    return () => socket.current.disconnect();
  }, []);

  function createRoom() {
    if (!userName) return;
    socket.current.emit("join-room", userName);
  }

  return (
    <>
      {roomCreated ? (
        <>
          <h2>Room Users</h2>

          {roomUsers.map((user) => (
            <UploadSection
              key={user.id} // ✅ very important
              socket={socket.current}
              userName={user.userName} // user name of that user
              userId={user.id} // optional (if UploadSection needs it)
            />
          ))}
        </>
      ) : (
        <>
          <h2>Create Or Join Room</h2>

          <input
            type="text"
            placeholder="Enter room name..."
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />

          <br />
          <br />

          <button onClick={createRoom}>Create Room</button>
        </>
      )}
    </>
  );
}

export default App;
