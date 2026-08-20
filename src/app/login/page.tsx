import {
  signIn,
} from "../../../auth";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <div className="w-full max-w-md rounded-2xl border border-purple-500/30 bg-slate-900 p-8 shadow-2xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-400">
            GeoVaris
          </p>

          <h1 className="mt-3 text-3xl font-bold text-white">
            Data Health Framework
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-300">
            Sign in to access the GeoVaris Data
            Health Framework.
          </p>
        </div>

        <form
          className="mt-8"
          action={async () => {
            "use server";

            await signIn(
              "microsoft-entra-id",
              {
                redirectTo: "/",
              },
            );
          }}
        >
          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01]"
          >
            Sign in with Microsoft
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Authorized users only
        </p>
      </div>
    </main>
  );
}