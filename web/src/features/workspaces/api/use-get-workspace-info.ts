import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Workspace } from "@/lib/types";

interface UseGetWorkspaceInfoProps {
  workspaceId: string;
}

export const useGetWorkspaceInfo = ({ workspaceId }: UseGetWorkspaceInfoProps) => {
  const query = useQuery({
    queryKey: ["workspace-info", workspaceId],
    queryFn: async () => {
      const response = await api<{ data: Partial<Workspace> }>(`/api/workspaces/${workspaceId}/info`);
      return response.data;
    },
  });

  return query;
};
