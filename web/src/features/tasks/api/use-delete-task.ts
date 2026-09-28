import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

type ResponseType = { data: { id: string } };
type RequestType = { param: { taskId: string } };

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await api<ResponseType>(`/api/tasks/${param.taskId}`, {
        method: "DELETE",
      });
      return response;
    },
    onSuccess: ({ data }) => {
      toast.success("Task succesfully deleted");
      queryClient.invalidateQueries({ queryKey: ["project-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["workspace-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", data.id] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete task");
    },
  });

  return mutation;
};
