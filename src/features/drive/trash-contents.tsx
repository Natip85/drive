"use client";

import { useEffect, useState } from "react";
import { ViewToggle } from "./view-toggle";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  TrashedFileCard,
  TrashedFileRow,
  TrashedFolderCard,
  TrashedFolderRow,
} from "./f-r-rows";
import type { files_table, folders_table } from "~/server/db/schema";
import EmptyTrash from "../../assets/images/empty-trash.svg";
type Props = {
  files: (typeof files_table.$inferSelect)[];
  folders: (typeof folders_table.$inferSelect)[];
  defaultViewMode?: "list" | "grid";
};
export default function TrashContents({
  defaultViewMode,
  files,
  folders,
}: Props) {
  const [viewMode, setViewMode] = useState<"list" | "grid">(
    defaultViewMode ?? "grid",
  );
  useEffect(() => {
    document.cookie = `viewMode=${viewMode};path=/;max-age=${30 * 24 * 60 * 60}`;
  }, [viewMode]);
  return (
    <>
      <div className="flex items-center justify-between pr-10">
        <h2 className="text-2xl font-bold md:text-4xl">Trash</h2>

        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>
      {!files.length && !folders.length ? (
        <div className="flex flex-col items-center justify-center">
          <div className="size-96">
            <EmptyTrash />
          </div>
          <div className="text-2xl font-bold md:text-4xl">Nothing in trash</div>
          <p className="max-w-96 text-center">
            Move items you dont need to trash. Items in trash will be deleted
            forever after 30 days.
          </p>
        </div>
      ) : (
        <div>
          {viewMode === "list" ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {folders
                  .filter((folder) => folder.name !== "Trash")
                  .map((folder) => (
                    <TrashedFolderRow key={folder.publicId} folder={folder} />
                  ))}
                {files.map((file) => (
                  <TrashedFileRow key={file.publicId} file={file} />
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
                {folders
                  .filter((folder) => folder.name !== "Trash")
                  .map((folder) => (
                    <TrashedFolderCard key={folder.publicId} folder={folder} />
                  ))}
              </div>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
                {files.map((file) => (
                  <TrashedFileCard key={file.publicId} file={file} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
