import { useOpenAddEmployeeDialog } from "@/features/employee-edit";
import { Button } from "@/shared/ui/button";
import { CardHeader } from "@/shared/ui/card";

export function EmployeeHeaderWidget() {
  const setIsAddOpen = useOpenAddEmployeeDialog();

  return (
    <CardHeader className="flex-row items-center justify-between">
      <Button onClick={() => setIsAddOpen(true)}>직원 추가</Button>
    </CardHeader>
  );
}
