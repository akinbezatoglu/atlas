import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Task, TaskStatus, PaginatedResponse } from "@/lib/types";

interface UseGetTasksVisitorProps {
  workspaceId: string;
  projectId?: string | null;
  status?: TaskStatus | null;
  search?: string | null;
  assigneeId?: string | null;
  dueDate?: string | null;
}

export const useGetTasksVisitor = ({
  workspaceId,
  projectId,
  status,
  search,
  assigneeId,
  dueDate,
}: UseGetTasksVisitorProps) => {
  const query = useQuery({
    queryKey: [
      "tasks",
      workspaceId,
      projectId,
      status,
      search,
      assigneeId,
      dueDate,
    ],
    queryFn: async () => {
      const response = await api<{ data: PaginatedResponse<Task> }>("/api/tasks", {
        query: {
          workspaceId,
          projectId: projectId ?? undefined,
          status: status ?? undefined,
          search: search ?? undefined,
          assigneeId: assigneeId ?? undefined,
          dueDate: dueDate ?? undefined,
          visitor: "true",
        },
      });
      return response.data;
    },
  });

  return query;
};
