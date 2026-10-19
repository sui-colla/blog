"use client";

import PageShell from "@/components/layout/PageShell";
import PostCard from "@/components/content/PostCard";
import { useI18n } from "@/lib/i18n";
import type { PostMeta } from "@/lib/content/posts";

interface Props {
  tag: string;
  posts: PostMeta[];
  tags?: { tag: string; count: number }[];
  popularPosts?: PostMeta[];
}

export default function TagDetailContent({
  tag,
  posts,
  tags = [],
  popularPosts = [],
}: Props) {
  const { t } = useI18n();

  return (
    <PageShell tags={tags} popularPosts={popularPosts}>
      <div className="card-base content-card">
        <h1 className="page-title">{tag}</h1>
        <p className="page-lead">
          {t("tags.articleCount").replace("{count}", String(posts.length))}
        </p>
      </div>

      <div className="post-list">
        {posts.map((post, index) => (
          <PostCard key={post.slug} post={post} index={index} />
        ))}
      </div>
    </PageShell>
  );
}
