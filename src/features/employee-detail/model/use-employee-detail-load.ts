import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { employeeApi, employeeQueryKeys, useSetSelectedEmployee } from "@/entities/employee";

export function useEmployeeDetailLoad(employeeId: number) {
  const setSelectedEmployee = useSetSelectedEmployee();

  const query = useQuery({
    queryKey: employeeQueryKeys.detail(employeeId),
    queryFn: () => employeeApi.getById(employeeId),
    enabled: employeeId > 0,
  });

  useEffect(() => {
    if (!query.data) return;
    setSelectedEmployee(query.data);

    return () => {
      setSelectedEmployee(null);
    };
  }, [query.data, setSelectedEmployee]);

  return {
    employee: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
