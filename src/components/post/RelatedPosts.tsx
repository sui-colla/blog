/**
 * 相关文章推荐（卡片式区块）
 * 根据标签重叠度打分排序，纯服务端计算。
 */
import Link from "next/link";
import type { PostMeta } from "@/lib/content/posts";
import { useI18n } from "@/lib/i18n";

interface Props {
  currentSlug: string;
  currentTags: string[];
  allPosts: PostMeta[];
  maxItems?: number;
}

export default function RelatedPosts({
  currentSlug,
  currentTags,
  allPosts,
  maxItems = 3,
}: Props) {
  const { t } = useI18n();

  if (currentTags.length === 0) return null;

  const scored = allPosts
    .filter((p) => p.slug !== currentSlug)
    .map((post) => {
      const overlap =
        post.tags?.filter((tag) => currentTags.includes(tag)).length ?? 0;
      return { post, score: overlap };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxItems);

  if (scored.length === 0) return null;

  return (
    <section className="card-base section-card">
      <h2 className="section-title">{t("related.title")}</h2>
      <div className="related-posts-grid">
        {scored.map(({ post }) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
            className="related-posts-card"
          >
            <time dateTime={post.date}>{post.date}</time>
            <h3 className="related-posts-card-title">{post.title}</h3>
            <p className="related-posts-card-summary">{post.summary}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
