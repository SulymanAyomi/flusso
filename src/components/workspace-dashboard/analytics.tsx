import { Card, CardContent, CardHeader, CardFooter } from "../ui/card";
import {
  ArrowDown,
  ArrowDownIcon,
  ArrowUp,
  ArrowUpIcon,
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

export const Analytics = () => {
  const workspaceId = useWorkspaceId();

  const { data: analytics, isLoading: isLoadingAnalytics } =
    useGetWorkspaceAnalytics({ workspaceId });

  if (isLoadingAnalytics) {
    const load = [1, 2, 3, 4];
    return (
      <div className="grid grid-cols-4 gap-4 py-2">
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
    <div className="grid grid-cols-4 gap-4 py-2">
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
              {formatTwoDigits(analytics?.activeProject!)}
            </div>
            <div className="text-xs">Projects in progress</div>
          </div>
          <div>
            <div className="text-xs flex flex-col items-start">
              <div className="flex gap-1 items-center ">
                <span className="p-1 bg-green-600 h-fit rounded-full"></span>
                <p>Total: {analytics?.totalProject}</p>
              </div>
              <div className="flex gap-1 items-center">
                <span className="p-1 bg-red-600 h-fit rounded-full"></span>
                <p>Over due: {analytics?.delayedProject}</p>
              </div>
              <div className="flex gap-1 items-center">
                <span className="p-1 bg-yellow-600 h-fit rounded-full"></span>
                <p>On hold: {analytics?.notStartedProject}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="px-3 py-0">
          <div className="flex flex-1  items-center justify-between">
            <div className="bg-green-700 text-green-100 text-[10px] rounded-[6px] py-1.5 px-1 flex items-center">
              <ArrowUp className="size-3" />
              {analytics?.percentageChange}% more than last month
            </div>
            <Link
              href={`workspaces/${workspaceId}/projects`}
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
              {formatTwoDigits(analytics?.taskCompleted!)}
            </div>
            <div className="text-xs">Task completed</div>
          </div>
          <div className="text-xs flex flex-col items-start">
            <div className="flex gap-1 items-center ">
              <span className="p-1 bg-green-600 h-fit rounded-full"></span>
              <p>Total: {analytics?.totalTask}</p>
            </div>
            <div className="flex gap-1 items-center ">
              <span className="p-1 bg-red-600 h-fit rounded-full"></span>
              <p>Overdue: {analytics?.overDueTask}</p>
            </div>
            <div className="flex gap-1 items-center ">
              <span className="p-1 bg-yellow-600 h-fit rounded-full"></span>
              <p>Unassigned: {analytics?.UnassignedTask}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="px-3 py-0">
          <div className="flex flex-1  items-center justify-between">
            <div className="bg-yellow-700 text-yellow-100 text-[10px] rounded-[6px] py-1.5 px-1 flex items-center">
              {PercentShow({ ...analytics?.TaskDiff! })}
            </div>
            <Link
              href={`workspaces/${workspaceId}/tasks`}
              className="text-[10px] flex items-center hover:underline hover:cursor-pointer"
            >
              view tasks
              <span>
                <ChevronRightIcon className="size-3" />
              </span>
            </Link>
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
            <div className="font-bold text-xl">
              {formatTwoDigits(analytics?.totalMember!)}
            </div>
            <div className="text-xs">Active member</div>
          </div>
          <div className="text-xs flex flex-col items-start">
            <div className="flex">
              <p className="font-semibold">This week</p>
            </div>
            <div className="pl-1">
              <div className="flex gap-1 items-center ">
                <span className="p-1 bg-blue-600 h-fit rounded-full"></span>
                <p>{analytics?.totalTasksUpdate} tasks updated</p>
              </div>
              <div className="flex gap-1 items-center ">
                <span className="p-1 bg-purple-600 h-fit rounded-full"></span>
                <p>{analytics?.totalComments} comments</p>
              </div>
            </div>

            {analytics?.totalViwer! > 0 && (
              <div className="flex gap-1 items-center ">
                <span className="p-1 bg-purple-600 h-fit rounded-full"></span>
                <p>{analytics?.totalViwer!} viwers</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="px-3 py-0">
          <div className="flex flex-1  items-center justify-between">
            <div className="bg-blue-700 text-blue-100 text-[10px] rounded-[6px] py-1.5 px-1 flex items-center">
              {analytics?.totalActivities} team activities this week
            </div>
            <div>
              <Link
                href={`workspaces/${workspaceId}/tasks`}
                className="text-[10px] flex items-center hover:underline hover:cursor-pointer"
              >
                view activities
                <span>
                  <ChevronRightIcon className="size-3" />
                </span>
              </Link>
            </div>
          </div>
        </CardFooter>
      </Card>
      <Card className="bg-red-100 text-red-900   flex flex-col  gap-6 py-6 shadow-sm">
        <CardHeader className="px-3 py-0">
          <div className="flex items-center justify-start">
            <div className="bg-red-700 text-red-100 rounded-full p-1 mr-2">
              <Stars className="size-3.5" />
            </div>
            <div className="text-sm font-semibold">AI Recommendations</div>
          </div>
        </CardHeader>
        <CardContent className="px-3 py-0 flex justify-between">
          <div className="flex flex-col gap-1">
            <div className="font-bold text-xl">02</div>
            <div className="text-xs">Recommendations</div>
          </div>
          <div className="text-xs flex flex-col items-start">
            <div className="flex gap-1 items-center ">
              <span className="p-1 bg-blue-600 h-fit rounded-full"></span>
              <p>5 task blocked</p>
            </div>
            <div className="flex gap-1 items-center ">
              <span className="p-1 bg-purple-600 h-fit rounded-full"></span>
              <p>3 critical alart</p>
            </div>
          </div>
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
  );
};

interface PercentShowProps {
  change: number;
  direction: string;
}
const PercentShow = ({ change, direction }: PercentShowProps) => {
  if (direction == "more") {
    return (
      <>
        <ArrowUpIcon className="size-3" />+{change}% more than last week
      </>
    );
  } else if (direction == "less") {
    return (
      <>
        <ArrowDownIcon className="size-3" />-{change}% less than last week
      </>
    );
  } else if (direction == "less") {
    <>{change}% less than last week</>;
  }
};
