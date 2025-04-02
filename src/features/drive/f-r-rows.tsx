"use client";
import {
  Edit3Icon,
  Folder as FolderIcon,
  ImageIcon,
  Loader2,
  MoreHorizontal,
  Trash2,
  Undo,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useState } from "react";
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
import { DialogClose } from "~/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { TableCell, TableRow } from "~/components/ui/table";

export function FileRow(props: { file: typeof files_table.$inferSelect }) {
  const router = useRouter();
  const { file } = props;
  const { mutateAsync: moveToTrash } = api.files.moveFileToTrash.useMutation();

  return (
    <TableRow key={file.id} className="hover:bg-gray-750">
      <TableCell className="w-6/12">
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
      </TableCell>
      <TableCell className="w-2/12">folder</TableCell>
      <TableCell className="w-3/12">--</TableCell>
      <TableCell className="w-1/12">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost">
              <MoreHorizontal />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem>
              <Edit3Icon className="mr-2 size-4" /> Rename
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                await moveToTrash(file.publicId);
                router.refresh();
              }}
            >
              <Trash2 className="mr-2 size-4" /> Move to trash
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

export function FileCard(props: { file: typeof files_table.$inferSelect }) {
  const router = useRouter();
  const { file } = props;
  const { mutateAsync: moveToTrash } = api.files.moveFileToTrash.useMutation();

  return (
    <Card key={file.id} className="overflow-hidden p-3">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-medium leading-none">{file.name}</h3>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem>
              <Edit3Icon className="mr-2 size-4" /> Rename
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                await moveToTrash(file.publicId);
                router.refresh();
              }}
            >
              <Trash2 className="mr-2 size-4" /> Move to trash
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={file.url}
            alt={file.name}
            fill
            className="rounded-md object-cover"
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function TrashedFileRow(props: {
  file: typeof files_table.$inferSelect;
}) {
  const router = useRouter();
  const { file } = props;
  const [deleteFileOpen, setDeleteFileOpen] = useState(false);

  const { mutateAsync: deleteFile, isPending: isDeleteLoading } =
    api.files.deleteFile.useMutation();
  const { mutateAsync: restoreFile } = api.files.restoreFile.useMutation();
  return (
    <TableRow key={file.id} className="hover:bg-gray-750">
      <TableCell className="w-6/12">
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
      </TableCell>
      <TableCell className="w-2/12 text-gray-400">file</TableCell>
      <TableCell className="w-3/12 text-gray-400">{file.size}</TableCell>
      <TableCell className="w-1/12">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost">
              <MoreHorizontal />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem
              onClick={async () => {
                await restoreFile(file.publicId);
                router.refresh();
              }}
            >
              <Undo className="mr-2 size-4" /> Restore
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setDeleteFileOpen(true)}>
              <Trash2 className="mr-2 size-4" /> Delete forever
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ResponsiveDialog
          isOpen={deleteFileOpen}
          setIsOpen={setDeleteFileOpen}
          title="DELETE FILE"
          description="This action cannot be undone. This will permanently delete the file and remove it from our servers."
        >
          <div className="flex w-full items-center justify-end gap-3">
            <DialogClose className="rounded-full px-4 py-2 hover:bg-[#C1E7FE]">
              Close
            </DialogClose>
            <Button
              variant={"ghost"}
              className="rounded-full hover:bg-[#C1E7FE]"
              onClick={async () => {
                await deleteFile(file.publicId);
                router.refresh();
              }}
            >
              {isDeleteLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" /> Loading...
                </span>
              ) : (
                <span>Confirm</span>
              )}
            </Button>
          </div>
        </ResponsiveDialog>
      </TableCell>
    </TableRow>
  );
}

export function FolderRow(props: {
  folder: typeof folders_table.$inferSelect;
}) {
  const router = useRouter();
  const { folder } = props;
  const [renameFolderOpen, setRenameFolderOpen] = useState(false);
  const { mutateAsync: moveToTrash } =
    api.folders.moveFolderToTrash.useMutation();
  return (
    <Fragment key={folder.id}>
      <TableRow className="hover:bg-gray-750">
        <TableCell className="w-6/12">
          <Link
            href={`/drive/${folder.publicId}`}
            className="flex items-center hover:text-blue-400"
          >
            <FolderIcon className="mr-3" size={20} />
            {folder.name}
          </Link>
        </TableCell>
        <TableCell className="w-2/12">folder</TableCell>
        <TableCell className="w-3/12">--</TableCell>
        <TableCell className="w-1/12">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="ghost">
                <MoreHorizontal />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem onClick={() => setRenameFolderOpen(true)}>
                <Edit3Icon className="mr-2 size-4" /> Rename
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async () => {
                  await moveToTrash(folder.publicId);
                  router.refresh();
                }}
              >
                <Trash2 className="mr-2 size-4" /> Move to trash
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      <ResponsiveDialog
        isOpen={renameFolderOpen}
        setIsOpen={setRenameFolderOpen}
        title="RENAME"
        description=" "
      >
        <AddRenameFolderForm setIsOpen={setRenameFolderOpen} folder={folder} />
      </ResponsiveDialog>
    </Fragment>
  );
}

export function FolderCard(props: {
  folder: typeof folders_table.$inferSelect;
}) {
  const router = useRouter();
  const { folder } = props;
  const [renameFolderOpen, setRenameFolderOpen] = useState(false);
  const { mutateAsync: moveToTrash, isPending: isLoading } =
    api.folders.moveFolderToTrash.useMutation();
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-1 p-2">
        <Link
          href={`/drive/${folder.publicId}`}
          className="flex flex-1 items-center gap-1 hover:text-blue-400"
        >
          <FolderIcon size={24} className="shrink-0" />
          <span
            className="max-w-[100px] truncate font-medium md:max-w-[150px]"
            title={folder.name}
          >
            {folder.name}
          </span>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="icon" className="ml-2">
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
              <Edit3Icon className="mr-2 size-4" /> Rename
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                await moveToTrash(folder.publicId);
                router.refresh();
              }}
              disabled={isLoading}
            >
              <Trash2 className="mr-2 size-4" />
              {isLoading ? "Moving..." : "Move to trash"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
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
    </Card>
  );
}

export function TrashedFolderRow(props: {
  folder: typeof folders_table.$inferSelect;
}) {
  const router = useRouter();
  const { folder } = props;
  const [renameFolderOpen, setRenameFolderOpen] = useState(false);
  const { mutateAsync: restoreFolder } =
    api.folders.restoreFolder.useMutation();
  return (
    <li
      key={folder.publicId}
      className="hover:bg-gray-750 border-b border-gray-300 px-6 py-4"
    >
      <div className="grid grid-cols-12 items-center gap-4">
        <div className="col-span-6 flex items-center">
          <Link
            href={`/drive/${folder.publicId}`}
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
              <DropdownMenuItem
                onClick={async () => {
                  await restoreFolder(folder.publicId);
                  router.refresh();
                }}
              >
                <Undo className="size-4" /> Restore
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
