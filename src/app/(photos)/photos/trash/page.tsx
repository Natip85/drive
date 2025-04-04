import { cookies } from "next/headers";
import TrashContents from "~/features/drive/trash-contents";
// import { api } from "~/trpc/server";

export default async function PhotosTrashPage() {
  //   const [files] = await Promise.all([api.files.getTrashFiles()]);
  const cookieStore = await cookies();
  const defaultViewMode =
    (cookieStore.get("viewMode")?.value as "list" | "grid") || "grid";
  return (
    <div className="p-2 md:p-10">
      <TrashContents
        folders={[]}
        files={[]}
        defaultViewMode={defaultViewMode}
      />
    </div>
  );
}
