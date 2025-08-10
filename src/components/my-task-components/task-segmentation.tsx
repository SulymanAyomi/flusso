import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "../ui/card";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { format } from "date-fns";
import { useGetWorkspaceTasks } from "@/features/workspaces/api/use-get-workspace-tasks";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Badge } from "../ui/badge";
import { DataTable } from "@/features/tasks/components/tasks-view/data-table";
import { columns } from "./columns";
const MyTaskSegmentation = () => {
  const workspaceId = useWorkspaceId();
  const { data, isLoading } = useGetWorkspaceTasks({ workspaceId });

  return (
    <div className="py-4">
      <Accordion type="single" collapsible className="space-y-2">
        <AccordionItem
          value="item-1"
          className="shadow-sm bg-white p-3 rounded-lg"
        >
          <AccordionTrigger className="bg-white px-2 py-2 rounded-md">
            Today Tasks
          </AccordionTrigger>
          <AccordionContent className="bg-white ">
            <DataTable columns={columns} data={data?.highpiorityTasks ?? []} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem
          value="item-1f"
          className="shadow-sm bg-white p-3 rounded-lg"
        >
          <AccordionTrigger className="bg-white px-2 py-2 rounded-md">
            Today Tasks
          </AccordionTrigger>
          <AccordionContent className="bg-white ">
            <DataTable columns={columns} data={data?.highpiorityTasks ?? []} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem
          value="item-1d"
          className="shadow-sm bg-white p-3 rounded-lg"
        >
          <AccordionTrigger className="bg-white px-2 py-2 rounded-md">
            Today Tasks
          </AccordionTrigger>
          <AccordionContent className="bg-white ">
            <DataTable columns={columns} data={data?.highpiorityTasks ?? []} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default MyTaskSegmentation;
