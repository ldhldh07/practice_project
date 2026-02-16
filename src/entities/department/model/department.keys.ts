export const departmentQueryKeys = {
  all: ["departments"] as const,
  list: () => ["departments", "list"] as const,
};
