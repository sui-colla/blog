import type { Metadata } from "next";
import LinksContent from "@/components/LinksContent";
import { linksPage } from "@/config/content-pages";

export const metadata: Metadata = {
  title: "链接",
  description: "LunaPath 收藏和推荐的链接，以及友情链接说明。",
};

export default function LinksPage() {
  return <LinksContent data={linksPage} />;
}
