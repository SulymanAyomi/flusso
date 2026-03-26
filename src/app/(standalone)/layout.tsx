import AuthProvider from "@/components/AuthProvider";
import { UserButton } from "@/features/auth/components/user-button";
import { getCurrent } from "@/features/auth/query";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

interface standloneLayoutProps {
  children: React.ReactNode;
}

const StandloneLayout = async ({ children }: standloneLayoutProps) => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");
  return (
    <AuthProvider>
      <main className="bg-neutral-100 min-h-screen">
        <div className="mx-auto max-w-screen-2xl">
          <nav className="flex justify-between items-center h-[73px] px-6">
            <Link href="/workspaces" className="flex items-center gap-1">
              <Image
                src="/flusso.png"
                alt="Logo"
                width={40}
                height={40}
                priority
              />
              <p className="text-brand1 font-semibold hidden lg:block">
                Flusso
              </p>
            </Link>
            <UserButton />
          </nav>
          <div className="flex flex-col items-center justify-center py-4 px-6">
            {children}
          </div>
        </div>
      </main>
    </AuthProvider>
  );
};

export default StandloneLayout;
