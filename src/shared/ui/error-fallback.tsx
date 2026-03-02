import { AlertTriangle, RotateCcw } from "lucide-react";

import { Button } from "./button";

interface ErrorFallbackProps {
  error: unknown;
  resetErrorBoundary: () => void;
}

export function ErrorFallback({ resetErrorBoundary }: Readonly<ErrorFallbackProps>) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center">
      <div className="mb-6 rounded-full bg-muted p-4">
        <AlertTriangle className="size-8 text-muted-foreground" />
      </div>
      <h1 className="mb-2 text-2xl font-bold">데이터를 불러올 수 없습니다</h1>
      <p className="mb-6 max-w-md text-muted-foreground">
        요청을 처리하는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.
      </p>
      <Button variant="outline" onClick={resetErrorBoundary}>
        <RotateCcw className="mr-2 size-4" />
        다시 시도
      </Button>
    </div>
  );
}
