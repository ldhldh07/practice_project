import { Link, useLocation } from "react-router-dom";

import { EMPLOYEE_MANAGER_ROUTE } from "@/shared/config/routes";
import { cn } from "@/shared/lib/cn";

import { Header } from "./header";

export function HeaderContainer() {
  const { pathname } = useLocation();
  const isActive = pathname === "/" || pathname.startsWith(EMPLOYEE_MANAGER_ROUTE.replace("*", ""));

  return (
    <Header
      navigation={
        <ul className="flex items-center gap-1">
          <li>
            <Link
              to={EMPLOYEE_MANAGER_ROUTE}
              className={cn(
                "inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent",
              )}
            >
              직원 관리
            </Link>
          </li>
        </ul>
      }
    />
  );
}
