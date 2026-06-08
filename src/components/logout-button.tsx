"use client";
import { useConfirm } from "@/hooks/use-confirm";
import { ChevronRightIcon, LogOutIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import React from "react";

const LogoutButton = () => {
  const [ConfirmDialog, confirm] = useConfirm(
    "Log out",
    "You will be logged out of the app",
    "destructive",
  );
  const onLogout = async () => {
    const ok = await confirm();
    if (!ok) return;
    await signOut({ callbackUrl: "/sign-in" });
  };
  return (
    <>
      <ConfirmDialog />
      <button
        onClick={onLogout}
        className="flex w-full items-center justify-between bg-blue-100 p-3 rounded-lg font-medium cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <LogOutIcon />
          Log out
        </div>
        <ChevronRightIcon className="size-4" />
      </button>
    </>
  );
};

export default LogoutButton;
