import { useGetProjectAnalytics } from "@/features/projects/api/use-get-project-analytics";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  ArrowDownIcon,
  ArrowUp,
  ArrowUpIcon,
  CheckIcon,
  ChevronRightIcon,
  Folder,
  TriangleAlert,
  Users2Icon,
} from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

const ProjectsAnalytics = () => {
  const workspaceId = useWorkspaceId();
  const { data, isLoading: isLoadingAnalytics } = useGetProjectAnalytics({
    workspaceId,
  });
  if (isLoadingAnalytics || !data) {
    const load = [1, 2, 3, 4];
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-2">
        {load.map((l) => (
          <Card
            key={l}
            className="bg-white text-red-900   flex flex-col  gap-6 py-6 shadow-sm"
          >
            <CardHeader className="px-3 py-0">
              <div className="flex items-center justify-start">
                <div className="p-1 mr-2">
                  <Skeleton className="size-5 rounded-full" />
                </div>
                <div className="w-full">
                  <Skeleton className="h-5" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-3 py-0 flex justify-between">
              <div className="flex flex-col gap-1">
                <Skeleton className="w-5 h-5" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="text-xs flex flex-col items-start">
                <Skeleton className="h-8 w-[94px]" />
              </div>
            </CardContent>
            <CardFooter className="px-3 py-0">
              <div className="flex flex-1  items-center justify-between">
                <Skeleton className="w-[144px] h-[29px]" />
                <Skeleton className="w-[54px] h-[12px]" />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-2">
      <Card className=" bg-green-100 text-green-900 flex flex-col gap-6 py-6 shadow-sm">
        <CardHeader className="px-3 py-0">
          <div className="flex items-center justify-start">
            <div className="bg-green-700 text-white rounded-full p-1 mr-2">
              <CheckIcon className="size-3.5" />
            </div>
            <div className="text-sm font-semibold">Task Completed</div>
          </div>
        </CardHeader>
        <CardContent className="px-3 py-0 flex justify-between">
          <div className="flex flex-col gap-1">
            <div className="font-bold text-xl">{data?.completedTasks}</div>
            <div className="text-xs">Tasks completed</div>
          </div>
          <div>
            <div className="text-xs flex flex-col items-start">
              <div className="flex gap-1 items-center ">
                <span className="p-1 bg-green-600 h-fit rounded-full"></span>
                <p>Total: {data.totalTasks}</p>
              </div>
              <div className="flex gap-1 items-center">
                <span className="p-1 bg-red-600 h-fit rounded-full"></span>
                <p>Over due: {data.overdueTasks}</p>
              </div>
              <div className="flex gap-1 items-center ">
                <span className="p-1 bg-yellow-600 h-fit rounded-full"></span>
                <p>unassigned: {data.unassignedTasks}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="px-3 py-0">
          <div className="flex flex-1  items-center justify-end">
            <div className="text-[10px] flex items-center hover:underline hover:cursor-pointer">
              view tasks
              <span>
                <ChevronRightIcon className="size-3" />
              </span>
            </div>
          </div>
        </CardFooter>
      </Card>
      <Card className=" bg-red-100 text-red-900 flex flex-col gap-6 py-6 shadow-sm">
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
            <div className="font-bold text-xl">
              {data!.thisweekOverdueTasks}
            </div>
            <div className="text-xs">Task overdue this week</div>
          </div>
          <div>
            <div className="text-xs flex flex-col items-start">
              <div className="flex gap-1 items-center ">
                <span className="p-1 bg-red-600 h-fit rounded-full"></span>
                <p>High: {data.thisweekHighPriorityTasks}</p>
              </div>
              <div className="flex gap-1 items-center">
                <span className="p-1 bg-red-400 h-fit rounded-full"></span>
                <p>Medium: {data.thisweekMediumPriorityTasks}</p>
              </div>
              <div className="flex gap-1 items-center ">
                <span className="p-1 bg-red-300 h-fit rounded-full"></span>
                <p>Low: {data.thisweekLowPriorityTasks}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="px-3 py-0">
          <div className="flex flex-1  items-center justify-between">
            <div className="bg-red-700 text-red-100 text-[10px] rounded-[6px] py-1.5 px-1 flex items-center">
              <PercentShow data={data.taskChange} />
            </div>
          </div>
        </CardFooter>
      </Card>
      <Card className=" bg-yellow-100 text-yellow-900  flex flex-col gap-6 py-6 shadow-sm">
        <CardHeader className="px-3 py-0">
          <div className="flex items-center justify-start">
            <div className="bg-yellow-700 text-white rounded-full p-1 mr-2">
              <Folder className="size-3.5" />
            </div>
            <div className="text-sm font-semibold">My Tasks</div>
          </div>
        </CardHeader>
        <CardContent className="px-3 py-0 flex justify-between">
          <div className="flex flex-col gap-1">
            <div className="font-bold text-xl">{data.myTotalOverdueTasks}</div>
            <div className="text-xs">Tasks assigned</div>
          </div>
          <div>
            <div className="text-xs flex flex-col items-start">
              <div className="flex gap-1 items-center ">
                <span className="p-1 bg-green-600 h-fit rounded-full"></span>
                <p>Completed: {data.completedAssignedTasks}</p>
              </div>
              <div className="flex gap-1 items-center ">
                <span className="p-1 bg-red-600 h-fit rounded-full"></span>
                <p>Overdue: {data.myTotalOverdueTasks}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="px-3 py-0">
          <div className="flex flex-1  items-center justify-between">
            <div className="bg-yellow-700 text-yellow-100 text-[10px] rounded-[6px] py-1.5 px-1 flex items-center">
              {data.completedAssignedTaskspercentage.change}% tasks completed
            </div>
          </div>
        </CardFooter>
      </Card>
      {/* Team memeber */}
      <Card className=" bg-blue-100 text-blue-950 flex flex-col gap-6 py-6 shadow-sm">
        <CardHeader className="px-3 py-0">
          <div className="flex items-center justify-start">
            <div className="bg-blue-700 text-white rounded-full p-1 mr-2">
              <Users2Icon className="size-3.5" />
            </div>
            <div className="text-sm font-semibold">Team member</div>
          </div>
        </CardHeader>
        <CardContent className="px-3 py-0 flex justify-between">
          <div className="flex flex-col gap-1">
            <div className="font-bold text-xl">{data.activeMembers}</div>
            <div className="text-xs">Active member</div>
          </div>

          <div className="text-xs flex flex-col items-start">
            <div className="flex">
              <p className="font-semibold">This week</p>
            </div>
            <div className="pl-1">
              <div className="flex gap-1 items-center ">
                <span className="p-1 bg-blue-600 h-fit rounded-full"></span>
                <p>{data?.comments} tasks updated</p>
              </div>
              <div className="flex gap-1 items-center ">
                <span className="p-1 bg-purple-600 h-fit rounded-full"></span>
                <p>{data?.taskUpdates} comments</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="px-3 py-0">
          <div className="flex flex-1  items-center justify-end">
            <div className="text-[10px] underline">view members</div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

interface PercentShowProps {
  data: { change: number; direction: string } | undefined;
}
const PercentShow = ({ data }: PercentShowProps) => {
  if (!data) {
    return <>0 changes from last week</>;
  }
  if (data.direction == "up") {
    return (
      <>
        <ArrowUpIcon className="size-3" />+{data.change}% more than last week
      </>
    );
  }
  if (data.direction == "down") {
    return (
      <>
        <ArrowDownIcon className="size-3" />-{data.change}% less than last week
      </>
    );
  }
  if (data.direction == "neutral") {
    return <>{data.change} changes from last week</>;
  }
};

export default ProjectsAnalytics;
