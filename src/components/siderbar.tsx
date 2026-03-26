import { Navigation } from "./navigation";
import { WorkspaceSwitcher } from "./workspace-switcher";
import LogoutButton from "./logout-button";
import Image from "next/image";

const Sidebar = () => {
  return (
    <aside className="h-full bg-white p-3 w-full shadow-sm border-r border-neutral-100 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-1 h-10 w-full mb-4">
          <Image src="/flusso.png" alt="Logo" width={40} height={40} priority />
          <p className="text-brand1 font-semibold hidden lg:block text-lg">
            Flusso
          </p>
        </div>
        <div className="mb-4">
          <WorkspaceSwitcher />
        </div>
        <div className="">
          <Navigation />
        </div>
      </div>
      <div>
        <LogoutButton />
      </div>
    </aside>
  );
};

export default Sidebar;
