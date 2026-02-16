import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { RootLayout } from "@/app/ui/layout";
import { ROUTES } from "@/shared/config/routes";
import { ErrorBoundary } from "@/shared/ui/error-boundary";

import EmployeeDetailPage from "./pages/employee-detail-page";
import EmployeeManagerPage from "./pages/employee-manager-page";

const App = () => {
  return (
    <ErrorBoundary
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">오류가 발생했습니다</h1>
            <p className="text-gray-600 mb-4">페이지를 새로고침해 주세요.</p>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => window.location.reload()}
            >
              새로고침
            </button>
          </div>
        </div>
      }
    >
      <Router>
        <RootLayout>
          <Routes>
            <Route path={ROUTES.EMPLOYEE_MANAGER} element={<EmployeeManagerPage />} />
            <Route path={ROUTES.EMPLOYEE_DETAIL} element={<EmployeeDetailPage />} />
          </Routes>
        </RootLayout>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
