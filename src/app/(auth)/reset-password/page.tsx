import ResetPassword from "@/features/auth/components/reset-password-card";
import { verifyPasswordToken } from "@/features/auth/hook/verify";
import { getCurrent } from "@/features/auth/query";
import { redirect } from "next/navigation";

const ResetPasswordPage = async ({
  searchParams,
}: {
  searchParams: { token?: string };
}) => {
  const token = searchParams.token;
  if (!token) {
    redirect("/invalid");
  }

  const valid = await verifyPasswordToken(token);

  if (valid.success) {
    return <ResetPassword />;
  } else {
    redirect("/invalid");
  }
};

export default ResetPasswordPage;
