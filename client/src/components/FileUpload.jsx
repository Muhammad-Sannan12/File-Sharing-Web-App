import { useState } from "react";
import axios from "axios";
import { Download, Upload, FileText } from "lucide-react";

function FileUpload({
  userId,
  socket,
  room,
  upFileName,
  currentUserId,
  upId,
  progressMap,
  downloadLink, // This is now an Array of objects
}) {
  const isFileReady = Array.isArray(downloadLink) && downloadLink.length > 0;
  const [files, setFiles] = useState([]);
  const [showFileList, setShowFileList] = useState(false);

  function handleFileChange(e) {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;
    setFiles(selectedFiles);
  }

  async function uploadFile() {
    if (files.length === 0) return alert("Select files first");
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("room", currentUserId);

    try {
      const res = await axios.post("http://localhost:3000/upload", formData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          socket.emit("file-uploading", {
            room,
            fileName:
              files.length > 1 ? `${files.length} files` : files[0].name,
            uploaderId: currentUserId,
            percent,
          });
        },
      });

      socket.emit("file-uploaded", {
        room,
        fileUrls: res.data.files, // Make sure backend sends back the array of {fileUrl, fileName, etc}
        uploaderId: currentUserId,
      });

      setFiles([]);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  }

  // Individual download handler
  async function triggerDownload(url, name) {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = name || "file";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed", err);
    }
  }

  const upprogress = progressMap[userId] || 0;

  return (
    <div className="w-full flex flex-col items-center gap-3">
      {/* Uploading Status */}
      {userId === upId && !isFileReady && (
        <p className="text-sm text-white font-medium">
          {upFileName} uploading...
        </p>
      )}

      {/* File Input */}
      {currentUserId === userId && !isFileReady && (
        <div className="w-full max-w-md">
          <input
            type="file"
            onChange={handleFileChange}
            multiple
            className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
          />
          {files.length > 0 && (
            <div className="mt-2 text-xs text-gray-300">
              Selected: {files.map((f) => f.name).join(", ")}
            </div>
          )}
        </div>
      )}

      {/* Main Action Button */}
      <div
        onClick={() => {
          if (!isFileReady) {
            uploadFile();
          } else if (downloadLink.length === 1) {
            // If only one file, download immediately
            triggerDownload(downloadLink[0].fileUrl, downloadLink[0].fileName);
          } else {
            // If multiple files, toggle the list view
            setShowFileList(!showFileList);
          }
        }}
        className={`relative w-full max-w-md h-12 border rounded-md flex items-center justify-center cursor-pointer overflow-hidden transition-colors
          ${!isFileReady ? "border-gray-500 hover:bg-gray-800" : "bg-blue-600 hover:bg-blue-700"}
        `}
      >
        {!isFileReady ? (
          upprogress > 0 ? (
            <>
              <div
                className="absolute left-0 top-0 h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${upprogress}%` }}
              />
              <span className="relative z-10 text-sm text-white font-semibold">
                {upprogress}%
              </span>
            </>
          ) : (
            <Upload className="relative z-10 h-5 w-5 text-gray-400" />
          )
        ) : (
          <span className="flex items-center gap-2 text-sm text-white font-semibold">
            <Download className="h-5 w-5 text-white" />
            {downloadLink.length > 1
              ? `View ${downloadLink.length} Files`
              : "Download File"}
          </span>
        )}
      </div>

      {/* Multiple Files List (The UI adjustment) */}
      {isFileReady && showFileList && downloadLink.length > 1 && (
        <div className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-md p-2 flex flex-col gap-2">
          {downloadLink.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 bg-gray-800 rounded hover:bg-gray-700 transition"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <FileText className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span className="text-xs text-white truncate">
                  {file.fileName}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent closing the menu
                  triggerDownload(file.fileUrl, file.fileName);
                }}
                className="text-xs bg-blue-500 hover:bg-blue-400 text-white px-2 py-1 rounded"
              >
                Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FileUpload;
