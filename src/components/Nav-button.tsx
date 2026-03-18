import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { useCreateWorkspaceModal } from "@/features/workspaces/hooks/use-create-workspace-modal";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Plus, PencilIcon, SparklesIcon } from "lucide-react";
import { useRouter } from "next/router";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const NavButton = () => {
  const { open: openProject } = useCreateProjectModal();
  const { open: openWorkspace } = useCreateWorkspaceModal();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="sm" className="font-semibold border">
          <Plus />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={openWorkspace}
          disabled={false}
          className="font-medium p-[10px]"
        >
          New workspace
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => openProject()}
          disabled={false}
          className="font-medium p-[10px]"
        >
          New project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavButton;
