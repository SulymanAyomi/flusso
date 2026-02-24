import { getCurrent } from "@/features/auth/query";
import { getWorkspaces } from "@/features/workspaces/query";
import { redirect } from "next/navigation";

export default async function Workspaces() {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");
  const workspace = await getWorkspaces(user.id);
  if (workspace.total === 0 || !workspace.workspaces) {
    redirect("/workspaces/create");
  } else {
    redirect(`/workspaces/${workspace?.workspaces.id}`);
  }
  return <div className="flex gap-5">Home Page</div>;
}
