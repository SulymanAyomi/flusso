import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <footer className="max-w-5xl mx-auto bg-white border-t mt-12 px-12 py-10 ">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex gap-1 items-center">
            <Image
              src="/flusso.png"
              alt="Logo"
              width={40}
              height={40}
              priority
            />
            <div className="font-semibold text-lg text-brand1">
              Flusso<span className="text-accent">.</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2">Contact:</p>
            <p className="text-xs text-neutral-500 pl-2">flusso@gmail.com</p>
          </div>
        </div>
        <div className="flex gap-6">
          <div>
            <p className="text-sm font-semibold mb-3">Sitemap</p>
            <ul className="space-y-3">
              <li>
                <a
                  href="/#home"
                  className="text-xs text-neutral-500 hover:text-black hover:underline no-underline"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/#features"
                  className="text-xs text-neutral-500 hover:text-black hover:underline no-underline"
                >
                  Features
                </a>
              </li>{" "}
              <li>
                <a
                  href="/#pricing"
                  className="text-xs text-neutral-500 hover:text-black hover:underline no-underline"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="/contact-us"
                  className="text-xs text-neutral-500 hover:text-black hover:underline no-underline"
                >
                  Contact us
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold mb-3">Company</p>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-xs text-neutral-500 hover:text-black hover:underline no-underline"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-xs text-neutral-500 hover:text-black hover:underline no-underline"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold mb-3">Legal</p>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-xs text-neutral-500 hover:text-black hover:underline no-underline"
                >
                  Privacy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-xs text-neutral-500 hover:text-black hover:underline no-underline"
                >
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="text-xs text-neutral-800 text-center">
        © 2025 Flusso, Inc.
      </div>
    </footer>
  );
};

export default Footer;
