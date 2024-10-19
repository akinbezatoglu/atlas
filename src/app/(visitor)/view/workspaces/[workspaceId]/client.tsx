'use client'

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { CalendarIcon, PlusIcon, SettingsIcon } from "lucide-react";

import { Task } from "@/features/tasks/types";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { PageLoader } from "@/components/page-loader";
import { PageError } from "@/components/page-error";
import { Button } from "@/components/ui/button";
import { VisitorAnalytics } from "@/features/visitors/components/visitor-analytics";
import { Card, CardContent } from "@/components/ui/card";
import { DottedSeparator } from "@/components/dotted-separator";
import { Project } from "@/features/projects/types";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { Member } from "@/features/members/types";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { useGetWorkspaceAnalyticsVisitor } from "@/features/workspaces/api/use-get-workspace-analytics-visitor";
import { useGetTasksVisitor } from "@/features/tasks/api/use-get-tasks-visitor";
import { useGetProjectsVisitor } from "@/features/projects/api/use-get-projects-visitor";
import { useGetMembersVisitor } from "@/features/members/api/use-get-members-visitor";

export const ViewWorkspaceIdClient = () => {
  const workspaceId = useWorkspaceId();

  const { data: analytics, isLoading: isLoadingAnalytics } = useGetWorkspaceAnalyticsVisitor({ workspaceId });
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasksVisitor({ workspaceId });
  const { data: projects, isLoading: isLoadingProjects } = useGetProjectsVisitor({ workspaceId });
  const { data: members, isLoading: isLoadingMembers } = useGetMembersVisitor({ workspaceId });

  const isLoading =
    isLoadingAnalytics ||
    isLoadingTasks ||
    isLoadingProjects ||
    isLoadingMembers;

  if (isLoading) {
    return <PageLoader />
  }

  if (!analytics || !tasks || !projects || !members) {
    return <PageError message= "This workspace is private. Only members can view this workspace" />
  }

  return (
    <div className="h-full felx flex-col space-y-4">
      <VisitorAnalytics data={analytics} />
      <div className="grid gird-cols-1 xl:grid-cols-2 gap-4">
        <TaskList
          data={tasks.documents}
          total={tasks.total}
        />
        <ProjectList
          data={projects.projects.documents}
          total={projects.projects.total}
        />
        <MembersList
          data={members.documents}
          total={members.total}
        />
      </div>
    </div>
  );
}

interface TaskLisTProps {
  data: Task[];
  total: number;
};

export const TaskList = ({ data, total }: TaskLisTProps) => {
  const workspaceId = useWorkspaceId();

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Tasks ({total})</p>
          <Button
            variant="muted"
            size="icon"
            className="cursor-not-allowed"
          >
            <PlusIcon className="size-4 text-neutral-400" />
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="flex flex-col gap-y-4">
          {data.map((task) => (
            <li key={task.$id}>
              <div className="cursor-not-allowed">
                <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                  <CardContent className="p-4">
                    <p className="text-base font-medium truncate">
                      {task.name}
                    </p>
                    <div className="flex items-center gap-x-2 text-sm">
                      <p className="text-muted-foreground">
                        {task.project?.name}
                      </p>
                      <div className="size-1 rounded-full bg-neutral-300" />
                      <div className="text-muted-foreground flex items-center">
                        <CalendarIcon className="size-3 mr-1" />
                        <span className="truncate">
                          {formatDistanceToNow(new Date(task.dueDate))}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No tasks found
          </li>
        </ul>
        <Button variant="muted" className="mt-4 w-full" asChild>
          <Link href={`/view/workspaces/${workspaceId}/tasks`}>
            Show All
          </Link>
        </Button>
      </div>
    </div>
  );
};

interface ProjectLisTProps {
  data: Project[];
  total: number;
};

export const ProjectList = ({ data, total }: ProjectLisTProps) => {
  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Projects ({total})</p>
          <Button
            variant="secondary"
            size="icon"
            className="cursor-not-allowed"
          >
            <PlusIcon className="size-4 text-neutral-400" />
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {data.map((project) => (
            <li key={project.$id}>
              <div className="cursor-not-allowed">
                <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                  <CardContent className="p-4 flex items-center gap-x-2.5">
                    <ProjectAvatar
                      className="size-12"
                      fallbackClassName="text-lg"
                      name={project.name}
                      image={project.imageUrl}
                    />
                    <p className="text-lg font-medium truncate">
                      {project.name}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No projects found
          </li>
        </ul>
      </div>
    </div>
  );
};

interface MembersListProps {
  data: Member[];
  total: number;
};

export const MembersList = ({ data, total }: MembersListProps) => {
  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Members ({total})</p>
          <Button
            variant="secondary"
            size="icon"
            className="cursor-not-allowed"
            asChild
          >
            <div>
              <SettingsIcon className="size-4 text-neutral-400" />

            </div>
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((member) => (
            <li key={member.$id}>
              <Card className="shadow-none rounded-lg overflow-hidden">
                <CardContent className="p-3 flex flex-col items-center gap-x-2">
                  <MemberAvatar
                    className="size-12"
                    fallbackClassName="text-lg"
                    name={member.name}
                  />
                  <div className="flex flex-col items-center overflow-hidden">
                    <p className="text-lg font-medium line-clamp-1">
                      {member.name}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {member.email}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No members found
          </li>
        </ul>
      </div>
    </div>
  );
};