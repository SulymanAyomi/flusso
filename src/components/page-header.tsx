import { Button } from "@/components/ui/button";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { useCreateWorkspaceModal } from "@/features/workspaces/hooks/use-create-workspace-modal";
import {
  ExternalLinkIcon,
  LinkIcon,
  PencilIcon,
  Plus,
  SparkleIcon,
  SparklesIcon,
  TrashIcon,
} from "lucide-react";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { id } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useIsMobile } from "@/hooks/use-mobile";
interface PageHeadePrrops {
  header: string;
  subText: string;
  button: boolean;
  buttonType?: "workspace" | "project";
}
const PageHeader = ({
  header,
  subText,
  button,
  buttonType,
}: PageHeadePrrops) => {
  const isMobile = useIsMobile();
  return (
    <div className="flex justify-between items-start md:items-center bg-[#1546E7] px-3 py-8">
      <div className="flex flex-col gap-2">
        <div>
          <h1 className="text-white font-bold text-2xl">{header}</h1>
        </div>
        <div className="text-white text-xs">{subText}</div>
      </div>
      <div>{!isMobile && button && <PageButton buttonType={buttonType} />}</div>
    </div>
  );
};

export default PageHeader;

interface PageButtonProps {
  buttonType?: "workspace" | "project";
}
const PageButton = ({ buttonType }: PageButtonProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { open: openProject } = useCreateProjectModal();
  const { open: openWorkspace } = useCreateWorkspaceModal();
  const onOpenProject = () =>
    router.push(`/workspaces/${workspaceId}/projects/create/AI`);

  if (buttonType == "project") {
    return (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            className="rounded-[12px] text-[#1546E7] font-semibold text-[12px]"
          >
            <Plus /> <span>New project</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={openProject}
            disabled={false}
            className="font-medium p-[10px]"
          >
            <PencilIcon className="size-4 mr-2 stroke-2" />
            New project
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onOpenProject()}
            disabled={false}
            className="font-medium p-[10px]"
          >
            <SparklesIcon className="size-4 mr-2 stroke-2" />
            AI project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  } else {
    return (
      <Button
        variant="secondary"
        className="rounded-[12px] text-[#1546E7] font-semibold text-[12px]"
        onClick={openWorkspace}
      >
        <Plus /> <span>New workspace</span>
      </Button>
    );
  }
};
