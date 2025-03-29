"use client";
import { UploadButton } from "~/lib/uploadthing";
import { FileIcon } from "lucide-react";
import { useRouter } from "next/navigation";
export const AddFileInput = ({ folderId }: { folderId: number }) => {
  const router = useRouter();
  return (
    <UploadButton
      input={{ folderId }}
      className="ut-button:flex ut-button:h-6 ut-button:w-full ut-button:justify-start ut-button:bg-transparent ut-button:p-0 ut-button:pl-2 ut-allowed-content:hidden"
      endpoint="driveUploader"
      onClientUploadComplete={async (res) => {
        console.log("upload complete", res);
        router.refresh();
      }}
      onUploadError={(error: Error) => {
        console.log("upload error", error);
      }}
      content={{
        button: () => (
          <span className="flex items-center justify-start gap-2">
            <FileIcon className="size-4" />
            <span className="text-[14.5px]">New file</span>
          </span>
        ),
      }}
      appearance={{
        button:
          "ut-ready: ut-ready:font-button ut-ready:text-xl ut-ready:text-black ut-uploading:cursor-not-allowed bg-none after:bg-green-700",
      }}
    />
  );
};
