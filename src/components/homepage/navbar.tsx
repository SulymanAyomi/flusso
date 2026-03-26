import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Mobilemenu } from "./menu";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b flex items-center justify-between px-12 py-5">
      <Link href="/" className="flex items-center gap-1">
        <Image src="/flusso.png" alt="Logo" width={40} height={40} priority />
        <p className="text-brand1 font-semibold hidden lg:block">Flusso</p>
      </Link>
      <div className="lg:flex px-4 items-center gap-4 justify-between text-black hidden">
        <Link
          href="/#home"
          className="text-sm font-medium p-2 px-3 hover:bg-brandBlue rounded-md"
        >
          Home
        </Link>
        <Link
          href="/#features"
          className="text-sm font-medium p-2 px-3 hover:bg-brandBlue rounded-md"
        >
          Features
        </Link>
        <Link
          href="/#pricing"
          className="text-sm font-medium p-2 px-3 hover:bg-brandBlue rounded-md"
        >
          Pricing
        </Link>
        <Link
          href="/contact-us"
          className="text-sm font-medium p-2 px-3 hover:bg-brandBlue rounded-md"
        >
          Contact us
        </Link>
      </div>
      <div className="items-center justify-between gap-3 hidden lg:flex">
        <Link
          href="/sign-in"
          className="text-sm font-bold p-2 px-3 hover:bg-brandBlue rounded-md bg-white text-black"
        >
          Login
        </Link>
        <Link
          href="/sign-up"
          className="text-sm font-bold p-2 px-3 rounded-md bg-brand1 text-white"
        >
          Get Started
        </Link>
      </div>
      <div className="lg:hidden flex items-center">
        <Mobilemenu />
      </div>
    </nav>
  );
};

export default Navbar;
