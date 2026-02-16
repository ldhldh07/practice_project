import { Building2 } from "lucide-react";
import { Link } from "react-router-dom";

import { ROUTES } from "@/shared/config/routes";

export function Header() {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Building2 className="w-6 h-6" />
          <h1 className="text-xl font-bold">HR 인사 관리 시스템</h1>
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to={ROUTES.EMPLOYEE_MANAGER} className="hover:underline">
                직원 관리
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
