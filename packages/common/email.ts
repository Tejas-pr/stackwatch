import nodemailer from "nodemailer";

function validateEmailEnv() {
  const required = [
    "EMAIL_SERVICE_HOST",
    "EMAIL_SERVICE_PORT",
    "EMAIL_SERVICE_USER",
    "EMAIL_SERVICE_PASS",
  ];

  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing environment variable: ${key}`);
    }
  }
}

function createTransporter() {
  validateEmailEnv();

  return nodemailer.createTransport({
    host: process.env.EMAIL_SERVICE_HOST!,
    port: Number(process.env.EMAIL_SERVICE_PORT),
    secure: Number(process.env.EMAIL_SERVICE_PORT) === 465,
    auth: {
      user: process.env.EMAIL_SERVICE_USER!,
      pass: process.env.EMAIL_SERVICE_PASS!,
    },
  });
}

type SendEmailParams = {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
};

export async function sendEmail({
  to,
  subject,
  text,
  html,
  from,
}: SendEmailParams) {
  if (!to) throw new Error("Recipient (to) is required");
  if (!subject) throw new Error("Email subject is required");
  if (!text && !html)
    throw new Error("Either text or html content must be provided");

  const transporter = createTransporter();

  try {
    const info = await transporter.sendMail({
      from:
        from ??
        `"No Reply" <${process.env.EMAIL_SERVICE_USER}>`,
      to: Array.isArray(to) ? to.join(",") : to,
      subject,
      text,
      html,
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Email send failed:", error);
    throw new Error("Failed to send email");
  }
}
