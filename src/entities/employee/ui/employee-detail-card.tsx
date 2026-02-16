import { Card, CardContent, CardHeader } from "@/shared/ui/card";

import type { ReactNode } from "react";

type EmployeeDetailCardProps = {
  title: string;
  action?: ReactNode;
  children: ReactNode;
};

export function EmployeeDetailCard({ title, action, children }: Readonly<EmployeeDetailCardProps>) {
  return (
    <Card className="w-full max-w-[1000px] mx-auto">
      <CardHeader className="flex-row items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        {action}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
