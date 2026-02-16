import { Card, CardContent, CardHeader } from "@/shared/ui/card";

import type { ReactNode } from "react";

type EmployeeDetailLayoutProps = {
  title: string;
  action?: ReactNode;
  children: ReactNode;
};

export function EmployeeDetailLayout({ title, action, children }: Readonly<EmployeeDetailLayoutProps>) {
  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          {action}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
