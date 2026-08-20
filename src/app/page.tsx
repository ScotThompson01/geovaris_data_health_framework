import Link from "next/link";

import { GeoVarisLogo } from "@/components/brand/GeoVarisLogo";
import { GdhfLogo } from "@/components/brand/GdhfLogo";

export default function HomePage() {
  return (
    <main
      className="relative min-h-screen overflow-hidden bg-slate-950 bg-cover bg-center bg-no-repeat text-white"
      style={{
        backgroundImage:
          "url('/brand/gdhf/gdhf-usa-background.png')",
      }}
    >
      {/* Background overlays */}

      <div className="absolute inset-0 bg-slate-950/35" />

      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/55 to-brand-purple/10" />

      {/* Page content */}

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-6">
        {/* Header */}

        <header className="grid grid-cols-2 items-start gap-8 py-8">
          {/* GeoVaris Logo */}

          <div className="flex items-start justify-start pt-8">
            <GeoVarisLogo
              width={1560}
              height={540}
              priority
              className="h-auto w-[900px] max-w-none"
            />
          </div>

          {/* GDHF Logo */}

          <div className="flex items-start justify-end pt-8">
            <div className="rounded-xl bg-white/95 px-5 py-3 shadow-xl">
              <GdhfLogo
                width={380}
                height={125}
                priority
                className="h-auto w-[310px]"
              />
            </div>
          </div>
        </header>

        {/* Main content */}

        <section className="grid flex-1 items-center gap-12 py-10 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Hero */}

          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-purple-300">
              GeoVaris Data Health Framework™
            </p>

            <h1 className="mt-5 text-5xl font-bold leading-tight md:text-6xl">
              Measure. Govern.
              <br />
              Improve.{" "}
              <span className="text-blue-400">
                Trust.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-200">
              A structured assessment platform for evaluating
              data governance, data quality, analytics readiness,
              and AI readiness — and turning results into
              prioritized, actionable improvement plans.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/assessments"
                className="rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg transition hover:scale-[1.02]"
              >
                Open Assessments
              </Link>

              <Link
                href="/assessments/new"
                className="rounded-xl border border-purple-400 bg-slate-950/60 px-7 py-3.5 text-base font-semibold text-white backdrop-blur transition hover:bg-purple-950/70"
              >
                Create New Assessment
              </Link>

              <Link
                href="/clients"
                className="rounded-xl border border-purple-400 bg-slate-950/60 px-7 py-3.5 text-base font-semibold text-white backdrop-blur transition hover:bg-purple-950/70"
              >
                Manage Clients
              </Link>

              <Link
                href="/templates"
                className="rounded-xl border border-purple-400 bg-slate-950/60 px-7 py-3.5 text-base font-semibold text-white backdrop-blur transition hover:bg-purple-950/70"
              >
                Manage Templates
              </Link>
            </div>

            <p className="mt-8 text-lg font-semibold">
              <span className="text-purple-400">
                Clean data.
              </span>{" "}
              <span className="text-blue-400">
                Confident results.
              </span>
            </p>
          </div>

          {/* Capabilities */}

          <div className="rounded-3xl border border-purple-300/30 bg-slate-950/70 p-8 shadow-2xl backdrop-blur-md">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-purple-300">
              Assessment Capabilities
            </p>

            <div className="mt-6 grid gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h2 className="text-lg font-semibold text-purple-300">
                  Data Governance
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Evaluate ownership, stewardship, policies,
                  and accountability.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h2 className="text-lg font-semibold text-blue-300">
                  Data Quality
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Assess controls, issue management, standards,
                  and reliability.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h2 className="text-lg font-semibold text-purple-300">
                  Analytics &amp; Reporting
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Measure trusted reporting, definitions,
                  and decision readiness.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h2 className="text-lg font-semibold text-blue-300">
                  AI Readiness
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Evaluate whether governed, trusted data can
                  support AI use cases.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}

        <footer className="border-t border-white/20 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-slate-300">
            <p>GeoVaris</p>

            <p>© 2026 GeoVaris</p>

            <p className="font-medium text-purple-300">
              GeoVaris Data Health Framework™
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}