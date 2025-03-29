import { Loader2 } from "lucide-react";
import { cookies } from "next/headers";
import { Suspense } from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { DriveSidebar } from "~/navigation/drive-sidebar";

export default async function DriveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center">
          <Loader2 className="size-20 animate-spin" />
        </div>
      }
    >
      <SidebarProvider defaultOpen={defaultOpen}>
        <DriveSidebar />
        <SidebarTrigger />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </Suspense>
  );
}
