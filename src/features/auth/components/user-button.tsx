"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Loader2Icon, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Separator } from "@/components/ui/separator";

export const UserButton = () => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="size-10 rounded-full flex items-center justify-center bg-neutral-200 border border-neutral-300">
        <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
      </div>
    );
  }
  const image = session?.user.image;
  const name = session?.user.name;
  const email = session?.user.email!;
  const avatarFallback = name
    ? name.charAt(0).toUpperCase()
    : email.charAt(0).toUpperCase();
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative">
        {image ? (
          <img
            src={image}
            className="border border-neutral-300 size-10 object-contain"
          />
        ) : (
          <Avatar className="size-10 hover:opacity-75 transition border border-neutral-300">
            <AvatarFallback className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        className="w-60"
        sideOffset={10}
      >
        <div className="flex flex-col items-center justify-center gap-2 px-2.5 py-4">
          {image ? (
            <img
              src={image}
              className="border border-neutral-300 size-10 object-contain"
            />
          ) : (
            <Avatar className="size-[52px] transition border border-neutral-300">
              <AvatarFallback className="bg-neutral-200 text-xl font-medium text-neutral-500 flex items-center justify-center">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
          )}
          <div className="flex flex-col items-center justify-center ">
            <p className="text-sm font-medium text-neutral-900">{name}</p>
            <p className="text-xs text-neutral-500 ">{email}</p>
          </div>
        </div>
        <Separator className="mb-1" />
        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: "/sign-in" })}
          className="h-10 flex items-center justify-center text-amber-700 font-medium cursor-pointer"
        >
          <LogOut className="size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
