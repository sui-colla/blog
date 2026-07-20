"use client";

import { siteConfig } from "@/config/site";
import { useI18n } from "@/lib/i18n";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-3xl px-6 py-8 text-center text-sm text-zinc-400">
        &copy; {new Date().getFullYear()} {siteConfig.name} &mdash; {t("footer.builtWith")}
      </div>
    </footer>
  );
}
