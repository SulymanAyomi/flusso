import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { cn } from "@/lib/utils";
import { ArrowUp, ChevronRightIcon, Folder } from "lucide-react";

interface AnalyticsCardProps {
  title: string;
  value: number;
  variant: "up" | "down";
  increasedValue: number;
}
export const AnalyticsCard = ({
  title,
  value,
  variant,
  increasedValue,
}: AnalyticsCardProps) => {
  const iconColor = variant === "up" ? "text-emrald-500" : "text-red-500";
  const increasedValueColor =
    variant === "up" ? "text-emrald-500" : "text-red-500";
  const Icon = variant === "up" ? FaCaretUp : FaCaretDown;

  return (
    <Card className=" bg-green-100 text-green-900 flex flex-col gap-6 py-6 shadow-sm">
      <CardHeader className="px-3 py-0">
        <div className="flex items-center justify-start">
          <div className="bg-green-700 text-white rounded-full p-1 mr-2">
            <Folder className="size-3.5" />
          </div>
          <div className="text-sm font-semibold">{title}</div>
        </div>
      </CardHeader>
      <CardContent className="px-3 py-0">
        <div className="flex flex-col gap-1">
          <div className="font-bold text-xl">{value}</div>
          <div className="text-xs">Ongoing Project</div>
        </div>
      </CardContent>
      <CardFooter className="px-3 py-0">
        <div className="flex flex-1  items-center justify-between">
          <div className="bg-green-700 text-green-100 text-[10px] rounded-[6px] py-1.5 px-1 flex items-center">
            <ArrowUp className="size-3" />
            {increasedValue}% more than last month
          </div>
          <div className="text-[10px] flex items-center hover:underline hover:cursor-pointer">
            view projects
            <span>
              <ChevronRightIcon className="size-3" />
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

// <span
//             className={cn(
//               increasedValueColor,
//               "truncate text-base font-medium"
//             )}
//           >
//             {increasedValue}
//           </span>
