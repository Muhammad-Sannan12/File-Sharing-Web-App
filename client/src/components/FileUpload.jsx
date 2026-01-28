import { useState } from "react";
import axios from "axios";
import { Download, Upload } from "lucide-react";

import { useRef } from "react";

function FileUpload({
  userId,
  socket,
  room,
  upFileName,
  currentUserId,
  upId,
  progressMap,
  downloadLink,
}) {
  const isFileReady = Boolean(downloadLink);

  const downloadRef = useRef(null);
  const [file, setFile] = useState(null);
  const [SelectedFile, setSelectedFile] = useState(null);

  function handleFileChange(e) {
    const selectedFile = e.target.files[0];
    // console.log(currentUserId);
    if (!selectedFile) return;

    setFile(selectedFile);
    setSelectedFile(selectedFile);
  }

  async function uploadFile() {
    if (!file) return alert("Select a file first");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("room", currentUserId);

    try {
      const res = await axios.post("http://localhost:3000/upload", formData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          socket.emit("file-uploading", {
            room,
            fileName: SelectedFile.name,
            uploaderId: currentUserId,
            percent,
          });
        },
      });

      socket.emit("file-uploaded", {
        room,
        fileUrl: res.data.fileUrl,
        fileName: SelectedFile.name,
        uploaderId: currentUserId,
      });
      //       socket.emit("upload-finished", {
      //   roomId: room,
      //   userId: currentUserId,
      // });
    } catch (err) {
      console.error("Upload failed:", err);
    }
  }
  async function downloadFile() {
    const res = await fetch(downloadLink);
    const blob = await res.blob();

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = upFileName || "file";
    a.click();

    URL.revokeObjectURL(url);
  }

  const upprogress = progressMap[userId] || 0;

  return (
    <>
      <div className="w-full  flex flex-col items-center gap-3">
        {userId === upId && !isFileReady && (
          <p className="text-sm text-white font-medium">
            {upFileName} uploading...
          </p>
        )}

        {currentUserId === userId && !isFileReady && (
          <input type="file" onChange={handleFileChange} />
        )}

        <div
          onClick={!isFileReady ? uploadFile : downloadFile}
          className={`relative w-full max-w-md h-12 border rounded-md flex items-center justify-center cursor-pointer overflow-hidden
          ${!isFileReady ? "" : "bg-blue-600 hover:bg-blue-700"}
        `}
        >
          {!isFileReady ? (
            upprogress > 0 ? (
              <>
                <div
                  className="absolute left-0 top-0 h-full  bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-300"
                  style={{ width: `${upprogress}%` }}
                />
                <span className="relative z-10 text-sm text-white font-semibold">
                  {upprogress}%
                </span>
              </>
            ) : (
              <Upload className="relative z-10 h-5 w-5 text-black" />
            )
          ) : (
            <span className="flex items-center gap-2 text-sm text-white font-semibold">
              <Download className="h-5 w-5 text-white" />
              Download File
            </span>
          )}
        </div>
      </div>
    </>
  );
}

export default FileUpload;
