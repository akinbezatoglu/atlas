import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleDotDashedIcon,
  CircleDotIcon,
  CircleIcon,
  PlusIcon,
} from "lucide-react";

import { snakeCaseToTitleCase } from "@/lib/utils";
import { TaskStatus } from "@/features/tasks/types";
import { Button } from "@/components/ui/button";

interface VisitorKanbanColumnHeaderProps {
  board: TaskStatus;
  taskCount: number;
}

const statusIconMap: Record<TaskStatus, React.ReactNode> = {
  [TaskStatus.BACKLOG]: (
    <CircleDashedIcon className="size-[18px] text-zinc-400" />
  ),
  [TaskStatus.TODO]: (
    <CircleIcon className="size-[18px] text-red-400" />
  ),
  [TaskStatus.IN_PROGRESS]: (
    <CircleDotDashedIcon className="size-[18px] text-yellow-400" />
  ),
  [TaskStatus.IN_REVIEW]: (
    <CircleDotIcon className="size-[18px] text-blue-400" />
  ),
  [TaskStatus.DONE]: (
    <CircleCheckIcon className="size-[18px] text-emerald-400" />
  ),
}

export function VisitorKanbanColumnHeader({
  board,
  taskCount,
}: VisitorKanbanColumnHeaderProps) {
  const icon = statusIconMap[board];

  return (
    <div className="px-2 py-1.5 flex items-center justify-between">
      <div className="flex items-center gap-x-2">
        {icon}
        <h2 className="text-sm font-medium">
          {snakeCaseToTitleCase(board)}
        </h2>
        <div className="size-5 flex items-center justify-center rounded-md font-medium bg-neutral-200 text-xs text-neutral-700">
          {taskCount}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="size-5 cursor-not-allowed"
      >
        <PlusIcon className="size-4 text-neutral-500" />
      </Button>
    </div>
  )
}
