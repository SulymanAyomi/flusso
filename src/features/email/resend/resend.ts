import { Resend } from "resend";
import { render } from "@react-email/components";

import { PUBLIC_APP_URL, RESEND_API_KEY } from "@/config";
import OtpMail from "../components/otp-email"

const resend = new Resend(RESEND_API_KEY);
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
        from: "Flusso <noreply@flusso.dev>",
        to: to,
        subject: "Verification code",
        html: html
    });
    if (error) {
        console.log(error)
        return { success: false, error }  // never throw, let caller decide
    }
    console.log("email ran for email:", to)
    return { success: true, data }
}


