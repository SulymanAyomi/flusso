import { getCurrent } from "@/features/auth/query";
import { redirect } from "next/navigation";
import MembersClientPage from "./client";

const WorkspaceIdMembersPage = async () => {
  const user = await getCurrent();
  if (!user) {
    redirect("/sign-in");
  }
  return <MembersClientPage user={user} />;
};

export default WorkspaceIdMembersPage;
