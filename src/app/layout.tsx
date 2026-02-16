import { Outlet } from "react-router-dom";

import { Footer } from "@/widgets/footer/ui/footer";
import { HeaderContainer } from "@/widgets/header/ui/header-container";

export function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderContainer />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
