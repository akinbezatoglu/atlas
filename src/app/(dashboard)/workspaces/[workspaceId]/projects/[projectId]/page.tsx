import Link from "next/link";
import { redirect } from "next/navigation";
import { PencilIcon } from "lucide-react";

import { getCurrent } from "@/features/auth/queries";
import { getProject } from "@/features/projects/queries";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";

import { Button } from "@/components/ui/button";

interface ProjectIdPageProps {
  params: { projectId: string };
}

const ProjectIdPage = async ({
  params
}: ProjectIdPageProps) => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  const initialValues = await getProject({
    projectId: params.projectId,
  });

  if (!initialValues) throw new Error("Project not found");

  return (
    <div className="felx flex-col gap-y-4">
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={initialValues.name}
            image={initialValues.imageUrl}
            className="size-8"
          />
          <p className="text-lg font-semibold">{initialValues.name}</p>
        </div>
        <div>
          <Button
            asChild
            size="sm"
            variant="secondary"
          >
            <Link href={`/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}/settings`}>
              <PencilIcon className="size-4 mr-2" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>
      <TaskViewSwitcher />
    </div>
  );
}

export default ProjectIdPage;
