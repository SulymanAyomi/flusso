import { PageError } from "@/components/page-error";
import { getCurrent } from "@/features/auth/query";
import { JoinWorkspaceForm } from "@/features/workspaces/components/join-workspace-form";
import { getWorkspaceInfo } from "@/features/workspaces/query";
import { redirect } from "next/navigation";

interface WorkspaceIdJoinPageProps {
  params: {
    workspaceId: string;
    inviteCode: string;
  };
}

const WorkspaceIdJoinPage = async ({ params }: WorkspaceIdJoinPageProps) => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  const initialValues = await getWorkspaceInfo({
    workspaceId: params.workspaceId,
  });

  if (!initialValues) {
    return (
      <PageError
        title="Workspace not found."
        message="This workspace may have been deleted or you might not have access to it."
      />
    );
  }

  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceForm
        initialValues={initialValues!}
        code={params.inviteCode}
        workspaceId={params.workspaceId}
      />
    </div>
  );
};

export default WorkspaceIdJoinPage;
