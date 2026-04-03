"use client";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import { Folder, SettingsIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GoCheckCircle,
  GoCheckCircleFill,
  GoHome,
  GoHomeFill,
  GoFileDirectory,
  GoFileDirectoryFill,
} from "react-icons/go";

export const Navigation = () => {
  const workspaceId = useWorkspaceId();
  const pathname = usePathname();
  const routes = [
    {
      label: "Dashboard",
      href: "",
      icon: GoHome,
      activeIcon: GoHomeFill,
      isActive: pathname == `/workspaces/${workspaceId}`,
    },
    {
      label: "Projects",
      href: "projects",
      icon: GoFileDirectory,
      activeIcon: GoFileDirectoryFill,
      isActive:
        pathname.includes("/workspaces") && pathname.includes("/projects"),
    },
    {
      label: "My Task",
      href: "tasks",
      icon: GoCheckCircle,
      activeIcon: GoCheckCircleFill,
      isActive:
        pathname.includes("/workspaces") && pathname.includes("/my-tasks"),
    },
    {
      label: "Members",
      href: "members",
      icon: UsersIcon,
      activeIcon: UsersIcon,
      isActive:
        pathname.includes("/workspaces") && pathname.includes("/members"),
    },
    {
      label: "Settings",
      href: "settings",
      icon: SettingsIcon,
      activeIcon: SettingsIcon,
      isActive:
        pathname.includes("/workspaces") && pathname.includes("/settings"),
    },
  ];
  return (
    <ul className="flex flex-col gap-2">
      {routes.map((item) => {
        const fullHref = `/workspaces/${workspaceId}/${item.href}`;
        const isActive = item.isActive;
        const Icon = isActive ? item.activeIcon : item.icon;
        return (
          <Link key={item.href} href={fullHref}>
            <div
              className={cn(
                "flex items-center gap-2.5 p-3 rounded-lg font-medium hover:bg-[#EBF2FF] transition cursor-pointer text-[14px]",
                item.isActive &&
                  "bg-[#EBF2FF] hover:bg-[#EBF2FF]/90 shadow-sm border data-[active=true]:border border-[#1546e733]  text-[#1546e7] ",
              )}
            >
              <Icon className="size-5" />
              {item.label}
            </div>
          </Link>
        );
      })}
    </ul>
  );
};

<div
  className="flex gap-2 items-center p-3 rounded-lg data-[active=true]:bg-[#EBF2FF]
    hover:bg-[#EBF2FF] cursor-pointer data-[active=true]:border data-[active=true]:border-[#1546e733]  data-[active=true]:text-[#1546e7] text-[14px] font-medium"
>
  <SettingsIcon className="size-5" />
  <a href="/dashboard">Dashboard</a>
</div>;
