"use client";
import { UserButton } from "@/features/auth/components/user-button";
import React from "react";
import { MobileSidebar } from "./mobile-sidebar";
import { usePathname } from "next/navigation";
import { Bell, CloudLightning } from "lucide-react";
import AuthProvider from "./AuthProvider";
import { SessionProvider } from "next-auth/react";
import { AuthUser } from "@/features/auth/type";

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

interface NavbarProps {
  user: AuthUser;
}
export const Navbar = ({ user }: NavbarProps) => {
  const pathname = usePathname();
  const pathnameParts = pathname.split("/");
  const pathnameKey = pathnameParts[3] as keyof typeof pathnameMap;
  const { title, description } = pathnameMap[pathnameKey] || defaultMap;

  return (
    <nav className="flex items-center justify-end p-4 gap-4">
      <div className="flex gap-4">
        <div className="flex gap-2">
          <div className="flex items-center justify-center border rounded-[12px] shadow-sm p-2 cursor-pointer">
            <CloudLightning className="size-3 mr-1" />
            <span className="text-xs">Upgrade now</span>
          </div>
          <div className="flex items-center justify-center border rounded-[8px] shadow-sm p-2">
            <Bell className="size-4" />
          </div>
        </div>
      </div>
      <div>
        <UserButton user={user} />
      </div>
    </nav>
  );
};
