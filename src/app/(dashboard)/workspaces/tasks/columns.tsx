"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Task } from "@/features/tasks/types";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreVertical } from "lucide-react";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
// import { MemberAvatar } from "@/features/members/components/member-avatar";
// import { TaskDate } from "./task-date";
// import { snakeCaseToTitleCase } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { TaskActions } from "./components/task-actions";
import { DataFilters } from "@/features/tasks/components/data-filters";
// import { TaskActions } from "./task-actions";

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Task Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.original.name;
      return <p className="line-clamp-1">{name}</p>;
    },
  },
  {
    accessorKey: "projects",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Project
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      // const project = row.original.project;
      return (
        <div className="flex items-center gap-x-2 font-medium">
          <ProjectAvatar className="size-6" name={"project.name"} image={""} />
          <p className="line-clamp-1">project.name</p>
        </div>
      );
    },
  },
  {
    accessorKey: "assignee",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Assignee
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      // const assignee = row.original.assignee;
      // if (assignee) {
      return (
        <div className="flex items-center gap-x-2 font-medium">
          <MemberAvatar
            className="size-6"
            fallbackClassName="text-xs"
            name={"Assignee"}
          />
          <p className="line-clamp-1">Assignee name</p>
        </div>
      );
      // }
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Due Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      // const dueDate = row.original.dueDate;
      return "23 May, 2023";
      // <TaskDate value={dueDate} />;
    },
  },
  {
    accessorKey: "piority",
    header: ({ column }) => {
      return (
        <div className="flex items-center justify-center text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Priority
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={"default"}>
          {
            // snakeCaseToTitleCase(status)
            "Low"
          }
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={"destructive"}>
          {
            // snakeCaseToTitleCase(status)
            "Todo"
          }
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      // const id = row.original?.$id;
      // const projectId = row.original.projectId;
      return (
        <TaskActions id={"id"} projectId={"projectId"}>
          <Button variant="ghost">
            <MoreVertical className="size-4" />
          </Button>
        </TaskActions>
      );
    },
  },
];

export const DataFilters1 = () => {
  return <DataFilters />;
};
