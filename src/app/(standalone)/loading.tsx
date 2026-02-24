import { Loader2Icon } from "lucide-react";

const DashboardLoading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <Loader2Icon className="size-9 animate-spin text-blue-400" />
    </div>
  );
};

export default DashboardLoading;
