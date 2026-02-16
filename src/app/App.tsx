import { RouterProvider } from "react-router-dom";

import { ERROR_BOUNDARY_TEXT } from "@/app/config/error-boundary.constants";
import { router } from "@/app/router";
import { ErrorBoundary } from "@/shared/ui/error-boundary";

const App = () => {
  return (
    <ErrorBoundary
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <svg
                className="h-6 w-6 text-destructive"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight">{ERROR_BOUNDARY_TEXT.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{ERROR_BOUNDARY_TEXT.description}</p>
            <button
              className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              onClick={() => window.location.reload()}
            >
              {ERROR_BOUNDARY_TEXT.reloadButton}
            </button>
          </div>
        </div>
      }
    >
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
};

export default App;
