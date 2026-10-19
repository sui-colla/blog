import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PostMeta } from "@/lib/content/posts";

interface Props {
  prev: PostMeta | null;
  next: PostMeta | null;
  labels: { prev: string; next: string };
}

export default function PostNav({ prev, next, labels }: Props) {
  if (!prev && !next) return null;

  return (
    <nav className="post-nav">
      {next ? (
        <Link
          href={`/posts/${next.slug}`}
          className="post-nav__btn post-nav__btn--prev btn-card"
          aria-label={`${labels.next}: ${next.title}`}
        >
          <ChevronLeft aria-hidden="true" strokeWidth={1.8} />
          <span className="post-nav__title">{next.title}</span>
        </Link>
      ) : (
        <span />
      )}

      {prev ? (
        <Link
          href={`/posts/${prev.slug}`}
          className="post-nav__btn post-nav__btn--next btn-card"
          aria-label={`${labels.prev}: ${prev.title}`}
        >
          <span className="post-nav__title">{prev.title}</span>
          <ChevronRight aria-hidden="true" strokeWidth={1.8} />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
