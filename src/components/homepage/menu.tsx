"use client";
import { MenuIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import Link from "next/link";
import { FaMoneyBillWave } from "react-icons/fa";

export const Mobilemenu = () => {
  return (
    <Popover>
      <PopoverTrigger>
        <button className="size-5 rounded-md lg:hidden py-3 bg-white text-black">
          <MenuIcon className="text-inherit" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className=" flex flex-col items-start gap-2 justify-between text-black">
          <Link
            href="/about"
            className="text-sm font-medium p-2 px-3 w-full rounded-md"
          >
            Features
          </Link>
          <Link
            href="/contact-us"
            className="text-sm font-medium p-2 px-3 w-full rounded-md"
          >
            Pricing
          </Link>
          <Link
            href="/contact-us"
            className="text-sm font-medium p-2 px-3 w-full rounded-md"
          >
            Contact us
          </Link>
          <Link
            href="/sign-in"
            className="text-sm font-medium p-2 px-3 w-full rounded-md"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="text-sm text-center font-medium p-2 px-3 bg-brand1 rounded-md w-full text-white"
          >
            Get started
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
};
