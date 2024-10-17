'use client'

import Link from "next/link";
import { PencilIcon } from "lucide-react";

import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { useGetProject } from "@/features/projects/api/use-get-project";
import { useGetProjectAnalytics } from "@/features/projects/api/use-get-project-analytics";

import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";

import { PageLoader } from "@/components/page-loader";
import { PageError } from "@/components/page-error";
import { Button } from "@/components/ui/button";
import { Analytics } from "@/components/analytics";

export const ProjectIdClient = () => {
  const projectId = useProjectId();
  const { data: project, isLoading: isLoadingProject } = useGetProject({ projectId });
  const { data: analytics, isLoading: isLoadingAnalytics } = useGetProjectAnalytics({ projectId });

  const isLoading = isLoadingAnalytics || isLoadingProject;

  if (isLoading) {
    return <PageLoader />
  }

  if (!project) {
    return <PageError message="Project not found" />
  }

  return (
    <div className="felx flex-col gap-y-4">
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={project.project.name}
            image={project.project.imageUrl}
            className="size-8"
          />
          <p className="text-lg font-semibold">{project.project.name}</p>
        </div>
        <div>
          <Button
            asChild
            size="sm"
            variant="secondary"
          >
            <Link href={`/workspaces/${project.project.workspaceId}/projects/${project.project.$id}/settings`}>
              <PencilIcon className="size-4 mr-2" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>
      {analytics ? (
        <Analytics data={analytics} />
      ) : null}
      <TaskViewSwitcher hideProjectFilter />
    </div>
  );
}