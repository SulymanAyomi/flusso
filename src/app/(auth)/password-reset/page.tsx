import RequestReset from "@/features/auth/components/password-request-card";
import { getCurrent } from "@/features/auth/query";
import { redirect } from "next/navigation";

const RequestResetPage = async () => {
  const user = await getCurrent();
  if (user) {
    redirect("/");
  }
  return <RequestReset />;
};

export default RequestResetPage;
