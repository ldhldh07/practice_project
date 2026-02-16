import { useEffect } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";

type RequireValidEmployeeIdGuardProps = {
  redirectPath: string;
};

export function RequireValidEmployeeIdGuard({ redirectPath }: Readonly<RequireValidEmployeeIdGuardProps>) {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  const parsedEmployeeId = Number(employeeId);
  const isValidEmployeeId = Number.isInteger(parsedEmployeeId) && parsedEmployeeId > 0;

  useEffect(() => {
    if (isValidEmployeeId) return;
    navigate(redirectPath, { replace: true });
  }, [isValidEmployeeId, navigate, redirectPath]);

  if (!isValidEmployeeId) {
    return null;
  }

  return <Outlet />;
}
