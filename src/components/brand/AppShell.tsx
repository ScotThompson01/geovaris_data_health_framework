import type {
  ReactNode,
} from "react";

import {
  auth,
  signOut,
} from "../../../auth";

import { BrandFooter } from "@/components/brand/BrandFooter";
import { BrandHeader } from "@/components/brand/BrandHeader";

type AppShellProps = {
  children: ReactNode;
};

export async function AppShell({
  children,
}: AppShellProps) {
  const session =
    await auth();

  return (
    <div className="flex min-h-screen flex-col bg-brand-background">
      <header className="border-b border-brand-border bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-6">
          <BrandHeader variant="app" />

          {session?.user && (
            <div className="flex flex-wrap items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-brand-text">
                  {session.user.name ??
                    "Signed-in User"}
                </p>

                {session.user.email && (
                  <p className="text-xs text-brand-muted">
                    {session.user.email}
                  </p>
                )}
              </div>

              <form
                action={async () => {
                  "use server";

                  await signOut({
                    redirectTo:
                      "/login",
                  });
                }}
              >
                <button
                  type="submit"
                  className="rounded-lg border border-brand-border px-4 py-2 text-sm font-medium text-brand-text hover:bg-slate-50"
                >
                  Sign Out
                </button>
              </form>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <BrandFooter variant="app" />
    </div>
  );
}