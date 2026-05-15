"use client";

import { MenuIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import Sidebar from "./siderbar";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ProfileSidebar from "./profile/profile-sidebar";

export const MobileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDashboard, setIsDashboard] = useState(true);
  const pathname = usePathname();
  const pathnameParts = pathname.split("/");
  const pathnameKey = pathnameParts[1];
  console.log(pathnameParts, pathnameKey);

  useEffect(() => {
    if (pathnameKey === "user") {
      setIsDashboard(false);
    } else {
      setIsDashboard(true);
    }
  }, [pathnameKey]);

  useEffect(() => {
    setIsOpen(false);
    const pathnameParts = pathname.split("/");
    const pathnameKey = pathnameParts[0];
    if (pathnameKey === "user") {
      setIsDashboard(false);
    } else {
      setIsDashboard(true);
    }
  }, [pathname]);
  return (
    <Sheet modal={false} open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary" size="icon" className=" lg:hidden">
          <MenuIcon className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        {isDashboard ? <Sidebar /> : <ProfileSidebar />}
      </SheetContent>
    </Sheet>
  );
};
