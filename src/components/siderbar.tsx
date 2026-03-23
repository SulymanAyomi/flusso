import { Navigation } from "./navigation";
import { WorkspaceSwitcher } from "./workspace-switcher";
import LogoutButton from "./logout-button";

const Sidebar = () => {
  return (
    <aside className="h-full bg-white p-3 w-full shadow-sm border-r border-neutral-100 flex flex-col justify-between">
      <div>
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
