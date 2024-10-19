import { cn } from "@/lib/utils";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { Project } from "@/features/projects/types";

import { TaskStatus } from "@/features/tasks/types";
import { Member } from "@/features/members/types";

interface VisitorEventCardProps {
  title: string,
  assignee: Member;
  project: Project;
  status: TaskStatus;
  id: string;
}

const statusColorMap: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: "border-l-red-500",
  [TaskStatus.IN_PROGRESS]: "border-l-yellow-500",
  [TaskStatus.IN_REVIEW]: "border-l-blue-500",
  [TaskStatus.DONE]: "border-l-emerald-500",
  [TaskStatus.BACKLOG]: "border-l-zinc-500"
};

export const VisitorEventCard = ({
  title,
  assignee,
  project,
  status,
}: VisitorEventCardProps) => {
  return (
    <div className="px-2">
      <div className={cn(
        "p-1.5 text-xs bg-white text-primary border rounded-md border-l-4 flex flex-col gap-y-1.5 cursor-not-allowed hover:opacity-75 transition",
        statusColorMap[status]
      )}>
        <p>{title}</p>
        <div className="flex items-center gap-x-1">
          <MemberAvatar name={assignee?.name} />
          <div className="size-1 rounded-full bg-neutral-300" />
          <ProjectAvatar
            name={project?.name}
            image={project?.imageUrl}
          />
        </div>
      </div>
    </div>
  );
};
