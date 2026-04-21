import nodemailer from "nodemailer";
import { buildRequestEmail } from "./email-templates";
import type { RequestPayload } from "./types";

const requiredEnvKeys = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "REQUEST_TO_EMAIL"] as const;

function getMailConfig() {
  const missingKeys = requiredEnvKeys.filter((key) => !process.env[key]);

  if (missingKeys.length > 0) {
    throw new Error(`Missing mail env vars: ${missingKeys.join(", ")}`);
  }

  const port = Number(process.env.SMTP_PORT);

  if (!Number.isFinite(port)) {
    throw new Error("SMTP_PORT must be a number");
  }

  return {
    host: process.env.SMTP_HOST!,
    port,
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
    requestToEmail: process.env.REQUEST_TO_EMAIL!,
  };
}

export async function sendRequestEmail(payload: RequestPayload) {
  const config = getMailConfig();
  const { subject, html } = buildRequestEmail(payload);

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  await transporter.sendMail({
    from: `"DM Merch" <${config.user}>`,
    to: config.requestToEmail,
    replyTo: payload.email || undefined,
    subject,
    html,
  });
}
