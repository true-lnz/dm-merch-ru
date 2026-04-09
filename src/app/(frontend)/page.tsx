import type { Metadata } from "next";
import { HomePage } from "@/views/home";

export const metadata: Metadata = {
  // TODO: тут написать чтото для SEO
};

export default function Page() {
  return <HomePage />;
}

