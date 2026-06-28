"use client";

import Link from "next/link";

interface Props {
  tag: string;
  className?: string;
}

export default function TagLink({ tag, className }: Props) {
  return (
    <Link
      href={`/tags/${encodeURIComponent(tag)}`}
      onClick={(e) => e.stopPropagation()}
      className={className}
    >
      {tag}
    </Link>
  );
}
