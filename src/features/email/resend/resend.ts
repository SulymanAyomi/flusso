import { Resend } from "resend";
import { render } from "@react-email/components";

import { PUBLIC_APP_URL } from "@/config";
import OtpMail from "../components/otp-email"

const resend = new Resend(process.env.RESEND_API_KEY);
export async function sendOTPEmail({
    to,
    code
}: any) {

    // const html = await render(SignupEmail({ verifyUrl: verifyUrl }))
    const html = await render(OtpMail({
        code: code,
    }
    )
    )
    const { data, error } = await resend.emails.send({
        from: "MOM Bridge Limited <onboarding@resend.dev>",
        to: to,
        subject: "Verification code",
        html: html
    });
    if (error) {
        console.log(error)
        throw new Error(error.message)

    }
    return data
}


