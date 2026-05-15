import { WorkspaceSwitcher } from "../workspace-switcher";
import LogoutButton from "../logout-button";
import Image from "next/image";
import { ProfileNavigation } from "./navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { GoArrowLeft, GoHome } from "react-icons/go";

const ProfileSidebar = () => {
  return (
    <aside className="h-full bg-white p-3 w-full shadow-sm border-r border-neutral-100 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-1 h-10 w-full mb-4">
          <Image src="/flusso.png" alt="Logo" width={40} height={40} priority />
          <p className="text-brand1 font-semibold hidden lg:block text-lg">
            Flusso
          </p>
        </div>
        <Link href={"/workspaces"}>
          <div
            className={cn(
              "flex items-center gap-2.5 p-3 rounded-lg font-medium hover:bg-[#EBF2FF] transition cursor-pointer text-[14px] mb-2",
            )}
          >
            <GoArrowLeft className="size-5" />
            Back to Dashboard
          </div>
        </Link>
        <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
        <div className="">
          <ProfileNavigation />
        </div>
      </div>
      <div>
        <LogoutButton />
      </div>
    </aside>
  );
};

export default ProfileSidebar;
