import type { Metadata } from "next";
import ProjectsContent from "@/components/ProjectsContent";
import { projects } from "@/config/content-pages";

export const metadata: Metadata = {
  title: "项目",
  description: "LunaPath 的项目、实验和作品归档。",
};

export default function ProjectsPage() {
  return <ProjectsContent projects={projects} />;
}
