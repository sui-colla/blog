import type { Metadata } from "next";
import UsesContent from "@/components/UsesContent";
import { usesCategories } from "@/config/content-pages";

export const metadata: Metadata = {
  title: "Uses",
  description: "LunaPath 正在使用和推荐的开发工具、软件、设备与服务。",
};

export default function UsesPage() {
  return <UsesContent categories={usesCategories} />;
}
