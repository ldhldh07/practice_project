import { useOpenAddEmployeeDialog } from "@/features/employee-edit";
import { Button } from "@/shared/ui/button";
import { CardHeader, CardTitle } from "@/shared/ui/card";

export function EmployeeHeaderWidget() {
  const setIsAddOpen = useOpenAddEmployeeDialog();

  return (
    <CardHeader className="flex-row items-center justify-between">
      <CardTitle className="text-xl">인사 관리 백오피스</CardTitle>
      <Button onClick={() => setIsAddOpen(true)}>직원 추가</Button>
    </CardHeader>
  );
}
