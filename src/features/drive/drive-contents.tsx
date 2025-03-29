"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
// import { usePostHog } from "posthog-js/react";
import type { files_table, folders_table } from "~/server/db/schema";
import { FileRow, FolderRow } from "./f-r-rows";
type DriveContentsProps = {
  files: (typeof files_table.$inferSelect)[];
  folders: (typeof folders_table.$inferSelect)[];
  parents: (typeof folders_table.$inferSelect)[];
};
export default function DriveContents({
  files,
  folders,
  parents,
}: DriveContentsProps) {
  // const posthog = usePostHog();

  return (
    <div className="flex-1 p-2 pt-0 md:p-5 md:pt-0">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/drive/1" className="mr-2 text-gray-600">
            My Drive
          </Link>
          {parents.map((folder) => (
            <div key={folder.id} className="flex items-center">
              {folder.id !== 1 && (
                <>
                  <ChevronRight className="mx-2 text-gray-500" size={16} />
                  <Link
                    href={`/drive/${folder.id}`}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {folder.name}
                  </Link>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="border-b border-gray-300 px-6 py-4">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium">
            <div className="col-span-6">Name</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-3">Size</div>
            <div className="col-span-1"></div>
          </div>
        </div>
        <ul>
          {folders
            .filter((folder) => folder.id !== 2)
            .map((folder) => (
              <FolderRow key={folder.id} folder={folder} />
            ))}
          {files.map((file) => (
            <FileRow key={file.id} file={file} />
          ))}
        </ul>
      </div>
    </div>
  );
}
