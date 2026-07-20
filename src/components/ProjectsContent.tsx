"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import type { ProjectItem, ProjectStatus } from "@/config/content-pages";

interface Props {
  projects: ProjectItem[];
}

const statusIcon: Record<ProjectStatus, string> = {
  featured: "✨",
  building: "🚧",
  archived: "📦",
  paused: "⏸️",
};

function ProjectCard({ project }: { project: ProjectItem }) {
  const { t } = useI18n();

  return (
    <article className="rounded-md border border-teal-100 bg-white/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/70 dark:hover:border-teal-900/60">
      {project.cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.cover}
          alt={`${project.name} cover`}
          className="mb-4 h-36 w-full rounded-xl object-cover"
          loading="lazy"
        />
      )}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
          {project.name}
        </h2>
        <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-600 dark:bg-teal-900/20 dark:text-teal-300">
          <span aria-hidden="true">{statusIcon[project.status]}</span>{" "}
          {t(`projects.status.${project.status}`)}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {project.summary}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
          >
            {tech}
          </span>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-3 text-sm font-medium">
        {project.githubUrl && (
          <a className="text-teal-600 hover:text-teal-700 dark:text-teal-400" href={project.githubUrl} target="_blank" rel="noopener noreferrer">
            GitHub ↗
          </a>
        )}
        {project.demoUrl && (
          <a className="text-teal-600 hover:text-teal-700 dark:text-teal-400" href={project.demoUrl} target="_blank" rel="noopener noreferrer">
            Demo ↗
          </a>
        )}
        {project.postUrl && (
          <Link className="text-teal-600 hover:text-teal-700 dark:text-teal-400" href={project.postUrl}>
            {t("projects.readPost")} →
          </Link>
        )}
      </div>
    </article>
  );
}

export default function ProjectsContent({ projects }: Props) {
  const { t } = useI18n();
  const featured = projects.filter((project) => project.status === "featured");
  const archived = projects.filter((project) => project.status !== "featured");

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <Link href="/" className="mb-8 inline-flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-teal-500">
        &larr; {t("post.backHome")}
      </Link>
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
        <span className="text-zinc-950 dark:text-zinc-50">
          {t("projects.title")}
        </span>
      </h1>
      <p className="mt-3 text-zinc-500 dark:text-zinc-400">{t("projects.description")}</p>

      {projects.length === 0 ? (
        <div className="mt-10 rounded-md border border-dashed border-teal-200 bg-teal-50/60 p-8 text-center text-sm text-zinc-500 dark:border-teal-900/50 dark:bg-teal-950/20 dark:text-zinc-400">
          {t("projects.empty")}
        </div>
      ) : (
        <div className="mt-10 space-y-10">
          <section>
            <h2 className="mb-4 text-xl font-bold text-zinc-900 dark:text-zinc-50">{t("projects.featured")}</h2>
            {featured.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {featured.map((project) => <ProjectCard key={project.name} project={project} />)}
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-zinc-200 p-5 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">{t("projects.featuredEmpty")}</p>
            )}
          </section>

          {archived.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-bold text-zinc-900 dark:text-zinc-50">{t("projects.archive")}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {archived.map((project) => <ProjectCard key={project.name} project={project} />)}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
