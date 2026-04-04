import { Card, CardContent, CardHeader, CardFooter } from "../ui/card";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BarChart2Icon,
  CheckIcon,
  ChevronRightIcon,
  Folder,
  Stars,
  Users2Icon,
} from "lucide-react";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetWorkspaceAnalytics } from "@/features/workspaces/api/use-get-workspace-analytics";
import { formatTwoDigits } from "@/lib/utils";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";

const Analytics = () => {
  const workspaceId = useWorkspaceId();

  const { data: analytics, isLoading: isLoadingAnalytics } =
    useGetWorkspaceAnalytics({ workspaceId });

  if (isLoadingAnalytics) {
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
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 py-2">
      <Card className="bg-violet-100 text-violet-900   flex flex-col  gap-6 py-6 shadow-sm">
        <CardHeader className="px-3 py-0">
          <div className="flex items-center justify-start">
            <div className="bg-violet-700 text-violet-100 rounded-full p-1 mr-2">
              <BarChart2Icon className="size-3.5" />
            </div>
            <div className="text-sm font-semibold">Project Completed</div>
          </div>
        </CardHeader>
        <CardContent className="px-3 py-0 flex justify-between">
          <div className="flex flex-col gap-1">
            <div className="font-bold text-xl">{analytics?.totalProjects}</div>
            <div className="text-xs">Project completed</div>
          </div>
        </CardContent>
        <CardFooter className="px-3 py-0">
          <div className="flex flex-1  items-center justify-between">
            <div className=" text-[10px] rounded-[6px] py-1.5 px-1 flex items-center bg-violet-700 text-violet-100">
              <ArrowUpIcon className="size-3" />
              15% since last month
            </div>
            <Link
              href={`/workspaces/${workspaceId}/projects`}
              className="text-[10px] flex items-center hover:underline hover:cursor-pointer"
            >
              view projects
              <span>
                <ChevronRightIcon className="size-3" />
              </span>
            </Link>{" "}
          </div>
        </CardFooter>
      </Card>
      {/* Project overview */}
      <Card className=" bg-green-100 text-green-900 flex flex-col gap-6 py-6 shadow-sm">
        <CardHeader className="px-3 py-0">
          <div className="flex items-center justify-start">
            <div className="bg-green-700 text-white rounded-full p-1 mr-2">
              <Folder className="size-3.5" />
            </div>
            <div className="text-sm font-semibold">Project Overview</div>
          </div>
        </CardHeader>
        <CardContent className="px-3 py-0 flex justify-between">
          <div className="flex flex-col gap-1">
            <div className="font-bold text-xl">
              {analytics?.activeProjects!}
            </div>
            <div className="text-xs">Projects in progress</div>
          </div>
          <div>
            <div className="text-xs  flex-col items-start hidden md:flex">
              <div className="flex gap-1 items-center ">
                <span className="p-1 bg-green-600 h-fit rounded-full"></span>
                <p>Total: {analytics?.totalProjects}</p>
              </div>
              <div className="flex gap-1 items-center">
                <span className="p-1 bg-red-600 h-fit rounded-full"></span>
                <p>Overdue: {analytics?.overdueProjects}</p>
              </div>
              <div className="flex gap-1 items-center">
                <span className="p-1 bg-yellow-600 h-fit rounded-full"></span>
                <p>Onhold: {analytics?.onHoldProjects}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="px-3 py-0">
          <div className="flex flex-1 flex-col md:flex-row items-start justify-start gap-1 md:items-center  md:justify-between">
            <div className="bg-green-700 text-green-100 text-[10px] rounded-[6px] py-1.5 px-1 flex items-center">
              {PercentShow({ data: analytics?.projectChange })}
            </div>
            <Link
              href={`/workspaces/${workspaceId}/projects`}
              className="text-[10px] flex items-center hover:underline hover:cursor-pointer"
            >
              view projects
              <span>
                <ChevronRightIcon className="size-3" />
              </span>
            </Link>
          </div>
        </CardFooter>
      </Card>
      {/* Task overview */}
      <Card className=" bg-yellow-100 text-yellow-900  flex flex-col gap-6 py-6 shadow-sm">
        <CardHeader className="px-3 py-0">
          <div className="flex items-center justify-start">
            <div className="bg-yellow-700 text-yellow-100  rounded-full p-1 mr-2">
              <CheckIcon className="size-3.5" />
            </div>
            <div className="text-sm font-semibold">Task Overview</div>
          </div>
        </CardHeader>
        <CardContent className="px-3 py-0 flex justify-between">
          <div className="flex flex-col gap-1">
            <div className="font-bold text-xl">
              {analytics?.completedTasks!}
            </div>
            <div className="text-xs">Task completed</div>
          </div>
          <div className="text-xs  flex-col items-start hidden md:flex">
            <div className="flex gap-1 items-center ">
              <span className="p-1 bg-green-600 h-fit rounded-full"></span>
              <p>Total: {analytics?.totalTasks}</p>
            </div>
            <div className="flex gap-1 items-center ">
              <span className="p-1 bg-red-600 h-fit rounded-full"></span>
              <p>Overdue: {analytics?.overdueTasks}</p>
            </div>
            <div className="flex gap-1 items-center ">
              <span className="p-1 bg-yellow-600 h-fit rounded-full"></span>
              <p>Unassigned: {analytics?.unassignedTasks}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="px-3 py-0">
          <div className="flex flex-1 flex-col md:flex-row items-start justify-start gap-1 md:items-center  md:justify-between">
            <div className="bg-yellow-700 text-yellow-100 text-[10px] rounded-[6px] py-1.5 px-1 flex items-center">
              {PercentShow({ data: analytics?.taskChange })}
            </div>
            {/* <Link
              href={`workspaces/${workspaceId}/tasks`}
              className="text-[10px] flex items-center hover:underline hover:cursor-pointer"
            >
              view tasks
              <span>
                <ChevronRightIcon className="size-3" />
              </span>
            </Link> */}
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
            <div className="text-sm font-semibold">Team members</div>
          </div>
        </CardHeader>
        <CardContent className="px-3 py-0 flex justify-between">
          <div className="flex flex-col gap-1">
            <div className="font-bold text-xl">{analytics?.activeMembers!}</div>
            <div className="text-xs">Active member</div>
          </div>
          <div className="text-xs flex-col items-start hidden md:flex">
            <div className="flex">
              <p className="font-semibold">This week</p>
            </div>
            <div className="pl-1">
              <div className="flex gap-1 items-center ">
                <span className="p-1 bg-blue-600 h-fit rounded-full"></span>
                <p>{analytics?.taskUpdates} tasks updated</p>
              </div>
              <div className="flex gap-1 items-center ">
                <span className="p-1 bg-purple-600 h-fit rounded-full"></span>
                <p>{analytics?.comments} comments</p>
              </div>
            </div>

            {analytics?.viewers! > 0 && (
              <div className="flex gap-1 items-center ">
                <span className="p-1 bg-purple-600 h-fit rounded-full"></span>
                <p>{analytics?.viewers!} viwers</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="px-3 py-0">
          <div className="flex flex-1 flex-col md:flex-row items-start justify-start gap-1 md:items-center  md:justify-between">
            <div className="bg-blue-700 text-blue-100 text-[10px] rounded-[6px] py-1.5 px-1 flex items-center">
              {analytics?.totalActivities} team activities this week
            </div>
            <div>
              {/* <Link
                href={`workspaces/${workspaceId}/tasks`}
                className="text-[10px] flex items-center hover:underline hover:cursor-pointer"
              >
                view activities
                <span>
                  <ChevronRightIcon className="size-3" />
                </span>
              </Link> */}
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Analytics;
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
