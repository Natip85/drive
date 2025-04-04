"use client";
import { Images, Star, Trash2Icon } from "lucide-react";
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

export function PhotosSidebar() {
  const items = [
    {
      title: "Photos",
      url: `/photos`,
      icon: Images,
    },
    {
      title: "Favorites",
      url: "/photos/favorites",
      icon: Star,
    },
    {
      title: "Trash",
      url: "/photos/trash",
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
              <Link href={`/photos`} className="items-center">
                <div className="flex items-center justify-center rounded-lg pl-1.5">
                  <Images />
                </div>
                <div className="flex h-full flex-col justify-end pb-1 text-left text-sm leading-tight">
                  <span className="truncate text-xs">Family Photos</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
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
