import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { useSetSelectedEmployee } from "@/entities/employee";
import { buildEmployeeDetailQuery } from "@/features/employee-load";

export function useEmployeeDetailLoad(employeeId: number) {
  const setSelectedEmployee = useSetSelectedEmployee();

  const query = useQuery(buildEmployeeDetailQuery(employeeId));

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
