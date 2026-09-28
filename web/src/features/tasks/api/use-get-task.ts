import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Task } from "@/lib/types";

interface UseGetTaskProps {
  taskId: string;
}

export const useGetTask = ({ taskId }: UseGetTaskProps) => {
  const query = useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const response = await api<{ data: Task }>(`/api/tasks/${taskId}`);
      return response.data;
    },
  });

  return query;
};
