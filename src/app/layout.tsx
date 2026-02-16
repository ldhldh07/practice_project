import { Outlet } from "react-router-dom";

import { Footer } from "@/widgets/footer/ui/footer";
import { HeaderContainer } from "@/widgets/header/ui/header-container";

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <HeaderContainer />
      <main className="flex-1">
        <div className="container mx-auto px-6 py-6">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
