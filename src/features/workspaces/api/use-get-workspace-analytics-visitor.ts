import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { InferResponseType } from "hono";

interface UseGetWorkspaceAnalyticsProps {
  workspaceId: string;
};

export type WorkspaceAnalyticsVisitorResponseType = InferResponseType<typeof client.api.workspaces[":workspaceId"]["analytics"]["visitor"]["$get"], 200>;

export const useGetWorkspaceAnalyticsVisitor = ({
  workspaceId,
}: UseGetWorkspaceAnalyticsProps) => {
  const query = useQuery({
    queryKey: ["workspace-analytics-visitor", workspaceId],
    queryFn: async () => {
      const response = await client.api.workspaces[":workspaceId"]["analytics"]["visitor"].$get({
        param: { workspaceId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch workspace analytics");
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
