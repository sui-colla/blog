"use client";

import Giscus from "@giscus/react";
import { useI18n } from "@/lib/i18n";

interface Props {
  slug: string;
}

export default function Comments({ slug }: Props) {
  const { locale } = useI18n();

  return (
    <section className="comments-section">
      <Giscus
        id="comments"
        repo="sui-colla/blog"
        repoId="" // TODO: 在 https://giscus.app 获取后填入
        category="Announcements"
        categoryId="" // TODO: 在 https://giscus.app 获取后填入
        mapping="pathname"
        term={slug}
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={locale === "zh" ? "light" : "light"}
        lang={locale === "zh" ? "zh-CN" : "en"}
        loading="lazy"
      />
    </section>
  );
}
