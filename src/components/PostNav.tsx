import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

interface Props {
  prev: PostMeta | null;
  next: PostMeta | null;
  labels: { prev: string; next: string };
}

export default function PostNav({ prev, next, labels }: Props) {
  if (!prev && !next) return null;

  return (
    <nav className="post-nav">
      {prev ? (
        <Link href={`/posts/${prev.slug}`} className="post-nav-link post-nav-prev">
          <span className="post-nav-label">&larr; {labels.prev}</span>
          <span className="post-nav-title">{prev.title}</span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link href={`/posts/${next.slug}`} className="post-nav-link post-nav-next">
          <span className="post-nav-label">{labels.next} &rarr;</span>
          <span className="post-nav-title">{next.title}</span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
