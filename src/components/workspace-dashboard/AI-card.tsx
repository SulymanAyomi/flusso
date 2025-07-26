import React from "react";
import { ChevronRightIcon } from "lucide-react";
import { Card, CardHeader, CardContent } from "../ui/card";

const AIRecommendation = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <h3 className="text-[18px] font-semibold">AI Recommendations</h3>
          <div className="text-[10px] flex items-center hover:underline hover:cursor-pointer">
            view all projects
            <span>
              <ChevronRightIcon className="size-3" />
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex gap-2 flex-col">
        <div className="flex justify-between items-center">
          <div className="text-xs">Today's task</div>
          <div className="text-[8px] bg-blue-700 rounded-[12px] py-1 px-2 text-blue-200">
            Overdue
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-xs">Design homepage</div>
          <div className="text-[8px] bg-blue-700 rounded-[12px] py-1 px-2 text-blue-200">
            Completed
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-xs">Fix login homepage</div>
          <div className="text-[8px] bg-yellow-700 rounded-[12px] py-1 px-2 text-blue-200">
            +High
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-xs">Write test today</div>
          <div className="text-[8px] bg-red-700 rounded-[12px] py-1 px-2 text-blue-200">
            Critical
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIRecommendation;
