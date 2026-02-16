import { queryOptions } from "@tanstack/react-query";

import { departmentQueryKeys } from "./department.keys";
import { departmentApi } from "../api/department.api";

export const departmentsQuery = () =>
  queryOptions({
    queryKey: departmentQueryKeys.list(),
    queryFn: () => departmentApi.getList(),
    staleTime: 60_000,
  });
