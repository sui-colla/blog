import type { Metadata } from "next";
import ProjectsContent from "@/components/content/ProjectsContent";
import { projects } from "@/config/content-pages";
import { getSidebarData } from "@/lib/content/sidebar";

export const metadata: Metadata = {
  title: "项目",
  description: "Xingye 的项目、实验和作品归档。",
};

export default function ProjectsPage() {
  const { tags, popularPosts } = getSidebarData();
  return (
    <ProjectsContent projects={projects} tags={tags} popularPosts={popularPosts} />
  );
}
