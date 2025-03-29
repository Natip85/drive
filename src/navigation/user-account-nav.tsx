"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { User2 } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useUser } from "~/hooks/use-user";

export default function UserAccountNav({ toggle }: { toggle?: () => void }) {
  const { user } = useUser();
  async function handleLogout() {
    await signOut({
      callbackUrl: "/auth/login",
    });
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="overflow-visible">
        <Avatar className="overflow-hidden hover:cursor-pointer">
          {user.image && (
            <AvatarImage
              size={40}
              src={user.image}
              alt={`${user.name} avatar`}
            />
          )}
          <AvatarFallback className="bg-primary">
            <User2 className="stroke-black" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-background" align="end">
        <DropdownMenuItem
          asChild
          className="font-button text-xl hover:cursor-pointer"
          onClick={toggle}
        >
          <Link href="/profile/details ">Profile</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleLogout}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
