import { FileQuestion, Home } from "lucide-react";
import { Link } from "react-router-dom";

import { EMPLOYEE_MANAGER_ROUTE } from "@/pages";

export function NotFoundPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20">
      <div className="rounded-full bg-muted p-4">
        <FileQuestion className="h-10 w-10 text-muted-foreground" />
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight">페이지를 찾을 수 없습니다</h2>
        <p className="mt-1 text-sm text-muted-foreground">요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
      </div>
      <Link
        to={EMPLOYEE_MANAGER_ROUTE}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
      >
        <Home className="h-4 w-4" />
        홈으로 돌아가기
      </Link>
    </div>
  );
}
