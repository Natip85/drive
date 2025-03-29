"use client";
import { SidebarMenuButton } from "~/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DriveSidebarMenuActiveButton({
  href,
  icon,
  title,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
}) {
  const pathname = usePathname();

  const isActive = pathname === href;
  return (
    <SidebarMenuButton asChild isActive={isActive}>
      <Link href={href}>
        {icon}
        <span>{title}</span>
      </Link>
    </SidebarMenuButton>
  );
}
