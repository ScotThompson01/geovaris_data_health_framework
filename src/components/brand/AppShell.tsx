import type {
  ReactNode,
} from "react";

import { BrandFooter } from "@/components/brand/BrandFooter";
import { BrandHeader } from "@/components/brand/BrandHeader";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({
  children,
}: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-brand-background">
      <header className="border-b border-brand-border bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <BrandHeader variant="app" />
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <BrandFooter variant="app" />
    </div>
  );
}