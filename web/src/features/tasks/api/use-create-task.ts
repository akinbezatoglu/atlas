import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Task } from "@/lib/types";

type ResponseType = { data: Task };
type RequestType = { json: any }; // Using any here to match old behavior, actual type is inferred from schema

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await api<ResponseType>("/api/tasks", {
        method: "POST",
        body: json,
      });
      return response;
    },
    onSuccess: () => {
      toast.success("Task succesfully created");
      queryClient.invalidateQueries({ queryKey: ["project-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["workspace-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create task");
    },
  });

  return mutation;
};
