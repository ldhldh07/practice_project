import { useParams } from "react-router-dom";

import { EmployeeDetailWidget } from "@/widgets/employee-detail";

const EmployeeDetailPage = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const parsedEmployeeId = Number(employeeId);

  return <EmployeeDetailWidget employeeId={parsedEmployeeId} />;
};

export default EmployeeDetailPage;
