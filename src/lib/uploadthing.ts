import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";
import type { ClientUploadedFileData } from "uploadthing/types";
import type { OurFileRouter } from "~/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

export type FileUploadResponseSingle = ClientUploadedFileData<{
  folderId: number;
}>;
