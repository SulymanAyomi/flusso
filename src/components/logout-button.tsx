"use client";
import { useConfirm } from "@/hooks/use-confirm";
import { LogOutIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import React from "react";

const LogoutButton = () => {
  const [ConfirmDialog, confirm] = useConfirm(
    "Sign out",
    "You will be signed out of the app",
    "primary"
  );
  const onLogout = async () => {
    const ok = await confirm();
    if (!ok) return;
    await signOut({ callbackUrl: "/" });
  };
  return (
    <>
      <ConfirmDialog />
      <button
        onClick={onLogout}
        className="flex w-full items-center justify-between bg-blue-100 p-3 rounded-lg font-medium cursor-pointer"
      >
        Logout
        <LogOutIcon />
      </button>
    </>
  );
};

export default LogoutButton;
