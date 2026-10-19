"use client";

/**
 * 页脚（对应 Fuwari Footer.astro）：
 * 虚线分隔 + 居中的版权、RSS / Sitemap 与「Powered by」信息。
 */
import { siteConfig } from "@/config/site";
import { useI18n } from "@/lib/i18n";

export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__divider" />
      <div className="site-footer__inner">
        <p>
          © {year} {siteConfig.profile.name}. All Rights Reserved. /{" "}
          <a href="/feed.xml">RSS</a> / <a href="/sitemap.xml">Sitemap</a>
          <br />
          {t("footer.builtWith")}
        </p>
      </div>
    </footer>
  );
}
