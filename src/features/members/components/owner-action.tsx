import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useMemberProfileModal } from "../hook/use-member-profile";

const OwnerAction = ({ memberId }: { memberId: string }) => {
  const { open: openProfile } = useMemberProfileModal();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button className="ml-auto border-none" variant="secondary" size="icon">
          <MoreVerticalIcon className="size-4 text-muted-foreground " />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        <DropdownMenuItem onClick={() => openProfile(memberId)}>
          View profile
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OwnerAction;
