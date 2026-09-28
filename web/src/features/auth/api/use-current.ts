import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { User } from "@/lib/types";

export const useCurrent = () => {
  const query = useQuery({
    queryKey: ["current"],
    queryFn: async () => {
      try {
        const { data } = await api<{ data: User }>("/api/auth/current");
        return data;
      } catch {
        return null;
      }
    },
  });

  return query;
};
