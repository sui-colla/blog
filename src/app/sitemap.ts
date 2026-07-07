import type { MetadataRoute } from "next";
import { getAllPosts, getAllTags } from "@/lib/posts";
import { absoluteUrl } from "@/config/site";

function latestPostDate(posts: { date: string }[]) {
  const latest = posts.reduce((current, post) => {
    const time = new Date(post.date).getTime();
    return time > current ? time : current;
  }, 0);

  return latest > 0 ? new Date(latest) : undefined;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const tags = getAllTags();
  const latest = latestPostDate(posts);

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/posts/${post.slug}`),
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const tagEntries: MetadataRoute.Sitemap = tags.map(({ tag }) => ({
    url: absoluteUrl(`/tags/${encodeURIComponent(tag)}`),
    lastModified: latest,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [
    {
      url: absoluteUrl(),
      lastModified: latest,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/about"),
      lastModified: latest,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: absoluteUrl("/tags"),
      lastModified: latest,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: absoluteUrl("/archive"),
      lastModified: latest,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: absoluteUrl("/projects"),
      lastModified: latest,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/now"),
      lastModified: latest,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: absoluteUrl("/links"),
      lastModified: latest,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: absoluteUrl("/uses"),
      lastModified: latest,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...postEntries,
    ...tagEntries,
  ];
}
