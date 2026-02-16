import { Link } from "react-router-dom";

import { EMPLOYEE_MANAGER_ROUTE } from "@/pages";

import { Header } from "./header";

export function HeaderContainer() {
  return (
    <Header
      navigation={
        <ul className="flex space-x-4">
          <li>
            <Link to={EMPLOYEE_MANAGER_ROUTE} className="hover:underline">
              직원 관리
            </Link>
          </li>
        </ul>
      }
    />
  );
}
