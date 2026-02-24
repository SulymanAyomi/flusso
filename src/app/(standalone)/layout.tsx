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
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl">
        <nav className="flex justify-between items-center h-[73px] px-6">
          <Link href="/">
            <Image src="/logo.svg" alt="logo" width={40} height={48} />
          </Link>
          <UserButton user={user} />
        </nav>
        <div className="flex flex-col items-center justify-center py-4 px-6">
          {children}
        </div>
      </div>
    </main>
  );
};

export default StandloneLayout;
