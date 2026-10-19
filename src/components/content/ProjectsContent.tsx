"use client";

import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import { useI18n } from "@/lib/i18n";
import type { PostMeta } from "@/lib/content/posts";
import type { ProjectItem, ProjectStatus } from "@/config/content-pages";

interface Props {
  projects: ProjectItem[];
  tags?: { tag: string; count: number }[];
  popularPosts?: PostMeta[];
}

const statusLabel: Record<ProjectStatus, string> = {
  featured: "projects.status.featured",
  building: "projects.status.building",
  archived: "projects.status.archived",
  paused: "projects.status.paused",
};

function ProjectCard({ project }: { project: ProjectItem }) {
  const { t } = useI18n();

  return (
    <article className="entry-card">
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "0.5rem",
        }}
      >
        <h3 className="entry-card__title">{project.name}</h3>
        <span className="tag-chip">{t(statusLabel[project.status])}</span>
      </div>
      <p className="entry-card__desc">{project.summary}</p>
      <div className="entry-card__meta">
        {project.techStack.map((tech) => (
          <span key={tech} className="tag-chip">
            {tech}
          </span>
        ))}
      </div>
      <div className="entry-card__links">
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
            GitHub ↗
          </a>
        )}
        {project.demoUrl && (
          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
            Demo ↗
          </a>
        )}
        {project.postUrl && (
          <Link href={project.postUrl}>{t("projects.readPost")} →</Link>
        )}
      </div>
    </article>
  );
}

export default function ProjectsContent({
  projects,
  tags = [],
  popularPosts = [],
}: Props) {
  const { t } = useI18n();
  const featured = projects.filter((project) => project.status === "featured");
  const rest = projects.filter((project) => project.status !== "featured");

  return (
    <PageShell tags={tags} popularPosts={popularPosts}>
      <div className="card-base content-card">
        <h1 className="page-title">{t("projects.title")}</h1>
        <p className="page-lead">{t("projects.description")}</p>

        {projects.length === 0 ? (
          <p className="empty-state" style={{ marginTop: "1.5rem" }}>
            {t("projects.empty")}
          </p>
        ) : (
          <>
            {featured.length > 0 && (
              <div style={{ marginTop: "1.5rem" }}>
                <h2 className="section-title">{t("projects.featured")}</h2>
                <div className="card-grid">
                  {featured.map((project) => (
                    <ProjectCard key={project.name} project={project} />
                  ))}
                </div>
              </div>
            )}

            {rest.length > 0 && (
              <div style={{ marginTop: "2rem" }}>
                <h2 className="section-title">{t("projects.archive")}</h2>
                <div className="card-grid">
                  {rest.map((project) => (
                    <ProjectCard key={project.name} project={project} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </PageShell>
  );
}
