import { RouterProvider } from "react-router-dom";

import { ERROR_BOUNDARY_TEXT } from "@/app/config/error-boundary.constants";
import { router } from "@/app/router";
import { ErrorBoundary } from "@/shared/ui/error-boundary";

const App = () => {
  return (
    <ErrorBoundary
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">{ERROR_BOUNDARY_TEXT.title}</h1>
            <p className="text-gray-600 mb-4">{ERROR_BOUNDARY_TEXT.description}</p>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
