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
import { ListChecksIcon, UserIcon } from "lucide-react";
import { ProjectsStatus } from "@/features/projects/types";
import { DatePicker } from "@/components/date-picker";
import { useProjectsFilters } from "@/features/projects/hooks/use-project-filters";
import { snakeCaseToTitleCase } from "@/lib/utils";

export const DataFilters = () => {
  const workspaceId = useWorkspaceId();
  const { data: members, isLoading: isLoadindMembers } = useGetMembers({
    workspaceId,
  });

  const memberOptions = members?.populateMembers.map((member) => ({
    id: member.id,
    name: member.user.name,
  }));

  const [{ status, assigneeId, dueDate }, setFilters] = useProjectsFilters();

  const onStatusChange = (value: string) => {
    setFilters({ status: value === "all" ? null : (value as ProjectsStatus) });
  };
  const onAssigneeChange = (value: string) => {
    setFilters({ assigneeId: value === "all" ? null : (value as string) });
  };

  if (isLoadindMembers) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-2">
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
          <SelectItem value={ProjectsStatus.ACTIVE}>
            {snakeCaseToTitleCase(ProjectsStatus.ACTIVE)}
          </SelectItem>

          <SelectItem value={ProjectsStatus.ON_HOLD}>
            {snakeCaseToTitleCase(ProjectsStatus.ON_HOLD)}
          </SelectItem>

          <SelectItem value={ProjectsStatus.ARCHIVED}>
            {snakeCaseToTitleCase(ProjectsStatus.ARCHIVED)}
          </SelectItem>

          <SelectItem value={ProjectsStatus.COMPLETED}>
            {snakeCaseToTitleCase(ProjectsStatus.COMPLETED)}
          </SelectItem>
        </SelectContent>
      </Select>
      <Select
        defaultValue={assigneeId ?? undefined}
        onValueChange={(value) => onAssigneeChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <UserIcon className="size-4 mr-2" />
            <SelectValue placeholder="Owners" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Members</SelectItem>
          <SelectSeparator />
          {memberOptions?.map((member) => (
            <SelectItem value={member.id} key={member.id}>
              {member.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <DatePicker
        placeholder="Due Date"
        className="h-8 w-full lg:w-auto"
        value={dueDate ? new Date(dueDate) : undefined}
        onChange={(date) => {
          setFilters({ dueDate: date ? date.toISOString() : null });
        }}
      />
    </div>
  );
};
