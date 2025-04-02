"use client";
import { FolderIcon, Home, HomeIcon, PlusIcon, Trash2Icon } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import Link from "next/link";
import DriveSidebarMenuActiveButton from "./drive-sidebar-menu-active-button";
import DriveSidebarUserMenu from "./drive-sidebar-user-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useState } from "react";
import { ResponsiveDialog } from "~/components/responsive-dialog";
import { AddFileInput } from "~/features/drive/add-file-input";
import { usePathname } from "next/navigation";
import AddRenameFolderForm from "~/features/drive/add-rename-folder-form";
type Props = {
  rootFolderId: string | null;
};

export function DriveSidebar({ rootFolderId }: Props) {
  const [addFolderOpen, setAddFolderOpen] = useState(false);
  const pathname = usePathname();
  const folderId = pathname.split("/").pop();
  if (!folderId) {
    return <div>No folder id found</div>;
  }
  const items = [
    {
      title: "Home",
      url: `/drive/${rootFolderId}`,
      icon: HomeIcon,
    },
    {
      title: "Trash",
      url: "/drive/trash",
      icon: Trash2Icon,
    },
  ];
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              asChild
            >
              <Link href={`/drive/${rootFolderId}`} className="items-center">
                <div className="flex items-center justify-center rounded-lg pl-1.5">
                  <Home />
                </div>
                <div className="flex h-full flex-col justify-end pb-1 text-left text-sm leading-tight">
                  <span className="truncate text-xs">Family Drive</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <div className="my-4">
        <SidebarMenu>
          <SidebarMenuItem className="pl-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full rounded-xl border bg-white p-7 pl-2 shadow-xl hover:bg-sidebar">
                  <div>
                    <PlusIcon className="-ml-1" />
                  </div>
                  <span className="text-lg">Add</span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuItem
                  onClick={() => {
                    setAddFolderOpen(true);
                  }}
                >
                  <span className="flex items-center gap-2">
                    <FolderIcon />
                    New folder
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <AddFileInput folderId={folderId} />
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
        <ResponsiveDialog
          isOpen={addFolderOpen}
          setIsOpen={setAddFolderOpen}
          title="NEW FOLDER"
          description=" "
        >
          <AddRenameFolderForm setIsOpen={setAddFolderOpen} />
        </ResponsiveDialog>
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <DriveSidebarMenuActiveButton
                    href={item.url}
                    title={item.title}
                    icon={<item.icon />}
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <DriveSidebarUserMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
