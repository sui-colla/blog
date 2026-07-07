import type { Metadata } from "next";
import AboutContent from "@/components/AboutContent";

export const metadata: Metadata = {
  title: "关于",
  description: "关于 LunaPath 和这个博客的说明。",
};

export default function AboutPage() {
  return <AboutContent />;
}
