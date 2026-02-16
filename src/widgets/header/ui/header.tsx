import { Building2 } from "lucide-react";

import type { ReactNode } from "react";

type HeaderProps = {
  navigation: ReactNode;
};

export function Header({ navigation }: Readonly<HeaderProps>) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Building2 className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold tracking-tight">HR Manager</span>
        </div>
        <nav>{navigation}</nav>
      </div>
    </header>
  );
}
