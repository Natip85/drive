"use client";
import {
  Edit3Icon,
  Folder as FolderIcon,
  Loader2,
  MoreHorizontal,
  Trash2,
  Trash2Icon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ResponsiveDialog } from "~/components/responsive-dialog";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { folders_table, files_table } from "~/server/db/schema";
import AddRenameFolderForm from "./add-rename-folder-form";
import { api } from "~/trpc/react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useRouter } from "next/navigation";

export function FileRow(props: { file: typeof files_table.$inferSelect }) {
  const router = useRouter();
  const { file } = props;
  const { mutateAsync: deleteFile, isPending: isLoading } =
    api.files.deleteFile.useMutation();
  return (
    <li
      key={file.id}
      className="hover:bg-gray-750 border-b border-gray-300 px-6 py-4"
    >
      <div className="grid grid-cols-12 items-center gap-4">
        <div className="col-span-6 flex items-center">
          <a
            href={file.url}
            className="flex items-center gap-3 hover:text-blue-400"
            target="_blank"
          >
            <div>
              <Image src={file.url} alt={file.name} width={50} height={50} />
            </div>
            <div>{file.name}</div>
          </a>
        </div>
        <div className="col-span-2 text-gray-400">{"file"}</div>
        <div className="col-span-3 text-gray-400">{file.size}</div>
        <div className="col-span-1 text-gray-400">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" aria-label="Delete file">
                <Trash2Icon size={20} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete the
                  file and remove it from our servers.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <div className="flex items-center gap-3">
                  <DialogClose>Cancel</DialogClose>
                  <DialogClose
                    onClick={async () => {
                      await deleteFile(file.id);
                      router.refresh();
                    }}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="animate-spin" />
                        Loading...
                      </span>
                    ) : (
                      <span>{"Confirm"}</span>
                    )}
                  </DialogClose>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </li>
  );
}

export function FolderRow(props: {
  folder: typeof folders_table.$inferSelect;
}) {
  const { folder } = props;
  const [renameFolderOpen, setRenameFolderOpen] = useState(false);

  return (
    <li
      key={folder.id}
      className="hover:bg-gray-750 border-b border-gray-300 px-6 py-4"
    >
      <div className="grid grid-cols-12 items-center gap-4">
        <div className="col-span-6 flex items-center">
          <Link
            href={`/drive/${folder.id}`}
            className="flex items-center hover:text-blue-400"
          >
            <FolderIcon className="mr-3" size={20} />
            {folder.name}
          </Link>
        </div>
        <div className="col-span-2 text-gray-400">{"folder"}</div>
        <div className="col-span-3 text-gray-400"></div>
        <div className="col-span-1 text-gray-400">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="ghost">
                <MoreHorizontal />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem
                onClick={() => {
                  setRenameFolderOpen(true);
                }}
              >
                <Edit3Icon className="size-4" /> Rename
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <Trash2 className="size-4" /> Move to trash
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ResponsiveDialog
            isOpen={renameFolderOpen}
            setIsOpen={setRenameFolderOpen}
            title="RENAME"
            description=" "
          >
            <AddRenameFolderForm
              setIsOpen={setRenameFolderOpen}
              folder={props.folder}
            />
          </ResponsiveDialog>
        </div>
      </div>
    </li>
  );
}
