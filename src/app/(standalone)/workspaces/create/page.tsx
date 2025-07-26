import { CreateWorkspaceForm } from "@/features/workspaces/components/create-workspace-form";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

const WorkspaceCreatePage = () => {
  return (
    <div className="w-full lg:max-w-xl">
      <CreateWorkspaceForm />
    </div>
  );
};

export default WorkspaceCreatePage;
