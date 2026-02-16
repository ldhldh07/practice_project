export type { Employee, EmployeeSortBy, SortOrder } from "./model/employee.types";
export type { EmployeeStatus } from "./model/employee.schema";
export type { EmployeesParams, EmployeesResponse, CreateEmployeeParams, UpdateEmployeePayload } from "./api/employee.api";

export { employeeApi } from "./api/employee.api";
export { employeeQueryKeys } from "./model/employee.keys";
export type { EmployeesListParams } from "./model/employee.keys";

export {
  useSelectedEmployee,
  useEmployeeDetailDialog,
  useAddEmployeeDialog,
  useEditEmployeeDialog,
  useEmployeeManager,
  useCreateEmployeeForm,
  useUpdateEmployeeForm,
  type CreateEmployeeFormData,
  type UpdateEmployeeFormData,
} from "./model/employee.hook";

export { useCreateEmployeeMutation, useUpdateEmployeeMutation, useDeleteEmployeeMutation } from "./model/employee.query";
export { useEmployeeSearchParams } from "./model/employee.search-params";
export type { EmployeeSearchParams } from "./model/employee.search-params";

export { EmployeeFilter } from "./ui/employee-filter";
export { EmployeesTable } from "./ui/employees-table";
export { EmployeeContent } from "./ui/employee-content";
export { EmployeeAddDialog } from "./ui/employee-add-dialog";
export { EmployeeEditDialog } from "./ui/employee-edit-dialog";
