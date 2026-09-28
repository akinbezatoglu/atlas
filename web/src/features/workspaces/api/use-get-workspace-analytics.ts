import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Analytics } from "@/lib/types";

interface UseGetWorkspaceAnalyticsProps {
  workspaceId: string;
}

export type WorkspaceAnalyticsResponseType = { data: Analytics };

export const useGetWorkspaceAnalytics = ({
  workspaceId,
}: UseGetWorkspaceAnalyticsProps) => {
  const query = useQuery({
    queryKey: ["workspace-analytics", workspaceId],
    queryFn: async () => {
      const response = await api<WorkspaceAnalyticsResponseType>(`/api/workspaces/${workspaceId}/analytics`);
      return response.data;
    },
  });

  return query;
};
