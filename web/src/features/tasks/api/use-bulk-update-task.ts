import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Task } from "@/lib/types";

type ResponseType = { data: Task[] };
type RequestType = { json: { tasks: { id: string; status: Task["status"]; position: number }[] } };

export const useBulkUpdateTask = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await api<ResponseType>("/api/tasks/bulk-update", {
        method: "POST",
        body: json,
      });
      return response;
    },
    onSuccess: () => {
      toast.success("Tasks succesfully updated");
      queryClient.invalidateQueries({ queryKey: ["project-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["workspace-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update tasks");
    },
  });

  return mutation;
};
