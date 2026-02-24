import React from "react";
import { Skeleton } from "./ui/skeleton";

const ActivitySkeleton = () => {
  return (
    <div className="space-y-2 w-full">
      {[...Array(5)].map(() => (
        <div className="flex justify-start items-center gap-2 w-full">
          <div className="flex items-center justify-center">
            <Skeleton className="size-8 rounded-full" />
          </div>
          <div className="flex justify-start items-center w-full">
            <Skeleton className="w-full h-4 mr-2" />
            <Skeleton className="w-8 h-6" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivitySkeleton;
