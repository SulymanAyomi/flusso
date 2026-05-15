import React from "react";
import { Button } from "./ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

const MobileBackButton = () => {
  return (
    <Link
      className="flex items-center gap-2 w-fit bg-white text-black text-sm border p-2 cursor-pointer rounded-md mb-3"
      href={"/workspaces"}
    >
      <ArrowLeftIcon className="size-4" />
      Dashboard
    </Link>
  );
};

export default MobileBackButton;
