import { useMutation, useQueryClient } from "react-query";

import { fetchAbstract } from "../utils/fetchAbstract";
import { typeToMethod } from "../utils/typeToMethod";
import { Order } from "../types/Order";

export const useOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({
      type,
      data,
    }:
      | { type: "create" | "update"; data: Order }
      | { type: "delete"; data: { order_id: string } }) => {
      return (await fetchAbstract(
        { queryClient },
        {},
        `orders${type !== "create" ? `/${data.order_id}` : ""}`,
        typeToMethod[type],
        data,
      )) as Order;
    },
    {
      onSuccess: () => {
        queryClient.resetQueries("order");
      },
    },
  );
};
