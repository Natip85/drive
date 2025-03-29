import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar";
import { ChevronsUpDown, LogOutIcon, User2, UserCog2 } from "lucide-react";
import { signOut } from "next-auth/react";
// import {ThemeToggle} from '../theme-toggle'
import Link from "next/link";

import { useUser } from "~/hooks/use-user";
export default function DriveSidebarUserMenu() {
  const { isMobile } = useSidebar();
  const { user } = useUser();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage size={32} src={user.image} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  <User2 />
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              {/* <ThemeToggle /> */}
              <DropdownMenuItem
                asChild
                className="flex items-center gap-2 font-button text-xl"
              >
                <Link href={"/profile/details"}>
                  <UserCog2 className="size-4" />
                  My profile
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              variant="destructive"
              onClick={() =>
                signOut({ redirect: true, callbackUrl: "/auth/login" })
              }
              className="flex items-center gap-2"
            >
              <LogOutIcon className="size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
