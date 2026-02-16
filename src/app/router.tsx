import { Suspense, lazy, type ReactNode } from "react";
import { createBrowserRouter } from "react-router-dom";

import { Layout } from "@/app/layout";
import { RequireValidEmployeeIdGuard } from "@/features/employee-detail";
import { EMPLOYEE_DETAIL_ROUTE, EMPLOYEE_DETAIL_TITLE, EMPLOYEE_MANAGER_ROUTE, EMPLOYEE_MANAGER_TITLE } from "@/pages";
import { NOT_FOUND_ROUTE, NOT_FOUND_TITLE } from "@/pages/not-found";

const LazyEmployeeManagerPage = lazy(() =>
  import("@/pages/employee-manager/EmployeeManagerPage").then((module) => ({ default: module.EmployeeManagerPage })),
);
const LazyEmployeeDetailPage = lazy(() =>
  import("@/pages/employee-detail/EmployeeDetailPage").then((module) => ({ default: module.EmployeeDetailPage })),
);
const LazyNotFoundPage = lazy(() =>
  import("@/pages/not-found/NotFoundPage").then((module) => ({ default: module.NotFoundPage })),
);

const RouteLoadingFallback = <div className="p-6 text-sm text-gray-500">불러오는 중...</div>;

function withRouteSuspense(element: ReactNode) {
  return <Suspense fallback={RouteLoadingFallback}>{element}</Suspense>;
}

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: EMPLOYEE_MANAGER_ROUTE,
        element: withRouteSuspense(<LazyEmployeeManagerPage />),
        handle: { title: EMPLOYEE_MANAGER_TITLE },
      },
      {
        element: <RequireValidEmployeeIdGuard redirectPath={EMPLOYEE_MANAGER_ROUTE} />,
        children: [
          {
            path: EMPLOYEE_DETAIL_ROUTE,
            element: withRouteSuspense(<LazyEmployeeDetailPage />),
            handle: { title: EMPLOYEE_DETAIL_TITLE },
          },
        ],
      },
      {
        path: NOT_FOUND_ROUTE,
        element: withRouteSuspense(<LazyNotFoundPage />),
        handle: { title: NOT_FOUND_TITLE },
      },
    ],
  },
]);
