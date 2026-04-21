import type { Metadata } from "next";
import { EmailPreviewClient } from "./email-preview-client";

export const metadata: Metadata = {
  title: "Email Preview",
  robots: {
    index: false,
    follow: false,
  },
};

export default function EmailPreviewPage() {
  return <EmailPreviewClient />;
}
