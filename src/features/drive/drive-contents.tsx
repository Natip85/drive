"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
// import { usePostHog } from "posthog-js/react";
import type { files_table, folders_table } from "~/server/db/schema";
import { FileCard, FileRow, FolderCard, FolderRow } from "./f-r-rows";
import { useEffect, useState } from "react";
import { ViewToggle } from "./view-toggle";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
type DriveContentsProps = {
  files: (typeof files_table.$inferSelect)[];
  folders: (typeof folders_table.$inferSelect)[];
  parents: (typeof folders_table.$inferSelect)[];
  defaultViewMode?: "list" | "grid";
};
export default function DriveContents({
  files,
  folders,
  parents,
  defaultViewMode,
}: DriveContentsProps) {
  // const posthog = usePostHog();
  const [viewMode, setViewMode] = useState<"list" | "grid">(
    defaultViewMode ?? "grid",
  );

  useEffect(() => {
    document.cookie = `viewMode=${viewMode};path=/;max-age=${30 * 24 * 60 * 60}`;
  }, [viewMode]);
  return (
    <div className="flex-1">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link
            href={`/drive/${parents[0]?.publicId}`}
            className="mr-2 text-2xl font-bold md:text-4xl"
          >
            Home
          </Link>
          {parents.map((folder) => (
            <div key={folder.publicId} className="flex items-center">
              {folder.name !== "Root" && (
                <>
                  <ChevronRight className="mx-2 text-gray-500" size={16} />
                  <Link
                    href={`/drive/${folder.publicId}`}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {folder.name}
                  </Link>
                </>
              )}
            </div>
          ))}
        </div>
        <div className="pr-10">
          <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        </div>
      </div>

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
                <FolderRow key={folder.publicId} folder={folder} />
              ))}
            {files.map((file) => (
              <FileRow key={file.publicId} file={file} />
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex flex-col gap-6">
          <div>Folders</div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {folders
              .filter((folder) => folder.name !== "Trash")
              .map((folder) => (
                <FolderCard key={folder.publicId} folder={folder} />
              ))}
          </div>
          <div>Files</div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {files.map((file) => (
              <FileCard key={file.publicId} file={file} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
