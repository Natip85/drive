import DriveContents from "~/features/drive/drive-contents";
import { api } from "~/trpc/server";

type Props = {
  params: Promise<{
    folderId: string;
  }>;
};
export default async function DrivePage({ params }: Props) {
  const param = await params;

  const parsedFolderId = parseInt(param.folderId);
  if (isNaN(parsedFolderId)) {
    return <div>Invalid folder ID</div>;
  }

  const [folders, files, parents] = await Promise.all([
    api.folders.getFolders(parsedFolderId),
    api.files.getFiles(parsedFolderId),
    api.folders.getAllParentsForFolder(parsedFolderId),
  ]);

  return (
    <div className="p-2 md:p-5">
      <DriveContents files={files} folders={folders} parents={parents} />
    </div>
  );
}
