import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Task } from "@/lib/types";

type ResponseType = { data: Task };
type RequestType = { param: { taskId: string }; json: Partial<Task> };

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await api<ResponseType>(`/api/tasks/${param.taskId}`, {
        method: "PATCH",
        body: json,
      });
      return response;
    },
    onSuccess: ({ data }) => {
      toast.success("Task succesfully updated");
      queryClient.invalidateQueries({ queryKey: ["project-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["workspace-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", data.id] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update task");
    },
  });

  return mutation;
};
