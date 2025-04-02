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
import { TrashedFileRow, TrashedFolderRow } from "./f-r-rows";
import type { files_table, folders_table } from "~/server/db/schema";
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
    <div>
      <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />

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
          {/* <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {folders
              .filter((folder) => folder.name !== "Trash")
              .map((folder) => (
                <FolderCard key={folder.publicId} folder={folder} />
              ))}
          </div> */}
          {/* <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {files.map((file) => (
              <FileCard key={file.publicId} file={file} />
            ))}
          </div> */}
        </div>
      )}
    </div>
  );
}
