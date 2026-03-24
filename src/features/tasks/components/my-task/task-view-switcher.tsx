"use client";
import { useQueryState } from "nuqs";
import {
  Calendar,
  FilterIcon,
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
import { DataTable } from "../tasks-view/data-table";
import { columns } from "./columns";
import { DataKanban } from "@/components/data-kanban";
import { useCallback, useState } from "react";
import { TaskStatus } from "../../types";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { DataCalendar } from "../tasks-view/data-calender";
import { useBulkUpdateTask } from "../../api/use-bulk-update-task";
import { DataFilters } from "./data-filters";
import { cn } from "@/lib/utils";
import {
  endOfDay,
  endOfISOWeek,
  endOfToday,
  endOfWeek,
  startOfToday,
  startOfWeek,
} from "date-fns";
import { useGetMyTasks } from "../../api/use-get-my-tasks";

interface TaskViewSwitcherProps {
  hideProjectFilter?: boolean;
}
export const TaskViewSwitcher = ({
  hideProjectFilter,
}: TaskViewSwitcherProps) => {
  const [
    { assignedToId, projectId, dueDate, status, search, fromDate, toDate },
    setFilters,
  ] = useTaskFilters();
  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table",
  });
  const [showFilter, setShowFilter] = useState(false);
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "thisWeek">(
    "all",
  );
  const { open } = useCreateTaskModal();
  const workspaceId = useWorkspaceId();
  const paramProjectId = useProjectId();
  const { data: tasks, isLoading: isLoadingTasks } = useGetMyTasks({
    workspaceId,
    status,
    projectId: paramProjectId || projectId,
    dueDate,
    search,
    fromDate,
    toDate,
  });

  const updateFilter = ({
    filter,
  }: {
    filter: "all" | "today" | "thisWeek";
  }) => {
    const now = new Date();

    setDateFilter(filter);
    if (filter == "all") {
      setFilters({
        status: null,
        projectId: null,
        dueDate: null,
        search: null,
        toDate: null,
        fromDate: null,
      });
    }
    if (filter == "today") {
      setFilters({
        status: null,
        projectId: null,
        search: null,
        dueDate: null,
        toDate: endOfToday().toISOString(),
        fromDate: startOfToday().toISOString(),
      });
    }
    if (filter == "thisWeek") {
      setFilters({
        status: null,
        projectId: null,
        search: null,
        dueDate: null,
        toDate: endOfWeek(now, { weekStartsOn: 1 }).toISOString(),
        fromDate: startOfWeek(now, { weekStartsOn: 1 }).toISOString(),
      });
    }
  };

  return (
    <Tabs defaultValue={view} onValueChange={setView} className="flex-1 w-full">
      <div className="h-full flex flex-col overflow-auto border-b px-4">
        <div className="flex flex-row items-start md:items-center  justify-between mb-3">
          <p className="text-lg font-semibold">
            My Tasks{" "}
            <sup className="font-sans text-xs align-top mt-1 inline-block bg-brand1 text-white rounded-full text-center px-1">
              {tasks?.total}
            </sup>
          </p>
          <div className=" flex gap-3 lg:gap-6">
            <div className="flex flex-row flex-nowrap gap-1.5">
              <div
                className={cn(
                  "text-[10px] px-2.5 py-1 rounded-xl flex items-center border cursor-pointer text-neutral-700 transition",
                  dateFilter == "all" && "bg-brand1 text-white  border-brand1",
                )}
                onClick={() => updateFilter({ filter: "all" })}
              >
                All
              </div>
              <div
                className={cn(
                  "text-[10px] px-2.5 py-1 rounded-xl flex items-center border cursor-pointer text-neutral-700 transition",
                  dateFilter == "today" &&
                    "bg-brand1 text-white  border-brand1",
                )}
                onClick={() => updateFilter({ filter: "today" })}
              >
                Today
              </div>
              <div
                className={cn(
                  "text-[10px] px-2.5 py-1 rounded-xl flex items-center border cursor-pointer text-neutral-700 transition",
                  dateFilter == "thisWeek" &&
                    "bg-brand1 text-white  border-brand1",
                )}
                onClick={() => updateFilter({ filter: "thisWeek" })}
              >
                This week
              </div>
            </div>
            <div
              className={cn(
                "cursor-pointer border rounded-xl flex items-center gap-1 text-gray-600 text-xs p-2 w-fit",
                showFilter && "text-white bg-blue-700",
              )}
              onClick={() => setShowFilter(!showFilter)}
            >
              <FilterIcon className="size-4" />
              <span className="hidden lg:flex">Show Filters</span>
            </div>
          </div>
        </div>
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
        {showFilter && (
          <div
            className={cn(
              "transition-all duration-1000 ease-in-out opacity-0 -translate-y-2",
              showFilter && "opacity-100 translate-y-0  ",
            )}
          >
            <DottedSeparator className="my-4" />
            <DataFilters />
            <DottedSeparator className="my-4" />
          </div>
        )}

        {isLoadingTasks ? (
          <div className="w-full border rounded-lg h-[200px] flex flex-col justify-center items-center mt-2">
            <Loader className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-2">
              <DataTable
                columns={columns}
                data={tasks?.documents ?? []}
                hideproject={hideProjectFilter}
              />
            </TabsContent>

            <TabsContent value="calendar" className="mt-2 h-full pb-4">
              <DataCalendar data={tasks?.documents ?? []} />
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};
