import { cookies } from "next/headers";
import TrashContents from "~/features/drive/trash-contents";
import { api } from "~/trpc/server";

export default async function TrashPage() {
  const [folders, files] = await Promise.all([
    api.folders.getTrashFolders(),
    api.files.getTrashFiles(),
  ]);
  const cookieStore = await cookies();
  const defaultViewMode =
    (cookieStore.get("viewMode")?.value as "list" | "grid") || "grid";
  return (
    <div>
      <TrashContents
        folders={folders}
        files={files}
        defaultViewMode={defaultViewMode}
      />
    </div>
  );
}
