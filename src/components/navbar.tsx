"use client";
import { UserButton } from "@/features/auth/components/user-button";
import { MobileSidebar } from "./mobile-sidebar";
import { Bell, CloudLightning } from "lucide-react";
import NavButton from "./Nav-button";

const pathnameMap = {
  tasks: {
    title: "My Tasks",
    description: "View all your tasks here",
  },
  projects: {
    title: "My Project",
    description: "View all your projects here",
  },
};

const defaultMap = {
  title: "Home",
  description: "Monitor all of your projects and tasks here",
};

export const Navbar = () => {
  // const pathname = usePathname();
  // const pathnameParts = pathname.split("/");
  // const pathnameKey = pathnameParts[3] as keyof typeof pathnameMap;
  // const { title, description } = pathnameMap[pathnameKey] || defaultMap;

  return (
    <nav className="flex items-center p-4 gap-4 justify-between lg:justify-end">
      <div>
        <MobileSidebar />
      </div>
      <div className="flex flex-row gap-4">
        <div className="flex items-center justify-center">
          <NavButton />
        </div>
        <div className="flex gap-4">
          <div className="flex gap-2">
            <div className="flex items-center justify-center border rounded-[12px] shadow-sm p-2 cursor-pointer">
              <CloudLightning className="size-3 mr-1" />
              <p className="text-xs">Upgrade now</p>
            </div>
            <div className="flex items-center justify-center border rounded-[8px] shadow-sm p-2">
              <Bell className="size-4" />
            </div>
          </div>
        </div>
        <div>
          <UserButton />
        </div>
      </div>
    </nav>
  );
};
