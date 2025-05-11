import { useMutation, useQueryClient } from "react-query";

import { fetchAbstract } from "../utils/fetchAbstract";

export const useDBImportMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(async (data: { data: string; password: string }) => {
    return (await fetchAbstract(
      { queryClient },
      {},
      `backup/import`,
      "POST",
      data,
    )) as { db: string };
  });
};
