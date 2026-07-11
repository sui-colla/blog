import type { Metadata } from "next";
import NowContent from "@/components/NowContent";
import { nowPage } from "@/config/content-pages";

export const metadata: Metadata = {
  title: "Now",
  description: "LunaPath 最近在学习、创作和关注的事情。",
};

export default function NowPage() {
  return <NowContent data={nowPage} />;
}
