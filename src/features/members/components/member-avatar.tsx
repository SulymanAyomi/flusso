import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface MemberAvatarProps {
  name: string;
  className?: string;
  fallbackClassName?: string;
  imageUrl?: string | null;
  imgClassName?: string;
}

export const MemberAvatar = ({
  name,
  className,
  fallbackClassName,
  imageUrl,
  imgClassName,
}: MemberAvatarProps) => {
  return (
    <>
      {imageUrl ? (
        <img
          src={imageUrl}
          className={cn(
            "size-5  transition border border-neutral-300 rounded-full object-cover",
            imgClassName
          )}
        ></img>
      ) : (
        <Avatar
          className={cn(
            "size-5  transition border border-neutral-300 rounded-full",
            className
          )}
        >
          <AvatarFallback
            className={cn(
              "bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center",
              fallbackClassName
            )}
          >
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
    </>
  );
};
//  <Avatar className="size-7 hover:opacity-75 transition border border-neutral-300 ml-[-10px]">
//                     <AvatarFallback className="bg-blue-600 text-sm font-medium text-blue-100 flex items-center justify-center">
//                       C
//                     </AvatarFallback>
//                   </Avatar>
