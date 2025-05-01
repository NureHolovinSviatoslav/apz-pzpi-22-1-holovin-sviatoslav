import { useQuery, useQueryClient } from "react-query";
import { Order } from "../types/Order";
import { fetchAbstract } from "../utils/fetchAbstract";

export const useOrderQuery = (id?: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const data = (await fetchAbstract(
        { queryClient },
        {},
        `orders${id ? `/${id}` : ""}`,
        "GET",
      )) as Order[] | Order;

      return Array.isArray(data) ? data : [data];
    },
  });
};
