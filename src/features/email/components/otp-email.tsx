import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Img,
} from "@react-email/components";
import { PUBLIC_APP_URL } from "@/config";

type Props = {
  verifyUrl: string;
};

export default function OtpMail({ code }: { code: string }) {
  return (
    <Html>
      <Head />
      <Preview>Your verification code is {code}</Preview>
      <Body
        style={{
          backgroundColor: "#f6f9fc",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <Container
          style={{
            backgroundColor: "#fff",
            padding: "40px",
            borderRadius: "8px",
            maxWidth: "600px",
            margin: "40px auto",
            boxShadow: "0 0 5px rgba(0,0,0,0.1)",
          }}
        >
          <Img
            src={`${PUBLIC_APP_URL}/lolo.png`}
            width="80"
            height="60"
            alt="Momlimited's Logo"
          />
          <div style={{ padding: "20px" }}>
            <Heading style={{ fontWeight: 600, fontSize: "18px" }}>
              Your verification code
            </Heading>
            <Text style={{}}>
              Just one more step and you're there. Please use the code below to
              verify your email and continue using Momlimited as a signed-in
              user.
            </Text>

            {/* Center the button */}
            <div style={{ textAlign: "center", marginTop: "24px" }}>
              <code
                style={{
                  display: "inline-block",
                  padding: "16px 4.5%",
                  width: "90.5%",
                  backgroundColor: "#f4f4f4",
                  borderRadius: "5px",
                  border: "1px solid #eee",
                  color: "#333",
                }}
              >
                {code}
              </code>
            </div>

            <Text
              style={{
                marginTop: "20px",
                fontSize: "12px",
                color: "#555",
              }}
            >
              This code will only work for the next 5 minutes. If you don't want
              to continue with Momlimited, you can safely ignore this mail.
            </Text>
          </div>
        </Container>
      </Body>
    </Html>
  );
}
