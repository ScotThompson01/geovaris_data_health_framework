import Link from "next/link";

export default function AccessDeniedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <div className="w-full max-w-md rounded-2xl border border-purple-500/30 bg-slate-900 p-8 text-center shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-400">
          GeoVaris
        </p>

        <h1 className="mt-3 text-3xl font-bold text-white">
          Access Denied
        </h1>

        <p className="mt-4 text-sm leading-6 text-slate-300">
          Your Microsoft account was
          authenticated successfully, but
          it is not currently authorized
          to access the GeoVaris Data
          Health Framework.
        </p>

        <p className="mt-4 text-sm leading-6 text-slate-400">
          Contact a GeoVaris administrator
          if you believe you should have
          access.
        </p>

        <Link
          href="/login"
          className="mt-8 inline-block rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg"
        >
          Return to Sign In
        </Link>

        <p className="mt-6 text-xs text-slate-500">
          Authorized users only
        </p>
      </div>
    </main>
  );
}