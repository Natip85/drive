"use client";
"use no memo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  type FolderSelect,
  folderAddRenameSchema,
  type FolderAddRename,
} from "./folder-types";
import { useUser } from "~/hooks/use-user";
import { usePathname, useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Loader2 } from "lucide-react";

export default function AddRenameFolderForm({
  setIsOpen,
  folder,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  folder?: FolderSelect;
}) {
  const router = useRouter();
  const { user } = useUser();
  const pathname = usePathname();
  const folderId = pathname.split("/").pop();

  const { mutateAsync: add, isPending: isLoading } =
    api.folders.createNewFolder.useMutation();

  const { mutateAsync: rename, isPending: isRenameLoading } =
    api.folders.renameFolder.useMutation();

  const form = useForm<FolderAddRename>({
    resolver: zodResolver(folderAddRenameSchema),
    defaultValues: folder || {
      createdAt: new Date(),
      name: "Untitled folder",
      ownerId: user.id,
      parent: folderId,
    },
  });
  const onSubmit = async (values: FolderAddRename) => {
    if (folder) {
      await rename({
        ...values,
        publicId: folder.publicId,
        id: folder.id,
        deletedAt: folder.deletedAt,
      });
      setIsOpen(false);
      router.refresh();
    } else {
      await add(values);
      setIsOpen(false);
      router.refresh();
    }
  };
  console.log("ERRORS: ", form.formState.errors);

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input id="name" {...field} placeholder="Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-8 flex items-center justify-end gap-3">
            <Button
              variant={"ghost"}
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full hover:bg-[#C1E7FE]"
            >
              Cancel
            </Button>

            <Button
              variant={"ghost"}
              type="submit"
              className="rounded-full hover:bg-[#C1E7FE]"
            >
              {isLoading || isRenameLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" />
                  Loading...
                </span>
              ) : (
                <span>{folder ? "Rename" : "Create"}</span>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
