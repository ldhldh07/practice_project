import { Suspense, lazy, type ReactNode } from "react";
import { createBrowserRouter } from "react-router-dom";

import { Layout } from "@/app/layout";
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

const RouteLoadingFallback = (
  <div className="space-y-6 px-6 py-6">
    <div className="space-y-2">
      <div className="h-7 w-48 animate-pulse rounded-lg bg-muted" />
      <div className="h-4 w-72 animate-pulse rounded-lg bg-muted" />
    </div>
    <div className="h-[400px] w-full animate-pulse rounded-xl bg-muted" />
  </div>
);

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
        path: EMPLOYEE_DETAIL_ROUTE,
        element: withRouteSuspense(<LazyEmployeeDetailPage />),
        handle: { title: EMPLOYEE_DETAIL_TITLE },
      },
      {
        path: NOT_FOUND_ROUTE,
        element: withRouteSuspense(<LazyNotFoundPage />),
        handle: { title: NOT_FOUND_TITLE },
      },
    ],
  },
]);
