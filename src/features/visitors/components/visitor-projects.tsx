'use client'

import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetProjectsVisitor } from "@/features/projects/api/use-get-projects-visitor";

export const VisitorProjects = () => {
  const workspaceId = useWorkspaceId();
  const { data } = useGetProjectsVisitor({
    workspaceId,
  });
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Projects</p>
      </div>
      {data?.projects.documents.map((project) => {

        return (
          <div key={project.$id}>
            <div
              className="flex items-center gap-2.5 py-2 rounded-md hover:opacity-75 transition cursor-not-allowed text-neutral-500"
            >
              <ProjectAvatar image={project.imageUrl} name={project.name} />
              <span className="truncate">{project.name}</span>
            </div>
          </div>
        )
      })}
    </div>
  );
};