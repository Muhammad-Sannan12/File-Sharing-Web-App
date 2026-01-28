import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { Card, CardContent } from "@/components/ui/card";
import FileUpload from "./FileUpload";
export default function UploadSection({
  socket,
  userName,
  userId,
  room,
  upFileName,
  upId,
  progressMap,
  currentUserId,
  downloadLink,
}) {
  return (
    <Card className="border border-border/50 bg-card/50 backdrop-blur-sm border-white">
      <CardContent className="p-4 flex flex-col items-center text-center gap-3">
        <Avatar className="h-12 w-12 border-2 border-primary/20 text-white">
          <AvatarFallback className="bg-primary/10 text-primary font-medium text-white">
            {userName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-foreground text-white">{userName}</p>
          <p className="text-xs text-muted-foreground text-white">
            ID: {userId}
          </p>
        </div>

        <FileUpload
          userId={userId}
          socket={socket}
          room={room}
          upFileName={upFileName}
          currentUserId={currentUserId}
          upId={upId}
          progressMap={progressMap}
          downloadLink={downloadLink}
        />
      </CardContent>
    </Card>
  );
}
