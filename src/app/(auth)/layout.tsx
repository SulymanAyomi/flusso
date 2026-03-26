"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const pathname = usePathname();
  const isSignIn = pathname === "/sign-in";
  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-1">
            <Image
              src="/flusso.png"
              alt="Logo"
              width={40}
              height={40}
              priority
            />
            <p className="text-brand1 font-semibold hidden lg:block">Flusso</p>
          </Link>
          <Button variant="secondary">
            <Link href={isSignIn ? "/sign-up" : "/sign-in"}>
              {isSignIn ? "Sign Up" : "Sign In"}
            </Link>
          </Button>
        </nav>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-40px)]">
          {children}
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
