import { useAddEmployeeDialog } from "@/entities/employee";
import { Button } from "@/shared/ui/button";
import { CardHeader, CardTitle } from "@/shared/ui/card";


export function EmployeeHeaderWidget() {
  const [, setIsAddOpen] = useAddEmployeeDialog();

  return (
    <CardHeader className="flex-row items-center justify-between">
      <CardTitle className="text-xl">인사 관리 백오피스</CardTitle>
      <Button onClick={() => setIsAddOpen(true)}>직원 추가</Button>
    </CardHeader>
  );
}
