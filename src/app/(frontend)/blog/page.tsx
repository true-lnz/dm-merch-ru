import type { Metadata } from "next";
import { BlogPage } from "@/views/blog";

export const metadata: Metadata = {
  title: "Блог",
};

export default function Page() {
  return <BlogPage />;
}

