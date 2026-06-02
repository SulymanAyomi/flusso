import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface ResetPasswordEmailProps {
  username: string;
  link: string;
}
import { PUBLIC_APP_URL } from "@/config";

export const ResetPasswordEmail = ({
  username,
  link,
}: ResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Password request</Preview>
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
            src={`${PUBLIC_APP_URL}/flusso.png`}
            width="80"
            height="60"
            alt="Flusso's Logo"
          />
          <div style={{ padding: "20px" }}>
            <Heading style={{ fontWeight: 600, fontSize: "18px" }}>
              Dear {username}
            </Heading>
            <Text style={{}}>
              You are receiving this email because we received a password reset
              request for your account.
            </Text>
            <Text style={{}}>
              To reset your password, please click the button below{" "}
            </Text>

            {/* Center the button */}
            <div style={{ textAlign: "center", marginTop: "24px" }}>
              <Section className="mt-[32px] mb-[32px] text-center">
                <Button
                  className="rounded bg-[#000000] px-5 py-3 text-center font-semibold text-[12px] text-white no-underline"
                  href={link}
                >
                  Reset
                </Button>
              </Section>
              <Text className="text-[14px] text-black leading-[24px]">
                or copy and paste this URL into your browser:{" "}
                <Link href={link} className="text-blue-600 no-underline">
                  {link}
                </Link>
              </Text>
            </div>

            <Text
              style={{
                marginTop: "20px",
                fontSize: "12px",
                color: "#555",
              }}
            >
              The link will only work for the next 5 minutes. If you don't want
              to reset your password, you can safely ignore this mail.
            </Text>
          </div>
        </Container>
      </Body>
    </Html>
  );
};

export default ResetPasswordEmail;
