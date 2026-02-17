import { useMutation, useQueryClient } from "@tanstack/react-query";

import { employeeApi, employeeQueryKeys } from "@/entities/employee";
import type { Employee } from "@/entities/employee";
import type { CreateEmployeeParams, EmployeesResponse, UpdateEmployeePayload } from "@/entities/employee";

export function useCreateEmployeeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateEmployeeParams) => employeeApi.create(payload),
    onMutate: async (payload) => {
      const listQueries = queryClient.getQueryCache().findAll({ queryKey: employeeQueryKeys.all });
      const previousSnapshots = listQueries.map((q) => ({
        key: q.queryKey,
        data: q.state.data as EmployeesResponse | undefined,
      }));

      const currentMaxId = listQueries.reduce((maxId, query) => {
        const snapshot = (query.state.data as EmployeesResponse | undefined)?.employees ?? [];
        const localMax = snapshot.reduce((m, e) => (e.id > m ? e.id : m), 0);
        return localMax > maxId ? localMax : maxId;
      }, 0);

      const optimisticEmployee: Employee = { ...payload, id: currentMaxId + 1 };

      listQueries.forEach((q) => {
        const data = (q.state.data as EmployeesResponse | undefined) ?? { employees: [], total: 0, skip: 0, limit: 10 };
        queryClient.setQueryData(q.queryKey, {
          ...data,
          employees: [optimisticEmployee, ...data.employees],
          total: data.total + 1,
        });
      });

      return { previousSnapshots, optimisticId: optimisticEmployee.id } as const;
    },
    onError: (_error, _variables, context) => {
      if (!context) return;
      context.previousSnapshots.forEach((s) => queryClient.setQueryData(s.key, s.data));
    },
    onSuccess: async (created, _variables, context) => {
      const listQueries = queryClient.getQueryCache().findAll({ queryKey: employeeQueryKeys.all });
      listQueries.forEach((q) => {
        const data = (q.state.data as EmployeesResponse | undefined) ?? { employees: [], total: 0, skip: 0, limit: 10 };
        const replaced = context
          ? data.employees.map((e: Employee) => (e.id === context.optimisticId ? created : e))
          : [created, ...data.employees];
        queryClient.setQueryData(q.queryKey, { ...data, employees: replaced });
      });
      await queryClient.invalidateQueries({ queryKey: employeeQueryKeys.all });
    },
  });
}

export function useUpdateEmployeeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateEmployeePayload) => employeeApi.update(payload),
    onMutate: async (payload) => {
      const listQueries = queryClient.getQueryCache().findAll({ queryKey: employeeQueryKeys.all });
      const previousSnapshots = listQueries.map((q) => ({
        key: q.queryKey,
        data: q.state.data as EmployeesResponse | undefined,
      }));

      listQueries.forEach((q) => {
        const data = (q.state.data as EmployeesResponse | undefined) ?? { employees: [], total: 0, skip: 0, limit: 10 };
        const replaced = data.employees.map((e: Employee) =>
          e.id === payload.employeeId ? { ...e, ...payload.params } : e,
        );
        queryClient.setQueryData(q.queryKey, { ...data, employees: replaced });
      });

      return { previousSnapshots } as const;
    },
    onError: (_err, _variables, context) => {
      if (!context) return;
      context.previousSnapshots.forEach((s) => queryClient.setQueryData(s.key, s.data));
    },
    onSuccess: async (updated) => {
      const listQueries = queryClient.getQueryCache().findAll({ queryKey: employeeQueryKeys.all });
      listQueries.forEach((q) => {
        const data = (q.state.data as EmployeesResponse | undefined) ?? { employees: [], total: 0, skip: 0, limit: 10 };
        const replaced = data.employees.map((e: Employee) => (e.id === updated.id ? { ...e, ...updated } : e));
        queryClient.setQueryData(q.queryKey, { ...data, employees: replaced });
      });
      await queryClient.invalidateQueries({ queryKey: employeeQueryKeys.all });
    },
  });
}
