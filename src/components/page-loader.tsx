import { Loader2Icon } from "lucide-react";

export const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2Icon className="size-9 animate-spin text-blue-400" />
    </div>
  );
};
