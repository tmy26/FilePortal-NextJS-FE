import { FileHistoryDetailInteractive } from "@/components/file-history-detail-client";
import { SupportChat } from "@/components/support-chat";
import type {
  TuningFileRead,
  TuningRequestDetailRead,
} from "@/lib/types/file-history";

type FileHistoryDetailProps = {
  request: TuningRequestDetailRead;
  currentUserId: string;
};

function sortFiles(files: TuningFileRead[]): TuningFileRead[] {
  return [...files].sort((a, b) => {
    if (a.role !== b.role) {
      return a.role === "original" ? -1 : 1;
    }
    return a.version - b.version;
  });
}

/** Server Component wrapper; download UI is a client island. */
export function FileHistoryDetail({
  request,
  currentUserId,
}: FileHistoryDetailProps) {
  const files = sortFiles(request.files);
  const hasProcessed = files.some((file) => file.role === "processed");

  return (
    <>
      <FileHistoryDetailInteractive
        request={request}
        files={files}
        hasProcessed={hasProcessed}
      />
      <SupportChat
        tuningRequestId={request.uuid}
        currentUserId={currentUserId}
      />
    </>
  );
}
