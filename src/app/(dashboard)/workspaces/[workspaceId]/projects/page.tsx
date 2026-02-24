import { getCurrent } from "@/features/auth/query";
import ProjectsClientPage from "./client";
import { redirect } from "next/navigation";

const Projects = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");
  return <ProjectsClientPage user={user} />;
};

export default Projects;
