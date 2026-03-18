import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Archive,
  ArrowUp,
  CalendarClockIcon,
  Check,
  CheckIcon,
  ChevronRightIcon,
  FilterIcon,
  FlagIcon,
  Folder,
  Layout,
  LayoutGridIcon,
  LayoutIcon,
  LayoutList,
  MenuIcon,
  MoreVerticalIcon,
  Plus,
  SearchIcon,
  TriangleAlert,
  XIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { columns, DataFilters1 } from "./columns";
import { DataTable } from "./components/data-table";
import { KanbanColumnHeader } from "@/components/kanban-column-header";
import { TaskStatus } from "@/features/tasks/types";
// import KanbanCard from "@/components/kaban-card";

const MyTasks = () => {
  const task = [
    {
      name: "Design homepage",
      status: "Todo",
      workspaceId: "string",
      assigneeId: "Ayomi",
      projectId: "string555",
      position: "100",
      duedate: "string",
      description: "loremisp mmmhu ggujn kkk",
    },
    {
      name: "Design homepage homepage",
      status: "Todo",
      workspaceId: "string",
      assigneeId: "Ayomi",
      projectId: "string555",
      position: "100",
      duedate: "string",
      description: "loremisp mmmhu ggujn kkk",
    },
    {
      name: "Design homepage homepage",
      status: "Todo",
      workspaceId: "string",
      assigneeId: "Ayomi",
      projectId: "string555",
      position: "100",
      duedate: "string",
      description: "loremisp mmmhu ggujn kkk",
    },
    {
      name: "Design homepage homepage",
      status: "Todo",
      workspaceId: "string",
      assigneeId: "Ayomi",
      projectId: "string555",
      position: "100",
      duedate: "string",
      description: "loremisp mmmhu ggujn kkk",
    },
    {
      name: "Design homepage homepage",
      status: "Todo",
      workspaceId: "string",
      assigneeId: "Ayomi",
      projectId: "string555",
      position: "100",
      duedate: "string",
      description: "loremisp mmmhu ggujn kkk",
    },
    {
      name: "Design homepage homepage",
      status: "Todo",
      workspaceId: "string",
      assigneeId: "Ayomi",
      projectId: "string555",
      position: "100",
      duedate: "string",
      description: "loremisp mmmhu ggujn kkk",
    },
    {
      name: "Design homepage homepage",
      status: "Todo",
      workspaceId: "string",
      assigneeId: "Ayomi",
      projectId: "string555",
      position: "100",
      duedate: "string",
      description: "loremisp mmmhu ggujn kkk",
    },
  ];

  const boards: TaskStatus[] = [
    TaskStatus.BACKLOG,
    TaskStatus.TODO,
    TaskStatus.IN_PROGRESS,
    TaskStatus.IN_REVIEW,
    TaskStatus.DONE,
  ];

  return (
    <div>
      <div className="flex justify-between items-center bg-[#1546E7] px-3 py-8">
        <div className="flex flex-col gap-2">
          <div>
            <h1 className="text-white font-bold text-2xl">Welcome, Ayomi</h1>
          </div>
          <div className="text-white text-xs">
            Start to manage your workspaces and their projects here
          </div>
        </div>
        <div>
          <Button
            variant="secondary"
            className="rounded-[12px] text-[#1546E7] font-semibold text-[12px]"
          >
            <Plus /> <span>Create New Workspace</span>
          </Button>
        </div>
      </div>
      <div className="flex gap-1 text-xs px-3 py-1">
        <div className="flex items-center text-neutral-500 text-xs">
          <span className="mr-1">
            <Folder className="size-3" />
          </span>
          My Tasks
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 px-3 py-2">
        <div className="flex items-center">
          <div className="flex font-semibold items-start">
            <h2 className="text-[32px] font-semibold">My Tasks</h2>
            <div className="text-[8px] text-blue-700">12</div>
          </div>
          <div className="flex bg-white border rounded-3xl p-0.5">
            <div className="px-2 py-1 rounded-2xl  bg-blue-700 text-white">
              <LayoutIcon className="size-4" />
            </div>
            <div className="px-2 py-1 rounded-2xl">
              <LayoutGridIcon className="size-4" />
            </div>
          </div>
        </div>
        <div className="flex gap-6">
          <div className="border rounded-xl flex items-center gap-1 text-gray-600 text-xs p-2">
            <Archive className="size-4" />
            <span>Archived</span>
          </div>
          <div className="border rounded-xl flex items-center gap-1 text-gray-600 text-xs p-2 cursor-pointer">
            <FilterIcon className="size-4" />
            <span>Show Filters</span>
          </div>
          <div className="flex-1">
            <div className="relative">
              <div className="absolute text-neutral-500 left-1.5 bottom-2.5">
                <SearchIcon className="size-4" />
              </div>
              <Input placeholder="Search" className="pl-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="px-3 w-full bg-white">
        {/* small top cards */}

        <div className="grid grid-cols-4 gap-4 py-2">
          <Card className=" bg-green-100 text-green-900 flex flex-col gap-6 py-6 shadow-sm">
            <CardHeader className="px-3 py-0">
              <div className="flex items-center justify-start">
                <div className="bg-green-700 text-white rounded-full p-1 mr-2">
                  <Folder className="size-3.5" />
                </div>
                <div className="text-sm font-semibold">Total Tasks</div>
              </div>
            </CardHeader>
            <CardContent className="px-3 py-0 flex justify-between">
              <div className="flex flex-col gap-1">
                <div className="font-bold text-xl">02</div>
                <div className="text-xs">Assigned tasks</div>
              </div>
            </CardContent>
            {/* <CardFooter className="px-3 py-0">
            <div className="flex flex-1  items-center justify-between">
              <div className="bg-green-700 text-green-100 text-[10px] rounded-[6px] py-1.5 px-1 flex items-center">
                <ArrowUp className="size-3" />
                15% more than last month
              </div>
              <div className="text-[10px] flex items-center hover:underline hover:cursor-pointer">
                view projects
                <span>
                  <ChevronRightIcon className="size-3" />
                </span>
              </div>
            </div>
          </CardFooter> */}
          </Card>
          <Card className=" bg-yellow-100 text-yellow-900  flex flex-col gap-6 py-6 shadow-sm">
            <CardHeader className="px-3 py-0">
              <div className="flex items-center justify-start">
                <div className="bg-yellow-700 text-yellow-100  rounded-full p-1 mr-2">
                  <CheckIcon className="size-3.5" />
                </div>
                <div className="text-sm font-semibold">Task Completed</div>
              </div>
            </CardHeader>
            <CardContent className="px-3 py-0 flex justify-between">
              <div className="flex flex-col gap-1">
                <div className="font-bold text-xl">02</div>
                <div className="text-xs">Task completed</div>
              </div>
            </CardContent>
          </Card>
          <Card className=" bg-blue-100 text-blue-950 flex flex-col gap-6 py-6 shadow-sm">
            <CardHeader className="px-3 py-0">
              <div className="flex items-center justify-start">
                <div className="bg-blue-700 text-white rounded-full p-1 mr-2">
                  <CalendarClockIcon className="size-3.5" />
                </div>
                <div className="text-sm font-semibold">Due this week</div>
              </div>
            </CardHeader>
            <CardContent className="px-3 py-0 flex justify-between">
              <div className="flex flex-col gap-1">
                <div className="font-bold text-xl">02</div>
                <div className="text-xs">Tasks to be completed this week</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-red-100 text-red-900   flex flex-col  gap-6 py-6 shadow-sm">
            <CardHeader className="px-3 py-0">
              <div className="flex items-center justify-start">
                <div className="bg-red-700 text-red-100 rounded-full p-1 mr-2">
                  <TriangleAlert className="size-3.5" />
                </div>
                <div className="text-sm font-semibold">Overdue Tasks</div>
              </div>
            </CardHeader>
            <CardContent className="px-3 py-0 flex justify-between">
              <div className="flex flex-col gap-1">
                <div className="font-bold text-xl">02</div>
                <div className="text-xs">Task(s) passed due date</div>
              </div>
              {/* <div className="text-xs flex flex-col items-start">
                <div className="flex gap-1 items-center ">
                  <span className="p-1 bg-blue-600 h-fit rounded-full"></span>
                  <p>5 task blocked</p>
                </div>
                <div className="flex gap-1 items-center ">
                  <span className="p-1 bg-purple-600 h-fit rounded-full"></span>
                  <p>3 critical alart</p>
                </div>
              </div> */}
            </CardContent>
            {/* <CardFooter className="px-3 py-0">
                    <div className="flex flex-1  items-center justify-between">
                      <div className=" text-[10px] rounded-[6px] py-1.5 px-1 flex items-center">
                        <ArrowUp className="size-3" />
                        15% more than last month
                      </div>
                      <div className="text-[10px] underline">view projects</div>
                    </div>
                  </CardFooter> */}
          </Card>
        </div>

        <div className="w-full">
          <DataFilters1 />
        </div>
        {/* my tasks table */}
        {/* <DataTable columns={columns} data={task ?? []} /> */}

        {/* my tasks kanban */}
        {/* <div className="flex overflow-x-auto">
          {boards.map((board) => {
            return (
              <div
                key={board}
                className="flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px]"
              >
                <KanbanColumnHeader board={board} taskCount={board.length} />
                <Droppable droppableId={board}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="min-h-[200px] py-1.5"
                    >
                      {tasks[board].map((task, index) => (
                        <Draggable
                          key={task.$id}
                          draggableId={task.$id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.dragHandleProps}
                              {...provided.draggableProps}
                            >
                              <KanbanCard />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div> */}
      </div>
    </div>
  );
};

export default MyTasks;
