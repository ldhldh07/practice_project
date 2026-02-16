import { Building2 } from "lucide-react";

import type { ReactNode } from "react";

type HeaderProps = {
  navigation: ReactNode;
};

export function Header({ navigation }: Readonly<HeaderProps>) {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Building2 className="w-6 h-6" />
          <h1 className="text-xl font-bold">HR 인사 관리 시스템</h1>
        </div>
        <nav>{navigation}</nav>
      </div>
    </header>
  );
}
