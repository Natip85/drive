import { cookies } from "next/headers";
import DriveContents from "~/features/drive/drive-contents";
import { api } from "~/trpc/server";

type Props = {
  params: Promise<{
    folderId: string;
  }>;
};
export default async function DrivePage({ params }: Props) {
  const param = await params;

  const paramFolderId = param.folderId;

  const [folders, files, parents] = await Promise.all([
    api.folders.getFolders(paramFolderId),
    api.files.getFiles(paramFolderId),
    api.folders.getAllParentsForFolder(paramFolderId),
  ]);
  const cookieStore = await cookies();
  const defaultViewMode =
    (cookieStore.get("viewMode")?.value as "list" | "grid") || "grid";
  return (
    <div className="p-2 md:p-10">
      <DriveContents
        files={files}
        folders={folders}
        parents={parents}
        defaultViewMode={defaultViewMode}
      />
    </div>
  );
}
