import { Card, CardContent, CardHeader, CardFooter } from "../ui/card";
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  ArrowDown,
  ArrowDownIcon,
  ArrowUp,
  ArrowUpIcon,
  BarChart2Icon,
  CheckCircle2Icon,
  CheckIcon,
  ChevronRightIcon,
  Folder,
  LucideCircleStop,
  Stars,
  StopCircleIcon,
  TriangleAlertIcon,
  Users2Icon,
} from "lucide-react";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { formatTwoDigits } from "@/lib/utils";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { useGetWorkspaceTasksAnalytics } from "@/features/workspaces/api/use-get-my-task-analytics";
import { Tooltip, TooltipContent } from "../ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";

export const MyTaskAnalytics = () => {
  const sampleData = {
    attention: {
      overdue: { count: 3, projects: ["Project Alpha", "Project Beta"] },
      dueToday: { count: 5 },
      highPriority: { count: 12, percentage: 35 },
    },
    workInProgress: {
      inProgress: 4,
      longestOpen: { days: 18, title: "Update API documentation for v2.0" },
    },
    momentum: {
      completedThisWeek: { count: 7, trend: 2, direction: "up" },
      avgCompletionTime: 3.2,
      projectsTouched: { current: 3, total: 5 },
    },
    priorities: {
      distribution: {
        high: 35,
        medium: 45,
        low: 20,
      },
      totalTasks: 43,
      status: "healthy", // healthy, caution, unhealthy
    },
  };
  const statusConfig = {
    healthy: {
      label: "Well-balanced priorities",
      icon: CheckCircle2Icon,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    caution: {
      label: "Many high-priority tasks—review if all are urgent",
      icon: AlertTriangleIcon,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
    },
    unhealthy: {
      label: "Priority inflation detected—consider re-prioritizing",
      icon: AlertCircleIcon,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
  };
  const data = sampleData.priorities;
  const workspaceId = useWorkspaceId();

  const { data: analytics, isLoading: isLoadingAnalytics } =
    useGetWorkspaceTasksAnalytics({ workspaceId });

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
  const config =
    statusConfig[analytics?.priortyCard.health.status ?? "healthy"];
  const StatusIcon = config.icon;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-2">
      {/* Tasks Overdue */}
      <Card className="bg-red-100 text-red-900 flex flex-col gap-6 py-6 shadow-sm">
        <CardHeader className="px-3 py-0">
          <div className="flex items-center justify-start">
            <div className="bg-red-700 text-red-100 rounded-full p-1 mr-2">
              <TriangleAlertIcon className="size-3.5" />
            </div>
            <div className="text-sm font-semibold">Urgent Tasks</div>
          </div>
        </CardHeader>
        <CardContent className="px-3 py-0 flex justify-between">
          <div className="flex flex-col gap-1">
            <div className="font-bold text-xl">
              {analytics?.overdueAndUrgent.total}
            </div>
            <div className="text-xs">Task past due</div>
          </div>
          <div>
            <div className="text-xs flex flex-col items-start">
              <div className="flex gap-1 items-center ">
                <span className="p-1 bg-red-600 h-fit rounded-full"></span>
                <p>High priority: {analytics?.overdueAndUrgent.high}</p>
              </div>
              <div className="flex gap-1 items-center ">
                <span className="p-1 bg-yellow-600 h-fit rounded-full"></span>
                <p>Due today: {analytics?.overdueAndUrgent.dueToday}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="px-3 py-0">
          <div className="flex flex-1  items-center justify-between">
            <div className="bg-red-700 text-red-100 text-[10px] rounded-[6px] py-1.5 px-1 flex items-center">
              {analytics?.overdueAndUrgent.trendDirection == "up" ? (
                <ArrowUpIcon className="size-3" />
              ) : analytics?.overdueAndUrgent.trendDirection == "down" ? (
                <ArrowDownIcon className="size-3" />
              ) : null}
              {analytics?.overdueAndUrgent.trend} since yesterday
            </div>
            <Link
              href={`workspaces/${workspaceId}/tasks`}
              className="text-[10px] flex items-center hover:underline hover:cursor-pointer"
            >
              view overdue
              <span>
                <ChevronRightIcon className="size-3" />
              </span>
            </Link>
          </div>
        </CardFooter>
      </Card>
      {/* Task Blocked */}
      <Card className=" bg-yellow-100 text-yellow-900  flex flex-col gap-6 py-6 shadow-sm">
        <CardHeader className="px-3 py-0">
          <div className="flex items-center justify-start">
            <div className="bg-yellow-700 text-yellow-100  rounded-full p-1 mr-2">
              <StopCircleIcon className="size-3.5" />
            </div>
            <div className="text-sm font-semibold">Tasks dependency</div>
          </div>
        </CardHeader>
        <CardContent className="px-3 py-0 flex justify-between">
          <div className="flex flex-col gap-1">
            <div className="font-bold text-xl">
              {" "}
              {analytics?.taskDependency.awaitingDependencies.count}
            </div>
            <div className="text-xs">Awaiting dependencies</div>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <div className="font-bold text-xl">
              {" "}
              {analytics?.taskDependency.blockingOthers.count}
            </div>
            <div className="text-xs text-end">Blocking others</div>
          </div>
        </CardContent>
        <CardFooter className="px-3 py-0">
          <div className="flex flex-1  items-center justify-between">
            <div className="bg-yellow-700 text-yellow-100 text-[10px] rounded-[6px] py-1.5 px-1 flex items-center">
              {
                analytics?.taskDependency.awaitingDependencies
                  .dependenciesNeeded
              }{" "}
              dependencies
            </div>
            <div>
              <Link
                href={`workspaces/${workspaceId}/tasks`}
                className="text-[10px] flex items-center hover:underline hover:cursor-pointer"
              >
                view dependencies
                <span>
                  <ChevronRightIcon className="size-3" />
                </span>
              </Link>
            </div>
          </div>
        </CardFooter>
      </Card>
      {/* Task completed */}
      <Card className=" bg-green-100 text-green-950 flex flex-col gap-6 py-6 shadow-sm">
        <CardHeader className="px-3 py-0">
          <div className="flex items-center justify-start">
            <div className="bg-green-700 text-green-100 rounded-full p-1 mr-2">
              <CheckCircle2Icon className="size-3.5" />
            </div>
            <div className="text-sm font-semibold">Task completed</div>
          </div>
        </CardHeader>
        <CardContent className="px-3 py-0 flex justify-between">
          <div className="flex flex-col gap-1">
            <div className="font-bold text-xl">
              {analytics?.completedThisWeek.count}
            </div>
            <div className="text-xs">tasks completed this week</div>
          </div>
        </CardContent>
        <CardFooter className="px-3 py-0">
          <div className="flex flex-1  items-center justify-between">
            <div className="bg-green-700 text-green-100 text-[10px] rounded-[6px] py-1.5 px-1 flex items-center">
              {analytics?.completedThisWeek.trendDirection == "up" ? (
                <ArrowUpIcon className="size-3" />
              ) : analytics?.completedThisWeek.trendDirection == "down" ? (
                <ArrowDownIcon className="size-3" />
              ) : null}{" "}
              {analytics?.completedThisWeek.trend}% from last week
            </div>
            <div>
              <Link
                href={`workspaces/${workspaceId}/tasks`}
                className="text-[10px] flex items-center hover:underline hover:cursor-pointer"
              >
                view completed
                <span>
                  <ChevronRightIcon className="size-3" />
                </span>
              </Link>
            </div>
          </div>
        </CardFooter>
      </Card>
      <Card className="bg-violet-100 text-violet-900 flex flex-col  gap-5 py-6 shadow-sm relative">
        <CardHeader className="px-3 py-0">
          <div className="flex items-center justify-start">
            <div className="bg-violet-700 text-violet-100 rounded-full p-1 mr-2">
              <BarChart2Icon className="size-3.5" />
            </div>
            <div className="text-sm font-semibold">Task priority</div>
          </div>
        </CardHeader>
        <CardContent className="px-3 py-0 flex flex-col justify-between ">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600">
              Distribution
            </span>
            <span className="text-xs text-gray-500">
              Out of {analytics?.priortyCard.total} tasks
            </span>
          </div>

          <div className="w-full h-8 flex rounded-lg overflow-hidden">
            <div
              className="bg-red-500 flex items-center justify-center text-white text-xs font-semibold"
              style={{
                width: `${analytics?.priortyCard.distribution.high}%`,
              }}
            >
              {`${analytics?.priortyCard.distribution.high}%`}
            </div>
            <div
              className="bg-amber-400 flex items-center justify-center text-white text-xs font-semibold"
              style={{
                width: `${analytics?.priortyCard.distribution.medium}%`,
              }}
            >
              {`${analytics?.priortyCard.distribution.medium}%`}
            </div>
            <div
              className="bg-green-500 flex items-center justify-center text-white text-xs font-semibold"
              style={{ width: `${analytics?.priortyCard.distribution.low}%` }}
            >
              {`${analytics?.priortyCard.distribution.low}%`}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 mt-1 justify-between">
            <div className="flex items-center gap-1">
              <div className="p-1 rounded-sm bg-red-500"></div>
              <span className="text-[10px] text-gray-600">
                High: {analytics?.priortyCard.counts.high}
              </span>
            </div>
            <div className="flex  items-center gap-1">
              <div className="p-1 rounded-sm bg-amber-400"></div>
              <span className="text-[10px] text-gray-600">
                Medium: {analytics?.priortyCard.counts.medium}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="p-1 rounded-sm bg-green-500"></div>
              <span className="text-[10px] text-gray-600">
                Low: {analytics?.priortyCard.counts.low}
              </span>
            </div>
          </div>
          <div
            className={`flex items-start gap-3 p-1 rounded-lg absolute bottom-0 w-[93%] ${config.borderColor} ${config.bgColor}`}
          >
            <StatusIcon
              className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.color}`}
            />
            <div className="flex-1">
              <p className={`text-xs font-semibold ${config.color}`}>
                {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
              </p>
              <Tooltip>
                <TooltipTrigger asChild>
                  {/* <Button variant="outline">Hover</Button> */}
                  <p className="text-[10px] text-gray-600 mt-1 line-clamp-1">
                    {config.label}
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p> {config.label}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardContent>
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
