import { cookies } from "next/headers";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { TrashedFileRow, TrashedFolderRow } from "~/features/drive/f-r-rows";
import TrashContents from "~/features/drive/trash-contents";
import { api } from "~/trpc/server";

export default async function TrashPage() {
  // const trashFiles = await api.files.getTrashFiles();
  // const trashFolders = await api.folders.getTrashFolders();
  const [folders, files] = await Promise.all([
    api.files.getTrashFiles(),
    api.folders.getTrashFolders(),
  ]);
  const cookieStore = await cookies();
  const defaultViewMode =
    (cookieStore.get("viewMode")?.value as "list" | "grid") || "grid";
  return (
    <div>
      {/* <ul>
        {trashFiles.map((file) => (
          <TrashedFileRow key={file.publicId} file={file} />
        ))}
        {trashFolders.map((folder) => (
          <TrashedFolderRow key={folder.publicId} folder={folder} />
        ))}
      </ul> */}
      <TrashContents
        folders={folders}
        files={files}
        defaultViewMode={defaultViewMode}
      />
    </div>
  );
}
