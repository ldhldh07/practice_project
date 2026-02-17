import { Outlet } from "react-router-dom";

import { Footer } from "@/app/ui/footer";
import { HeaderContainer } from "@/app/ui/header-container";

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <HeaderContainer />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6 sm:px-6">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
