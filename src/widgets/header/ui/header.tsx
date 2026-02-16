import { Building2 } from "lucide-react";

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
              <a href="#" className="hover:underline">
                홈
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                구성원
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                조직도
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
