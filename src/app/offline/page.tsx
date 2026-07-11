import type { Metadata } from "next";
import OfflineContent from "@/components/OfflineContent";

export const metadata: Metadata = {
  title: "离线阅读",
  description: "当前网络不可用，可以继续阅读已缓存的 LunaPath 内容。",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OfflinePage() {
  return <OfflineContent />;
}
