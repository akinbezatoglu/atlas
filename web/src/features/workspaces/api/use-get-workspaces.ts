import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Workspace, PaginatedResponse } from "@/lib/types";

export const useGetWorkspaces = () => {
  const query = useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const response = await api<{ data: PaginatedResponse<Workspace> }>("/api/workspaces");
      return response.data;
    },
  });

  return query;
};
