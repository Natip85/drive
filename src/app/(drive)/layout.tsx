import { Loader2 } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { DriveSidebar } from "~/navigation/drive-sidebar";
import { auth } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function DriveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";
  const session = await auth();
  if (!session) {
    return redirect("/auth/login");
  }
  const { rootFolderId } = await api.folders.getSidebarFolders(
    session?.user.id,
  );
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center">
          <Loader2 className="size-20 animate-spin" />
        </div>
      }
    >
      <SidebarProvider defaultOpen={defaultOpen}>
        <DriveSidebar rootFolderId={rootFolderId} />
        <SidebarTrigger />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </Suspense>
  );
}
