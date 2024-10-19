'use client'

import { useCallback } from "react"
import { useQueryState } from "nuqs"
import { Loader, PlusIcon } from "lucide-react"
import { toast } from "sonner"

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"

import { DottedSeparator } from "@/components/dotted-separator"
import { Button } from "@/components/ui/button"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs"

import { useProjectId } from "@/features/projects/hooks/use-project-id"
import { useTaskFilters } from "@/features/tasks/hooks/use-task-filters"
import { useGetTasksVisitor } from "@/features/tasks/api/use-get-tasks-visitor"
import { VisitorDataFilters } from "./visitor-data-filters"
import { VisitorDataTable } from "./visitor-data-table"
import { visitorColumns } from "./visitor-columns"
import { VisitorDataKanban } from "./visitor-data-kanban"
import { VisitorDataCalendar } from "./visitor-data-calendar"

interface TaskViewSwitcherProps {
  hideProjectFilter?: boolean;
};

export const VisitorTaskViewSwitcher = ({
  hideProjectFilter,
}: TaskViewSwitcherProps) => {
  const [{
    status,
    assigneeId,
    projectId,
    dueDate
  }] = useTaskFilters();

  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table",
  });

  const workspaceId = useWorkspaceId();
  const paramProjectId = useProjectId();

  const {
    data: tasks,
    isLoading: isLoadingTasks
  } = useGetTasksVisitor({
    workspaceId,
    projectId: paramProjectId || projectId,
    assigneeId,
    status,
    dueDate,
  });

  const onKanbanChange = useCallback(() => {
    toast.error("Changes to this view do not affect the actual data");
  }, []);

  return (
    <div>
      <Tabs
        defaultValue={view}
        onValueChange={setView}
        className="flex-1 w-full border rounded-lg"
      >
        <div className="h-full flex flex-col overflow-auto p-4">
          <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
            <TabsList className="w-full lg:w-auto">
              <TabsTrigger
                className="h-8 w-full lg:w-auto"
                value="table"
              >
                Table
              </TabsTrigger>
              <TabsTrigger
                className="h-8 w-full lg:w-auto"
                value="kanban"
              >
                Kanban
              </TabsTrigger>
              <TabsTrigger
                className="h-8 w-full lg:w-auto"
                value="calendar"
              >
                Calendar
              </TabsTrigger>
            </TabsList>
            <Button
              size="sm"
              className="w-full lg:w-auto cursor-not-allowed"
            >
              <PlusIcon className="size-4 mr-2" />
              New
            </Button>
          </div>
          <DottedSeparator className="my-4" />
          <VisitorDataFilters hideProjectFilter={hideProjectFilter} />
          <DottedSeparator className="my-4" />
          {isLoadingTasks ? (
            <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
              <Loader className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <TabsContent value="table" className="mt-0">
                <VisitorDataTable columns={visitorColumns} data={tasks?.documents ?? []} />
              </TabsContent>
              <TabsContent value="kanban" className="mt-0">
                <VisitorDataKanban
                  data={tasks?.documents ?? []}
                  onChange={onKanbanChange}
                />
              </TabsContent>
              <TabsContent value="calendar" className="mt-0 h-full pb-4">
                <VisitorDataCalendar data={tasks?.documents ?? []} />
              </TabsContent>
            </>
          )}
        </div>
      </Tabs>
    </div>
  )
}