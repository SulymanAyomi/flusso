import { useRouter } from "next/navigation";
import { ExternalLinkIcon, PencilIcon, TrashIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useEditProjectModal } from "@/features/projects/hooks/use-edit-project-modal";
import { useDeleteProject } from "@/features/projects/api/use-delete-project";

interface ProjectActionsProps {
  id: string;
  children: React.ReactNode;
}
export const ProjectActions = ({ id, children }: ProjectActionsProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const { open } = useEditProjectModal();

  const [ConfirmDialog, confirm] = useConfirm(
    "Delete project",
    "This action will delete project and all it tasks.",
    "destructive"
  );
  const { mutate, isPending } = useDeleteProject();

  const onDelete = async () => {
    const ok = await confirm();
    if (!ok) return;

    mutate({ param: { projectId: id } });
  };

  const onOpenProject = () => {
    router.push(`/workspaces/${workspaceId}/projects/${id}`);
  };

  return (
    <div className="flex justify-end">
      <ConfirmDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={onOpenProject}
            disabled={false}
            className="font-medium p-[10px]"
          >
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            Open Project
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => open(id)}
            disabled={false}
            className="font-medium p-[10px]"
          >
            <PencilIcon className="size-4 mr-2 stroke-2" />
            Edit Project
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onDelete}
            disabled={isPending}
            className="font-medium text-amber-700 focus:text-amber-700  p-[10px]"
          >
            <TrashIcon className="size-4 mr-2 stroke-2" />
            Delete Project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
