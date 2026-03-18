import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import {
  CheckCircle2Icon,
  FolderIcon,
  ListChecksIcon,
  SearchIcon,
  UserIcon,
} from "lucide-react";
import { TaskStatus, TaskPriority } from "../../types";
import { useTaskFilters } from "../../hooks/use-task-filters";
import { DatePicker } from "@/components/date-picker";
import { Input } from "@/components/ui/input";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { useState } from "react";
import { useGetQuickProjects } from "@/features/projects/api/use-get-quick-projects";

interface DataFiltersProps {
  hideProjectFilter?: boolean;
}

export const DataFilters = ({ hideProjectFilter }: DataFiltersProps) => {
  const workspaceId = useWorkspaceId();
  const [search, setSearch] = useState("");
  const { data: projects, isLoading: isLoadingProject } = useGetQuickProjects({
    workspaceId,
  });

  const projectOptions = projects?.map((project) => ({
    id: project.id,
    name: project.name,
  }));

  const [{ status, projectId, dueDate }, setFilters] = useTaskFilters();

  const onStatusChange = (value: string) => {
    setFilters({ status: value === "all" ? null : (value as TaskStatus) });
  };

  const onProjectChange = (value: string) => {
    setFilters({ projectId: value === "all" ? null : (value as string) });
  };

  const onSearchChange = (value: string) => {
    setFilters({ search: value === "" ? null : (value as string) });
  };

  const isLoading = isLoadingProject;
  if (isLoading) return null;

  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <Select
          defaultValue={status ?? undefined}
          onValueChange={(value) => onStatusChange(value)}
        >
          <SelectTrigger className="w-full lg:w-auto h-8">
            <div className="flex items-center pr-2">
              <ListChecksIcon className="size-4 mr-2" />
              <SelectValue placeholder="All statuses" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectSeparator />

            <SelectItem value={TaskStatus.BACKLOG}>
              {snakeCaseToTitleCase(TaskStatus.BACKLOG)}
            </SelectItem>

            <SelectItem value={TaskStatus.TODO}>
              {snakeCaseToTitleCase(TaskStatus.TODO)}
            </SelectItem>

            <SelectItem value={TaskStatus.IN_REVIEW}>
              {snakeCaseToTitleCase(TaskStatus.IN_REVIEW)}
            </SelectItem>

            <SelectItem value={TaskStatus.IN_PROGRESS}>
              {snakeCaseToTitleCase(TaskStatus.IN_PROGRESS)}
            </SelectItem>

            <SelectItem value={TaskStatus.DONE}>
              {snakeCaseToTitleCase(TaskStatus.DONE)}
            </SelectItem>
          </SelectContent>
        </Select>
        <Select
          defaultValue={status ?? undefined}
          onValueChange={(value) => onStatusChange(value)}
        >
          <SelectTrigger className="w-full lg:w-auto h-8">
            <div className="flex items-center pr-2">
              <CheckCircle2Icon className="size-4 mr-2" />
              <SelectValue placeholder="All priorities" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priority</SelectItem>
            <SelectSeparator />

            <SelectItem value={TaskPriority.LOW}>
              {snakeCaseToTitleCase(TaskPriority.LOW)}
            </SelectItem>

            <SelectItem value={TaskPriority.MEDIUM}>
              {snakeCaseToTitleCase(TaskPriority.MEDIUM)}
            </SelectItem>

            <SelectItem value={TaskPriority.HIGH}>
              {snakeCaseToTitleCase(TaskPriority.HIGH)}
            </SelectItem>

            <SelectItem value={TaskPriority.CRITICAL}>
              {snakeCaseToTitleCase(TaskPriority.CRITICAL)}
            </SelectItem>
          </SelectContent>
        </Select>
        <Select
          defaultValue={projectId ?? undefined}
          onValueChange={(value) => onProjectChange(value)}
        >
          <SelectTrigger className="w-full lg:w-auto h-8">
            <div className="flex items-center pr-2">
              <FolderIcon className="size-4 mr-2" />
              <SelectValue placeholder="All projects" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All projects</SelectItem>
            <SelectSeparator />
            {projectOptions?.map((project) => (
              <SelectItem value={project.id} key={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DatePicker
          placeholder="Due Date"
          className="h-8 w-full lg:w-auto"
          value={dueDate ? new Date(dueDate) : undefined}
          onChange={(date) => {
            setFilters({
              dueDate: date ? date.toISOString() : null,
              fromDate: null,
              toDate: null,
            });
          }}
        />
      </div>
      <div className="">
        <div className="relative">
          <div className="absolute pl-1 text-neutral-500 top-1/2 transform -translate-y-1/2 ">
            <SearchIcon className="size-4" />
          </div>
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              onSearchChange(e.target.value);
            }}
            placeholder="Search task by name"
            className="pl-7 focus-visible:ring-blue-500 focus-visible:border-none"
          />
        </div>
      </div>
    </div>
  );
};
