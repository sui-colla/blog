import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
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
      const overlap = post.tags?.filter((tag) => currentTags.includes(tag)).length ?? 0;
      return { post, score: overlap };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxItems);

  if (scored.length === 0) return null;

  return (
    <section className="related-posts">
      <h3 className="related-posts-title">{t("related.title")}</h3>
      <div className="related-posts-grid">
        {scored.map(({ post }) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
            className="related-posts-card"
          >
            <time
              dateTime={post.date}
              className="text-xs text-zinc-400 dark:text-zinc-500"
            >
              {new Date(post.date).toLocaleDateString("zh-CN", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </time>
            <h4 className="related-posts-card-title">{post.title}</h4>
            <p className="related-posts-card-summary">{post.summary}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
