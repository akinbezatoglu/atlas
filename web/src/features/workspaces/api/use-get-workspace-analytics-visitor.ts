import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Analytics } from "@/lib/types";

interface UseGetWorkspaceAnalyticsVisitorProps {
  workspaceId: string;
}

export type WorkspaceAnalyticsVisitorResponseType = { data: Analytics };

export const useGetWorkspaceAnalyticsVisitor = ({
  workspaceId,
}: UseGetWorkspaceAnalyticsVisitorProps) => {
  const query = useQuery({
    queryKey: ["workspace-analytics", workspaceId],
    queryFn: async () => {
      const response = await api<WorkspaceAnalyticsVisitorResponseType>(`/api/workspaces/${workspaceId}/analytics`, {
        query: { visitor: "true" }
      });
      return response.data;
    },
  });

  return query;
};
