import ResetPassword from "@/features/auth/components/reset-password-card";
import { getCurrent } from "@/features/auth/query";
import { redirect } from "next/navigation";

const ResetPasswordPage = async () => {
  const user = await getCurrent();
  if (user) {
    redirect("/");
  }
  return <ResetPassword />;
};

export default ResetPasswordPage;
