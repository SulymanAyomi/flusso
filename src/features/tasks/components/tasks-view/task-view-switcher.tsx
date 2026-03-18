"use client";
import { useQueryState } from "nuqs";
import {
  Calendar,
  LayoutDashboard,
  Loader,
  PlusIcon,
  Table2Icon,
} from "lucide-react";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useCreateTaskModal } from "../../hooks/use-create-task-modal";
import { useTaskFilters } from "../../hooks/use-task-filters";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetTasks } from "../../api/use-get-tasks";
import { DataFilters } from "./data-filters";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { DataKanban } from "@/components/data-kanban";
import { useCallback } from "react";
import { useBulkUpdateTask } from "../../api/use-bulk-update-task";
import { TaskStatus } from "../../types";
import { DataCalendar } from "./data-calender";
import { useProjectId } from "@/features/projects/hooks/use-project-id";

interface TaskViewSwitcherProps {
  hideProjectFilter?: boolean;
}
export const TaskViewSwitcher = ({
  hideProjectFilter,
}: TaskViewSwitcherProps) => {
  const [{ assignedToId, projectId, dueDate, status, search }] =
    useTaskFilters();
  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table",
  });

  const { open } = useCreateTaskModal();
  const workspaceId = useWorkspaceId();
  const paramProjectId = useProjectId();
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
    assignedToId,
    status,
    projectId: paramProjectId || projectId,
    dueDate,
    search,
  });
  const { mutate: bulkupdate } = useBulkUpdateTask();
  const onKanbanChange = useCallback(
    (tasks: { id: string; status: TaskStatus; position: number }[]) => {
      bulkupdate({
        json: { tasks },
      });
    },
    [bulkupdate],
  );

  return (
    <Tabs defaultValue={view} onValueChange={setView} className="flex-1 w-full">
      <div className="h-full flex flex-col overflow-auto border-b px-4">
        <p className="text-lg font-semibold">All Tasks</p>
        <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center ">
          <TabsList className="w-full lg:w-fit bg-white pb-0  gap-4 justify-start">
            <TabsTrigger
              className="h-8 items-center w-full lg:w-auto px-3 py-0 text-black  rounded-none shadow-none bg-inherit data-[state=active]:border-b-2 data-[state=active]:bg-inherit data-[state=active]:border-b-[#1546e7] data-[state=active]:text-[#1546e7] data-[state=active]:font-bold data-[state=active]:shadow-none"
              value="table"
            >
              <div className="flex items-center justify-start">
                <Table2Icon className="size-6 mr-1" />
                <p>Table</p>
              </div>
            </TabsTrigger>
            <TabsTrigger
              className="h-8 items-center w-full lg:w-auto px-3 py-0 text-black rounded-none shadow-none bg-inherit data-[state=active]:border-b-2 data-[state=active]:bg-inherit  data-[state=active]:border-b-[#1546e7] data-[state=active]:text-[#1546e7] data-[state=active]:font-bold data-[state=active]:shadow-none"
              value="kanban"
            >
              <div className="flex items-center justify-start">
                <LayoutDashboard className="size-6 mr-1 " />
                <p>Kanban</p>
              </div>
            </TabsTrigger>
            <TabsTrigger
              className="h-8 items-center w-full lg:w-auto px-3 py-0 text-black rounded-none shadow-none bg-inherit data-[state=active]:border-b-2 data-[state=active]:bg-inherit data-[state=active]:border-b-[#1546e7] data-[state=active]:text-[#1546e7] data-[state=active]:font-bold data-[state=active]:shadow-none"
              value="calendar"
            >
              <div className="flex items-center justify-start">
                <Calendar className="size-6 mr-1 " />
                <p>Calender</p>
              </div>
            </TabsTrigger>
          </TabsList>
          <Button onClick={open} size="sm" className="w-full lg:w-auto">
            <PlusIcon className="size-4 mr-2" />
            New
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <DataFilters hideProjectFilter={hideProjectFilter} />
        <DottedSeparator className="my-4" />
        {isLoadingTasks ? (
          <div className="w-full border rounded-lg h-[200px] flex flex-col justify-center items-center">
            <Loader className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
              <DataTable
                columns={columns}
                data={tasks?.documents ?? []}
                hideproject={hideProjectFilter}
              />
            </TabsContent>
            <TabsContent value="kanban" className="mt-0">
              <DataKanban
                data={tasks?.documents ?? []}
                onChange={onKanbanChange}
              />
            </TabsContent>
            <TabsContent value="calendar" className="mt-0 h-full pb-4">
              <DataCalendar data={tasks?.documents ?? []} />
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};
