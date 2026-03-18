import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { UserX2Icon } from "lucide-react";
import React from "react";
import { MemberAvatar } from "./member-avatar";

interface MemberDisplayProps {
  assignedTo: {
    id: string;
    user: {
      name: string | null;
      email: string | null;
    };
  } | null;
  className?: string;
}
const MemberDisplay = ({ assignedTo, className }: MemberDisplayProps) => {
  return (
    <div>
      {assignedTo ? (
        <MemberAvatar name={assignedTo?.user.name!} className={className} />
      ) : (
        <Avatar
          className={cn(
            "size-5 transition border border-neutral-300 bg-neutral-200 rounded-full flex items-center justify-center",
            className,
          )}
        >
          <UserX2Icon className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center size-4" />
        </Avatar>
      )}
    </div>
  );
};

export default MemberDisplay;
