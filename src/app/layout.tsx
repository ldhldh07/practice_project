import { ErrorBoundary } from "react-error-boundary";
import { Outlet, useLocation } from "react-router-dom";

import { Footer } from "@/app/ui/footer";
import { HeaderContainer } from "@/app/ui/header-container";
import { ErrorFallback } from "@/shared/ui/error-fallback";

export function Layout() {
  const { pathname, search } = useLocation();

  return (
    <div className="flex min-h-screen flex-col">
      <HeaderContainer />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6 sm:px-6">
          <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={[pathname, search]}>
            <Outlet />
          </ErrorBoundary>
        </div>
      </main>
      <Footer />
    </div>
  );
}
