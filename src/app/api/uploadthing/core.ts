import { createUploadthing } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";
import { auth } from "~/server/auth";
import { api } from "~/trpc/server";

const f = createUploadthing();

export const ourFileRouter = {
  driveUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "2MB",
      maxFileCount: 1,
    },
  })
    .input(
      z.object({
        folderId: z.string(),
      }),
    )
    .middleware(async ({ input }) => {
      const [session, user] = await Promise.allSettled([
        auth(),
        api.users.getMe(),
      ]);

      if (
        session.status === "rejected" ||
        user.status === "rejected" ||
        !session.value?.user
      ) {
        throw new UploadThingError("Unauthorized");
      }
      const folder = await api.folders.getFolderById(input.folderId);

      // eslint-disable-next-line @typescript-eslint/only-throw-error
      if (!folder) throw new UploadThingError("Folder not found");

      if (folder.ownerId !== session.value.user.id) {
        throw new UploadThingError("Unauthorized");
      }

      return { userId: session.value.user.id, parentId: input.folderId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);

      await api.files.createNewFile({
        file: {
          name: file.name,
          size: file.size,
          url: file.ufsUrl,
          parent: metadata.parentId,
        },
        userId: metadata.userId,
      });

      return { uploadedBy: metadata.userId };
    }),
};

export type OurFileRouter = typeof ourFileRouter;
