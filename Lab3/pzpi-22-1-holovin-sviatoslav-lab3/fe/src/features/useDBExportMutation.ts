import { useMutation, useQueryClient } from "react-query";

import { fetchAbstract } from "../utils/fetchAbstract";

export const useDBExportMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(async (data: { password: string }) => {
    return (await fetchAbstract(
      { queryClient },
      {},
      `backup/export`,
      "POST",
      data,
    )) as { db: string };
  });
};
