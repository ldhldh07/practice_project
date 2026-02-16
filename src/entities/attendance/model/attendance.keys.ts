export const attendanceQueryKeys = {
  all: ["attendance"] as const,
  byEmployee: (employeeId: number) => ["attendance", "employee", employeeId] as const,
};
