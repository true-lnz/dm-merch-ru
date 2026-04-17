import type { Metadata } from "next";
import { BlogPlaceholderPage } from "@/views/blog";

export const metadata: Metadata = {
  title: "Скоро будет",
};

export default function Page() {
  return <BlogPlaceholderPage />;
}
