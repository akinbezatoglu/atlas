import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Member, PaginatedResponse } from "@/lib/types";

interface UseGetMembersVisitorProps {
  workspaceId: string;
}

export const useGetMembersVisitor = ({ workspaceId }: UseGetMembersVisitorProps) => {
  const query = useQuery({
    queryKey: ["members", workspaceId],
    queryFn: async () => {
      const response = await api<{ data: PaginatedResponse<Member> }>("/api/members", {
        query: { workspaceId, visitor: "true" },
      });
      return response.data;
    },
  });

  return query;
};
