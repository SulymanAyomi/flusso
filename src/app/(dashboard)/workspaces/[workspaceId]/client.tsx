"use client";
import Link from "next/link";
import { Calendar as CalendarIcon, Plus, PlusIcon } from "lucide-react";

import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useGetWorkspaceAnalytics } from "@/features/workspaces/api/use-get-workspace-analytics";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { Analytics } from "@/components/workspace-dashboard/analytics";

import { Button } from "@/components/ui/button";

import ProjectLists from "@/components/workspace-dashboard/projects-list";
import HighPiority from "@/components/workspace-dashboard/high-piority";
import Activities from "@/components/workspace-dashboard/activities";
import TaskTabs from "@/components/workspace-dashboard/task-tab";
import PageHeader from "@/components/page-header";

export const WorkspaceIdClient = () => {
  return (
    <div className="flex flex-col">
      <PageHeader
        header="Welcome, Ayomi"
        subText="Start to manage your workspaces and their projects here"
        button={true}
        buttonType="workspace"
      />
      <div className="flex p-3 font-semibold">
        <h2 className="text-xl">Dashboard</h2>
      </div>
      {/* Body */}
      <div className="px-3 w-full bg-neutral-100">
        {/* workspce overview cards */}
        <Analytics />
        <div className="grid grid-cols-2 py-2 gap-2">
          {/* workspace dashboards cards */}
          {/* projects card  */}
          <ProjectLists />
          <div className="flex gap-2 flex-col">
            {/* highest piority card */}
            <HighPiority />
            {/* Activity card */}
            <Activities />
          </div>
          {/* Tasks card */}
          <TaskTabs />
          {/* Ai card */}
        </div>
      </div>
    </div>
  );
};

// interface TaskListProps {
//   data: Task[];
//   total: number;
// }

// export const TaskList = ({ data, total }: TaskListProps) => {
//   const workspaceId = useWorkspaceId();

//   const { open: createTask } = useCreateTaskModal();

//   return (
//     <div className="flex flex-col gap-y-4 col-span-1">
//       <div className="bg-muted rounded-lg p-4">
//         <div className="flex items-center justify-between">
//           <p className="text-lg font-semibold">Tasks ({total})</p>
//           <Button variant="muted" size="icon" onClick={createTask}>
//             <PlusIcon className="size-4 text-neutral-400" />
//           </Button>
//         </div>
//         <DottedSeparator className="my-4" />
//         <ul className="flex flex-col gap-y-4">
//           {data.map((task) => (
//             <li key={task.$id}>
//               <Link href={`/workspaces/${workspaceId}/tasks/${task.$id}`}>
//                 <Card className="shadow-none rounded-lg hover:opacity-75 transition">
//                   <CardContent className="p-4">
//                     <p className="text-lg font-medium truncate">{task.name}</p>
//                     <div className="flex items-center gap-x-2">
//                       <p>{task.project?.name}</p>
//                       <div className="size-1 rounded-full bg-neutral-300" />
//                       <div className="text-sm text-muted-foreground flex items-center">
//                         <CalendarIcon className="size-3 me-1" />
//                         <span className="truncate">
//                           {formatDistanceToNow(new Date(task.dueDate))}
//                         </span>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </Link>
//             </li>
//           ))}
//           <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
//             No tasks found
//           </li>
//         </ul>
//         <Button variant="muted" className="mt-4 w-full" asChild>
//           <Link href={`/workspaces/${workspaceId}/tasks`}>Show All</Link>
//         </Button>
//       </div>
//     </div>
//   );
// };

// interface ProjectListProps {
//   data: Project[];
//   total: number;
// }

// export const ProjectList = ({ data, total }: ProjectListProps) => {
//   const workspaceId = useWorkspaceId();

//   return (
//     <div className="flex flex-col gap-y-4 col-span-1">
//       <div className="bg-white border rounded-lg p-4">
//         <div className="flex items-center justify-between">
//           <p className="text-lg font-semibold">Projects ({total})</p>
//           <Button variant="secondary" size="icon" asChild>
//             <Link href={`/workspaces/${workspaceId}/projects/create`}>
//               <PlusIcon className="size-4 text-neutral-400" />
//             </Link>
//           </Button>
//         </div>
//         <DottedSeparator className="my-4" />
//         <ul className="flex flex-col gap-y-4">
//           {data.map((project) => (
//             <li key={project.$id}>
//               <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
//                 <Card className="shadow-none rounded-lg hover:opacity-75 transition">
//                   <CardContent className="p-4 flex items-center gap-x-2.5">
//                     <ProjectAvatar
//                       className="size-12"
//                       fallbackClassname="text-lg"
//                       name={project.name}
//                       image={project.imageUrl}
//                     />
//                     <p className="text-lg font-medium truncate">
//                       {project.name}
//                     </p>
//                   </CardContent>
//                 </Card>
//               </Link>
//             </li>
//           ))}
//           <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
//             No project found
//           </li>
//         </ul>
//         <Button variant="muted" className="mt-4 w-full" asChild>
//           <Link href={`/workspaces/${workspaceId}/projects`}>Show All</Link>
//         </Button>
//       </div>
//     </div>
//   );
// };

// interface MemberListProps {
//   data: Member[];
//   total: number;
// }

// export const MemberList = ({ data, total }: MemberListProps) => {
//   const workspaceId = useWorkspaceId();

//   return (
//     <div className="flex flex-col gap-y-4 col-span-1">
//       <div className="bg-white border rounded-lg p-4">
//         <div className="flex items-center justify-between">
//           <p className="text-lg font-semibold">Members ({total})</p>
//           <Button variant="secondary" size="icon" asChild>
//             <Link href={`/workspaces/${workspaceId}/projects/create`}>
//               <PlusIcon className="size-4 text-neutral-400" />
//             </Link>
//           </Button>
//         </div>
//         <DottedSeparator className="my-4" />
//         <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {data.map((member) => (
//             <li key={member.id}>
//               <Link href={`/workspaces/${workspaceId}/members`}>
//                 <Card className="shadow-none rounded-lg overflow-hidden">
//                   <CardContent className="p-4 flex flex-col items-center gap-x-2">
//                     <MemberAvatar className="size-12" name={member.name} />
//                     <div className="flex flex-col items-center overflow-hidden">
//                       <p className="text-lg font-medium line-clamp-1">
//                         {member.user.name}
//                       </p>
//                       <p className="text-lg font-medium line-clamp-1">
//                         {member.email}
//                       </p>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </Link>
//             </li>
//           ))}
//           <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
//             No member found
//           </li>
//         </ul>
//         <Button variant="muted" className="mt-4 w-full" asChild>
//           <Link href={`/workspaces/${workspaceId}/members`}>Show All</Link>
//         </Button>
//       </div>
//     </div>
//   );
// };
