import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Analytics } from "@/lib/types";

interface UseGetProjectAnalyticsProps {
  projectId: string;
}

export type ProjectAnalyticsResponseType = { data: Analytics };

export const useGetProjectAnalytics = ({
  projectId,
}: UseGetProjectAnalyticsProps) => {
  const query = useQuery({
    queryKey: ["project-analytics", projectId],
    queryFn: async () => {
      const response = await api<ProjectAnalyticsResponseType>(`/api/projects/${projectId}/analytics`);
      return response.data;
    },
  });

  return query;
};
